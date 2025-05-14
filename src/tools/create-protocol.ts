import { chainClient, chainId, credentials } from "@/lib/chain-client";
import { ReceiptSchema } from "@/types";
import { createTool } from "@mastra/core/tools";
import { E, TraceabilityContract, log } from "@zlattice/lattice-js";
import { z } from "zod";

export const createProtocol = async (protoContent: string) => {
	const protocolSuite = 1;
	const traceability = new TraceabilityContract();
	const code = await traceability.createProtocol(
		protocolSuite,
		Buffer.from(protoContent, "utf-8"),
	);
	const result = await chainClient.callContractWaitReceipt(
		credentials,
		chainId,
		"zltc_QLbz7JHiBTspUvTPzLHy5biDS9mu53mmv",
		code,
	);

	if (E.isRight(result)) {
		throw new Error("Failed to create protocol");
	}

	const receipt = result.left;
	if (receipt.success) {
		const iface = traceability.getIface().getInterface();
		const result = iface.decodeFunctionResult(
			"addProtocol",
			receipt.contractRet ?? "",
		);
		log.info("Decoded call contract result, get protocol id: %s", result);
		receipt.contractRet = result.toString();
	}

	return {
		receipt,
	};
};

export const createProtocolTool = createTool({
	id: "create-protocol",
	description: "Create a protocol",
	inputSchema: z.object({
		protoContent: z.string(),
	}),
	outputSchema: z.object({
		receipt: ReceiptSchema,
	}),
	execute: async ({ context }) => {
		return await createProtocol(context.protoContent);
	},
});
