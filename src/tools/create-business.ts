import { ChainConfig, Credentials, Curves, LatticeClient, NodeConnectionConfig, TraceabilityContract } from "@zlattice/lattice-js";

export const createBusinessTool = async () => {
  const chainId = 1;
  const chainConfig = new ChainConfig(Curves.Sm2p256v1, true);
  const nodeConnectionConfig = new NodeConnectionConfig("192.168.3.51", 13000);
  const credentials = Credentials.fromPrivateKey(
    "zltc_bXmfbHYXx5e2ri9nSrDcjGLzZ4A3EmbXK",
    "0xb2abf4282ac9be1b61afa64305e1b0eb4b7d0726384d1000486396ff73a66a5d"
  );
  const traceability = new TraceabilityContract();

  const lattice = new LatticeClient(chainConfig, nodeConnectionConfig);
  const receipt = await lattice.callContractWaitReceipt(
    credentials,
    chainId,
    "zltc_QLbz7JHiBTspS9WTWJUrbNsB5wbENMweQ",
    traceability.createBusiness(),
  )
  return {
    receipt,
  };
};