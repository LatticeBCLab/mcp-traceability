import { chainClient, chainId, credentials } from "@/lib/chain-client";
import { ReceiptSchema } from "@/types";
import { createTool } from "@mastra/core/tools";
import { TraceabilityContract, log } from "@zlattice/lattice-js";
import { z } from "zod";

export const createProtocol = async (protoContent: string) => {
  const protocolSuite = 1;
  const traceability = new TraceabilityContract();
  const code = await traceability.createProtocol(
    protocolSuite,
    Buffer.from(protoContent, "utf-8"),
  );
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
          const result = iface.decodeFunctionResult(
            "addProtocol",
            receipt.contractRet ?? "",
          );
          log.info("Decoded call contract result, get protocol id: %s", result);
          receipt.contractRet = result.toString();
        }
        return receipt;
      },
      (error) => {
        throw error instanceof Error ? error : new Error(String(error));
      },
    );
};

export const createProtocolTool = createTool({
  id: "create-protocol",
  description: "Create a protocol",
  inputSchema: z.object({
    protoContent: z.string(),
  }),
  outputSchema: ReceiptSchema,
  execute: async ({ context }) => {
    return await createProtocol(context.protoContent);
  },
});
