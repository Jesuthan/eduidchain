import {
  MeshTxBuilder,
  MeshWallet,
  BlockfrostProvider,
  deserializeAddress,
  ForgeScript,
  resolveScriptHash,
  type NativeScript,
  stringToHex,
} from "@meshsdk/core";

import dotenv from "dotenv";
import certificateData from "./certificates.json"; // ✅ JSON import

dotenv.config();

// ✅ Setup Provider and Wallet
const provider = new BlockfrostProvider(process.env.BLOCKFROST_KEY!);
const words = process.env.MNEMONIC!.split(" ");

const wallet = new MeshWallet({
  key: { type: "mnemonic", words },
  networkId: 0, // 0 = Preprod, 1 = Mainnet
  fetcher: provider,
  submitter: provider,
});

const txBuilder = new MeshTxBuilder({ fetcher: provider });

async function mintCertificates() {
  const address = await wallet.getChangeAddress();
  const utxos = await wallet.getUtxos();
  const { pubKeyHash } = deserializeAddress(address);

  const latestBlock = await provider.fetchLatestBlock();
  const currentSlot = Number(latestBlock.slot);
  const expirySlot = currentSlot + 2000;

  const nativeScript: NativeScript = {
    type: "all",
    scripts: [
      { type: "before", slot: expirySlot.toString() },
      { type: "sig", keyHash: pubKeyHash },
    ],
  };

  const forgeScript = ForgeScript.fromNativeScript(nativeScript);
  const policyId = resolveScriptHash(forgeScript);

  type AssetMetadata = {
    files: {
      mediaType: string;
      name: string;
      src: string;
    }[];
    image: string;
    mediaType: string;
    name: string;
    [key: string]: unknown;
  };

  function get721Metadata(
    name: string,
    ipfsCID: string,
    attributes?: Record<string, unknown>
  ): AssetMetadata {
    return {
      ...attributes,
      files: [
        {
          mediaType: "image/jpeg",
          name,
          src: `ipfs://${ipfsCID}`,
        },
      ],
      image: `ipfs://${ipfsCID}`,
      mediaType: "image/jpeg",
      name,
    };
  }

  const metadata: {
    [policyId: string]: {
      [assetName: string]: AssetMetadata;
    };
  } = { [policyId]: {} };

  for (let i = 0; i < certificateData.length; i++) {
    const cert = certificateData[i];
    const tokenName = `UOJ #${i + 1}`;
    const tokenHex = stringToHex(tokenName);

    txBuilder.mint("1", policyId, tokenHex).mintingScript(forgeScript);

    const certAttributes = {
      type: "University Certificate",
      studentName: cert.studentName,
      universityName: "University of Jaffna",
      degree: cert.degree,
      major: cert.major,
      issueDate: cert.issueDate,
      certificateID: cert.certificateID,
      validatorURL: "https://university.example.edu/verify/",
      index: i + 1,
    };

    metadata[policyId]![tokenName] = get721Metadata(tokenName, cert.ipfsCID, certAttributes);
  }

  const unsignedTx = await txBuilder
    .metadataValue(721, metadata)
    .changeAddress(address)
    .invalidHereafter(expirySlot)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log("✅ Transaction submitted! TX Hash:", txHash);
}

mintCertificates().catch(console.error);
