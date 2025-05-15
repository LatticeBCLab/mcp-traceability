import {
	chainClient,
	chainId,
	credentials,
	traceabilityContract,
} from "@/lib/chain-client";
import { createTool } from "@mastra/core/tools";
import { encodeBytes32Array } from "@zlattice/lattice-js";
import * as E from "fp-ts/Either";
import { z } from "zod";

export const writeTraceability = async (
	dataId: string,
	data: string,
	protocolUri: number,
	businessContractAddress: string,
) => {
	const code = await traceabilityContract.writeTraceability({
		protocolUri,
		dataId,
		data: encodeBytes32Array(Buffer.from(data, "utf-8")),
		businessContractAddress,
	});
	const result = await chainClient.callContractWaitReceipt(
		credentials,
		chainId,
		traceabilityContract.getBuiltinContract().getAddress(),
		code,
	);

	if (E.isRight(result)) {
		throw new Error("Failed to write traceability");
	}

	const receipt = result.left;

	return {
		receipt,
	};
};

export const writeTraceabilityTool = createTool({
	id: "write-traceability",
	description: "Write traceability data to the blockchain.",
	inputSchema: z.object({
		dataId: z.string().describe("The data id of the traceability data."),
		data: z.string().describe("The data of the traceability data."),
		protocolUri: z
			.number()
			.describe("The protocol uri of the traceability data."),
		businessContractAddress: z
			.string()
			.describe("The business contract address of the traceability data."),
	}),
	execute: async ({ context }) => {
		return await writeTraceability(
			context.dataId,
			context.data,
			context.protocolUri,
			context.businessContractAddress,
		);
	},
});

export const generateDataId = () => {
	const chars =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let id = "";
	for (let i = 0; i < 66; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return `0x${id}`;
};

export const generateDataIdTool = createTool({
	id: "generate-data-id",
	description: "Generate a data id.",
	execute: async () => {
		return generateDataId();
	},
});