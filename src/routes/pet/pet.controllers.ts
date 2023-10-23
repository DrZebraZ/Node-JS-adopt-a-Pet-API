import { ResultValidation } from "@/utils/result-validation";
import { FastifyReply, FastifyRequest } from "fastify";
import { applyResult } from "../middlewares/applyResult";
import { PetCreateCase } from "./pet-cases/pet.create.case";
import { PrismaPetRepository } from "./repository/prisma.pet.repository";
import { createPetBodyType } from "./pet.schemas";




export class PetController{
  constructor(){}

  async registerPet(req:FastifyRequest<{Body:createPetBodyType}>, res: FastifyReply){
    const petRepository = new PrismaPetRepository()
    const petCase = new PetCreateCase(petRepository)
    const resultValidation = new ResultValidation()
    await petCase.execute(req.body, req.user, resultValidation)
    applyResult(resultValidation, res, 201)
  }
}