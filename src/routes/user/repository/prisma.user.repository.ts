import { Prisma } from '@prisma/client';
import { UserRepository } from '../user.repository.model';
import { ResultValidation } from '@/utils/result-validation';
import { prisma } from '@/db/prisma';
import { ERROR_TYPES } from '@/errors/ErrorTypes';

export class PrismaUserRepository implements UserRepository{

  async findByEmail(email: string, resultValidation: ResultValidation): Promise<void> {
    try{
      await prisma.user.findUnique(
        {where:{
          email
        }}
      ).then(result => {
        result != null ? resultValidation.setResult({data: result}): "" ;
      })
    }catch(err){
      resultValidation.addError(ERROR_TYPES.SELECT_ERROR.TAG, ERROR_TYPES.SELECT_ERROR.MESSAGE, true, err)
    }
  }

  async create(data: Prisma.UserCreateInput, resultValidation: ResultValidation): Promise<void> {
    try{
      await prisma.user.create({
        data: data
      }).then(result => 
        result != null ? resultValidation.setResult({data:"done!"}): resultValidation.addError(ERROR_TYPES.CREATE_USER_ERROR.TAG, ERROR_TYPES.CREATE_USER_ERROR.MESSAGE)
      )
    }catch(err){
      resultValidation.addError(ERROR_TYPES.INSERT_ERROR.TAG, ERROR_TYPES.INSERT_ERROR.MESSAGE, true, err)
    }
  }
}