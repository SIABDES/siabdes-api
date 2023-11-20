import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Public } from '~modules/auth/decorators';

const schema = z.object({
  persons: z.array(
    z.object({
      name: z.string(),
      age: z.string().transform((val) => parseInt(val, 10)),
    }),
  ),
});

class SchemaDto extends createZodDto(schema) {}

@Public()
@Controller('app')
export class AppController {
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  test(@Body() data: SchemaDto) {
    return {
      data,
    };
  }
}
