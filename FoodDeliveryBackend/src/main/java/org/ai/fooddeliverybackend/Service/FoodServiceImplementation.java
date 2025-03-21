package org.ai.fooddeliverybackend.Service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.ai.fooddeliverybackend.Model.FoodEntity;
import org.ai.fooddeliverybackend.Repository.FoodRepository;
import org.ai.fooddeliverybackend.Request.FoodRequest;
import org.ai.fooddeliverybackend.Response.FoodResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodServiceImplementation implements FoodService{

    @Autowired
    private  FoodRepository foodRepository;

    @Autowired
    private GridFSBucket gridFSBucket;

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        String imageUrl=saveImage(file);
        FoodEntity newFoodEntity=convertRequestToFoodEntity(request);
        newFoodEntity.setImageUrl(imageUrl);
        FoodEntity savedFoodEntity=foodRepository.save(newFoodEntity);
        FoodResponse foodResponse=convertFoodEntityToResponse(savedFoodEntity);
        return foodResponse;


    }


    private String saveImage(MultipartFile file) {

        if(file==null|| file.isEmpty()){
            return null;
        }
        try{
            InputStream inputStream = file.getInputStream();
            GridFSUploadOptions options = new GridFSUploadOptions();

            // Store the file in GridFS and get its ObjectId
            ObjectId fileId = gridFSBucket.uploadFromStream(file.getOriginalFilename(), inputStream, options);

            return fileId.toHexString();
        }catch(IOException e){
            throw new RuntimeException("Image upload failed!", e);
        }
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity> foods=foodRepository.findAll();
        return convertFoodEntityListToResponseList(foods);
    }

    @Override
    public FoodResponse getFoodById(String id) {
   return convertFoodEntityToResponse(foodRepository.findById(id).orElseThrow(()->new RuntimeException("Food not found for the id : "+id)));
    }

    @Override
    public void deleteFoodById(String id) {
        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        // Delete associated image from GridFS
        if (food.getImageUrl() != null) {
            gridFSBucket.delete(new ObjectId(food.getImageUrl()));
        }

        // Delete food entry from MongoDB
        foodRepository.deleteById(id);


    }




    private FoodEntity convertRequestToFoodEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private List<FoodEntity> convertRequestListToFoodEntityList(List<FoodRequest> requestList) {
        return requestList.stream().map(this::convertRequestToFoodEntity).collect(Collectors.toList());
    }

    private FoodResponse convertFoodEntityToResponse(FoodEntity foodEntity){
              return FoodResponse.builder()
                       .id(foodEntity.getId())
                       .name(foodEntity.getName())
                       .description(foodEntity.getDescription())
                       .category(foodEntity.getCategory())
                       .price(foodEntity.getPrice())
                       .imageUrl(foodEntity.getImageUrl())
                       .build();
    }

    private List<FoodResponse> convertFoodEntityListToResponseList(List<FoodEntity> foods){

        return foods.stream().map(this::convertFoodEntityToResponse).collect(Collectors.toList());
    }




}
