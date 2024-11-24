import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../port";

function AdminProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(location.state?.message || "");

  const handleCardpopup = (product) => {
    navigate(`/admin-profile/${product.productid}`, { state: { product } });
  };

  const handleAddProduct = () => {
    navigate("add-product");
  };

  const Category = [
    { id: 1, value: "footwear" },
    { id: 2, value: "fashion" },
    { id: 3, value: "sports" },
    { id: 4, value: "food" },
  ];

  const handleChange = (value) => {
    setCheckedItems((prevCheckedItems) =>
      prevCheckedItems.includes(value)
        ? prevCheckedItems.filter((item) => item !== value)
        : [...prevCheckedItems, value]
    );
  };

  const displayProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin-api/products`);
      if (res.data.message === "Products are") {
        setProducts(res.data.payload);
      } else {
        console.log(res.data.message); 
      }
    } catch (error) {
      console.log("Failed to fetch products");
    }
  };

  useEffect(() => {
    displayProducts();
    
    if (message) {
      setTimeout(() => setMessage(""), 3000);
    }
    
  }, [location, message]);

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      checkedItems.length === 0 || checkedItems.includes(product.category);
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="container mt-5">
      {message && <div className="alert alert-success text-center">{message}</div>}
      <div className="d-flex justify-content-between mb-4">
        <button className="btn btn-primary px-4 py-2" onClick={handleAddProduct}>
          Add Product
        </button>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => navigate('dispatch-products')}>
            Dispatch Products
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('deliver-products')}>
            Deliver Products
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('return-products')}>
            Verify Return Products
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <h5 className="text-secondary">Filter By Category</h5>
          {Category.map((cat) => (
            <div className="form-check mb-2" key={cat.id}>
              <input
                type="checkbox"
                id={cat.id}
                value={cat.value}
                onChange={() => handleChange(cat.value)}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor={cat.id}>
                {cat.value}
              </label>
            </div>
          ))}
        </div>
        <div className="col-md-9">
          <form className="d-flex mb-4" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Products"
              value={searchQuery}
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-primary text-white bg-primary"
              type="button"
            >
              Search
            </button>
          </form>
          <div className="row">
            {filteredProducts.map((product) => (
              <div className="col-md-4 mb-4 p-2" key={product.productid}>
                <div className="card shadow-lg h-100 border-0 rounded-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover", borderRadius: "10px" }}
                  />
                  <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title text-center">{product.title}</h5>
                    <p className="card-text text-center text-muted">
                      {product.category}
                    </p>
                    <div className="d-flex justify-content-center mb-3">
                      <span className="text-decoration-line-through me-2 text-muted">
                        ${product.price}
                      </span>
                      <span className="h5 text-success">${product.priceAfterDiscount}</span>
                    </div>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleCardpopup(product)}
                      >
                        Edit
                      </button>
                      <button className={`btn ${product.display_status === false ? 'btn-danger' : 'btn-success'} btn-sm`} disabled>
                        {product.display_status === false ? 'Disabled' : 'Enabled'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
