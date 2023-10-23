import { randomUUID } from "crypto";
import { PetRepository } from "../pet.repository.model";
import { createPetBodyType, insertPetDatabase, insertPetDatabaseType } from "../pet.schemas";
import { JWTBodyType } from "@/routes/user/user.schemas";
import { ResultValidation } from "@/utils/result-validation";
import { ERROR_TYPES } from "@/errors/ErrorTypes";



export class PetCreateCase{
  constructor(private petRepository:PetRepository){}

  async execute(body: createPetBodyType, user:JWTBodyType, resultValidation:ResultValidation):Promise<void>{
    const pet = insertPetDatabase.parse({
      ...body,
      id:randomUUID(),
      userId:user.id
    })
    await this.petRepository.create(pet, resultValidation)
  }
}
