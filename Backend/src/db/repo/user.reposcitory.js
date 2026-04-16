
import { User } from "../models/user.model.js";
import { AbstractRepository } from "./abstract.repository.js";
export class UserRepository extends AbstractRepository {
  constructor() {
    super(User); 
  }
}