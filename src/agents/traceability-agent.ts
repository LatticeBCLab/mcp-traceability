import {
	generateDataIdTool,
	readProtocolTool,
	writeTraceabilityTool,
} from "@/tools";
import { deepseek } from "@ai-sdk/deepseek";
import { Agent } from "@mastra/core/agent";

export const traceabilityAgent = new Agent({
	name: "Write Traceability Agent",
	instructions: `
    You are an assistant that helps users manage traceability data.

    Work flow:
    1. 从用户信息中获取protocolUri, businessContractAddress等参数，如果获取不到，则提示用户提供。
    2. readProtocolTool: read protocol from the blockchain. And get the protobuf from receipt.contractRet.
    3. 通过protobuf中定义的message结构来检查用户给的data数据结构是否和protobuf中定义的message结构一致。
    4. 如果一致，则使用writeTraceabilityTool来写入traceability数据到区块链。
    5. 如果数据结构不一致，则提示用户修改数据结构。
    6. 如果用户没有提供dataId，则帮助用户生成一个dataId。
    7. 如果用户没有提供data，则帮助用户生成一个data。
    `,
	model: deepseek("deepseek-chat"),
	tools: { readProtocolTool, writeTraceabilityTool, generateDataIdTool },
});
