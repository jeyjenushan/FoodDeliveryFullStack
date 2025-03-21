import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/AuthService";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Login = () => {
  const { setToken, loadCardData } = useContext(StoreContext);
  const naviagte = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(data);
    try {
      const response = await loginUser(data);
      if (response.status == 200) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        loadCardData(response.data.token);
        naviagte("/");
      } else {
        toast.error("Plz enter username or password");
      }
    } catch (error) {
      toast.error("Plz enter username or password");
    }
  };

  return (
    <div className=" login-container ">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="card-header text-center bg-primary text-white">
          <h5>Sign In</h5>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmitHandler}>
            <div className="mb-4">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  name="email"
                  value={data.email}
                  onChange={onChangeHandler}
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
                  value={data.password}
                  onChange={onChangeHandler}
                />
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-outline-primary w-100">
              Sign In
            </button>

            <button type="reset" className="btn btn-outline-danger w-100 mt-3">
              Reset
            </button>

            <div className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
