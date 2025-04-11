export const DECIMALS = 18;
export const ProposalAction = {
  Distribute: 0,
  Burn: 1,
  Approve: 2,
  UpdateMetadata: 3,
} as const;

export enum ProposalStatus {
  OnVoting = 0,
  Passed = 1,
  Executed = 2,
  Rejected = 3,
}