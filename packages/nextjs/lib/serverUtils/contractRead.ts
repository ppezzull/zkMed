"use server";

import { readContract } from "@wagmi/core";
import type { ExtractAbiFunctionNames } from "abitype";
import deployedContracts from "~~/contracts/deployedContracts";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import type {
  AbiFunctionArguments,
  AbiFunctionReturnType,
  ContractAbi,
  ContractName,
} from "~~/utils/scaffold-eth/contract";

export async function serverReadContract<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>({
  contractName,
  functionName,
  args,
  chainId,
}: {
  contractName: TContractName;
  functionName: TFunctionName;
  args?: AbiFunctionArguments<ContractAbi<TContractName>, TFunctionName>;
  chainId?: number;
}): Promise<AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>> {
  const chains = wagmiConfig.chains;
  const chain = chains.find(c => c.id === chainId) ?? chains[0];
  if (!chain) throw new Error("No chain configured in wagmiConfig");

  const contract = (deployedContracts as any)?.[chain.id]?.[contractName as string];
  if (!contract?.address || !contract?.abi) {
    throw new Error(`Contract ${contractName} not found for chain ${chain.id}`);
  }

  const result = await readContract(wagmiConfig, {
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: functionName as any,
    args: (args as any) ?? [],
    chainId: chain.id,
  });

  return result as AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>;
}

export async function serverRead<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>(
  contractName: TContractName,
  functionName: TFunctionName,
  args?: AbiFunctionArguments<ContractAbi<TContractName>, TFunctionName>,
  chainId?: number,
): Promise<AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>> {
  return serverReadContract<TContractName, TFunctionName>({
    contractName,
    functionName,
    args,
    chainId,
  });
}

export async function serverContract<TContractName extends ContractName>(
  contractName: TContractName,
  opts?: { chainId?: number },
) {
  return {
    read: async <TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">>(params: {
      functionName: TFunctionName;
      args?: AbiFunctionArguments<ContractAbi<TContractName>, TFunctionName>;
    }): Promise<AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName>> =>
      serverReadContract<TContractName, TFunctionName>({
        contractName,
        functionName: params.functionName,
        args: params.args,
        chainId: opts?.chainId,
      }),
  };
}

export async function serverContractRead<
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>(params: {
  contractName: TContractName;
  functionName: TFunctionName;
  args?: AbiFunctionArguments<ContractAbi<TContractName>, TFunctionName>;
  chainId?: number;
}): Promise<{ data: AbiFunctionReturnType<ContractAbi<TContractName>, TFunctionName> | null }> {
  try {
    const data = await serverReadContract<TContractName, TFunctionName>({
      contractName: params.contractName,
      functionName: params.functionName,
      args: params.args,
      chainId: params.chainId,
    });
    return { data };
  } catch {
    return { data: null };
  }
}
