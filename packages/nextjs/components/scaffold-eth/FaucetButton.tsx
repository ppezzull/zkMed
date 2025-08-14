"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { createWalletClient, http, parseEther } from "viem";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";

// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";
const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { authenticated, ready } = usePrivy();

  const { data: balance } = useWatchBalance({ address });

  const [loading, setLoading] = useState(false);

  const faucetTxn = useTransactor(localWalletClient);

  const sendETH = async () => {
    if (!address) return;
    try {
      setLoading(true);
      await faucetTxn({
        account: FAUCET_ADDRESS,
        to: address,
        value: parseEther(NUM_OF_ETH),
      });
      setLoading(false);
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
      setLoading(false);
    }
  };

  // Show only on local hardhat AND when user is authenticated
  if (targetNetwork.id !== hardhat.id) return null;
  if (!ready || !authenticated) return null;

  const isBalanceZero = balance && balance.value === 0n;

  return (
    <div
      className={
        !isBalanceZero
          ? "ml-2"
          : "ml-2 tooltip tooltip-bottom tooltip-primary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:-translate-x-2/5"
      }
      data-tip="Grab funds from faucet"
    >
      <button
        onClick={sendETH}
        disabled={loading}
        className="px-4 py-2 rounded-2xl border border-gray-500 text-gray-300 font-semibold hover:border-gray-400 hover:text-white transition-all duration-300 text-sm flex items-center gap-2"
        aria-label="Faucet"
        title="Faucet"
      >
        {!loading ? (
          <>
            <BanknotesIcon className="h-4 w-4" />
            <span>Faucet</span>
          </>
        ) : (
          <span className="loading loading-spinner loading-xs"></span>
        )}
      </button>
    </div>
  );
};
