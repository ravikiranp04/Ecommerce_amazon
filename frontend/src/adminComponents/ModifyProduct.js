
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from "axios";
import { BASE_URL } from '../port';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
function ModifyProduct() {
    const { register, handleSubmit, watch } = useForm();
    const location=useLocation()
   let {product} = location.state || {}
  const [imageUrls, setImageUrls] = useState('');
  const navigate= useNavigate();
  const watchPrice = watch("price", 0);
  const watchDiscount = watch("discountPercentage", 0);
  const [err,setErr]=useState("")
  const calculateDiscountedPrice = (price, discount) => {
    const priceValue = parseFloat(price);
    const discountValue = parseFloat(discount);
    if (!isNaN(priceValue) && !isNaN(discountValue)) {
      return (priceValue - (priceValue * (discountValue / 100))).toFixed(2);
    }
    return 0;
  };


  useEffect(() => {
    if (product.images) {
        setImageUrls(product.images.join('\n'));
    }
}, [product.images]);
  
//--------------------------------------

  const onSubmit =async(data) => {
    data.productid = product.productid;
    const finalData = {
      ...data,
      priceAfterDiscount: calculateDiscountedPrice(data.price, data.discountPercentage),
      images: imageUrls.split('\n').filter(url => url.trim() !== '') // Splitting the textarea content by newline
    };
    finalData.display_status=product.display_status
    console.log(finalData);
    const res= await axios.put(`${BASE_URL}/admin-api/modify-product`,finalData)
    console.group(res)
    product={...finalData}
    if(res.data.message==='Product Modified'){
       navigate(`/admin-profile/${product.productid}`,{state:{product}})
    }
    else{
        setErr(res.data.message);
        console.log(err)
    }
  };

  const handleTextareaChange = (event) => {
    setImageUrls(event.target.value);
  };
  return (
    <div className="container">
      <h3>Modify Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label>Title</label>
          <input type='text' className='form-control mb-3' placeholder='Title' {...register("title")} defaultValue={product.title} />
        </div>
        <div>
          <label>Description</label>
          <input type='text' className='form-control mb-3' placeholder='Description' {...register("description")}  defaultValue={product.description}/>
        </div>
        <div>
          <label>Price</label>
          <input type='number' className='form-control mb-3' placeholder='Price' {...register("price")} defaultValue={product.price} />
        </div>
        <div>
          <label>Discount (in %)</label>
          <input type='number' className='form-control mb-3' placeholder='Discount Percentage' {...register("discountPercentage")} defaultValue={product.discountPercentage} />
        </div>
        <div>
          <label>Stock</label>
          <input type='number' className='form-control mb-3' placeholder='Enter updated stock' {...register("stock")} defaultValue={product.stock}/>
        </div>
        <div>
          <label>Brand</label>
          <select className='form-control mb-3' {...register("brand")} defaultValue={product.brand}>
            <option value="">Select</option>
            <option value="puma">PUMA</option>
            <option value="adidas">Adidas</option>
            <option value="allen solly">Allen Solly</option>
            <option value="nike">Nike</option>
            <option value="nestle">Nestle</option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <select className='form-control mb-3' {...register("category")} defaultValue={product.category}>
            <option value="">Select</option>
            <option value="footwear">Foot Wear</option>
            <option value="fashion">Fashion</option>
            <option value="sports">Sports</option>
            <option value="food">Food</option>
          </select>
        </div>
        <div>
          <label>Paste Image URLs (One per line)</label>
          <textarea className='form-control mb-3' rows="4" onChange={handleTextareaChange} value={imageUrls} defaultValue={imageUrls}></textarea>
        </div>
        <div>
          <label>Price After Discount:</label>
          <input type='number' className='form-control mb-3' value={calculateDiscountedPrice(watchPrice, watchDiscount)} defaultValue={product.discountPercentage} readOnly />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default ModifyProduct