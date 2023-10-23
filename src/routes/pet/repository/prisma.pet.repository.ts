import { Prisma } from '@prisma/client';
import { ResultValidation } from '@/utils/result-validation';
import { prisma } from '@/db/prisma';
import { ERROR_TYPES } from '@/errors/ErrorTypes';
import { PetRepository } from '../pet.repository.model';
import { insertPetDatabaseType } from '../pet.schemas';

export class PrismaPetRepository implements PetRepository{

  async create(data: insertPetDatabaseType, resultValidation: ResultValidation): Promise<void> {
    try{
      await prisma.pet.create({
        data: data
      }).then(result => 
        result != null ? resultValidation.setResult({data:"Done!"}): resultValidation.addError(ERROR_TYPES.pet.CREATE_PET_ERROR.TAG, ERROR_TYPES.pet.CREATE_PET_ERROR.MESSAGE)
      )
    }catch(err){
      resultValidation.addError(ERROR_TYPES.database.INSERT_ERROR.TAG, ERROR_TYPES.database.INSERT_ERROR.MESSAGE, true, err)
    }
  }
}