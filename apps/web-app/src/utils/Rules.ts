import { z } from "zod";

export const createTokenSchema = z.object({
  name: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  symbol: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  decimals: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 18;
    }, "Value must be between 0 and 18"),
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
});

export const contractSchema = z.object({
  balanceOf: z.string().nonempty("This field is required"),
  ownerAddress: z.string().nonempty("This field is required"),
  spenderAddress: z.string().nonempty("This field is required"),
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
});

export const createDAOContractSchema = z.object({
  nameDAO: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  descriptionDao: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  listAddress: z.string().optional().array().min(1, "This DAO has no members.").max(160, "Maximum of 160 addresses allowed"),
  requireVote: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  avatar: z.string().max(1000, "Length max 1000 characters"),
  nameToken: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  symbol: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  decimals: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 18;
    }, "Value must be between 0 and 18"),
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
});

export const createProposalSchema = z.object({
  addressReceive: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
  action: z.string(),
  description: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length max 160 characters"),
});

export type ReadContractType = z.infer<typeof contractSchema>;
export type CreateTokenType = z.infer<typeof createTokenSchema>;
export type CreateProposalType = z.infer<typeof createProposalSchema>;
export type CreateDAOContractSchemaType = z.infer<
  typeof createDAOContractSchema
>;
