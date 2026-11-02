#!/usr/bin/env python3
"""
Training pipeline for Paleo-Scanner Dinosaur Classifier using tf_keras.

Implements Transfer Learning with MobileNetV3-Small, dynamic data augmentation,
class weight balancing to handle the 38 Paleo Pines species, and exports
the serialised .keras model alongside class indices.
"""

import argparse
import json
import os
from pathlib import Path
import numpy as np

# Ensure tf_keras is used per project specification
os.environ["TF_USE_LEGACY_KERAS"] = "1"
import tensorflow as tf
import tf_keras as keras
from tf_keras import layers
from sklearn.utils.class_weight import compute_class_weight

IMG_SIZE = (224, 224)
DEFAULT_DATA_DIR = Path(__file__).resolve().parent / "data" / "processed"
DEFAULT_MODEL_DIR = Path(__file__).resolve().parent / "models"


def build_augmentation_layer() -> keras.Sequential:
    """Build dynamic data augmentation pipeline to prevent overfitting."""
    return keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.08),  # ~15 degrees
            layers.RandomZoom(0.12),
            layers.RandomBrightness(0.15),
            layers.RandomContrast(0.1),
        ],
        name="dino_augmentation",
    )


def build_model(num_classes: int, learning_rate: float = 1e-3) -> keras.Model:
    """Construct MobileNetV3-Small transfer learning architecture."""
    # Base pretrained feature extractor
    base_model = keras.applications.MobileNetV3Small(
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3),
        include_top=False,
        weights="imagenet",
        minimalistic=False,
        pooling=None,
    )
    base_model.trainable = False  # Freeze backbone for stage 1

    inputs = keras.Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3), name="image_input")
    x = build_augmentation_layer()(inputs)
    x = keras.applications.mobilenet_v3.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="avg_pool")(x)
    x = layers.BatchNormalization(name="batch_norm")(x)
    x = layers.Dropout(0.35, name="dropout_regularization")(x)
    x = layers.Dense(128, activation="relu", name="dense_features")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="species_probabilities")(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="paleo_scanner_mobilenet_v3")

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss="categorical_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.TopKCategoricalAccuracy(k=3, name="top_3_accuracy"),
        ],
    )
    return model


def main():
    parser = argparse.ArgumentParser(description="Train Paleo-Scanner CNN Classifier")
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--model-dir", type=Path, default=DEFAULT_MODEL_DIR)
    parser.add_argument("--epochs", type=int, default=25)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--lr", type=float, default=1e-3)
    args = parser.parse_args()

    train_dir = args.data_dir / "train"
    val_dir = args.data_dir / "val"
    args.model_dir.mkdir(parents=True, exist_ok=True)

    if not train_dir.exists() or not val_dir.exists():
        raise FileNotFoundError(
            f"Diretórios de dataset não encontrados em {args.data_dir}. "
            "Execute 'python scripts/extract_dataset.py' primeiro."
        )

    print(f"Carregando datasets de {args.data_dir}...")
    train_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        label_mode="categorical",
        image_size=IMG_SIZE,
        batch_size=args.batch_size,
        shuffle=True,
        seed=42,
    )

    val_ds = keras.utils.image_dataset_from_directory(
        val_dir,
        label_mode="categorical",
        image_size=IMG_SIZE,
        batch_size=args.batch_size,
        shuffle=False,
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"-> Detectadas {num_classes} classes no dataset de treino.")

    # Save class indices mapping for API inference
    class_mapping = {idx: name for idx, name in enumerate(class_names)}
    with open(args.model_dir / "class_indices.json", "w", encoding="utf-8") as f:
        json.dump(class_mapping, f, indent=2, ensure_ascii=False)
    print(f"-> Mapa de classes salvo em: {args.model_dir / 'class_indices.json'}")

    # Compute balanced class weights to solve minority species imbalance
    y_train = []
    for _, labels in train_ds.unbatch():
        y_train.append(np.argmax(labels.numpy()))
    y_train = np.array(y_train)

    classes_unique = np.unique(y_train)
    weights = compute_class_weight(
        class_weight="balanced",
        classes=classes_unique,
        y=y_train,
    )
    class_weight_dict = {int(cls): float(w) for cls, w in zip(classes_unique, weights)}
    print("-> Pesos balanceados calculados para mitigar desbalanceamento de classes.")

    # Optimize pipeline I/O
    train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    # Build and summarize model
    model = build_model(num_classes=num_classes, learning_rate=args.lr)
    model.summary()

    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=6,
            restore_best_weights=True,
            verbose=1,
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=3,
            min_lr=1e-6,
            verbose=1,
        ),
        keras.callbacks.ModelCheckpoint(
            filepath=str(args.model_dir / "dino_mobilenet_v3_best.keras"),
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),
    ]

    print(f"\nIniciando treinamento por até {args.epochs} épocas...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        class_weight=class_weight_dict,
        callbacks=callbacks,
    )

    # Save final model
    final_model_path = args.model_dir / "dino_mobilenet_v3.keras"
    model.save(final_model_path)
    print(f"\n✅ Modelo final salvo com sucesso em: {final_model_path}")

    # Evaluate on validation
    eval_results = model.evaluate(val_ds, verbose=0)
    print(f"Avaliação Final - Perda: {eval_results[0]:.4f} | Acurácia Top-1: {eval_results[1]*100:.2f}% | Acurácia Top-3: {eval_results[2]*100:.2f}%")


if __name__ == "__main__":
    main()
