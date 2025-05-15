import { readProtocolTool, writeTraceabilityTool } from "@/tools";
import { deepseek } from "@ai-sdk/deepseek";
import { Agent } from "@mastra/core/agent";

export const traceabilityAgent = new Agent({
	name: "Write Traceability Agent",
	instructions: `
    You are an assistant that helps users manage traceability data.
    You can use the following tools to help users write traceability data:
    
    - readProtocolTool: read protocol from the blockchain.
    - writeTraceabilityTool: write traceability data to the blockchain.
    `,
	model: deepseek("deepseek-chat"),
	tools: { readProtocolTool, writeTraceabilityTool },
});
