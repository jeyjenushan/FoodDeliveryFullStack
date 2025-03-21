import React, { useEffect, useState } from "react";
import "./AddFood.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { addFood } from "../../Services/FoodService";
import { toast } from "react-toastify";

const AddFood = () => {
  const LKR_SYMBOL = "Rs.";
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Briyani",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    try {
      await addFood(data, image);
      toast.success("Food added sucessfully.");
      setData({ name: "", description: "", category: "Briyani", price: "" });
      setImage(null);
    } catch (error) {
      toast.error("Error Adding Food");
    }
  };

  return (
    <div className="mt-2 ms-4 mb-3 ">
      <div className="row ">
        <div className="card col-md-8">
          <div className="card-body">
            <h2 className="mb-4">Add Foods</h2>
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.Upload}
                    width={98}
                  />
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Chicken Briyani"
                  id="name"
                  name="name"
                  required
                  onChange={onChangeHandler}
                  value={data.name}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="5"
                  name="description"
                  required
                  placeholder="Write a Content Here...."
                  onChange={onChangeHandler}
                  value={data.description}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  onChange={onChangeHandler}
                  value={data.category}
                >
                  <option value="Briyani">Briyani</option>
                  <option value="Cake">Cake</option>
                  <option value="Burger">Burger</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Salad">Salad</option>
                  <option value="Ice cream">Ice cream</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  required
                  placeholder={LKR_SYMBOL}
                  onChange={onChangeHandler}
                  value={data.price}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
