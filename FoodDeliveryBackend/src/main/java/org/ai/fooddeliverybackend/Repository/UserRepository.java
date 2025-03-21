package org.ai.fooddeliverybackend.Repository;

import org.ai.fooddeliverybackend.Model.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {

Optional<UserEntity> findByEmail(String email);

}
