export type GetBumdesProfileResponse = {
  name: string;
  founded_at: Date;
  phone: string;
  complete_address: string;
  email: string;

  village_rule_number: string;
  sk_administrator_number: string;
  sk_administrator_date: Date;
  sk_assistant_number: string;
  sk_assistant_date: Date;

  bank?: {
    name: string;
    account_number: string;
  };

  npwp_number?: string;

  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
    other_socials?: string;
  };

  capital_participation: {
    initial: number;
    additional: number;
  };
};
