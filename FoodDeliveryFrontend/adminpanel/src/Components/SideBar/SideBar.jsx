import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

function SideBar({ sidebarVisible }) {
  return (
    <div
      className={`border-end bg-white ${sidebarVisible ? "" : "d-none"}`}
      id="sidebar-wrapper"
    >
      <div className="sidebar-heading border-bottom bg-light">
        <img src={assets.Logo} height={32} width={32} />
      </div>
      <div className="list-group list-group-flush">
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/add"
        >
          <i className="bi bi-plus-circle me-2"></i> AddFood
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/list"
        >
          <i className="bi bi-list-ul me-2"></i> ListFood
        </Link>
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to="/orders"
        >
          <i className="bi bi-cart me-2"></i> Order
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
