import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const id = z.string().uuid()
const name = z.string({required_error:"Must provide a valid name"})
const email = z.string({required_error:"Must provide a valid email"}).email();
const password = z.string({required_error:"Must provide a password"}).min(8)
const cep = z.string().length(8)
const address = z.string({required_error:"Must provide the address"})
const phoneNumber = z.string({required_error:"Must provide the phone number"})
const exp = z.number()

export const createUserBody = z.object({
  name,
  email,
  address,
  cep,
  password,
  phoneNumber
})
export type createUserBodyType = z.infer<typeof createUserBody>

export const insertUserDatabaseBody = z.object({
  id,
  name,
  email,
  address,
  cep,
  password,
  phoneNumber
})
export type insertUserDatabaseBodyType = z.infer<typeof insertUserDatabaseBody>

export const loginUserBody = z.object({
  email,
  password
})
export type loginUserBodyType = z.infer<typeof loginUserBody>

export const JWTBody = z.object({
  id,
  name,
  email
})
export type JWTBodyType = z.infer<typeof JWTBody>

export const JWTCreationBody = z.object({
  id,
  name,
  email,
  exp
})
export type JWTCreationBodyType = z.infer<typeof JWTCreationBody>

const models = {
  createUserBody,
  loginUserBody
}

const options = {
  $id: "userSchemas"
}

export const { schemas : userSchemas, $ref} = buildJsonSchemas(models, options)