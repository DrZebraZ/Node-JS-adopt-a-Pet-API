import { ResultValidation } from "@/utils/result-validation";
import { insertPetDatabaseType } from "./pet.schemas";



export interface PetRepository{
  create(data: insertPetDatabaseType, resultValidation:ResultValidation):Promise<void>

}