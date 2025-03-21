import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { registerUser } from "../../service/AuthService";
const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(data);
    try {

const response=await registerUser(data);

      if (response.status == 201) {
        toast.success("Registration completed,Please Login");
        navigate("/login");
      } else {
        toast.error("Unable to register,Please try again");
      }
    } catch (error) {
      toast.error("Unable to register,Please try again");
    }
  };

  return (
    <div className=" register-container ">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="card-header text-center bg-primary text-white">
          <h5>Sign Up</h5>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmitHandler}>
            <div className="mb-4">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="john"
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  required
                />
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  required
                />
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-outline-primary w-100">
              Sign Up
            </button>

            <button type="reset" className="btn btn-outline-danger w-100 mt-3">
              Reset
            </button>

            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Login now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
