import React from 'react'
import Navigation from '../components/navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer'

function RouteLayout() {
  return (
    <div>
      <Navigation />
      <div style={{ minHeight: "70vh" }}>
        <div>
          {" "}
          <Outlet />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <Footer />
      </div>
    </div>
  )
}

export default RouteLayout;