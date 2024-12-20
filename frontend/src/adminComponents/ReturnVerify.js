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
  const [rejectReason, setRejectReason] = useState(""); 
  const location = useLocation();
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const myproduct = location.state;
  const [comparisonResult,setComparisonResult]=useState("");
  const [similarity,setSimilarity]=useState(null);
  const [loading, setLoading] = useState(false);
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

  //QR code submission
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
        rejectProduct(myproduct.barcode,"Invalid Product..."); 
        setValidRfid("");
        setProductDetails(null); 
        setIsRejected(true);
      }
    }
  };

  //RFID verification
  const handleRfidCheck = () => {
    if (rfid === validRfid) {
      setRfidVerified(true);
      alert("RFID matched!");
    } else {
      const confirmReject = window.confirm(
        "RFID not matched. Do you want to reject this product?"
      );
      if (confirmReject) {
        const reason = "RFID Tag Mismatch"; 
        setRejectReason(reason); 

        setRfidVerified(false);

        setProductDetails({
          ...productDetails, 
          rejectedReason: reason 
        });

        
        rejectProduct(myproduct.barcode, reason);
        setIsRejected(true); 
      } else {
        setRfidVerified(false); 
      }
    }
  };

  //image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); 
      setImageFile(file); 
    }
  };

  // Handle image verification
  const handleImageVerify = async () => {
    /*if (!imageFile) {
      alert("Image not available");
      return;
    }
    if(!myproduct.dispatchImages){
      alert("Dispatch Images not available");
      return;
    }
    
    const formData = {};
    formData.file = image
    formData.dispatchImages=myproduct.dispatchImages;
    console.log(formData)
    try {
      const response = await axios.post(`http://127.0.0.1:5000/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response)
      if (response.data.result === "Genuine Product") {
        alert(`Product Verified: Similarity - ${response.data.similarity}`);
      } else {
        alert(`Product Fraudulent: Similarity - ${response.data.similarity}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong while verifying the product");
    }*/
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("dispatchImages",myproduct.dispatchImages)
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });
        console.log(response)
        const data = await response.json();
        setComparisonResult(data.result);  
        setSimilarity(data.similarity);
          
        console.log(data)
        if(data.result==="Genuine Product"){
          canAcceptReturn=true;
          setIsRejected(false)

        }
        else{
          setRejectReason("Product mismatch")
          canAcceptReturn=false
          setIsRejected(true)
        }
        navigate('/admin-profile/return-products')
      } catch (error) {
        console.error("Error during image upload:", error);
        
      } finally {
        setLoading(false);
      }

  };


  

  //  "Seal is broken"
  useEffect(() => {
    if (selectedOption === "Seal is broken") {
      const confirmReject = window.confirm(
        "The seal is broken. Do you want to reject this product?"
      );
      if (confirmReject) {
        const reason = "Tamper Seal Broken";
        setRejectReason(reason);
        setProductDetails({
          ...productDetails, 
          rejectedReason: "Tamper Seal Broken" 
        });
        rejectProduct(myproduct.barcode, reason);
        setIsRejected(true);
      } else {
        setSelectedOption(""); 
      }
    }
  }, [selectedOption]);

  const canAcceptReturn =
    rfidVerified &&
    (selectedOption === "Seal is unbroken" ||
      selectedOption === "Non-sealed object") &&
    image;

  const handleReject = () => {
    if (productDetails) {
      rejectProduct(myproduct.barcode, rejectReason);
      setIsRejected(true);
    }
  };
  const handleAcceptReturn=async()=>{
    const res = await axios.put(`${BASE_URL}/admin-api/accept-product/${myproduct.barcode}/${myproduct.username}/${myproduct.price}`);
    window.confirm("Confirm to Accept")
    if(res.data.message==="Return Accepted"){
      setIsRejected(false)
      setNotification("Product Accepted and Refund Processed");
        setTimeout(() => {
          setNotification('');
          navigate('/admin-profile/return-products');
        }, 2000);
      
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
                  
                  
                  {loading ? (
                <p>Processing...</p>
                ) : (
                comparisonResult && (
                    <div className="result mt-3">
                    <h5>Result:</h5>
                    <p>{comparisonResult}</p>
                    {similarity && (
                        <div>
                        <h6>Similarity Score:</h6>
                        <p>{similarity.toFixed(7)}</p> {/* Display similarity with 7 decimal points */}
                        </div>
                    )}
                    </div>
                )
                )}

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
            onClick={handleAcceptReturn}
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