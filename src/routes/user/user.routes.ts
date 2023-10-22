import { FastifyInstance } from "fastify";
import UserController from "./user.controllers";
import { $ref } from "./user.schemas";
import { RequireAuth } from "../middlewares/authentication";

export async function UserRoutes(app: FastifyInstance){
  const controller = new UserController();
  app.post('/create', {schema:{body:$ref('createUserBody')}}, controller.createNewUser);
  app.post('/authorization', {schema:{body:$ref('loginUserBody')}}, controller.authorization);
  app.get('/validate', {preHandler: RequireAuth.bind(app)}, controller.jwtValidate)
}