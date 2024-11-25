from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import torch
from sklearn.metrics.pairwise import cosine_similarity
from torchvision import models, transforms
from PIL import Image
from torchvision.models import ResNet50_Weights

app = Flask(__name__)  # Corrected here

# Enable CORS for all routes from localhost:3000
CORS(app, origins=["http://localhost:5100"])  # Add this line

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Inline image comparison code
def process_image(image_path):
    image = Image.open(image_path).convert("RGB")
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return preprocess(image).unsqueeze(0)

def load_model():
    model = models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
    model.eval()  # Set to evaluation mode
    return model

def extract_features(image_path, model):
    image = process_image(image_path)
    with torch.no_grad():
        return model(image)

def compare_images(original_image_paths, return_image_path):
    model = load_model()
    best_similarity = -1
    best_result = "Fraudulent Product"
    for original_path in original_image_paths:
        similarity = cosine_similarity(
            [extract_features(original_path, model).cpu().numpy().flatten()],
            [extract_features(return_image_path, model).cpu().numpy().flatten()]
        )[0][0]
        if similarity > best_similarity:
            best_similarity = similarity
            best_result = "Genuine Product" if similarity > 0.8 else "Fraudulent Product"
    
    # Convert similarity to float to avoid serialization issues
    return best_result, float(best_similarity)

@app.route("/upload", methods=["POST"])
def upload_image():
    print('heyyy')

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    print(file)
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        original_image_paths = ["f1.jpg", "f2.jpg", "f3.jpg", "f4.jpg","f5.jpg"]
        result, similarity = compare_images(original_image_paths, file_path)
        os.remove(file_path)
        
        # Return result and similarity as a JSON response
        return jsonify({"result": result, "similarity": similarity})
    
    return jsonify({"error": "Failed to upload file"}), 500

if __name__ == "__main__":  # Corrected here
    app.run(debug=True)