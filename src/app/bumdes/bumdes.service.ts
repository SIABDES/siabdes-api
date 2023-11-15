import { Injectable } from '@nestjs/common';
import { CreateBumdesDto } from './dto';
import { Bumdes } from '@prisma/client';
import { IBumdesService } from './interfaces';
import { PrismaService } from '~lib/prisma/prisma.service';

@Injectable()
export class BumdesService implements IBumdesService {
  constructor(private prisma: PrismaService) {}

  async createBumdes(dto: CreateBumdesDto): Promise<string> {
    const { address, name, phone } = dto;
    const {
      completeAddress,
      district,
      province,
      regency,
      subDistrict,
      village,
    } = address;

    const bumdes = await this.prisma.bumdes.create({
      data: {
        name,
        phone,
        address: {
          create: {
            province,
            regency,
            district,
            subDistrict,
            village,
            completeAddress,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return bumdes.id;
  }

  async findBumdesById(id: string): Promise<Bumdes> {
    return this.prisma.bumdes.findUnique({
      where: {
        id,
      },
    });
  }
}
