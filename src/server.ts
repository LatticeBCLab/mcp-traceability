import "dotenv/config";
import { log } from "@zlattice/lattice-js";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { protocolBuffersAgent } from "./agents/protocol-buffers-agent";
import { createBusinessTool } from "./tools/create-business";
import { readProtocol } from "./tools/read-protocol";

const server = new FastMCP({
	name: "My Server",
	version: "1.0.0",
});

server.addTool({
	name: "add",
	description: "Add two numbers",
	parameters: z.object({
		a: z.number(),
		b: z.number(),
	}),
	execute: async (args) => {
		return String(args.a + args.b);
	},
});

server.addTool({
	name: "createBusiness",
	description: "Create a business contract address",
	execute: async () => {
		const receipt = await createBusinessTool();
		return JSON.stringify(receipt);
	},
});

server.addTool({
	name: "createProtocol",
	description: "Create a protocol",
	parameters: z.object({
		message: z.string().describe("User message"),
	}),
	execute: async (args) => {
		const result = await protocolBuffersAgent.generate([
			{ role: "user", content: args.message },
		]);
		log.info("agent result", result.text);
		return result.text;
	},
});

server.addTool({
	name: "readProtocol",
	description: "Read a protocol",
	parameters: z.object({
		protocolUri: z.number().describe("Protocol URI"),
	}),
	execute: async (args) => {
		const result = await readProtocol(args.protocolUri);
		return JSON.stringify(result);
	},
});

server.start({
	transportType: "stdio",
	/* transportType: "sse",
	sse: {
		endpoint: "/sse",
		port: 8000,
	}, */
});