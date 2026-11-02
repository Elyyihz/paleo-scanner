#!/usr/bin/env python3
"""
Extract and organize dinosaur images from Paleo Pines Dinosaur Checklist.xlsx.

This script parses the OpenXML drawings from both 'Dino Colors Checklist'
and 'Dino Checklist' tabs, maps each embedded PNG image to its respective
dinosaur species and color variant, and organizes them into train/val folders
for CNN training with tf_keras.
"""

import os
import re
import json
import random
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image
import openpyxl

DEFAULT_XLSX_PATH = "/Users/elyyihz/Downloads/Paleo Pines Dinosaur Checklist.xlsx"
OUTPUT_DIR = Path("/Users/elyyihz/repositories/personal/paleo-scanner/ml/data")
PORTRAITS_DIR = Path("/Users/elyyihz/repositories/personal/paleo-scanner/backend/app/static/portraits")

NS_XDR = "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main"
NS_MAP = {"xdr": NS_XDR, "a": NS_A}


def slugify(text: str) -> str:
    """Normalize dinosaur name to lowercase alphanumeric slug."""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def parse_drawing_relationships(z: zipfile.ZipFile, rels_path: str) -> dict:
    """Extract mapping from rId to target media file."""
    content = z.read(rels_path).decode("utf-8")
    root = ET.fromstring(content)
    mapping = {}
    for rel in root:
        r_id = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        if r_id and target:
            # target is like '../media/image116.png'
            clean_target = "xl/" + target.replace("../", "")
            mapping[r_id] = clean_target
    return mapping


def parse_drawing_anchors(z: zipfile.ZipFile, drawing_xml_path: str, r_map: dict) -> list:
    """Extract list of (row, col, media_path) from drawing XML."""
    content = z.read(drawing_xml_path).decode("utf-8")
    root = ET.fromstring(content)
    anchors = []

    for anchor in root:
        blip = anchor.find(".//a:blip", NS_MAP)
        if blip is None:
            continue
        r_id = blip.attrib.get(f"{{{NS_A}}}embed") or blip.attrib.get(
            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"
        )
        if not r_id or r_id not in r_map:
            continue

        from_elem = anchor.find("xdr:from", NS_MAP)
        if from_elem is not None:
            col_text = from_elem.find("xdr:col", NS_MAP).text
            row_text = from_elem.find("xdr:row", NS_MAP).text
            # OpenXML is 0-indexed, convert to 1-indexed for Excel comparison
            row = int(row_text) + 1
            col = int(col_text) + 1
            anchors.append((row, col, r_map[r_id]))

    return anchors


def find_color_checklist_headers(ws) -> list:
    """Identify all dinosaur header cells across rows and columns."""
    headers = []
    for r in range(1, ws.max_row + 1):
        for c in range(1, ws.max_column + 1):
            val = ws.cell(row=r, column=c).value
            if val and isinstance(val, str):
                v_clean = val.strip()
                # Headers are followed by a cell containing "Color" or "Pattern"
                next_val = ws.cell(row=r + 1, column=c).value
                if next_val and ("Color" in str(next_val) or "Pattern" in str(next_val)):
                    if not any(kw in v_clean for kw in ["Color", "Pattern", "~", "*", "http"]):
                        headers.append((r, c, v_clean))
    return sorted(headers, key=lambda x: (x[0], x[1]))


def extract_dino_colors_dataset(xlsx_path: str) -> dict:
    """Extract dinosaur skin variants from Dino Colors Checklist."""
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws = wb["Dino Colors Checklist"]
    headers = find_color_checklist_headers(ws)
    print(f"-> Detectados {len(headers)} blocos de espécies em 'Dino Colors Checklist'")

    species_images = {}

    with zipfile.ZipFile(xlsx_path, "r") as z:
        r_map = parse_drawing_relationships(z, "xl/drawings/_rels/drawing4.xml.rels")
        anchors = parse_drawing_anchors(z, "xl/drawings/drawing4.xml", r_map)
        print(f"-> Localizadas {len(anchors)} imagens ancoradas no drawing4.xml")

        for row, col, media_path in anchors:
            # Find candidate headers in row block [hr, hr + 20)
            candidates = [h for h in headers if h[0] <= row < h[0] + 20]
            if not candidates:
                continue

            # Pick header with col closest to and <= col + 2
            matched = candidates[0]
            for c in candidates:
                if c[1] <= col + 2:
                    matched = c

            dino_name = matched[2]
            slug = slugify(dino_name)

            # Retrieve skin description if available
            skin_desc = ws.cell(row=row - 1, column=col).value or ws.cell(row=row, column=col).value
            skin_label = slugify(str(skin_desc)) if skin_desc else f"variant_{len(species_images.get(slug, [])) + 1}"

            data = z.read(media_path)
            if slug not in species_images:
                species_images[slug] = {
                    "common_name": dino_name,
                    "samples": []
                }

            species_images[slug]["samples"].append({
                "label": skin_label,
                "bytes": data,
                "media_path": media_path
            })

    return species_images


def extract_portraits(xlsx_path: str) -> dict:
    """Extract primary portraits for each species from Dino Checklist."""
    portraits = {}
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws = wb["Dino Checklist"]

    # In Dino Checklist, row 4, 9, 14, 19, 24, 29 have dino names in various columns
    species_cells = {}
    for r in range(1, ws.max_row + 1):
        for c in range(1, ws.max_column + 1):
            val = ws.cell(row=r, column=c).value
            if val and isinstance(val, str):
                v_clean = val.split("*")[0].strip()
                if any(v_clean.lower().endswith(suf) for suf in [
                    "saurus", "raptor", "mimus", "ceratops", "don", "rex", "pteryx", "suchus", "chirus"
                ]):
                    species_cells[(r, c)] = v_clean

    with zipfile.ZipFile(xlsx_path, "r") as z:
        if "xl/drawings/_rels/drawing3.xml.rels" in z.namelist():
            r_map = parse_drawing_relationships(z, "xl/drawings/_rels/drawing3.xml.rels")
            anchors = parse_drawing_anchors(z, "xl/drawings/drawing3.xml", r_map)
            print(f"-> Localizadas {len(anchors)} imagens ancoradas no drawing3.xml (Checklist Geral)")

            for row, col, media_path in anchors:
                # Find species above or nearby
                for (sr, sc), sname in species_cells.items():
                    if sr <= row <= sr + 2 and abs(col - sc) <= 1:
                        slug = slugify(sname)
                        if slug not in portraits:
                            portraits[slug] = z.read(media_path)
                        break

    return portraits


def save_dataset(species_images: dict, portraits: dict, val_ratio: float = 0.2, seed: int = 42):
    """Save images into structured train/val folders and write summary metadata."""
    random.seed(seed)
    train_dir = OUTPUT_DIR / "processed" / "train"
    val_dir = OUTPUT_DIR / "processed" / "val"
    train_dir.mkdir(parents=True, exist_ok=True)
    val_dir.mkdir(parents=True, exist_ok=True)
    PORTRAITS_DIR.mkdir(parents=True, exist_ok=True)

    summary = {
        "total_species": len(species_images),
        "total_images": 0,
        "train_images": 0,
        "val_images": 0,
        "classes": sorted(list(species_images.keys())),
        "species_breakdown": {}
    }

    print("\n--- Organizando Imagens por Espécie ---")
    for slug, info in sorted(species_images.items()):
        samples = info["samples"]
        random.shuffle(samples)

        sp_train_dir = train_dir / slug
        sp_val_dir = val_dir / slug
        sp_train_dir.mkdir(parents=True, exist_ok=True)
        sp_val_dir.mkdir(parents=True, exist_ok=True)

        # Calculate train/val split (at least 1 in val if len > 3)
        n_val = max(1, int(len(samples) * val_ratio)) if len(samples) > 3 else 1
        val_samples = samples[:n_val]
        train_samples = samples[n_val:]

        for idx, s in enumerate(train_samples, start=1):
            fname = f"{slug}_train_{idx:03d}_{s['label'][:30]}.png"
            with open(sp_train_dir / fname, "wb") as f:
                f.write(s["bytes"])

        for idx, s in enumerate(val_samples, start=1):
            fname = f"{slug}_val_{idx:03d}_{s['label'][:30]}.png"
            with open(sp_val_dir / fname, "wb") as f:
                f.write(s["bytes"])

        summary["total_images"] += len(samples)
        summary["train_images"] += len(train_samples)
        summary["val_images"] += len(val_samples)
        summary["species_breakdown"][slug] = {
            "common_name": info["common_name"],
            "total_samples": len(samples),
            "train_samples": len(train_samples),
            "val_samples": len(val_samples)
        }

        print(f"  {info['common_name']:22} -> Treino: {len(train_samples):2} | Val: {len(val_samples):2}")

    # Save portraits
    for slug, pbytes in portraits.items():
        portrait_path = PORTRAITS_DIR / f"{slug}.png"
        with open(portrait_path, "wb") as f:
            f.write(pbytes)

    # Save JSON summary
    summary_path = OUTPUT_DIR / "dataset_summary.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Concluído! Total de {summary['total_images']} imagens processadas:")
    print(f"   - Treino: {summary['train_images']} imagens em {train_dir}")
    print(f"   - Validação: {summary['val_images']} imagens em {val_dir}")
    print(f"   - Retratos salvos em: {PORTRAITS_DIR}")
    print(f"   - Resumo estruturado em: {summary_path}")


def main():
    if not os.path.exists(DEFAULT_XLSX_PATH):
        raise FileNotFoundError(f"Arquivo não encontrado: {DEFAULT_XLSX_PATH}")

    print("Iniciando extração do dataset Paleo Pines...")
    species_images = extract_dino_colors_dataset(DEFAULT_XLSX_PATH)
    portraits = extract_portraits(DEFAULT_XLSX_PATH)
    save_dataset(species_images, portraits)


if __name__ == "__main__":
    main()
