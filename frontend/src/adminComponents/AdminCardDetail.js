import React, { useState } from 'react';
import { IoStarSharp } from "react-icons/io5";
import axios from 'axios';
import { BASE_URL } from '../port';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminCardDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};
    const [err, setErr] = useState('');

    const EnableProduct = async () => {
        try {
            const res = await axios.put(`${BASE_URL}/admin-api/enable/${product.productid}`);
            if (res.data.message === 'Product Enabled') {
                navigate(`/admin-profile`, { state: { message: 'Product enabled successfully' } });
            } else {
                setErr(res.data.message);
            }
        } catch (error) {
            setErr('Failed to enable product');
        }
    };

    const DisableProduct = async () => {
        try {
            const res = await axios.put(`${BASE_URL}/admin-api/disable/${product.productid}`);
            if (res.data.message === 'Product disabled') {
                navigate(`/admin-profile`, { state: { message: 'Product disabled successfully' } });
            } else {
                setErr(res.data.message);
            }
        } catch (error) {
            setErr('Failed to disable product');
        }
    };

    if (!product) {
        return <div>Product details not available.</div>;
    }

    return (
        <div className="container p-3">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.images[0]} alt={product.title} className="w-100 mb-3" />
                    <div className="d-flex justify-content-around">
                        {product.images.map((img, index) => (
                            <img src={img} alt={product.title} key={index} className="w-25 p-1 border" style={{maxHeight:"25%"}}/>
                        ))}
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>{product.title}</h3>
                    <div className="d-flex mb-2">
                        {[...Array(5)].map((_, i) => (
                            <IoStarSharp key={i} className={i < product.rating ? "text-warning" : "text-muted"} />
                        ))}
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <span className="text-decoration-line-through me-2">${product.price}</span>
                        <h5 className="mb-0">${product.priceAfterDiscount}</h5>
                    </div>
                    <div>
                        <p>CATEGORY: <b>{product.category}</b></p>
                        <hr />
                    </div>
                    <div>
                        <p className="m-0 me-3 pb-2">Stock: {product.stock}</p>
                    </div>
                    {product.display_status ? (
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-success btn-sm me-2" disabled>Available</button>
                            <button className="btn btn-danger btn-sm" onClick={DisableProduct}>Make Not Available</button>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-success btn-sm me-2" onClick={EnableProduct}>Make it available</button>
                            <button className="btn btn-danger btn-sm" disabled>Not Available</button>
                        </div>
                    )}
                    <hr />
                    <button className="btn btn-success w-100" onClick={()=>{navigate('modify-product',{state:{product}})}}>Modify</button>
                    {err && <div className="text-danger mt-2">{err}</div>}
                </div>
            </div>
        </div>
    );
}

export default AdminCardDetail;
