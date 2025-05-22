import "dotenv/config";
import { log } from "@zlattice/lattice-js";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { protocolBuffersAgent } from "./agents/protocol-buffers-agent";
import { webSearchAgent } from "./agents/web-search-agent";
import { createBusinessTool } from "./tools/create-business";
import { readProtocol } from "./tools/read-protocol";
import { writeTraceability } from "./tools/write-traceability";

const server = new FastMCP({
  name: "Traceability MCP Server",
  version: "1.0.0",
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
  name: "web search",
  description: "Search the web",
  parameters: z.object({
    query: z.string().describe("Search query"),
  }),
  execute: async (args) => {
    const result = await webSearchAgent.generate([
      { role: "user", content: args.query },
    ]);
    return result.text;
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
    const receipt = await readProtocol(args.protocolUri);
    return JSON.stringify(receipt);
  },
});

server.addTool({
  name: "writeTraceability",
  description: "Write a traceability",
  parameters: z.object({
    protocolUri: z.number().describe("Protocol URI"),
    dataId: z.string().describe("Data ID"),
    data: z.string().describe("Data"),
    businessContractAddress: z.string().describe("Business Contract Address"),
  }),
  execute: async (args) => {
    const receipt = await writeTraceability(
      args.dataId,
      args.data,
      args.protocolUri,
      args.businessContractAddress,
    );
    return JSON.stringify(receipt);
  },
});

/* server.addTool({
  name: "writeTraceability",
  description: "Write a traceability",
  parameters: z.object({
    message: z.string().describe("User message"),
    protocolUri: z.number().describe("Protocol URI"),
    businessContractAddress: z.string().describe("Business Contract Address"),
  }),
  execute: async (args) => {
    const agent = traceabilityAgent;
    const result = await agent.generate([
      {
        role: "user",
        content: `message: ${args.message}, protocolUri: ${args.protocolUri}, businessContractAddress: ${args.businessContractAddress}`,
      },
    ]);
    return result.text;
  },
}); */

const transportType = process.env.TRANSPORT_TYPE || "stdio";

let startOptions:
  | { transportType: "stdio" }
  | {
      transportType: "httpStream";
      httpStream: { port: number; endpoint: string };
    };

if (transportType === "stdio") {
  startOptions = {
    transportType: "stdio",
  };
} else if (transportType === "sse") {
  startOptions = {
    transportType: "httpStream",
    httpStream: {
      port: Number.parseInt(process.env.SSE_PORT || "8000", 10),
      endpoint: process.env.SSE_ENDPOINT || "/sse",
    },
  };
} else {
  console.error(
    `Unsupported TRANSPORT_TYPE: ${transportType}. Defaulting to stdio.`,
  );
  startOptions = {
    transportType: "stdio",
  };
}

server.start(startOptions);