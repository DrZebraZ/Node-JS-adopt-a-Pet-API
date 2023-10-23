import { ResultValidation } from "@/utils/result-validation";
import { PetRepository } from "../pet.repository.model";
import { insertPetDatabaseType } from "../pet.schemas";



export class InMemoryPetRepository implements PetRepository{

  public pets: insertPetDatabaseType[] = []

  async create(data: insertPetDatabaseType, resultValidation: ResultValidation): Promise<void> {
    this.pets.push(data)
    resultValidation.setResult({data:"Done!"})
  }

}