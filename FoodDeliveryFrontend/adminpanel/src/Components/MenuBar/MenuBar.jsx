import React from "react";

function MenuBar({ toggleSidebar }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button
          onClick={toggleSidebar}
          className="btn btn-primary"
          id="sidebarToggle"
        >
          <i className="bi bi-list"></i>
        </button>
      </div>
    </nav>
  );
}

export default MenuBar;
