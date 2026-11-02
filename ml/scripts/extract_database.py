#!/usr/bin/env python3
"""
Extract structured tabular data from 'Paleo Pines - Database v3.0.3.xlsx'
and generate a seed JSON for the backend FastAPI SQLite/PostgreSQL database.
"""

import json
import re
import os
from pathlib import Path
import openpyxl

DEFAULT_XLSX = "/Users/elyyihz/Downloads/Paleo Pines - Database v3.0.3.xlsx"
OUTPUT_PATH = Path("/Users/elyyihz/repositories/personal/paleo-scanner/backend/app/infrastructure/database/dinosaurs_seed.json")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def main():
    if not os.path.exists(DEFAULT_XLSX):
        raise FileNotFoundError(f"Arquivo não encontrado: {DEFAULT_XLSX}")

    wb = openpyxl.load_workbook(DEFAULT_XLSX, data_only=True)
    ws_dinos = wb["Data Dinosaurs"]

    # Read column header mapping from row 2
    col_names = {}
    for c in range(1, ws_dinos.max_column + 1):
        v = ws_dinos.cell(row=2, column=c).value
        if v:
            col_names[v.strip()] = c

    # Extract all dinosaur species rows (starting at row 3)
    dinosaurs = []
    for r in range(3, ws_dinos.max_row + 1):
        name = ws_dinos.cell(row=r, column=col_names["Dinosaur"]).value
        if not name or not str(name).strip():
            continue

        name = str(name).strip()
        slug = slugify(name)

        dino_data = {
            "slug": slug,
            "common_name": name,
            "diet": ws_dinos.cell(row=r, column=col_names.get("Diet", 7)).value or "Herbivore",
            "social": ws_dinos.cell(row=r, column=col_names.get("Social", 8)).value or "Pack",
            "biome": ws_dinos.cell(row=r, column=col_names.get("Biome", 9)).value or "Valley",
            "poppin_favorite": ws_dinos.cell(row=r, column=col_names.get("Poppin", 10)).value or "Crunchy",
            "wild_skill": ws_dinos.cell(row=r, column=col_names.get("Wild Skill", 11)).value or "None",
            "farm_skill": ws_dinos.cell(row=r, column=col_names.get("Farm Skill", 12)).value or "None",
            "size": ws_dinos.cell(row=r, column=col_names.get("Size", 13)).value or "Medium",
            "ridable": str(ws_dinos.cell(row=r, column=col_names.get("Ridable", 14)).value).lower() in ["true", "yes", "ridable"],
            "pen_m2": ws_dinos.cell(row=r, column=col_names.get("m²", 16)).value or 25,
            "friendcall": ws_dinos.cell(row=r, column=col_names.get("Friendcall", 19)).value or "",
            "description": ws_dinos.cell(row=r, column=col_names.get("Description", 23)).value or "",
            "wiki_link": ws_dinos.cell(row=r, column=col_names.get("Wiki link", 24)).value or "",
            "paleo_gg_link": ws_dinos.cell(row=r, column=col_names.get("Paleo link", 25)).value or "",
            "speed_trot": ws_dinos.cell(row=r, column=col_names.get("Speed Trot", 26)).value,
            "speed_sprint": ws_dinos.cell(row=r, column=col_names.get("Speed Sprint", 27)).value,
        }
        dinosaurs.append(dino_data)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(dinosaurs, f, indent=2, ensure_ascii=False)

    print(f"✅ Extraídas {len(dinosaurs)} espécies com sucesso para: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
