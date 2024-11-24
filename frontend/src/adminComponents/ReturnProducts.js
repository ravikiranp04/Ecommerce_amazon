
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../port";
import "./DeliverProducts.css";
import { useNavigate } from "react-router-dom";
function ReturnProducts() {
    const [dispatchedProducts, setdispatchedProducts] = useState([]);
    const [err, setErr] = useState("");
    const [notification, setNotification] = useState("");
    const navigate=useNavigate();
    useEffect(() => {
      const fetchReturnProducts = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/admin-api/return-products-list`);
          console.log(res);
          if (res.data.message === "Return Products are") {
            setdispatchedProducts(res.data.payload);
          } else {
            setErr(res.data.message);
          }
        } catch (error) {
          setErr("Failed to fetch dispatched products.");
        }
      };
      fetchReturnProducts();
    }, []);
  
    
    return (
      <div className="dispatch-products">
        <h1>Return Products</h1>
        {err && <p className="error-message">{err}</p>}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              zIndex: 1000,
              fontWeight: "bold",
            }}
          >
            {notification}
          </div>
        )}
        <div className="product-list">
          {dispatchedProducts.length > 0 &&
            dispatchedProducts.map((product) => (
              <div key={product.productid} className="product-card">
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
                <div>
                  <button
                    className="btn btn-success"
                    onClick={() => navigate('return-verify',{state:product})}
                  >
                    Verify Product
                  </button>
                </div>
              </div>
            ))}
          {dispatchedProducts.length === 0 && <p>No products to Return</p>}
        </div>
      </div>
    );
}

export default ReturnProducts