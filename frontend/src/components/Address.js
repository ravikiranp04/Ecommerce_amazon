import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../port';

function Address() {
  const { currentuser } = useSelector((state) => state.userLogin);
  const [addresses, setAddresses] = useState([]);  // Initialize as an empty array
  const [selectedAddress, setSelectedAddress] = useState({});  // Object for selected address
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(''); // State to control notification
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = location.state || {};  // Extract products from location state
  const token = sessionStorage.getItem('token');
  
  // Axios instance with token
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user-api/get-addresses/${currentuser.username}`);
        console.log(res);
        if (res.data.message === "Addresses are") {
          setAddresses(res.data.payload || []);  // Set addresses if available
        } else {
          setError(res.data.message);
          setAddresses([]); // Ensure addresses is an array if error occurs
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to fetch addresses. Please try again later.");
        setAddresses([]);  // Ensure addresses is an array
      }
    };

    fetchAddresses();
  }, [currentuser.username]);

  // Handle order placement
  const handleProceed = async (products, selectedAddress) => {
    if (selectedAddress === null || Object.keys(selectedAddress).length === 0) {
      setError("Please select an address to proceed.");
      return;
    }
    let orderid=`${currentuser.username}_${Date.now()}`
    // Add the selected address to each product
    products.forEach((product) => {
      product.deliveryAddress = selectedAddress;
      product.orderid=orderid
    });

    try {
      const res = await axiosWithToken.post(`${BASE_URL}/user-api/place-order`, products);
      if (res.data.message === "Order placed successfully") {
        // Show the success notification
        setNotification('Order placed successfully!');
        
        // Hide the notification after 2 seconds and navigate to home page
        setTimeout(() => {
          setNotification('');
          navigate(`/user-profile/${currentuser.username}`);  // Navigate to home page (or another page as needed)
        }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Select an Address</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
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

      <div className="row">
        {addresses && Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div
                className={`card shadow-sm p-3 ${selectedAddress === address ? 'border-primary' : ''}`}
                onClick={() => setSelectedAddress(address)}  // Set selected address
                style={{ cursor: 'pointer' }}
              >
                <h5 className="card-title">Address {index + 1}</h5>
                <p><strong>Name:</strong> {address.name}</p>
                <p><strong>Mobile:</strong> {address.mobileno}</p>
                <p><strong>Address Line 1:</strong> {address.add_1}</p>
                <p><strong>Address Line 2:</strong> {address.add_2}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Country:</strong> {address.country}</p>
                <p><strong>Pincode:</strong> {address.pincode}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses found. Please add one to proceed.</p>
        )}
      </div>
      
      <button
        className="btn btn-dark w-100 mt-3"
        onClick={() => handleProceed(location.state, selectedAddress)}
        disabled={addresses.length === 0 || !selectedAddress.name}
      >
        Proceed with Selected Address
      </button>
    </div>
  );
}

export default Address;
