"""Implementation of IVisionClassifierGateway with tf_keras."""

import json
from pathlib import Path
from typing import List, Tuple
from app.core.domain.entities.prediction_result import PredictionResult
from app.core.domain.gateways.vision_classifier_gateway import IVisionClassifierGateway
from app.infrastructure.ml.mock_vision_classifier import MockVisionClassifierGateway

PROJECT_ROOT = Path(__file__).resolve().parents[4]
BACKEND_ROOT = Path(__file__).resolve().parents[3]

DEFAULT_MODEL_PATH = (
    (PROJECT_ROOT / "ml" / "models" / "dino_mobilenet_v3.keras")
    if (PROJECT_ROOT / "ml" / "models" / "dino_mobilenet_v3.keras").exists()
    else (BACKEND_ROOT / "ml" / "models" / "dino_mobilenet_v3.keras")
)

DEFAULT_INDICES_PATH = (
    (PROJECT_ROOT / "ml" / "models" / "class_indices.json")
    if (PROJECT_ROOT / "ml" / "models" / "class_indices.json").exists()
    else (BACKEND_ROOT / "ml" / "models" / "class_indices.json")
)


class KerasVisionClassifierGateway(IVisionClassifierGateway):
    """Classifies dinosaur species using a trained tf_keras CNN model."""

    def __init__(
        self,
        model_path: Path = DEFAULT_MODEL_PATH,
        indices_path: Path = DEFAULT_INDICES_PATH,
    ):
        self._model_path = model_path
        self._indices_path = indices_path
        self._model = None
        self._class_mapping = {}
        self._fallback_mock = MockVisionClassifierGateway()
        self._try_load()

    def _try_load(self):
        """Attempt to load trained Keras model and class indices."""
        if not self._model_path.exists() or not self._indices_path.exists():
            return

        try:
            import os
            os.environ["TF_USE_LEGACY_KERAS"] = "1"
            import tf_keras as keras

            with open(self._indices_path, "r", encoding="utf-8") as f:
                raw_mapping = json.load(f)
                self._class_mapping = {int(k): v for k, v in raw_mapping.items()}

            self._model = keras.models.load_model(self._model_path)
        except Exception:
            self._model = None

    def classify_image(self, image_bytes: bytes) -> PredictionResult:
        if self._model is None:
            return self._fallback_mock.classify_image(image_bytes)

        import io
        from PIL import Image
        import numpy as np

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            return self._fallback_mock.classify_image(image_bytes)

        image = image.resize((224, 224))
        arr = np.array(image, dtype=np.float32)
        arr = np.expand_dims(arr, axis=0)

        preds = self._model.predict(arr, verbose=0)[0]
        top_indices = np.argsort(preds)[::-1][:3]

        top_candidates: List[Tuple[str, float]] = []
        for idx in top_indices:
            slug = self._class_mapping.get(idx, f"species_{idx}")
            prob = float(preds[idx])
            top_candidates.append((slug, round(prob, 4)))

        best_slug = top_candidates[0][0]
        best_conf = top_candidates[0][1]

        return PredictionResult(
            predicted_slug=best_slug,
            confidence=best_conf,
            top_candidates=top_candidates,
        )
