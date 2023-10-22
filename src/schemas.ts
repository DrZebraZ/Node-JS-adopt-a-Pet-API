import { FastifyInstance } from "fastify";
import { userSchemas } from "./routes/user/user.schemas";

export default async function setSchemas(app: FastifyInstance){
  try{
    for (let schema of [
      ...userSchemas
    ]){
      app.addSchema(schema)
    }
  }catch(err){
    console.log(err)
  }
}