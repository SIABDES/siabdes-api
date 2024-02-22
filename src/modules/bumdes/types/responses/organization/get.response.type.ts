import { BumdesUnitOrganization } from '../../bumdes-organization.type';

export type GetBumdesOrganizationResponse = {
  consultant: string;
  core: {
    leader: string;
    secretary: string;
    treasurer: string;
    units: BumdesUnitOrganization[];
  };
  supervisor?: {
    leader?: string;
    secretary?: string;
    treasurer?: string;
  };
};
