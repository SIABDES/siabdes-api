import {
  Pph21PtkpStatus,
  UnitEmployeeChildrenAmount,
  UnitEmployeeMarriageStatus,
  UnitEmployeeNpwpStatus,
} from '@prisma/client';

type AllowedChildrenAmount = 0 | 1 | 2 | 3;

function getChildrenAmountInNumber(
  childrenAmount: UnitEmployeeChildrenAmount,
): AllowedChildrenAmount {
  switch (childrenAmount) {
    case 'NONE':
      return 0;
    case 'ONE':
      return 1;
    case 'TWO':
      return 2;
    case 'THREE':
      return 3;
  }
}

export function mapPtkpStatus(
  marriageStatus: UnitEmployeeMarriageStatus,
  npwpStatus: UnitEmployeeNpwpStatus,
  childrenAmount: UnitEmployeeChildrenAmount,
): Pph21PtkpStatus {
  const children = getChildrenAmountInNumber(childrenAmount);

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
