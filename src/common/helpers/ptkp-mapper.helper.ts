import {
  Pph21PtkpStatus,
  UnitEmployeeChildrenAmount,
  UnitEmployeeMarriageStatus,
  UnitEmployeeNpwpStatus,
} from '@prisma/client';

const childrenAmountMap = {
  NONE: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
} as const;

type PtkpMapDto = {
  marriageStatus: UnitEmployeeMarriageStatus;
  npwpStatus: UnitEmployeeNpwpStatus;
  childrenAmount: UnitEmployeeChildrenAmount;
};

export function mapPtkpStatus({
  marriageStatus,
  npwpStatus,
  childrenAmount,
}: PtkpMapDto): Pph21PtkpStatus {
  const children = childrenAmountMap[childrenAmount];

  if (marriageStatus === 'NOT_MARRIED') {
    return `TK${children}`;
  }

  if (
    marriageStatus === 'MARRIED' &&
    (!npwpStatus || npwpStatus === 'SEPARATED_WITH_HUSBAND')
  ) {
    return `K${children}`;
  }

  if (marriageStatus === 'MARRIED' && npwpStatus === 'MERGED_WITH_HUSBAND') {
    return `KI${children}`;
  }
}
