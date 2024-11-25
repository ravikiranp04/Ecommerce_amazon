import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../port";
import { useForm } from "react-hook-form";
import "./DispatchProducts.css";

function DispatchProducts() {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]); 
  const [notification, setNotification] = useState('');
  const [imageURL, setImageURL] = useState(""); 
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispatchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/get-dispatch-products`);
        if (res.data.message === "Dispatch products are") {
          setProducts(res.data.payload);
        } else {
          setErr(res.data.message);
        }
      } catch (error) {
        setErr("Error fetching dispatch products");
      }
    };
    fetchDispatchProducts();
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setImages([]); 
    setImageURL(""); 
    setValue("barcode", ""); 
    setValue("rfid", ""); 
  };

  const handleBarcodeChange = (event) => {
    const barcodeValue = event.target.value;
    setValue("barcode", barcodeValue); 
    setValue("rfid", `${selectedProduct.username}_${barcodeValue}`); 
  };

  const handleScanSubmit = async (data) => {
    selectedProduct.barcode = data.barcode;
    selectedProduct.rfidTag = data.rfid;
    selectedProduct.dispatchImages = images; 
    selectedProduct.deliveryStatus = 'dispatched';
    delete selectedProduct._id;
    
    const res = await axios.put(`${BASE_URL}/admin-api/dispatch-product`, selectedProduct);
    console.log(res);
    if (res.data.message === 'Product Dispatched') {
      setSelectedProduct(null);
      setNotification("Product dispatched successfully");
      setTimeout(() => {
        setNotification('');
        navigate('/admin-profile/dispatch-products');
      }, 2000);
    } else {
      setErr("Please try again");
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file)); 
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); 
      setImages((prevImages) => [...prevImages, imageUrl]);
    }
  };

  const handleAddImageURL = () => {
    if (imageURL.trim() !== "") {
      setImages((prevImages) => [...prevImages, imageURL.trim()]);
      setImageURL(""); 
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index)); 
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image instanceof Object && image.preview) {
          URL.revokeObjectURL(image.preview); 
        }
      });
    };
  }, [images]);

  return (
    <div className="dispatch-products">
      <h1>Dispatch Products</h1>
      {err && <p className="error-message">{err}</p>}
      {/* Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'green',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 1000,
            fontWeight: 'bold',
          }}
        >
          {notification}
        </div>
      )}
      <div className="product-list">
        {products.map(
          (product) =>
            product.deliveryStatus === "ordered" && (
              <div
                key={product.productid}
                className="product-card"
                onClick={() => handleCardClick(product)}
              >
                <div className="product-image">
                  <img
                    src={product.images[0]} 
                    alt={product.title}
                    className="card-img"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-brand">Brand: {product.brand}</p>
                  <p className="product-category">Category: {product.category}</p>
                  <p className="product-price">₹{product.priceAfterDiscount}</p>
                  
                </div>
              </div>
            )
        )}
      </div>

      {selectedProduct && (
        <div className="scan-modal">
          <h2>Scan Product</h2>
          <p>Product: {selectedProduct.title}</p>
          <form onSubmit={handleSubmit(handleScanSubmit)}>
            <div>
              <label htmlFor="barcode">Barcode:</label>
              <input
                type="text"
                id="barcode"
                placeholder="Enter barcode"
                {...register("barcode", { required: "Barcode is required" })}
                onChange={handleBarcodeChange} 
              />
              {errors.barcode && <p className="error">{errors.barcode.message}</p>}
            </div>

            <div>
              <label htmlFor="rfid">RFID Tag:</label>
              <input
                type="text"
                id="rfid"
                readOnly
                {...register("rfid", { required: "RFID is required" })}
              />
              {errors.rfid && <p className="error">{errors.rfid.message}</p>}
            </div>

            <div>
              <label htmlFor="images">Upload or Capture Images:</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              <p>OR</p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
              />
              <p>OR</p>
              <input
                type="text"
                placeholder="Paste image URL"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
              <button type="button" onClick={handleAddImageURL}>
                Add Image URL
              </button>
            </div>

            <div className="image-preview">
              {images.map((image, index) => {
                const previewUrl = image instanceof File ? URL.createObjectURL(image) : image;
                return (
                  <div key={index} className="image-preview-item">
                    <img
                      src={previewUrl}
                      alt={`Captured ${index + 1}`}
                      className="small-image"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>

            <button type="submit">Submit</button>
            <button type="button" onClick={() => setSelectedProduct(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}


export default DispatchProducts;  