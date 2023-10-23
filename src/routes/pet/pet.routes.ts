import { FastifyInstance } from "fastify";
import { RequireAuth } from "../middlewares/authentication";
import { PetController } from "./pet.controllers";


export function petRoutes(app:FastifyInstance){
  const petController = new PetController()
  app.post('/create',{preHandler:RequireAuth.bind(app)}, petController.registerPet)
}