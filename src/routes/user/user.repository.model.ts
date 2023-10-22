import { Prisma, User } from "@prisma/client";
import { ResultValidation } from '@/utils/result-validation'

export interface UserRepository{
  findByEmail(email: string, resultValidation: ResultValidation): Promise<void>
  create(data: Prisma.UserCreateInput, resultValidation: ResultValidation): Promise<void>
}