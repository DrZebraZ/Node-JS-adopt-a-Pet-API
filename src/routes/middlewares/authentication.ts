import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { JWTBody } from "../user/user.schemas";
import jsonwebtoken from 'jsonwebtoken';
import _env from '../../env/index';


export const RequireAuth = function (request:FastifyRequest, reply:FastifyReply, done:HookHandlerDoneFunction): void{
  try{
    const [,token] = request.headers.authorization?.split(' ') || [' ',' '];
    if(!token){
      reply.code(401).send('Token not Found')
      return
    }
    var decoded = jsonwebtoken.verify(token, _env.JWTKEY);
    console.log(decoded)
    if(!decoded){
      reply.code(401).send('UNAUTHORIZED')
      return
    }
    const user = JWTBody.parse(decoded)
    request.user = user
    done()
  }catch(e){
    console.log(e)
    reply.code(401).send('UNAUTHORIZED')
  }
}


