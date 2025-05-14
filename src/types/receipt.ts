import { z } from "zod";

export const EventSchema = z.object({
	address: z.string(),
	topics: z.array(z.string()),
	data: z.instanceof(Buffer),
	logIndex: z.number(),
	tblockHash: z.string(),
	dblockHash: z.string(),
	dblockNumber: z.number(),
	removed: z.boolean(),
	dataHex: z.string(),
});

export const ReceiptSchema = z.object({
	confirmTime: z.string().optional(),
	success: z.boolean(),
	receiptIndex: z.number(),
	tBlockHash: z.string(),
	contractAddress: z.string().optional(),
	contractRet: z.string().optional(),
	jouleUsed: z.number(),
	events: z.array(EventSchema),
	dblockHash: z.string(),
	dblockNumber: z.number(),
});

export type Event = z.infer<typeof EventSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
