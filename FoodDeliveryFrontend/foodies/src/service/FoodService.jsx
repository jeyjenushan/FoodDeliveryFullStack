import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";

export const fetchFoodList = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log("Error fetching food list", error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  try {
    const response = await axios.get(API_URL + "/" + id);
    return response.data;
  } catch (error) {
    console.log("Error while getting a signle food");
    throw error;
  }
};

export const deleteFood = async (id) => {
  try {
    const response = await axios.delete(API_URL + "/" + id);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.log("Error while getting a signle food");
    throw error;
  }
};
