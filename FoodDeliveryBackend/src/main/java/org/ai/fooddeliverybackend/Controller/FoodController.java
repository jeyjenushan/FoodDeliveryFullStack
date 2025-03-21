package org.ai.fooddeliverybackend.Controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import lombok.AllArgsConstructor;
import org.ai.fooddeliverybackend.Request.FoodRequest;
import org.ai.fooddeliverybackend.Response.FoodResponse;
import org.ai.fooddeliverybackend.Service.FoodService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
public class FoodController {
    @Autowired
    private GridFSBucket gridFSBucket;
    @Autowired
    private FoodService foodService;

    @PostMapping()
    public FoodResponse addFood(@RequestPart("food") String foodString,
                                @RequestPart("image") MultipartFile image){
        ObjectMapper objectMapper=new ObjectMapper();
        FoodRequest foodRequest=null;
        try{
            foodRequest=objectMapper.readValue(foodString,FoodRequest.class);
        }catch (JsonProcessingException e){
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid Json Format");
        }
        return foodService.addFood(foodRequest,image);
    }

    @GetMapping()
    public List<FoodResponse> getAllFoods(){
        return foodService.readFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id){
        return foodService.getFoodById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id){
        foodService.deleteFoodById(id);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String id) {
        GridFSDownloadStream stream = gridFSBucket.openDownloadStream(new ObjectId(id));
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new InputStreamResource(stream));
    }





}
