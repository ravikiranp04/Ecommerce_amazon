from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
from sklearn.metrics.pairwise import cosine_similarity
from torchvision import models, transforms
from PIL import Image
from torchvision.models import ResNet50_Weights
import json

app = Flask(__name__)

# Allowing specific origin for CORS
CORS(app, origins="http://localhost:5100")  # This allows your frontend to communicate with this backend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Image Preprocessing Function
def process_image(image_path):
    image = Image.open(image_path).convert("RGB")
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return preprocess(image).unsqueeze(0)

# Extract Features from an Image (Remove softmax and directly use the features)
def extract_features(image_path, model):
    image = process_image(image_path)
    with torch.no_grad():
        # Pass the image through the network and extract the feature vector (before softmax)
        features = model(image)
        # Use global average pooling or the output of the final layer
        return features.flatten().cpu().numpy()

# Compare Images Using Cosine Similarity
def compare_images(original_image_paths, return_image_path):
    best_similarity = -1
    best_result = "Fraudulent Product"
    for original_path in original_image_paths:
        try:
            # Get the feature vectors for both the original and the uploaded image
            original_features = extract_features(original_path, model)
            return_image_features = extract_features(return_image_path, model)
            
            # Compute cosine similarity between the vectors
            similarity = cosine_similarity([original_features], [return_image_features])[0][0]
            
            if similarity > best_similarity:
                best_similarity = similarity
                # Adjust threshold if necessary for "Genuine Product" or "Fraudulent Product"
                best_result = "Genuine Product" if similarity > 0.8 else "Fraudulent Product"
        except Exception as e:
            print(f"Error processing image {original_path}: {e}")
            continue  # Skip any images that cause errors

    return best_result, best_similarity



@app.route("/upload", methods=["POST"])
def upload_image():
    # Check if the file is provided
    if "file" not in request.files:
        return jsonify({"error": "File not provided"}), 400

    # Check if dispatchImages is provided
    dispatch_images_str = request.form.get("dispatchImages")  # Expecting array of image paths
    if not dispatch_images_str:
        return jsonify({"error": "dispatchImages not provided"}), 400

    file = request.files["file"]

    try:
        # Convert the dispatchImages string back to a list (since it was stringified on the frontend)
        dispatch_images = json.loads(dispatch_images_str)
    except Exception as e:
         return jsonify({"error": f"Error parsing dispatchImages: {str(e)}"}), 400

    if file:
        # Save the uploaded image temporarily
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Process comparison
        try:
            result, similarity = compare_images(dispatch_images, file_path)
        except Exception as e:
            os.remove(file_path)
            return jsonify({"error": f"Error during comparison: {str(e)}"}), 500

        # Clean up uploaded file aftegr processing
        os.remove(file_path)

        # Return result and similarity as a JSON response
        return jsonify({"result": result, "similarity": similarity})
    
    return jsonify({"error": "Failed to upload file"}), 500

if __name__ == "__main__":
    app.run(debug=True)
