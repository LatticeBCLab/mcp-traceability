import { FastMCP } from "fastmcp";
import { z } from "zod";
import { createBusinessTool } from "./tools/create-business";
import { E } from "@zlattice/lattice-js";

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
    const result = await createBusinessTool();
    if (E.isLeft(result.receipt)) {
      const receipt = result.receipt.left;
      return JSON.stringify(receipt);
    }
    return result.receipt.right.toString();
  },
});

server.start({
  //transportType: "stdio",
   transportType: "sse",
  sse: {
    endpoint: "/sse",
    port: 8000,
  },
});