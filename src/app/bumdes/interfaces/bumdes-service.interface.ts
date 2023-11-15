import { Bumdes } from '@prisma/client';
import { CreateBumdesDto } from '../dto';

export interface IBumdesService {
  createBumdes(dto: CreateBumdesDto): Promise<string>;

  findBumdesById(id: string): Promise<Bumdes>;
}
