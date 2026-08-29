const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { defineChain } = require('viem');

const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
  testnet: true,
});

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("PRIVATE_KEY environment variable required");
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey);
  console.log(`Deployer Account: ${account.address}`);

  const publicClient = createPublicClient({ chain: monadTestnet, transport: http() });
  const walletClient = createWalletClient({ account, chain: monadTestnet, transport: http() });

  // Compile SkillMaxEscrow
  const escrowPath = path.join(__dirname, 'src', 'SkillMaxEscrow.sol');
  const escrowSource = fs.readFileSync(escrowPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'SkillMaxEscrow.sol': { content: escrowSource },
    },
    settings: {
      outputSelection: {
        '*': { '*': ['abi', 'evm.bytecode'] },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    const errs = output.errors.filter(e => e.severity === 'error');
    if (errs.length > 0) {
      console.error('Compilation errors:', errs);
      process.exit(1);
    }
  }

  const escrowContract = output.contracts['SkillMaxEscrow.sol']['SkillMaxEscrow'];
  const bytecode = '0x' + escrowContract.evm.bytecode.object;
  const abi = escrowContract.abi;

  console.log("Deploying SkillMaxEscrow to Monad Testnet...");
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [account.address], // arbiter
  });

  console.log(`Tx Submitted: https://testnet.monadscan.com/tx/${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`SkillMaxEscrow Deployed Address: ${receipt.contractAddress}`);
}

main().catch(console.error);
