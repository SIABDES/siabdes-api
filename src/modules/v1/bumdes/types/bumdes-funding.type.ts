export type BumdesFundingHistoryItem = {
  id: string;
  year: number;
  rules_number: string;
  village_government_funding: {
    amount: number;
    percentage: number;
  };
  other_parties_funding: {
    amount: number;
    percentage: number;
  };
};
