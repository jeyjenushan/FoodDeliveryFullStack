import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/CartUtil";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);
  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subTotal, shipping, tax, Total } = calculateCartTotals(
    cartItems,
    quantities
  );

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });
  const [errors, setErrors] = useState({
    zip: "",
  });

  const stripe = useStripe();
  const elements = useElements();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };

  const validateZipCode = (zip) => {
    const zipRegex = /^[0-9]{5}$/; // assuming the zip code should be 5 digits
    return zipRegex.test(zip);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate postal code before proceeding
    if (!validateZipCode(data.zip)) {
      setErrors({ zip: "Your postal code is incomplete or invalid." });
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe has not been initialized");
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card element is not available");
      return;
    }

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName},${data.address},${data.city},${data.state},${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderItemRequests: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: Total.toFixed(2),
      OrderStatus: "Preparing",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/create",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 && response.data.clientSecret) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          response.data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                phone: data.phoneNumber,
              },
            },
          }
        );

        if (error) {
          toast.error(error.message);
        } else if (paymentIntent.status === "succeeded") {
          await verifyPayment(paymentIntent.id);
          await clearCart();
          navigate("/myorders");
        }
      } else {
        toast.error("Unable to place order, please try again");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Unable to place order, please try again");
    }
  };

  const verifyPayment = async (paymentIntentId) => {
    const paymentData = {
      stripe_payment_intent_id: paymentIntentId,
      payment_id: paymentIntentId,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/verify",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        toast.success("Payment successful");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment verification failed");
        navigate("/myorders");
      }
    } catch (error) {
      toast.error("Payment failed,please try again");
    }
  };
  const deleteOrder = async (response) => {
    try {
      await axios.delete("http://localhost:8080/api/orders/" + orderId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error("Unable to remove the food,something went wrong");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuantities({});
    } catch (error) {
      toast.error("Unable to remove the food,something went wrong");
    }
  };

  // CardElement options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#495057",
        lineHeight: "24px",
        fontFamily: "Helvetica, sans-serif",
        "::placeholder": {
          color: "#6c757d",
        },
      },
      invalid: {
        color: "#dc3545",
      },
    },
    hidePostalCode: true, // To hide postal code input
  };

  return (
    <div className="container mt-4">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto"
            src={assets.Logo}
            alt=""
            width="98"
            height="98"
          />
        </div>

        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty:{quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    Rs.{item.price * quantities[item.id]}.00
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Shipping</span>
                </div>
                <span className="text-body-secondary">
                  {subTotal === 0 ? 0.0 : shipping.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between ">
                <div>
                  <span>Tax[10%]</span>
                </div>
                <span>{tax.toFixed(2)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (RS)</span>
                <strong>RS.{Total.toFixed(2)}.00</strong>
              </li>
            </ul>
          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="John"
                    value={data.firstName}
                    name="firstName"
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Smith"
                    value={data.lastName}
                    name="lastName"
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={data.email}
                      name="email"
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="1234567890"
                    required
                    value={data.phoneNumber}
                    name="phoneNumber"
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    required
                    value={data.address}
                    name="address"
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    id="country"
                    value={data.state}
                    name="state"
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose...</option>
                    <option>SriLanka</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    value={data.city}
                    name="city"
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose...</option>
                    <option>Jaffna</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="zip"
                    placeholder="98745"
                    required
                    value={data.zip}
                    name="zip"
                    onChange={onChangeHandler}
                  />
                  {errors.zip && (
                    <div className="text-danger">{errors.zip}</div>
                  )}
                </div>
              </div>

              <hr className="my-4" />

              <label htmlFor="card" className="form-label">
                Credit or Debit Card
              </label>
              <CardElement
                options={cardElementOptions}
                id="card"
                className="form-control"
              />

              <button
                className="w-100 btn btn-primary btn-lg mt-3"
                type="submit"
                disabled={cartItems.length == 0}
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
