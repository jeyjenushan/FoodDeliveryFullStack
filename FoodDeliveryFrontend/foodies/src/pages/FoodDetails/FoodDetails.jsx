import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { fetchFoodDetails } from "../../service/FoodService";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";
const FoodDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const { foodList, quantities, decreaseQty, increaseQty, removeFromCart } =
    useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFoodDetails = async () => {
      try {
        const reponse = await fetchFoodDetails(id);
        setData(reponse);
        console.log("The response is : " + data);
      } catch (error) {
        toast.error("Error display the food details");
      }
    };
    loadFoodDetails();
  }, [id]);

  const addToCart = () => {
    increaseQty(data.id);
    navigate("/cart");
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img
              className="card-img-top mb-5 mb-md-0"
              src={`http://localhost:8080/api/foods/image/${data.imageUrl}`}
              alt="..."
            />
          </div>
          <div className="col-md-6">
            <div className="fs-5 mb-1 fs-5">
              Category:
              <span className="badge text-bg-warning">{data.category}</span>
            </div>
            <h1 className="display-5 fw-bolder">{data.name}</h1>
            <div className="fs-5 mb-2">
              <span>Rs.{data.price}.00</span>
            </div>
            <p className="lead">{data.description}</p>
            <div className="d-flex">
              <button
                className="btn btn-outline-dark flex-shrink-0"
                type="button"
                onClick={addToCart}
              >
                <i className="bi-cart-fill me-1"></i>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodDetails;
