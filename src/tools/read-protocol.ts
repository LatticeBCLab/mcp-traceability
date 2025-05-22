import { chainClient } from "@/lib/chain-client";
import { chainId, credentials } from "@/lib/chain-client";
import { hexStringsToBufferWithTrimmedZeros } from "@/lib/utils";
import { ReceiptSchema } from "@/types";
import type { Result } from "@/types";
import { createTool } from "@mastra/core/tools";
import { Address, TraceabilityContract } from "@zlattice/lattice-js";
import { z } from "zod";

export const readProtocol = async (protocolUri: number) => {
  const traceability = new TraceabilityContract();
  const code = await traceability.readProtocol(protocolUri);
  return await chainClient
    .callContractWaitReceipt(
      credentials,
      chainId,
      traceability.getBuiltinContract().getAddress(),
      code,
    )
    .match(
      (receipt) => {
        if (receipt.success) {
          const iface = traceability.getIface().getInterface();
          const decodedResult = iface.decodeFunctionResult(
            "getAddress",
            receipt.contractRet ?? "",
          );
          const contractRet = [];
          for (const item of decodedResult) {
            const result = (item as Array<object>).at(0) as Result;
            const updater = new Address(result.updater as string).toZLTC();
            const data = result.data as Array<string>;
            const protobuf =
              hexStringsToBufferWithTrimmedZeros(data).toString("utf-8");
            contractRet.push({
              updater,
              protobuf,
            });
          }
          receipt.contractRet = JSON.stringify(contractRet);
        }
        return receipt;
      },
      (error) => {
        throw error instanceof Error ? error : new Error(String(error));
      },
    );
};

export const readProtocolTool = createTool({
  id: "read-protocol",
  description: "Read protocol from the blockchain.",
  inputSchema: z.object({
    protocolUri: z.number(),
  }),
  outputSchema: z.object({
    receipt: ReceiptSchema,
  }),
  execute: async ({ context }) => {
    const receipt = await readProtocol(context.protocolUri);
    return {
      receipt,
    };
  },
});