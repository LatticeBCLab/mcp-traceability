import { deepseek } from "@ai-sdk/deepseek";
import { Agent } from "@mastra/core/agent";
import { MCPClient } from "@mastra/mcp";

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

export const webSearchAgent = new Agent({
  name: "Web Search Agent",
  instructions: `
	You are a web search agent. You can use the web search tool to search the web.
	`,
  model: deepseek("deepseek-chat"),
  tools: { ...(await mcp.getTools()) },
});