"""Integration tests for FastAPI endpoints."""

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    """Module-level client ensuring FastAPI lifespan runs and seeds the database."""
    with TestClient(app) as test_client:
        yield test_client


def test_health_check_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_list_dinosaurs_endpoint(client):
    response = client.get("/api/v1/dinosaurs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 40


def test_get_dinosaur_by_slug_endpoint(client):
    response = client.get("/api/v1/dinosaurs/parasaurolophus")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "parasaurolophus"
    assert data["common_name"] == "Parasaurolophus"
    assert data["fossil_profile"] is not None
    assert "Hadrosauridae" in data["fossil_profile"]["taxonomy_family"]


def test_get_dinosaur_newly_curated_species(client):
    """Verify that previously uncataloged species now return rich fossil data."""
    # Test Archaeopteryx (Jurássico / Baviera)
    res_arch = client.get("/api/v1/dinosaurs/archaeopteryx")
    assert res_arch.status_code == 200
    data_arch = res_arch.json()
    assert data_arch["fossil_profile"] is not None
    assert data_arch["fossil_profile"]["scientific_name"] == "Archaeopteryx lithographica"
    assert data_arch["fossil_profile"]["geological_period"] == "Jurassic"

    # Test Dimetrodon (Permiano / Proto-mamífero sinápsido)
    res_dim = client.get("/api/v1/dinosaurs/dimetrodon")
    assert res_dim.status_code == 200
    data_dim = res_dim.json()
    assert data_dim["fossil_profile"] is not None
    assert data_dim["fossil_profile"]["scientific_name"] == "Dimetrodon grandis"
    assert data_dim["fossil_profile"]["geological_period"] == "Permian"

    # Test Spinosaurus
    res_spino = client.get("/api/v1/dinosaurs/spinosaurus")
    assert res_spino.status_code == 200
    data_spino = res_spino.json()
    assert data_spino["fossil_profile"] is not None
    assert "Spinosaurus aegyptiacus" in data_spino["fossil_profile"]["scientific_name"]

    # Test Sarcosuchus
    res_sarco = client.get("/api/v1/dinosaurs/sarcosuchus")
    assert res_sarco.status_code == 200
    data_sarco = res_sarco.json()
    assert data_sarco["fossil_profile"] is not None
    assert "Sarcosuchus imperator" in data_sarco["fossil_profile"]["scientific_name"]


def test_get_dinosaur_not_found(client):
    response = client.get("/api/v1/dinosaurs/alien_saurus")
    assert response.status_code == 404


def test_scan_endpoint_valid_image(client):
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
    assert data["dinosaur"]["fossil_profile"] is not None


def test_scan_endpoint_invalid_mime_type(client):
    fake_txt = io.BytesIO(b"not an image")
    response = client.post(
        "/api/v1/scan",
        files={"file": ("notes.txt", fake_txt, "text/plain")},
    )
    assert response.status_code == 415
