import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from "axios";
import { BASE_URL } from '../port';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [imageUrls, setImageUrls] = useState('');
  const navigate = useNavigate();
  const watchPrice = watch("price", 0);
  const watchDiscount = watch("discountPercentage", 0);
  const [err, setErr] = useState("");

  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountValue = parseFloat(discount);
    if (!isNaN(priceValue) && !isNaN(discountValue)) {
      return (priceValue - (priceValue * (discountValue / 100))).toFixed(2);
    }
    return 0;
  };

  const onSubmit = async (data) => {
    data.productid = Date.now();
    const finalData = {
      ...data,
      priceAfterDiscount: calculateDiscountedPrice(data.price, data.discountPercentage),
      images: imageUrls.split('\n').filter(url => url.trim() !== ''),
      display_status: true
    };

    try {
      const res = await axios.post(`${BASE_URL}/admin-api/add-product`, finalData);
      if (res.data.message === 'Product added Successfully') {
        navigate('/admin-profile');
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr("An error occurred while adding the product.");
      console.log(error);
    }
  };

  const handleTextareaChange = (event) => {
    setImageUrls(event.target.value);
  };

  return (
    <div className="container">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label>Title</label>
          <input
            type='text'
            className='form-control mb-3'
            placeholder='Title'
            {...register("title", { required: true })}
          />
          {errors.title && <p className="text-danger">Title is required.</p>}
        </div>
        <div className='form-group'>
          <label>Description</label>
          <input
            type='text'
            className='form-control mb-3'
            placeholder='Description'
            {...register("description", { required: true })}
          />
          {errors.description && <p className="text-danger">Description is required.</p>}
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            type='number'
            className='form-control mb-3'
            placeholder='Price'
            {...register("price", { required: true })}
          />
          {errors.price && <p className="text-danger">Price is required.</p>}
        </div>
        <div className='form-group'>
          <label>Discount (in %)</label>
          <input
            type='number'
            className='form-control mb-3'
            placeholder='Discount Percentage'
            {...register("discountPercentage", { required: true })}
          />
          {errors.discountPercentage && <p className="text-danger">Discount Percentage is required.</p>}
        </div>
        <div className='form-group'>
          <label>Stock</label>
          <input
            type='number'
            className='form-control mb-3'
            placeholder='Enter updated stock'
            {...register("stock", { required: true })}
          />
          {errors.stock && <p className="text-danger">Stock is required.</p>}
        </div>
        <div className='form-group'>
          <label>Brand</label>
          <select className='form-control mb-3' {...register("brand", { required: true })}>
            <option value="">Select</option>
            <option value="puma">PUMA</option>
            <option value="adidas">Adidas</option>
            <option value="allen solly">Allen Solly</option>
            <option value="nike">Nike</option>
            <option value="nestle">Nestle</option>
          </select>
          {errors.brand && <p className="text-danger">Brand is required.</p>}
        </div>
        <div className='form-group'>
          <label>Category</label>
          <select className='form-control mb-3' {...register("category", { required: true })}>
            <option value="">Select</option>
            <option value="footwear">Foot Wear</option>
            <option value="fashion">Fashion</option>
            <option value="sports">Sports</option>
            <option value="food">Food</option>
          </select>
          {errors.category && <p className="text-danger">Category is required.</p>}
        </div>
        <div className='form-group'>
          <label>Paste Image URLs (One per line)</label>
          <textarea
            className='form-control mb-3'
            rows="4"
            onChange={handleTextareaChange}
            value={imageUrls}
          ></textarea>
        </div>
        <div className='form-group'>
          <label>Price After Discount:</label>
          <input
            type='number'
            className='form-control mb-3'
            value={calculateDiscountedPrice(watchPrice, watchDiscount)}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        {err && <p className="text-danger mt-3">{err}</p>}
      </form>
    </div>
  );
}

export default AddProduct;
