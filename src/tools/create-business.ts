import { chainClient, chainId, credentials } from "@/lib/chain-client";
import { TraceabilityContract } from "@zlattice/lattice-js";
import { log } from "@zlattice/lattice-js";
import { Address } from "@zlattice/lattice-js";

export const createBusinessTool = async () => {
  const traceability = new TraceabilityContract();
  return await chainClient
    .callContractWaitReceipt(
      credentials,
      chainId,
      TraceabilityContract.ADDRESS_FOR_CREATE_BUSINESS,
      traceability.createBusiness(),
    )
    .match(
      (receipt) => {
        if (receipt.success) {
          const address = new Address(receipt.contractRet ?? "").toZLTC();
          log.info(
            "Decoded call contract result, get business address: %s",
            address,
          );
          receipt.contractRet = address;
        }
        return receipt;
      },
      (error) => {
        throw error instanceof Error ? error : new Error(String(error));
      },
    );
};