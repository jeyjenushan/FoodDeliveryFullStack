import axios from "axios";


const API_URL="http://localhost:8080/api/foods"
export const addFood=async (foodData,image)=>{
    const formData1 = new FormData();
    formData1.append("food", JSON.stringify(foodData));
    formData1.append("image", image);
    try {
      const response = await axios.post(
       API_URL,
       formData1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      console.log("Food Adding error" + error);
     throw error;
    }
}


export const getFoodList=async ()=>{
  try{
    const response = await axios.get(API_URL);
    
    console.log("The list of the foods" + response.data);
      return response.data;
  }catch(error){
    console.log("Viewing Food  error" + error);
    throw error;
  }
}

export const deleteFood=async (foodId)=>{
  try{
    const response = await axios.delete(API_URL+"/"+foodId);
    return response.status === 204 || response.status === 200; 
  }catch(error){
    console.log("error while deleting the food" + error);
    throw error;
  }
}