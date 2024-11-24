import React, { useState } from "react";
import { Modal } from 'react-bootstrap';
import { IoStarSharp } from "react-icons/io5";
import axios from "axios";
import { BASE_URL } from "../port";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CardDetail = ({ show, handleClose }) => {
  const [err, setErr] = useState('');
  const { currentuser } = useSelector(state => state.userLogin);
  
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const AddtoCart = async (product) => {
    try {
      const res = await axiosWithToken.put(`${BASE_URL}/user-api/add-to-cart/${currentuser.username}/${product.productid}/${quantity}`);
      if (res.data.message === "product added to cart") {
        navigate(`/user-profile/${currentuser.username}/cart`);
      } else {
        setErr(res.data.message);
        console.error(err);
      }
    } catch (error) {
      setErr('Network Error');
      console.error('Network Error:', error);
    }
  };

  return (
    <Modal show={!!show} onHide={handleClose} centered>
      {show && (
        <div className="container d-flex p-1">
          <div className="w-50 h-100 p-1 ">
            <div className="p-2">
              <img src={show.images[0]} alt={show.title} className="w-100 mb-3 h-75" />
            </div>
            <div className="d-flex justify-content-around p-2">
              {show.images.map((img, index) => (
                <img src={img} alt={show.title} key={index} className="w-25 p-1 border-dark" />
              ))}
            </div>
          </div>
          <div className="w-50 h-100 m-0 p-1">
            <h3>{show.title}</h3>
            <div className="d-flex">
              <span><IoStarSharp /><IoStarSharp /><IoStarSharp /><IoStarSharp /><IoStarSharp /></span>
            </div>
            <div className="d-flex">
              <span className="text-decoration-line-through">${show.price}</span>
              <h5>${show.priceAfterDiscount}</h5>
            </div>
            <div>
              <p>CATEGORY: <b>{show.category}</b></p>
              <hr />
            </div>
            <div className="d-flex" style={{ height: "40px" }}>
              <div className="d-flex qty-change" style={{ width: "150px", height: "100%" }}>
                <button className="bg-success" style={{ width: "30px", height: "40px" }} onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</button>
                <p className="text-center" style={{ width: "40px", height: "40px", border: '1px solid #000' }}>{quantity}</p>
                <button className="bg-success" style={{ width: "30px", height: "40px" }} onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <div className="w-50">
                {
                  currentuser.username?<button className="mx-auto h-100 bg-primary rounded-2" onClick={() => AddtoCart(show)}>Add to cart</button>:
                  <button className="mx-auto h-100 bg-primary rounded-2" onClick={() => navigate('/cart')}>Add to cart</button>
                }
                
              </div>
            </div>
            <hr />
            <button className="w-75 bg-success text-light rounded border-dark">Customize</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CardDetail;
