"""Unit tests for Application use cases."""

import pytest
from app.core.use_cases.scan_dinosaur import ScanDinosaurUseCase
from app.core.use_cases.get_dinosaur import GetDinosaurUseCase
from app.core.use_cases.list_dinosaurs import ListDinosaursUseCase
from app.infrastructure.ml.mock_vision_classifier import MockVisionClassifierGateway
from app.infrastructure.repositories.json_dinosaur_repository import JSONDinosaurRepository


@pytest.fixture
def repo():
    return JSONDinosaurRepository()


@pytest.fixture
def vision_gateway():
    return MockVisionClassifierGateway()


def test_scan_dinosaur_use_case_success(vision_gateway, repo):
    use_case = ScanDinosaurUseCase(vision_gateway, repo)
    image_bytes = b"fake-png-content"
    output = use_case.execute(image_bytes)

    assert output.prediction is not None
    assert output.prediction.confidence > 0.0
    assert output.dinosaur is not None
    assert output.comparison_report is not None


def test_scan_dinosaur_use_case_empty_bytes(vision_gateway, repo):
    use_case = ScanDinosaurUseCase(vision_gateway, repo)
    with pytest.raises(ValueError, match="Bytes da imagem não podem ser vazios"):
        use_case.execute(b"")


def test_get_dinosaur_use_case(repo):
    use_case = GetDinosaurUseCase(repo)
    dino = use_case.execute("triceratops")
    assert dino is not None
    assert dino.common_name == "Triceratops"
    assert dino.game_profile.diet.value == "Herbivore"


def test_get_dinosaur_use_case_not_found(repo):
    use_case = GetDinosaurUseCase(repo)
    dino = use_case.execute("inexistent_dino")
    assert dino is None


def test_list_dinosaurs_use_case_with_filters(repo):
    use_case = ListDinosaursUseCase(repo)
    all_dinos = use_case.execute()
    assert len(all_dinos) >= 30

    valley_dinos = use_case.execute(biome="Valley")
    assert len(valley_dinos) > 0
    assert all(d.game_profile.biome.value == "Valley" for d in valley_dinos)
