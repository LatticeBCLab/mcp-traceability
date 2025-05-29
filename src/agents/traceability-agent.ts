import {
  createBusinessTool,
  createProtocolTool,
  generateDataIdTool,
  readProtocolTool,
  writeTraceabilityTool,
} from "@/tools";
import { deepseek } from "@ai-sdk/deepseek";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../traceability-memory.db",
  }),
  options: {
    lastMessages: 10,
    workingMemory: {
      enabled: true,
    },
  },
});

const instructions = `You are a helpful assistant that can help users with their data and tools, powered by deepseek.

  Your main responsibilities are:
  1. Read the protocol from the database.
  2. Write the traceability data to the database.
  3. Generate the data ID.

  Available tools:
  - readProtocolTool: Read the protocol from the database.
  - writeTraceabilityTool: Write the traceability data to the database.
  - generateDataIdTool: Generate the data ID.

  You are also given a user's information.
  You are also given a workflow to help the user with their data.
  `;


export const traceabilityAgent = new Agent({
  name: "Traceability Agent",
  instructions,
  model: deepseek("deepseek-chat"),
  tools: {
    createProtocolTool,
    createBusinessTool,
    readProtocolTool,
    writeTraceabilityTool,
    generateDataIdTool,
  },
  memory,
});
