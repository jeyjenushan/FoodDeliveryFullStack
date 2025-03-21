import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import { deleteFood, getFoodList } from "../../Services/FoodService";

function ListFood() {
  const [List, setList] = useState([]);
  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error("Food view not successfully.");
    }
  };
  const handleDelete = async (_id) => {
    try {
      const success = await deleteFood(_id);
      if (success) {
        toast.success("Food Removed");
        setList((prevFoods) => prevFoods.filter((food) => food.id !== _id)); // Update state directly
      } else {
        toast.error("Error occurred while removing the food.");
      }
    } catch (error) {
      toast.error("Error occurred while removing the food.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {List.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={`http://localhost:8080/api/foods/image/${item.imageUrl}`}
                    alt="Food Image"
                    height={48}
                    width={48}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs.{item.price}.00</td>
                <td className="text-danger">
                  <i
                    className="bi bi-x-circle-fill"
                    onClick={() => handleDelete(item.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListFood;
