import 'dotenv/config';
import { z } from 'zod';


const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']),
  PORT: z.coerce.number().default(3001),
  JWTKEY: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false){
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export default _env.data