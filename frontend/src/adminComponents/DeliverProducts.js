import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../port";
import "./DeliverProducts.css";

function DeliverProducts() {
  const [dispatchedProducts, setdispatchedProducts] = useState([]);
  const [err, setErr] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchDispatchedProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/delivery-list`);
        console.log(res);
        if (res.data.message === "Dispatched products are") {
          setdispatchedProducts(res.data.payload);
        } else {
          setErr(res.data.message);
        }
      } catch (error) {
        setErr("Failed to fetch dispatched products.");
      }
    };
    fetchDispatchedProducts();
  }, []);

  const handleProductDelivery = async (product) => {
    console.log(product);
    let stat = window.confirm("Confirm to deliver");
    if (stat) {
      try {
        console.log(product)
        const res = await axios.put(
          `${BASE_URL}/admin-api/deliver-product/${product.productid}/${product.rfidTag}/${product.orderid}`
        );
        if (res.data.message === "Product Delivered") {
          const updatedProducts = dispatchedProducts.filter(
            (item) => item.productid !== product.productid
          );
          setdispatchedProducts(updatedProducts);
          setNotification("Product delivered successfully!");
          setTimeout(() => setNotification(""), 3000);
        } else {
          setErr(res.data.message);
        }
      } catch (error) {
        setErr("Failed to deliver the product.");
      }
    }
  };

  return (
    <div className="dispatch-products">
      <h1>Deliver Products</h1>
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
                <p className="product-stock">Stock: {product.stock}</p>
              </div>
              <div>
                <button
                  className="btn btn-success"
                  onClick={() => handleProductDelivery(product)}
                >
                  Deliver Product
                </button>
              </div>
            </div>
          ))}
        {dispatchedProducts.length === 0 && <p>No products to deliver</p>}
      </div>
    </div>
  );
}

export default DeliverProducts;
