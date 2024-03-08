import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthUserRole } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { OptionalCommonDeleteDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';
import { HasRoles } from '~modules/v1/auth/decorators';
import { AddPph21V2Dto, EditPph21V2Dto, GetManyPph21V2Dto } from '../dto';
import { DeletePph21V2Response } from '../responses/pph21.response';
import { Pph21V2Schema } from '../schemas';
import { Pph21V2Service } from '../services/pph21.v2.service';

@Controller({
  path: 'pph21',
  version: '2',
})
export class Pph21V2Controller {
  private readonly logger = new Logger(Pph21V2Controller.name);

  constructor(private readonly pph21Service: Pph21V2Service) {}

  @Post()
  @HasRoles(AuthUserRole.UNIT)
  async add(@Body(new ZodValidationPipe(Pph21V2Schema)) dto: AddPph21V2Dto) {
    this.logger.log('Adding Pph21 data...');

    const result = await this.pph21Service.add(dto);

    this.logger.log(`Pph21 data added successfully with ID ${result.id}`);

    return new ResponseBuilder({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'Pph21 data added successfully',
    }).build();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    this.logger.log('Getting Pph21 data by id...');

    const result = await this.pph21Service.getById(id);

    this.logger.log('Pph21 data retrieved successfully');

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'Pph21 data retrieved successfully',
    }).build();
  }

  @Get()
  async getMany(@Query() dto?: GetManyPph21V2Dto) {
    this.logger.log('Getting Pph21 data...');

    const result = await this.pph21Service.getMany(dto);

    this.logger.log(
      `Pph21 data retrieved successfully with total data ${result._count} `,
    );

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'Pph21 data retrieved successfully',
    }).build();
  }

  @Put(':id')
  @HasRoles(AuthUserRole.UNIT)
  async updateById(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(Pph21V2Schema)) dto: EditPph21V2Dto,
  ) {
    this.logger.log('Updating Pph21 data...');

    const result = await this.pph21Service.updateById(id, dto);

    this.logger.log(`Pph21 with ID '${id}' data updated successfully`);

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'Pph21 data updated successfully',
    }).build();
  }

  @Delete(':id')
  @HasRoles(AuthUserRole.UNIT)
  async deleteById(
    @Param('id') id: string,
    @Query() dto?: OptionalCommonDeleteDto,
  ) {
    this.logger.log('Deleting Pph21 data...');

    let result: DeletePph21V2Response;

    if (dto?.hard_delete) {
      result = await this.pph21Service.hardDeleteById(id, dto);
    } else {
      result = await this.pph21Service.softDeleteById(id);
    }

    this.logger.log('Pph21 data deleted successfully');

    return new ResponseBuilder({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'Pph21 data deleted successfully',
    }).build();
  }
}
