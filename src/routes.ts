import { FastifyInstance } from "fastify";
import { UserRoutes } from "./routes/user/user.routes";


export default async function setRoutes(app: FastifyInstance){
  app.register(UserRoutes, {prefix: "/user"})
}