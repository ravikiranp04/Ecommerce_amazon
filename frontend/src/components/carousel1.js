import React from "react";

export default function Carousel1() {
  return (
    <div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner" id="carousel">
          {/* First Slide */}
          <div className="carousel-item active">
            <div className="carousel-image-container">
              <img
                src="https://source.unsplash.com/random/1200x400/?shirt"
                className="d-block w-100"
                alt="shirt"
                style={{
                  objectFit: "cover",
                  height: "400px",
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Stylish Shirts</h5>
                <p>Discover our latest collection of stylish shirts.</p>
              </div>
            </div>
          </div>
          {/* Second Slide */}
          <div className="carousel-item">
            <div className="carousel-image-container">
              <img
                src="https://source.unsplash.com/random/1000x400/?necklace"
                className="d-block w-100"
                alt="necklace"
                style={{
                  objectFit: "cover",
                  height: "400px",
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Elegant Necklaces</h5>
                <p>Find the perfect necklace to complement your style.</p>
              </div>
            </div>
          </div>
          {/* Third Slide */}
          <div className="carousel-item">
            <div className="carousel-image-container">
              <img
                src="https://source.unsplash.com/random/1200x400/?shoes"
                className="d-block w-100"
                alt="shoes"
                style={{
                  objectFit: "cover",
                  height: "400px",
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>Fashionable Shoes</h5>
                <p>Step up your fashion game with our latest shoes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Navigation Buttons */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
            style={{
              backgroundColor: "#000", 
              borderRadius: "50%",
              padding: "10px",
            }}
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
            style={{
              backgroundColor: "#000", 
              borderRadius: "50%",
              padding: "10px",
            }}
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
