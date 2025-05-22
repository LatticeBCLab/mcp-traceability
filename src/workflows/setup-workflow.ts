import { protocolBuffersAgent } from "@/agents/protocol-buffers-agent";
import { createBusinessTool, writeTraceability } from "@/tools";
import { Step, Workflow } from "@mastra/core";
import { z } from "zod";

export const setupWorkflow = new Workflow({
  name: "Setup Workflow",
  triggerSchema: z.object({
    message: z.string().describe("User message"),
  }),
});

const stepOne = new Step({
  id: "createBusiness",
  description: "Create a business contract address",
  outputSchema: z.object({
    businessContractAddress: z.string().describe("Business contract address"),
  }),
  execute: async ({ context }) => {
    const receipt = await createBusinessTool();
    return { businessContractAddress: receipt.contractRet ?? "" };
  },
});

const stepTwo = new Step({
  id: "createProtocol",
  description: "Create a protocol",
  outputSchema: z.object({
    protocolUri: z.number().positive().describe("Protocol URI"),
  }),
  execute: async ({ context }) => {
    const result = await protocolBuffersAgent.generate([
      { role: "user", content: context.triggerData.message },
    ]);
    return { protocolUri: Number(result.text) };
  },
});

const stepThree = new Step({
  id: "writeTraceability",
  description: "Write a traceability",
  execute: async ({ context }) => {
    const businessContractAddress =
      context.getStepResult(stepOne)?.businessContractAddress;
    const protocolUri = context.getStepResult(stepTwo)?.protocolUri;
    if (!businessContractAddress || !protocolUri) {
      throw new Error("Business contract address or protocol URI is missing");
    }
    const receipt = await writeTraceability(
      "1",
      "{}",
      protocolUri,
      businessContractAddress,
    );
    return { traceability: receipt.contractRet ?? "" };
  },
});

setupWorkflow.step(stepOne).step(stepTwo).step(stepThree);
