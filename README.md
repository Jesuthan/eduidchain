# 🎓 EduIDChain

**EduIDChain** is a decentralized academic credential verification system built on the Cardano blockchain. It enables universities to issue NFT-based certificates and allows employers or institutions to verify them securely and transparently.

---
## 📽️ Demo Video

Watch the full walkthrough of EduIDChain on YouTube:  
👉 [https://www.youtube.com/watch?v=Hd7Slz-s6Qc](https://www.youtube.com/watch?v=Hd7Slz-s6Qc)

## 🚀 Key Features

- 🏫 **NFT-based Certificate Issuance**: Universities mint NFTs containing degree data
- 🔐 **Tamper-Proof Credentials**: Stored on Cardano Testnet, verifiable forever
- 👛 **Wallet Connect**: Supports Eternl and Lace wallets via Mesh SDK
- 🔍 **Verification Page**: Employers can validate NFTs using Blockfrost API
- 🌐 **React Frontend**: Clean, modern UI built with Tailwind CSS

---
## 📽️ Demo Video

Watch the full walkthrough of EduIDChain on YouTube:  
👉## 📽️ Demo Video

Watch the full walkthrough of EduIDChain on YouTube:  
👉 https://www.youtube.com/watch?v=Hd7Slz-s6Qc



## 🧱 Tech Stack

| Layer               | Tools & Libraries                         |
|--------------------|--------------------------------------------|
| Frontend           | React.js + Tailwind CSS                   |
| Blockchain Layer   | Cardano (via Mesh SDK + Blockfrost API)   |
| Smart Contract     | Optional - Aiken (future enhancement)     |
| NFT Minting        | Mesh SDK `mintAssets()`                   |
| Wallets Supported  | Eternl, Lace                              |
| Metadata Hosting   | IPFS (optional) + on-chain storage        |
| Deployment         | GitHub + Vercel                           |

---

## 💡 Use Case

Universities can issue verifiable degrees to students on the blockchain. Students share their NFT Asset ID with employers. Employers visit the **Verify** page, enter the ID, and instantly validate the student's degree metadata on Cardano.

---

## 🗂️ Project Structure

```
eduidchain/
├── public/
├── src/
│   ├── components/
│   │   └── WalletConnector.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── IssueCredential.js
│   │   └── VerifyCredential.js
│   ├── App.js
│   └── index.js
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🧪 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/eduidchain.git
cd eduidchain
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Run the app:

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🔗 Connect Your Wallet

Supports:
- **Eternl**
- **Lace**
- Any wallet integrated with Mesh SDK

Click **"Connect Wallet"** at the top and approve the request in your browser extension.

---

## 🔐 Minting NFT Certificate

Admins can enter:
- Student Name
- Degree Title
- GPA
- Date Issued
- Wallet Address

Click **"Mint Certificate"**, and the student will receive an NFT in their wallet.

---

## 🔍 Verifying a Certificate

1. Get the NFT **Asset ID** from the student
2. Go to `/verify` page
3. Paste the Asset ID
4. Click **Verify** to fetch on-chain metadata from Blockfrost API
5. Check degree, issuer, and match policy ID (to confirm it's legit)

---

## 🧪 Blockfrost API Setup

1. Sign up at: [https://blockfrost.io](https://blockfrost.io)
2. Get your **Testnet API Key**
3. Create a `.env` file in the root:

```bash
REACT_APP_BLOCKFROST_KEY=your_blockfrost_key
```

---

## 📜 License

MIT — feel free to use, modify, or build on this.

---

## 🤝 Built for

**UniHack 2025** – Inter-University Blockchain Hackathon in Sri Lanka  
Organized by CoinCeylon × University of Kelaniya

Team of 5 students | Built with ❤️ in 2 weeks
