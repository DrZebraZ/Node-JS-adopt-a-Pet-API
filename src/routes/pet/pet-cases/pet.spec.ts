import { expect, vi, describe, it, beforeEach} from 'vitest'
import { PetRepository } from '../pet.repository.model';
import { createPetBodyType, insertPetDatabase, insertPetDatabaseType } from '../pet.schemas';
import { ResultValidation } from '@/utils/result-validation';
import { ERROR_TYPES } from '@/errors/ErrorTypes';
import { JWTBody, createUserBodyType } from '@/routes/user/user.schemas';
import { PetCreateCase } from './pet.create.case';
import { UserRepository } from '@/routes/user/user.repository.model';
import { UserCreateCase } from '@/routes/user/user-cases/user.create.case';
import { UserAuthenticateCase } from '@/routes/user/user-cases/user.authenticate.case';
import { InMemoryUserRepository } from '@/routes/user/repository/inmemory.user.repository';
import { InMemoryPetRepository } from '../repository/inmemory.pet.repository';
import jsonwebtoken from 'jsonwebtoken';
import _env from '../../../env/index';
import { randomUUID } from 'crypto';



class FakeRepository implements PetRepository{

  async create(data: insertPetDatabaseType, resultValidation: ResultValidation): Promise<void> {
    try{
      throw new Error('STOP')
    }catch(err){
      resultValidation.addError(ERROR_TYPES.database.INSERT_ERROR.TAG, ERROR_TYPES.database.INSERT_ERROR.MESSAGE, true, err)
    } 
  }
} 

const userCreate:createUserBodyType = {
    name: 'John Doe',
    email: 'test@test.com',
    address: 'test test 123',
    cep: '12345678',
    password: '12345678',
    phoneNumber: '123124125'
  };

const petCreate:createPetBodyType = {
  name:"John Doe`s pet",
  age: 2,
  description:"the pet have some description right here",
  energy: 'Medium',
  independency: 'High',
  size: 'Medium',
  requirements: ['Grass', 'space', 'medications']
}


describe('Create new pet Case', () => {
  let sut: PetCreateCase
  let userRepository: UserRepository
  let userCreateCase: UserCreateCase
  let userAuthenticateCase: UserAuthenticateCase
  let petRepository: PetRepository
  let resultValidation: ResultValidation

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    userCreateCase = new UserCreateCase(userRepository)
    userAuthenticateCase = new UserAuthenticateCase(userRepository)
    petRepository = new InMemoryPetRepository()
    sut = new PetCreateCase(petRepository)
    resultValidation = new ResultValidation()
  })

  it('should create a new pet normally', async () => {
    await userCreateCase.execute(userCreate, resultValidation)
    resultValidation.clearResult()
    const login = {
      email:userCreate.email,
      password: userCreate.password
    }
    await userAuthenticateCase.execute(login, resultValidation)
    const token = resultValidation.getResult().data['AuthToken']
    const decoded = jsonwebtoken.verify(token, _env.JWTKEY);
    const user = JWTBody.parse(decoded)
    
    await sut.execute(petCreate, user, resultValidation)
    expect(resultValidation.getResult().data).toEqual("Done!")
    
  })
})
