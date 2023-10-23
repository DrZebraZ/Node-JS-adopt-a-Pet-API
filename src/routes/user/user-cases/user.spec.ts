import { expect, vi, describe, it, beforeEach} from 'vitest'
import { InMemoryUserRepository } from '../repository/inmemory.user.repository'
import { ResultValidation } from '@/utils/result-validation'
import { createUserBodyType, insertUserDatabaseBodyType } from '../user.schemas'
import { UserRepository } from '../user.repository.model'
import { compare, hash } from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { ERROR_TYPES } from '@/errors/ErrorTypes'
import { UserCreateCase } from './user.create.case'
import { UserAuthenticateCase } from './user.authenticate.case'



class FakeRepository implements UserRepository{
  async findByEmail(email: string, resultValidation: ResultValidation): Promise<void> {
    try{
      throw new Error('STOP')
    }catch(err){
      resultValidation.addError(ERROR_TYPES.database.SELECT_ERROR.TAG, ERROR_TYPES.database.SELECT_ERROR.MESSAGE, true, err)
    } 
  }
  async create(data: Prisma.UserCreateInput, resultValidation: ResultValidation): Promise<void> {
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


describe('Create new user Case', () => {
  let sut: UserCreateCase
  let userRepository: UserRepository
  let resultValidation: ResultValidation
  

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UserCreateCase(userRepository)
    resultValidation = new ResultValidation()
  })

  it('should hash user password upon register', async () => {
    await sut.execute(userCreate, resultValidation)
    await userRepository.findByEmail('test@test.com', resultValidation)
    const isPasswordHashedCorrectly = await compare(
      '12345678',
      resultValidation.getResult().data.password
    )
    expect(isPasswordHashedCorrectly).toEqual(true)
  })


  it('should throw error after findByEmail', async ()=>{
    userRepository = new FakeRepository()
    sut = new UserCreateCase(userRepository)
    await sut.execute(userCreate, resultValidation)
    expect(resultValidation.findErrorByTags([ERROR_TYPES.database.SELECT_ERROR.TAG])).toEqual(true)
  })

  it('should throw error cause email already used', async () => {
    await sut.execute(userCreate, resultValidation)
    await sut.execute(userCreate, resultValidation)
    expect(resultValidation.findErrorByTags([ERROR_TYPES.user.EMAIL_ALREADY_EXISTS.TAG])).toEqual(true)
  })
  
})

describe('Authenticate user Case', () => {
  let sut: UserAuthenticateCase
  let userRepository: UserRepository
  let resultValidation: ResultValidation
  let userCreateCase: UserCreateCase
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UserAuthenticateCase(userRepository)
    userCreateCase = new UserCreateCase(userRepository)
    resultValidation = new ResultValidation()  
  })

  it('should login normally', async ()=>{
    await userCreateCase.execute(userCreate, resultValidation)
    await sut.execute({
      email: 'test@test.com',
      password: '12345678'
    },resultValidation)
    expect(resultValidation.hasError()).toEqual(false)
    expect(resultValidation.isResultEmpty()).toEqual(false)
  })

  it('should not login cause wrong password', async()=>{
    await userCreateCase.execute(userCreate, resultValidation)
    await sut.execute({
      email: 'test@test.com',
      password: '1234567'
    },resultValidation)
    expect(resultValidation.findErrorByTags([ERROR_TYPES.user.GENERIC_LOGIN_ERROR.TAG])).toEqual(true)
  })

  it('should not login cause wrong email', async()=>{
    await userCreateCase.execute(userCreate, resultValidation)
    resultValidation.clearResult()
    await sut.execute({
      email: 'error@test.com',
      password: '12345678'
    },resultValidation)
    expect(resultValidation.findErrorByTags([ERROR_TYPES.user.GENERIC_LOGIN_ERROR.TAG])).toEqual(true)
  })

  it('should return select error in database', async()=>{
    sut = new UserAuthenticateCase(new FakeRepository())
    await userCreateCase.execute(userCreate, resultValidation)
    resultValidation.clearResult()
    await sut.execute({
      email: 'test@test.com',
      password: '12345678'
    }, resultValidation)
    expect(resultValidation.findErrorByTags([ERROR_TYPES.database.SELECT_ERROR.TAG])).toEqual(true)
  })

})
