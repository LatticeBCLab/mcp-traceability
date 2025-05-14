import { chainClient, chainId, credentials } from "@/lib/chain-client";
import { TraceabilityContract } from "@zlattice/lattice-js";

export const createBusinessTool = async () => {
	const traceability = new TraceabilityContract();
	const receipt = await chainClient.callContractWaitReceipt(
		credentials,
		chainId,
		TraceabilityContract.ADDRESS_FOR_CREATE_BUSINESS,
		traceability.createBusiness(),
	);
	return {
		receipt,
	};
};