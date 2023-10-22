import { FastifyReply } from "fastify";
import { ResultValidation } from "../../utils/result-validation";

export function applyResult(result: ResultValidation, res: FastifyReply, successStatusCode:number) {
	if (result.hasError()) {
    console.log("Tem ERRO")
		if (result.hasCriticalError()) {
      console.log("É CRITICO!")
      for(let error in result.getErrorList()){
        console.log("============ ERROR ============")
        console.log(error)
      }
      
      //TODO ERROR LOGGER
			res.code(500);
      res.send("INTERNAL SERVER ERROR")
		} else {
      console.log("NÃO É CRITICO!")
      // TODO ERROR LOGGER
			res.code(400);
		}
		res.send(JSON.stringify(result.getErrorList()));
	}else{
    const cookies = result.getResult().cookie
    if (cookies){
      cookies.forEach(function (cookie){
        res.cookie(cookie.name, cookie.value, cookie.opts || undefined)
      })
      result.dropCookies()
    } 
    // TODO SUCCESS LOGGERS
    if (result.isResultEmpty()) {
      res.code(204);
      res.send();
    } else {
      res.code(successStatusCode);
      res.send(JSON.stringify(result.getResult()));
    } 
  }
}