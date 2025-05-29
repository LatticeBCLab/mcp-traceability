import { deepseek } from "@ai-sdk/deepseek";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { Memory } from "@mastra/memory";

const mcp = new MCPClient({
  servers: {
    exa: {
      command: "npx",
      args: ["exa-mcp-server"],
      env: {
        EXA_API_KEY: process.env.EXA_API_KEY || "",
      },
    },
  },
});

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  options: {
    workingMemory: {
      enabled: true,
    },
  },
});

export const webSearchAgent = new Agent({
  name: "Web Search Agent",
  instructions: `
	You are a web search agent. You can use the web search tool to search the web.
	`,
  model: deepseek("deepseek-chat"),
  tools: { ...(await mcp.getTools()) },
  memory,
});