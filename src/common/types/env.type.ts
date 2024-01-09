import { z } from 'nestjs-zod/z';

export const EnvSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((val) => parseInt(val))
    .pipe(z.number().positive())
    .default('3000'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),

  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }),
  JWT_EXPIRES_IN: z.string({ required_error: 'JWT_EXPIRES_IN is required' }),
  JWT_REFRESH_SECRET: z.string({
    required_error: 'JWT_REFRESH_SECRET is required',
  }),
  JWT_REFRESH_EXPIRES_IN: z.string({
    required_error: 'JWT_REFRESH_EXPIRES_IN is required',
  }),

  MINIO_ENDPOINT: z.string({ required_error: 'MINIO_ENDPOINT is required' }),
  MINIO_PORT: z.string().optional(),
  MINIO_ACCESS_KEY: z.string({
    required_error: 'MINIO_ACCESS_KEY is required',
  }),
  MINIO_SECRET_KEY: z.string({
    required_error: 'MINIO_SECRET_KEY is required',
  }),
  MINIO_BUCKET_NAME: z.string({
    required_error: 'MINIO_BUCKET_NAME is required',
  }),
  MINIO_USE_SSL: z
    .string({ required_error: 'MINIO_USE_SSL is required' })
    .transform((val) => val?.toLowerCase() === 'true')
    .default('false'),
});

export type Env = z.infer<typeof EnvSchema>;
