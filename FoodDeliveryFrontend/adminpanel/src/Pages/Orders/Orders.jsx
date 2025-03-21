import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";

function Orders() {
  const [data, setData] = useState([]);
  const fetchOrders = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/orders/all",
      {}
    );
    setData(response.data);
  };

  const updateStatus = async (event, orderId) => {
    const response = await axios.patch(
      `http://localhost:8080/api/orders/status/${orderId}?status=${event.target.value}`
    );

    if (response.status == 200) {
      await fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  });

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={assets.Delivery}
                        alt=""
                        height={48}
                        width={48}
                      />
                    </td>

                    <td>
                      <div>
                        {order.orderedItems.map((item, index) => {
                          if (index === order.orderedItems.length - 1) {
                            return item.name + "*" + item.quantity;
                          } else {
                            return item.name + "*" + item.quantity + ",";
                          }
                        })}
                        <div>{order.userAddress}</div>
                      </div>
                    </td>
                    <td>Rs.{order.amount}.00</td>
                    <td>Items : {order.orderedItems.length}</td>

                    <td>
                      <select
                        onChange={(event) => updateStatus(event, order.id)}
                        value={order.status}
                        className="form-control"
                      >
                        <option value="Food Preparing">Food Preparing</option>
                        <option value="Out for delivery">
                          Out for delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
