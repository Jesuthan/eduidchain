require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_IPFS_KEY;

async function uploadMultipleCertificates() {
  for (let i = 1; i <= 10; i++) {
    const fileName = `UOJ${i}.jpg`;  // ✅ must use backticks!
    const filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`❗ File not found: ${fileName}`);
      continue;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.post(
        'https://ipfs.blockfrost.io/api/v0/ipfs/add',
        form,
        {
          headers: {
            ...form.getHeaders(),
            project_id: BLOCKFROST_API_KEY
          }
        }
      );

      console.log(`Uploaded: ${fileName}`);
      console.log(`   CID: ${response.data.ipfs_hash}`);
      console.log(`   Gateway: https://ipfs.blockfrost.dev/ipfs/${response.data.ipfs_hash}`);
      console.log('------------------------------------');
    } catch (error) {
      console.error(`Failed to upload ${fileName}:`, error.response?.data || error.message);
    }
  }
}

uploadMultipleCertificates();


    