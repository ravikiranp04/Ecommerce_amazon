import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import axios from "axios";
import { BASE_URL } from "../port";
import "./Myorders.css";
import { Modal, Button } from "react-bootstrap"; // For the modal

function Myorders() {
  const token = sessionStorage.getItem("token");
  const { currentuser } = useSelector((state) => state.userLogin);

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const [notification, setNotification] = useState("");
  const [err, setErr] = useState("");
  const [myorders, setMyorders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For storing selected order for viewing details
  const [showModal, setShowModal] = useState(false); // Modal visibility for viewing details
  const [returnReason, setReturnReason] = useState(""); // To store the user's return reason
  const [showReturnModal, setShowReturnModal] = useState(false); // Modal visibility for return reason
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null); // Store order for return

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosWithToken.get(
          `${BASE_URL}/user-api/get-orders/${currentuser.username}`
        );
        if (res.data.message === "Orders are") {
          setMyorders(res.data.payload);
        } else {
          setErr(res.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setErr("Failed to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, [currentuser.username]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axiosWithToken.post(`${BASE_URL}/user-api/cancel-order`, { orderId });
      if (res.data.success) {
        setMyorders(
          myorders.map((order) =>
            order._id === orderId ? { ...order, deliveryStatus: "cancelled" } : order
          )
        );
        alert("Order cancelled successfully.");
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleReturnOrder = async () => {
    try {
      if (!returnReason.trim()) {
        alert("Please provide a reason for the return.");
        return;
      }

      const res = await axiosWithToken.put(
        `${BASE_URL}/user-api/return-order/${selectedReturnOrder._id}`,
        { reason: returnReason }
      );

      if (res.data.message === "Return requested") {
        setMyorders(
          myorders.map((order) =>
            order._id === selectedReturnOrder._id
              ? { ...order, deliveryStatus: "return requested" }
              : order
          )
        );
        setNotification("Return Requested");
        setTimeout(()=>{
          setNotification('');
         
        },2000)
      } else {
        setErr(res.data.message);
      }

      setShowReturnModal(false); // Close the modal
      setReturnReason(""); // Clear the return reason
    } catch (error) {
      console.error("Error placing return request:", error);
    }
  };

  const isReturnDisabled = (returnDate) => {
    const now = new Date();
    return now > new Date(returnDate);
  };

  return (
    <div className="container myorders-container">
      <h3 className="text-center p-5 orders-title">My Orders</h3>

      {err && <div className="alert alert-danger text-center">{err}</div>}

      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontWeight: "bold",
          }}
        >
          {notification}
        </div>
      )}

      {myorders.length === 0 ? (
        <p className="text-center no-orders">No orders yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {myorders.map((order) => (
            <div className="col" key={order._id}>
              <div className="card order-card shadow-lg">
                <img
                  src={order.images[0]}
                  className="card-img-top order-image"
                  alt={order.title}
                />
                <div className="card-body">
                  <h5 className="card-title order-title text-center">{order.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Date: {formatDate(order.dateOfPurchase)}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Status: {order.deliveryStatus}
                  </h6>
                  <button
                    className="btn btn-primary order-btn w-100 mb-2"
                    onClick={() => setSelectedOrder(order) || setShowModal(true)}
                  >
                    View Details
                  </button>

                  {/* Cancel Button for Ordered/Dispatched */}
                  {(order.deliveryStatus === "ordered" || order.deliveryStatus === "dispatched") && (
                    <button
                      className="btn btn-danger order-btn w-100"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel
                    </button>
                  )}

                  {/* Return Button for Delivered */}
                  {order.deliveryStatus === "delivered" && (
                    <button
                      className="btn btn-warning order-btn w-100"
                      onClick={() => {
                        setSelectedReturnOrder(order);
                        setShowReturnModal(true);
                      }}
                      disabled={isReturnDisabled(order.returnValidDate)}
                    >
                      {isReturnDisabled(order.returnValidDate) ? "Return Unavailable" : "Return"}
                    </button>
                  )}

                  {/* Return Requested Button */}
                  {order.deliveryStatus === "return requested" && (
                    <button className="btn btn-warning order-btn w-100" disabled>
                      Return Requested
                    </button>
                  )}
                  {order.deliveryStatus === "Return Rejected" && (
                    <p className="txt-warning  w-100" >
                      Return Rejcted due to {order.rejectReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Viewing Order Details */}
      {selectedOrder && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className="mb-3">{selectedOrder.title}</h5>
            <img
              src={selectedOrder.images[0]}
              alt={selectedOrder.title}
              className="img-fluid mb-3"
            />
            <p>
              <strong>Description:</strong> {selectedOrder.description || "N/A"}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedOrder.price}
            </p>
            <p>
              <strong>Discount:</strong> {selectedOrder.discountPercentage}%
            </p>
            <p>
              <strong>Price After Discount:</strong> ₹{selectedOrder.priceAfterDiscount}
            </p>
            <p>
              <strong>Category:</strong> {selectedOrder.category}
            </p>
            <p>
              <strong>Brand:</strong> {selectedOrder.brand}
            </p>
            <p>
              <strong>Delivery Status:</strong> {selectedOrder.deliveryStatus}
            </p>
            <p>
              <strong>Delivery Date:</strong> {formatDate(selectedOrder.deliveryDate)}
            </p>

            <h6 className="mt-3">Delivery Address:</h6>
            <p>
              {selectedOrder.deliveryAddress.name}, {selectedOrder.deliveryAddress.add_1},
              <br />
              {selectedOrder.deliveryAddress.add_2}, {selectedOrder.deliveryAddress.city},
              <br />
              {selectedOrder.deliveryAddress.state}, {selectedOrder.deliveryAddress.country} -{" "}
              {selectedOrder.deliveryAddress.pincode}.
              <br />
              Phone: {selectedOrder.deliveryAddress.mobileno}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for Return Reason */}
      <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Return Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please provide a reason for returning the product:</p>
          <textarea
            className="form-control"
            rows="4"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder="Enter your reason here..."
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReturnModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReturnOrder}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Myorders;
