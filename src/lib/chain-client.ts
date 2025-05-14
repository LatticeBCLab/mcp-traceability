import {
	ChainConfig,
	Credentials,
	Curves,
	LatticeClient,
	NodeConnectionConfig,
} from "@zlattice/lattice-js";

export const chainId = Number(process.env.CHAIN_ID) || 1;

export const chainConfig = new ChainConfig(Curves.Sm2p256v1, true);

export const nodeConnectionConfig = new NodeConnectionConfig(
	process.env.NODE_IP || "192.168.3.51",
	Number(process.env.NODE_PORT) || 13000,
);

export const credentials = Credentials.fromPrivateKey(
	process.env.ACCOUNT_ADDRESS || "zltc_bXmfbHYXx5e2ri9nSrDcjGLzZ4pA3EmbXK",
	process.env.PRIVATE_KEY ||
		"0xb2abf4282ac9be1b61afa64305e1b0eb4b7d0726384d1000486396ff73a66a5d",
);

export const chainClient = new LatticeClient(chainConfig, nodeConnectionConfig);
