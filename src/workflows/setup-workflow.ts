import { protocolBuffersAgent } from "@/agents/protocol-buffers-agent";
import { createBusiness, writeTraceability } from "@/tools";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const setupWorkflow = createWorkflow({
  id: "setupWorkflow",
  inputSchema: z.object({
    message: z.string().describe("User message"),
  }),
  outputSchema: z.object({
    businessContractAddress: z.string().describe("Business contract address"),
  }),
  steps: [],
})
  .branch([])
  .commit();

const stepOne = createStep({
  id: "createBusiness",
  description: "Create a business contract address",
  inputSchema: z.object({
    message: z.string().describe("User message"),
  }),
  outputSchema: z.object({
    businessContractAddress: z
      .string()
      .regex(/^zltc_[a-fA-F0-9]{33}$/)
      .describe("Business contract address"),
  }),
  execute: async ({
    inputData,
    mastra,
    getStepResult,
    getInitData,
    runtimeContext,
  }) => {
    const receipt = await createBusiness();
    return { businessContractAddress: receipt.contractRet ?? "" };
  },
});

const stepTwo = createStep({
  id: "createProtocol",
  description: "Create a protocol",
  inputSchema: z.object({
    message: z.string().describe("User message"),
  }),
  outputSchema: z.object({
    protocolUri: z.number().positive().describe("Protocol URI"),
  }),
  execute: async ({
    inputData,
    mastra,
    getStepResult,
    getInitData,
    runtimeContext,
  }) => {
    const result = await protocolBuffersAgent.generate([
      { role: "user", content: inputData.message },
    ]);
    return { protocolUri: Number(result.text) };
  },
});

const stepThree = createStep({
  id: "writeTraceability",
  description: "Write a traceability",
  inputSchema: z.object({
    message: z.string().describe("User message"),
  }),
  outputSchema: z.object({
    traceability: z.string().describe("Traceability"),
  }),
  execute: async ({
    inputData,
    mastra,
    getStepResult,
    getInitData,
    runtimeContext,
  }) => {
    const businessContractAddress =
      getStepResult(stepOne)?.businessContractAddress;
    const protocolUri = getStepResult(stepTwo)?.protocolUri;
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

//setupWorkflow.step(stepOne).step(stepTwo).step(stepThree);
