import React, { useState, useEffect } from 'react';
import WishListCard from './WishListCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../port';

function WishList() {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const token = sessionStorage.getItem('token');
  const { currentuser } = useSelector(state => state.userLogin);

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  

  useEffect(() => {
    const displayCards = async () => {
      try {
        const res = await axiosWithToken.get(`${BASE_URL}/user-api/display-wishlist/${currentuser.username}`);
        if (res.data.message === 'WishList Items are') {
          setProducts(res.data.payload);
        } else {
          setErr(res.data.message);
          console.log(res.data.message);
        }
      } catch (error) {
        setErr('An error occurred while fetching the wishlist');
        console.error(error);
      }
    };
    displayCards();
  }, [updateCounter,currentuser.username,axiosWithToken]);

  const handleItemRemoval = () => {
    setUpdateCounter(prev => prev + 1);
  };

  return (
    <div>
      <h1 className='mx-auto'>WishList</h1>
      {err && <p className="error">{err}</p>}
      {products.length === 0 ? (
        <p>No products in wishlist</p>
      ) : (
        <WishListCard products={products} onItemRemove={handleItemRemoval} />
      )}
    </div>
  );
}

export default WishList;
