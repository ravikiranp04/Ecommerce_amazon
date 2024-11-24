import React from "react";

function Footer() {
  return (
    <footer className="section bg-footer bg-black text-white">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div>
              <h6 className="footer-heading text-uppercase text-white">
                Information
              </h6>
              <ul className="list-unstyled footer-link mt-2">
                <li>
                  <button onClick={() => window.location.href = "/pages"}>Pages</button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/team"}>Our Team</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <h6 className="footer-heading text-uppercase text-white">
                Resources
              </h6>
              <ul className="list-unstyled footer-link mt-2">
                <li>
                  <a href="https://www.wikipedia.org">Wikipedia</a>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/terms"}>Terms &amp; Service</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-2">
            <div>
              <h6 className="footer-heading text-uppercase text-white">Help</h6>
              <ul className="list-unstyled footer-link mt-2">
                <li>
                  <button onClick={() => window.location.href = "/terms-of-service"}>Terms of Services</button>
                </li>
                <li>
                  <button onClick={() => window.location.href = "/privacy-policy"}>Privacy Policy</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div>
              <h6 className="footer-heading text-uppercase text-white">
                Contact Us
              </h6>
              <p className="contact-info mt-2">
                Contact us if you need help with anything
              </p>
              <p className="contact-info">+91 9999999999</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="footer-alt mb-0 f-14">2026, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
