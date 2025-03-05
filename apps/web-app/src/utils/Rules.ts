import { z } from "zod";

export const createTokenSchema = z.object({
  name: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length from 5 - 160 characters"),
  symbol: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length from 5 - 160 characters"),
  decimals: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length from 5 - 160 characters")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 18;
    }, "Value must be between 0 and 18"),
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length from 5 - 160 characters"),
});

export const readContractSchema = z.object({
  balanceOf: z.string().nonempty("This field is required"),
  ownerAddress: z.string().nonempty("This field is required"),
  spenderAddress: z.string().nonempty("This field is required"),
  amount: z
    .string()
    .nonempty("This field is required")
    .max(160, "Length from 5 - 160 characters"),
});
export type ReadContractType = z.infer<typeof readContractSchema>;
export type CreateTokenType = z.infer<typeof createTokenSchema>;
