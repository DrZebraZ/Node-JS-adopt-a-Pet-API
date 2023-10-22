import { JWTBodyType } from "../routes/user/user.schemas";

declare module "fastify"{
  interface FastifyRequest{
    user: JWTBodyType
  }
}