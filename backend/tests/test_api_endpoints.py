"""Integration tests for FastAPI endpoints."""

import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_list_dinosaurs_endpoint():
    response = client.get("/api/v1/dinosaurs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 30


def test_get_dinosaur_by_slug_endpoint():
    response = client.get("/api/v1/dinosaurs/parasaurolophus")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "parasaurolophus"
    assert data["common_name"] == "Parasaurolophus"
    assert data["fossil_profile"] is not None
    assert "Hadrosauridae" in data["fossil_profile"]["taxonomy_family"]


def test_get_dinosaur_not_found():
    response = client.get("/api/v1/dinosaurs/alien_saurus")
    assert response.status_code == 404


def test_scan_endpoint_valid_image():
    # Send mock PNG file
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\nfakeimagebytes")
    response = client.post(
        "/api/v1/scan",
        files={"file": ("screenshot.png", fake_image, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert data["prediction"]["confidence"] > 0.0
    assert "dinosaur" in data
    assert "comparison_report" in data


def test_scan_endpoint_invalid_mime_type():
    fake_txt = io.BytesIO(b"not an image")
    response = client.post(
        "/api/v1/scan",
        files={"file": ("notes.txt", fake_txt, "text/plain")},
    )
    assert response.status_code == 415
