import { randomBytes } from "node:crypto";
import {
	chainClient,
	chainId,
	credentials,
	traceabilityContract,
} from "@/lib/chain-client";
import { ReceiptSchema } from "@/types";
import { createTool } from "@mastra/core/tools";
import { encodeBytes32Array } from "@zlattice/lattice-js";
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

  return await chainClient
    .callContractWaitReceipt(
      credentials,
      chainId,
      traceabilityContract.getBuiltinContract().getAddress(),
      code,
    )
    .match(
      (receipt) => receipt,
      (error) => {
        throw error instanceof Error ? error : new Error(String(error));
      },
    );
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
  outputSchema: ReceiptSchema,
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
  const bs = randomBytes(64);
  return `0x${bs.toString("hex")}`;
};

export const generateDataIdTool = createTool({
  id: "generate-data-id",
  description: "Generate a data id for the traceability data.",
  outputSchema: z
    .string()
    .regex(/^0x[0-9a-fA-F]{64}$/)
    .describe("The data id of the traceability data."),
  execute: async () => {
    return generateDataId();
  },
});