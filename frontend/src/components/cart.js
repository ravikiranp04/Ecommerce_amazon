import React, { useState, useEffect } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../port';

function Cart() {
  const { currentuser } = useSelector((state) => state.userLogin);
  const [subtotal, setSubTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState('');
  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
  const navigate = useNavigate();
  //const location = useLocation();

  

  const calculateSubtotal = (quantities, products) => {
    let sub = 0;
    products.forEach((product, index) => {
      sub += quantities[index] * product.priceAfterDiscount;
    });
    setSubTotal(sub);
  };

  const IncreaseCartCount = async (index, prodid) => {
    const res = await axiosWithToken.put(`${BASE_URL}/user-api/increase-cart-count/${currentuser.username}/${prodid}`);
    if (res.data.message === 'product quantity increased') {
      handleQuantityChange(index, 1);
    } else {
      setErr(res.data.message);
    }
  };

  const DecreaseCartCount = async (index, prodid) => {
    const res = await axiosWithToken.put(`${BASE_URL}/user-api/decrease-cart-count/${currentuser.username}/${prodid}`);
    if (res.data.message === 'product quantity Decreased') {
      handleQuantityChange(index, -1);
    } else {
      setErr(res.data.message);
    }
  };

  useEffect(() => {
    const displayCartItems = async () => {
      const res = await axiosWithToken.get(`${BASE_URL}/user-api/display-cart/${currentuser.username}`);
      if (res.data.message === 'Cart Items are') {
        setProducts(res.data.payload);
        navigate(`/user-profile/${currentuser.username}/cart`);
      } else {
        setErr(res.data.message);
        console.log(err);
      }
    };
    displayCartItems();
  }, []);

  useEffect(() => {
    const initialQuantities = products.map((product) => product.quantity || 1);
    setQuantities(initialQuantities);
    calculateSubtotal(initialQuantities, products);
  }, [products]);

  const removeItem = async (index, prodid) => {
    const res = await axiosWithToken.put(`${BASE_URL}/user-api/remove-cart/${currentuser.username}/${prodid}`);
    if (res.data.message === 'product removed from cart') {
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
      const updatedQuantities = quantities.filter((_, i) => i !== index);
      setQuantities(updatedQuantities);
      calculateSubtotal(updatedQuantities, updatedProducts);
    } else {
      setErr(res.data.message);
    }
  };

  const [quantities, setQuantities] = useState([]);

  const handleQuantityChange = (index, delta) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(0, newQuantities[index] + delta);
    setQuantities(newQuantities);
    calculateSubtotal(newQuantities, products);
  };

  const handleProceed=(products)=>{
    products.forEach(product=>{
      product.username=currentuser.username;
      product.dateOfPurchase =Date.now();
      product.deliveryDate = Date.now() + (7 * 24 * 60 * 60 * 1000);
      product.returnValidDate = Date.now() + (14 * 24 * 60 * 60 * 1000);
      product.deliveryStatus = "ordered";
      product.returnValidity = true;
    })
    console.log(products)
    navigate(`address`,{state:products});
  }

  return (
    <div className="container p-2">
      <div className="d-flex justify-content-even">
        <div className="w-50 pr-2">
          <table className="table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>SUBTOTAL</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.productid}>
                  <td className="d-flex align-items-center">
                    <img src={product.image} alt={product.title} className="mr-3" style={{ width: '50px', height: 'auto' }} />
                    <p>{product.title}</p>
                  </td>
                  <td>${product.priceAfterDiscount}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      { quantities[index]===1?
                          <MdDeleteForever
                          className="text-danger"
                          style={{ cursor: 'pointer', fontSize: '24px' }}
                          onClick={() => removeItem(index, product.productid)}
                        />:
                          <button
                          className="btn btn-success"
                          onClick={() => DecreaseCartCount(index, product.productid)}
                        >
                          -
                        </button>
                        
                        
                      }
                      
                      <p className="text-center mx-2" style={{ width: '40px' }}>{quantities[index]}</p>
                      <button
                        className="btn btn-success"
                        onClick={() => IncreaseCartCount(index, product.productid)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${product.priceAfterDiscount * quantities[index]}</td>
                  <td>
                    <MdDeleteForever
                      className="text-danger"
                      style={{ cursor: 'pointer', fontSize: '24px' }}
                      onClick={() => removeItem(index, product.productid)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div className="d-flex">
            <input type="text" className="form-control" placeholder="Coupon Code" />
            <button className="btn btn-primary ml-2">APPLY COUPON</button>
          </div>
          <hr />
        </div>
        <div className="mt-4 p-3 bg-white shadow-sm" style={{ width: '35%' }}>
          <h3>Cart Total</h3>
          <div className="d-flex justify-content-between">
            <h5>Subtotal</h5>
            <h5>${subtotal}</h5>
          </div>
          <hr />
          <form>
            <div className="form-group">
              <label htmlFor="countrySelect">Country</label>
              <select className="form-control" id="countrySelect">
                <option>India</option>
              </select>
              <label htmlFor="stateSelect">State</label>
              <select className="form-control" id="stateSelect">
                <option>Telangana</option>
              </select>
              <label htmlFor="citySelect">City</label>
              <select className="form-control" id="citySelect">
                <option>Hyderabad</option>
              </select>
              <label htmlFor="pinSelect">Pincode</label>
              <input type="text" className="form-control" id="pinSelect" placeholder="Enter pincode" />
            </div>
          </form>
          <hr />
          <button className="btn btn-dark w-100" style={{ height: '50px' }} onClick={()=>handleProceed(products)}>PROCEED TO CHECKOUT &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
