import React, { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { MdDeleteForever } from 'react-icons/md';
//import { useNavigate } from "react-router-dom";
import CardDetail from "./cardDetail";
import { useSelector } from "react-redux";
import { BASE_URL } from "../port";
import axios from "axios";

export default function WishListCard({ products, onItemRemove }) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { currentuser } = useSelector(state => state.userLogin);
  //const navigate = useNavigate();

  const handleCardpopup = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const Category = [
    { id: 1, value: "footwear" },
    { id: 2, value: "fashion" },
    { id: 3, value: "sports" },
    { id: 4, value: "food" },
  ];

  const handleChange = (value) => {
    if (checkedItems.includes(value)) {
      setCheckedItems(prevState => prevState.filter(item => item !== value));
    } else {
      setCheckedItems(prevState => [...prevState, value]);
    }
  };
  

  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const removeItem = async (product) => {
    try {
      const res = await axiosWithToken.put(`${BASE_URL}/user-api/remove-wishlist/${currentuser.username}/${product.productid}`);
      console.log(res);
      if (res.data.message === 'product removed from wishList') {
        onItemRemove(); // Call the callback function to update the wishlist
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.error('An error occurred while removing the item', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = checkedItems.length === 0 || checkedItems.includes(product.category);
    const matchesSearchQuery = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  return (
    <div className="d-flex justify-content-center carousel-inner">
      <div className="col-md-3" style={{ width: "20%", marginLeft: '20px' }}>
        <h5>Sort By</h5>
        <ul>
          {Category.map((cat) => (
            <li className="d-flex mx-auto m-1" key={cat.id}>
              <input
                type="checkbox"
                id={cat.id}
                value={cat.value}
                onChange={() => handleChange(cat.value)}
                className="m-1 form-check-input"
              />
              <label htmlFor={cat.id}>{cat.value}</label>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: "80%" }}>
        <div>
          <form className="d-flex mt-2">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              value={searchQuery}
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="d-flex justify-content-center flex-wrap">
          {filteredProducts.map((product) => (
            <div
              key={product.productid}
              className="card-body border bg-light border-primary m-4 shadow"
              style={{ maxWidth: "250px", height: "450px" }}
            >
              <img src={product.image} alt={product.title} className="w-100 mb-3 h-50" />
              <div>
                <div>
                  <p className="text-center mb-1">{product.category}</p>
                </div>
                <div>
                  <p className="text-center mb-1 fs-4">
                    <b>{product.title}</b>
                  </p>
                </div>
                <div>
                  <p className="text-center">
                    <span className="text-decoration-line-through">${product.price}</span>
                    <h5>${product.priceAfterDiscount}</h5>
                  </p>
                </div>
                <div className="text-center d-flex justify-content-around">
                  <CiShare1 onClick={() => handleCardpopup(product)} />
                  <MdDeleteForever
                    className="text-danger"
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                    onClick={() => removeItem(product)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && <CardDetail show={selectedProduct} handleClose={handleClosePopup} />}
    </div>
  );
}
