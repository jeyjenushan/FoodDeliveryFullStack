import React from "react";
import MenuBar from "./component/MenuBar/MenuBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import ContactUs from "./pages/Contact Us/ContactUs";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import { ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyOrders from "./pages/MyOrders/MyOrders";
import { useContext } from "react";
import { StoreContext } from "./context/StoreContext";

const stripePromise = loadStripe(
  "pk_test_51QgjejRqANa7cQ2jJrdk9vSIl3XCh1HWJUOEWFDRy2OD24IXGZFtfHzmWZfjLc8pdPSB8OWolK43dIbaSNfXXScK00BvL4vMQe"
);

function App() {
  const { token } = useContext(StoreContext);
  return (
    <div>
      <MenuBar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />
        <Route
          path="/order"
          element={
            token ? (
              <Elements stripe={stripePromise}>
                <PlaceOrder />
              </Elements>
            ) : (
              <Login />
            )
          }
        />

        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={token ? <Home /> : <Register />} />
      </Routes>
    </div>
  );
}

export default App;
