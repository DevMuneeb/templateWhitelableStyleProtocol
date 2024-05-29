import { z } from "zod";

export const connectFormSchema = z.object({
  email: z.string().email(),
});

export type EmailConnectSchema = z.infer<typeof connectFormSchema>;

export const nftFormSchema = z.object({
  // nft: z.string().optional(),
  // payment: z.number(),
  customAsset: z.string().optional(),
  // paymentHash: z.string().optional(),
  world: z.string(),
});

export type NFTConnectSchema = z.infer<typeof nftFormSchema>;
