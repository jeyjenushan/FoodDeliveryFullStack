import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AddFood from "./Pages/AddFood/AddFood";
import ListFood from "./Pages/ListFood/ListFood";
import Orders from "./Pages/Orders/Orders";
import SideBar from "./Components/SideBar/SideBar";
import MenuBar from "./Components/MenuBar/MenuBar";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [sidebarVisible, setSideBarvisible] = useState(true);
  const toggleSidebar = () => {
    console.log(sidebarVisible);
    setSideBarvisible(!sidebarVisible);
  };
  return (
    <div className="d-flex" id="wrapper">
      <SideBar sidebarVisible={sidebarVisible} />

      <div id="page-content-wrapper">
        <MenuBar toggleSidebar={toggleSidebar} />
        <ToastContainer />
        <div className="container-fluid">
          <Routes>
            <Route path="/add" element={<AddFood />} />
            <Route path="/list" element={<ListFood />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<ListFood />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
