import React, { useEffect, useState } from "react";
import Card from "../components/card";
import Carousel1 from "../components/carousel1";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../port";
import './Home.css';  // Import custom CSS for animations

export default function Home() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const displayProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user-api/products`);
        console.log(res);
        if (res.data.message === 'Products are') {
          setProducts(res.data.payload);
        } else {
          setErr(res.data.message);
          console.log(err);
        }
      } catch (error) {
        setErr("Failed to fetch products");
        console.error(error);
      }
    };
    displayProducts();
  }, [location]);

  return (
    <div className="home-container">
      <div><Carousel1 /></div>
      <div className="product-container">
        <Card products={products} />
      </div>
    </div>
  );
}
