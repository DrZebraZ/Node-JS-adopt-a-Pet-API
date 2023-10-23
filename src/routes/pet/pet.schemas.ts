import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'


const id = z.string()
const name = z.string({required_error: "Must provide a pet name."})
const description = z.string({required_error: "Must give the pet description."})
const age = z.coerce.number({required_error: "Must give the pet age."})
const energy = z.enum(['Low', 'Medium', 'High'])
const size = z.enum(['Low', 'Medium', 'High'])
const independency = z.enum(['Low', 'Medium', 'High'])
const requirements = z.string().array()
const userId = z.string({required_error:"Need a user id to create a pet"})

export const createPetBody = z.object({
  name,
  description,
  age,
  energy,
  size,
  independency,
  requirements
})
export type createPetBodyType = z.infer<typeof createPetBody>

export const insertPetDatabase = z.object({
  id,
  name,
  description,
  age,
  energy,
  size,
  independency,
  requirements,
  userId
})
export type insertPetDatabaseType = z.infer<typeof insertPetDatabase>

const models = {
  createPetBody
}

const options = {
  $id: "petSchemas"
}

export const { schemas: petSchemas, $ref} = buildJsonSchemas(models, options)

