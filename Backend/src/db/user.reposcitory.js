import { User } from "src/db/models/user.model.js";
import { AbstractRepository } from "src/db/abstract.repository.js";
export class UserRepository extends AbstractRepository {
  constructor() {
    super(User); 
  }
}