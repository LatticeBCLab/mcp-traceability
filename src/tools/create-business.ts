import { chainClient, chainId, credentials } from "@/lib/chain-client";
import { TraceabilityContract, isHexString } from "@zlattice/lattice-js";
import { E, log } from "@zlattice/lattice-js";
import { Address } from "@zlattice/lattice-js";

export const createBusinessTool = async () => {
	const traceability = new TraceabilityContract();
	const result = await chainClient.callContractWaitReceipt(
		credentials,
		chainId,
		TraceabilityContract.ADDRESS_FOR_CREATE_BUSINESS,
		traceability.createBusiness(),
	);

	if (E.isRight(result)) {
		throw new Error("Failed to create business");
	}

	const receipt = result.left;
	if (receipt.success) {
		const address = new Address(receipt.contractRet ?? "").toZLTC();
		log.info("Decoded call contract result, get business address: %s", address);
		receipt.contractRet = address;
	}

	return {
		receipt,
	};
};