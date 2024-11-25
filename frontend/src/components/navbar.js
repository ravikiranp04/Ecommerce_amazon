import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'; 
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../Redux/slices/userLoginSLice"; 
import { useNavigate } from "react-router-dom";
import { FaWallet } from 'react-icons/fa'; 
import { BASE_URL } from "../port";

export default function Navigation() {
  const dispatch = useDispatch();
  const { currentuser, loginStatus } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  
  
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
  
    const fetchWalletBalance = async () => {
      if (currentuser?.username) {
        try {
          
          const response = await axios.get(`${BASE_URL}/user-api/wallet/${currentuser.username}`);
          
          if (response.data?.message === "Wallet balance is" && response.data?.payload !== undefined) {
            setWalletBalance(response.data.payload);
          }
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      }
    };

    fetchWalletBalance();  
  }, [currentuser]);  

  function logout() {
    sessionStorage.removeItem("token");
    dispatch(resetState());
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="https://play-lh.googleusercontent.com/Z1gy3SDNLW4Nk3lz4yrvNoa4lA1if7NtlPgMJtntVLbONpu6GMM-Mv-5itive-nnzWM"
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
          <span className="text-info fs-4 ms-2"><em>E-commerce</em></span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {loginStatus === false ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-info" to="">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-info" to="/about">
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-info" to="/cart">
                    My Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-info" to="/login">
                    Signin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-info" to="/register">
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              currentuser.username === 'admin' ? (
                <div className="d-flex align-items-center">
                  <li className="nav-item">
                    <Link className="nav-link text-info" to="" onClick={logout}>
                      <span className="lead fs-3 text-warning m-2">
                        {currentuser.username}
                      </span>
                      SignOut
                    </Link>
                  </li>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <li className="nav-item me-3">
                    <button className="btn btn-success" onClick={() => { navigate(`/user-profile/${currentuser.username}/my-orders`) }}>
                      My Orders
                    </button>
                  </li>
                  <li className="nav-item me-3">
                    <button className="btn btn-success" onClick={() => { navigate(`/user-profile/${currentuser.username}/cart`) }}>
                      My Cart
                    </button>
                  </li>
                  <li className="nav-item me-3">
                    <button className="btn btn-success" onClick={() => { navigate(`/user-profile/${currentuser.username}/wishlist`) }}>
                      My Wishlist
                    </button>
                  </li>
                  {/* Display Wallet balance with icon */}
                  <li className="nav-item me-3">
                    <div className="d-flex align-items-center">
                      <FaWallet className="fs-4 text-info me-2" />
                      <span className="text-info fs-5">
                        {walletBalance !== undefined ? `₹${walletBalance.toFixed(2)}` : '₹0.00'}
                      </span>
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-info" to="" onClick={logout}>
                      <span className="lead fs-3 text-warning m-2">
                        {currentuser.username}
                      </span>
                      SignOut
                    </Link>
                  </li>
                </div>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
