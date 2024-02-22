import { Pph21TerType } from '@prisma/client';

export type GetEmployeeTerResponse = {
  percentage: number;
  type: Pph21TerType;
};
