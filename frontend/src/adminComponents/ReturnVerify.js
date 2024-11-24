import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../port";
import "./DeliverProducts.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ReturnVerify() {
  const [qrCode, setQrCode] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [products, setProducts] = useState([]);
  const [rfid, setRfid] = useState("");
  const [rfidVerified, setRfidVerified] = useState(false);
  const [image, setImage] = useState(null);
  const [isRejected, setIsRejected] = useState(false);
  const [validRfid, setValidRfid] = useState("");
  const [err, setErr] = useState("");
  const [rejectReason, setRejectReason] = useState(""); // Rejection reason state
  const location = useLocation();
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const myproduct = location.state;
  const [isAccepted,setisAccepted]=useState(false)

  // Fetching products data
  useEffect(() => {
    const fetchAllProducts = async () => {
      const res = await axios.get(`${BASE_URL}/admin-api/return-products-list`);
      if (res.data.message === "Return Products are") {
        setProducts(res.data.payload);
      } else {
        setErr(res.data.message);
      }
    };
    fetchAllProducts();
  }, []);

  // Function to handle API call for rejecting a product
  const rejectProduct = async (bcode, reson) => {
    try {
      console.log(bcode);
      console.log(reson);
      const response = await axios.put(`${BASE_URL}/admin-api/reject-product/${bcode}/${reson}`);
      console.log(response);
      if (response.data.message == "Return Rejected") {
        setNotification("Product Rejected");
        setTimeout(() => {
          setNotification('');
          navigate('/admin-profile/return-products');
        }, 2000);
      } else {
        alert("Error rejecting the product");
      }
    } catch (error) {
      console.error("Error rejecting the product:", error);
      alert("Something went wrong while rejecting the product");
    }
  };

  // Handle QR code submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const details = products.find((p) => p.barcode === qrCode);

    if (details) {
      setValidRfid(details.rfidTag);
      setProductDetails(details);
      setIsRejected(false);
    } else {
      const confirmReject = window.confirm(
        "No product found for the entered QR code. Do you want to reject this product?"
      );
      if (confirmReject) {
        const rejectionReason = "Invalid Product...";
        setRejectReason(rejectionReason);
        rejectProduct(myproduct.barcode, rejectReason); // Call API for invalid product
        setValidRfid("");
        setProductDetails(null); // Clear product details
        setIsRejected(true);
      }
    }
  };

  // Handle RFID verification
  const handleRfidCheck = () => {
    if (rfid === validRfid) {
      setRfidVerified(true);
      alert("RFID matched!");
    } else {
      const confirmReject = window.confirm(
        "RFID not matched. Do you want to reject this product?"
      );
      if (confirmReject) {
        const reason = "RFID Tag Mismatch"; // Set the rejection reason here
        setRejectReason(reason); // Update state with the rejection reason

        setRfidVerified(false);

        setProductDetails({
          ...productDetails,
          rejectedReason: reason 
        });

        // Use the updated rejection reason for the rejection API call
        rejectProduct(myproduct.barcode, reason);
        setIsRejected(true); // Mark product as rejected
      } else {
        setRfidVerified(false); // Keep RFID verification as false if user does not reject
      }
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert the image file to a URL
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Set image URL for preview
      setImageFile(file); // Store the image file for submission
    }
  };

  // Handle image verification
  const handleImageVerify = async () => {
    if (!imageFile) {
      alert("Image not available");
      return;
    }
    if(!myproduct.dispatchImages){
      alert("Dispatch Images not available");
      return;
    }
    
   
    const formData = new FormData();
    formData.append("file", imageFile);  // imageFile is the image file object from input
    formData.append("dispatchImages", JSON.stringify(myproduct.dispatchImages)); 
    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response)
      if (response.data.result === "Genuine Product") {
        alert(`Product Verified: Similarity - ${response.data.similarity}`);
        setIsRejected(false)
        setisAccepted(true)
        
      } else {
        alert(`Product Fraudulent: Similarity - ${response.data.similarity}`);
        setisAccepted(false)
        
        setRejectReason("Product Mismatch")
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong while verifying the product");
    }
  };

  

  // Confirmation for "Seal is broken"
  useEffect(() => {
    if (selectedOption === "Seal is broken") {
      const confirmReject = window.confirm(
        "The seal is broken. Do you want to reject this product?"
      );
      if (confirmReject) {
        const reason = "Tamper Seal Broken";
        setRejectReason(reason);
        setProductDetails({
          ...productDetails, // Preserve existing details
          rejectedReason: "Tamper Seal Broken" // Add rejection reason to details
        });
        rejectProduct(myproduct.barcode, reason);
        setIsRejected(true);
      } else {
        setSelectedOption(""); // Reset the option if not rejecting
      }
    }
  }, [selectedOption]);

  // Determine if all conditions for accepting the return are met
  const canAcceptReturn =
    rfidVerified &&
    (selectedOption === "Seal is unbroken" ||
      selectedOption === "Non-sealed object") &&
    image;

  // Handle Reject button click
  const handleReject = () => {
    // Make the API call to reject the product
    if (productDetails) {
      rejectProduct(myproduct.barcode, rejectReason);
      setIsRejected(true);
    }
  };
  const handleAcceptReturn=async()=>{
    const res = await axios.put(`${BASE_URL}/admin-api/accept-product/${myproduct.barcode}/${myproduct.username}/${myproduct.price}`)
    if(res.data.message==='Return Accepted'){
      navigate(`/admin-profile/return-products`);
    }
    else{
      setErr(res.data.message)
    }
  }

  return (
    <div className="return-container text-center p-5">
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

      {/* QR Code Submission */}
      <div className="return-box">
        <form onSubmit={handleSubmit}>
          <label htmlFor="qr-code" className="return-label p-1">
            QR Code:
          </label>
          <input
            type="text"
            placeholder="Enter your QR code"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />
          <button className="return-btn m-2" type="submit">
            Submit
          </button>
        </form>
      </div>

      {productDetails && (
        <div className="d-flex justify-content-center mt-4">
          {/* Product Details Card */}
          <div className="product-details card h-100 w-25 m-2 p-3">
            <h3>Product Details</h3>
            <center>
              <img
                src={productDetails.images[0]}
                alt={productDetails.title}
                className="img-thumbnail mb-3"
                style={{ maxWidth: "18rem" }}
              />
            </center>
            <p>
              <strong>Product Name:</strong> {productDetails.title}
            </p>
            <p>
              <strong>Buyer Name:</strong> {productDetails.username}
            </p>
            <p>
              <strong>Return Date:</strong> {productDetails.returnValidDate}
            </p>
            <p>
              <strong>Reason for Return:</strong> {productDetails.returnReason}
            </p>
            {productDetails.rejectedReason && (
              <p className="text-danger">
                <strong>Rejected Reason:</strong> {productDetails.rejectedReason}
              </p>
            )}
          </div>

          {/* RFID Input Card */}
          <div className="rfid-input card h-100 w-25 m-2 p-3">
            <h4>RFID Verification</h4>
            <input
              type="text"
              placeholder="Enter RFID tag"
              value={rfid || ""}
              onChange={(e) => setRfid(e.target.value)}
            />
            <button className="return-btn m-2" onClick={handleRfidCheck}>
              Verify RFID
            </button>
          </div>

          {/* Radio Options Card */}
          {rfidVerified && (
            <div className="radio-options card h-100 w-25 m-2 p-3">
              <h4>Select an Option</h4>
              <div>
                <input
                  type="radio"
                  id="unbroken"
                  name="returnOption"
                  value="Seal is unbroken"
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label htmlFor="unbroken" className="ms-2">
                  Seal is unbroken
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="radio"
                  id="broken"
                  name="returnOption"
                  value="Seal is broken"
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label htmlFor="broken" className="ms-2">
                  Seal is broken
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="radio"
                  id="nonsealed"
                  name="returnOption"
                  value="Non-sealed object"
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label htmlFor="nonsealed" className="ms-2">
                  Non-sealed object
                </label>
              </div>
            </div>
          )}

          {/* Image Upload Card */}
          {(selectedOption === "Seal is unbroken" ||
            selectedOption === "Non-sealed object") && (
            <div className="image-upload card h-100 w-25 m-2 p-3">
              <h4>Upload an Image</h4>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <div className="image-preview mt-2">
                  <h5>Preview:</h5>
                  <img
                    src={image}
                    alt="Uploaded"
                    className="img-thumbnail"
                    style={{ maxWidth: "18rem" }}
                  />
                  {/* Verify Button */}
                  <button
                    className="return-btn m-2"
                    onClick={handleImageVerify}
                  >
                    Verify Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Accept and Reject Buttons */}
      {productDetails && !isRejected && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-success m-2"
            disabled={!canAcceptReturn}
            onClick={()=>handleAcceptReturn}
          >
            Accept Return
          </button>
          <button
            className="btn btn-danger m-2"
            onClick={handleReject}
          >
            Reject Return
          </button>
        </div>
      )}

      {isRejected && (
        <div className="text-danger mt-4">
          <h5>The return has been rejected.</h5>
        </div>
      )}
    </div>
  );
}

export default ReturnVerify;
