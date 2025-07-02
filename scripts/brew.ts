import { MeshWallet } from "@meshsdk/core";

const words = MeshWallet.brew() as string[];

const mnemonicString = words.join(" ");
console.log("mnemonic:", mnemonicString);

const wallet = new MeshWallet({
  key: { type: "mnemonic", words },
  networkId: 0,
});

console.log("Public Change Address:", await wallet.getChangeAddress());
