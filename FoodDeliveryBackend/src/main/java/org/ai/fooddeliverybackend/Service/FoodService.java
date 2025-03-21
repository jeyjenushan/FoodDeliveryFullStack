package org.ai.fooddeliverybackend.Service;

import org.ai.fooddeliverybackend.Request.FoodRequest;
import org.ai.fooddeliverybackend.Response.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    FoodResponse addFood(FoodRequest request, MultipartFile file);
    List<FoodResponse> readFoods();
    FoodResponse getFoodById(String id);
    void deleteFoodById(String id);
}
