package org.ai.fooddeliverybackend.Repository;

import org.ai.fooddeliverybackend.Model.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends MongoRepository<FoodEntity,String> {
}
