import { ResultValidation } from "@/utils/result-validation";
import { UserRepository } from "../user.repository.model";
import jsonwebtoken from "jsonwebtoken";
import { JWTBodyType, loginUserBodyType, JWTCreationBody, JWTBody } from '../user.schemas';
import { ERROR_TYPES } from "@/errors/ErrorTypes";
import { compare } from "bcryptjs";
import _env from '../../../env/index';




export class UserAuthenticateCase {
  constructor(private repository: UserRepository){}

  async execute({email, password}:loginUserBodyType, resultValidation:ResultValidation):Promise<void>{ 
    await this.repository.findByEmail(email, resultValidation)
    if(resultValidation.hasError()){
      return
    }
    console.log(resultValidation.getResult())
    if(resultValidation.isResultEmpty()){
      console.log("Result Empty")
      this._GENERIC_LOGIN_ERROR(resultValidation)
      return
    }
    
    const doesPasswordMatches = await compare(password, resultValidation.getResult().data.password)
    console.log(doesPasswordMatches)
    if(!doesPasswordMatches){
      this._GENERIC_LOGIN_ERROR(resultValidation)
      return
    }

    await this._GENERATE_JWT(resultValidation.getResult().data, resultValidation)
    
    return
  }

  private async _GENERATE_JWT(data: JWTBodyType, resultValidation:ResultValidation){
    const tokenFormatter = JWTBody.parse({
      ...data
    })
    const token = jsonwebtoken.sign(
      tokenFormatter,
      _env.JWTKEY,
      {expiresIn: 1*60*60*24} //1d
    )
    resultValidation.setResult({data:{AuthToken:token}})
  }

  private _GENERIC_LOGIN_ERROR(resultValidation: ResultValidation){
    resultValidation.addError(ERROR_TYPES.GENERIC_LOGIN_ERROR.TAG, ERROR_TYPES.GENERIC_LOGIN_ERROR.MESSAGE)
    return
  }
}
