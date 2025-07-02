import {
  MeshTxBuilder,
  MeshWallet,
  BlockfrostProvider,
  deserializeAddress,
  ForgeScript,
  resolveScriptHash,
  type NativeScript,
  stringToHex
} from "@meshsdk/core";

import dotenv from "dotenv";
dotenv.config();

// ✅ Load from .env
const provider = new BlockfrostProvider(process.env.BLOCKFROST_KEY!);
const words = process.env.MNEMONIC!.split(" ");

// ✅ Wallet setup
const wallet = new MeshWallet({
  key: { type: "mnemonic", words },
  networkId: 0, // preprod
  fetcher: provider,
  submitter: provider,
});

const txBuilder = new MeshTxBuilder({ fetcher: provider });

// ✅ Get address, UTXOs, pubKeyHash
const address = await wallet.getChangeAddress();
const utxos = await wallet.getUtxos();
const { pubKeyHash } = deserializeAddress(address);

// ✅ Dynamically fetch current slot and set expiry
const latestBlock = await provider.fetchLatestBlock();
const currentSlot = Number(latestBlock.slot);
const expirySlot = currentSlot + 2000; // ~40 min buffer

// ✅ Native script setup
const nativeScript: NativeScript = {
  type: "all",
  scripts: [
    {
      type: "before",
      slot: expirySlot.toString(),
    },
    { type: "sig", keyHash: pubKeyHash },
  ],
};

const forgeScript = ForgeScript.fromNativeScript(nativeScript);
const policyId = resolveScriptHash(forgeScript);

// ✅ Metadata type
type AssetMetadata = {
  files: {
    mediaType: string;
    name: string;
    src: string;
  }[];
  image: string;
  mediaType: string;
  name: string;
};

// ✅ Metadata builder
function get721Metadata(
  name: string,
  attributes?: Record<string, unknown>
): AssetMetadata {
  return {
    ...attributes,
    files: [
      {
        mediaType: "image/png",
        name,
        src: "ipfs://QmPS4PBvpGc2z6Dd6JdYqfHrKnURjtRGPTJWdhnAXNA8bQ",
      },
    ],
    image: "ipfs://QmPS4PBvpGc2z6Dd6JdYqfHrKnURjtRGPTJWdhnAXNA8bQ",
    mediaType: "image/png",
    name,
  };
}

// ✅ Build full metadata map
const metadata: {
  [policyId: string]: {
    [assetName: string]: AssetMetadata;
  };
} = { [policyId]: {} };

for (let i = 1; i < 10; i++) {
  const tokenName = "Asset #" + i;
  const tokenHex = stringToHex(tokenName);
  txBuilder.mint("1", policyId, tokenHex).mintingScript(forgeScript);
  metadata[policyId]![tokenName] = get721Metadata(tokenName, { Attribute: i });
}

// ✅ Build, sign, and submit the transaction
const unsignedTx = await txBuilder
  .metadataValue(721, metadata)
  .changeAddress(address)
  .invalidHereafter(expirySlot)
  .selectUtxosFrom(utxos)
  .complete();

const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);

console.log("✅ Submitted TX Hash:", txHash);
