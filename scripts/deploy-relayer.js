/**
 * Deploy StealthRelayer Contract to Thanos Sepolia
 *
 * Usage: PRIVATE_KEY=<key> node scripts/deploy-relayer.js
 */

const { ethers } = require('ethers');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Read contract source
const relayerSource = fs.readFileSync(
  path.join(__dirname, '../contracts/StealthRelayer.sol'),
  'utf8'
);

function compileContract(source, contractName) {
  const input = {
    language: 'Solidity',
    sources: {
      [`${contractName}.sol`]: { content: source }
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        '*': { '*': ['abi', 'evm.bytecode.object'] }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    if (errors.length > 0) {
      console.error('Compilation errors:');
      errors.forEach(e => console.error(e.formattedMessage));
      throw new Error('Compilation failed');
    }
    // Show warnings
    const warnings = output.errors.filter(e => e.severity === 'warning');
    if (warnings.length > 0) {
      console.log('Compilation warnings:');
      warnings.forEach(w => console.log(w.formattedMessage));
    }
  }

  const contract = output.contracts[`${contractName}.sol`][contractName];
  return {
    abi: contract.abi,
    bytecode: '0x' + contract.evm.bytecode.object
  };
}

async function main() {
  // Configuration
  const RPC_URL = 'https://rpc.thanos-sepolia.tokamak.network';
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    console.error('Please set PRIVATE_KEY environment variable');
    console.error('Usage: PRIVATE_KEY=<your_key> node scripts/deploy-relayer.js');
    process.exit(1);
  }

  console.log('Compiling StealthRelayer...');
  const relayerCompiled = compileContract(relayerSource, 'StealthRelayer');
  console.log('Compilation successful!');

  console.log('\nConnecting to Thanos Sepolia...');
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const network = await provider.getNetwork();
  console.log(`Connected to chain ID: ${network.chainId}`);

  const balance = await wallet.getBalance();
  console.log(`Deployer address: ${wallet.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(balance)} TOKAMAK`);

  if (balance.isZero()) {
    console.error('Deployer has no balance! Please fund the account first.');
    process.exit(1);
  }

  // Get current gas price
  const gasPrice = await provider.getGasPrice();
  console.log(`Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

  // Deploy StealthRelayer with deployer as fee recipient
  console.log('\nDeploying StealthRelayer...');
  console.log(`Fee recipient will be: ${wallet.address}`);

  const RelayerFactory = new ethers.ContractFactory(
    relayerCompiled.abi,
    relayerCompiled.bytecode,
    wallet
  );
  const relayer = await RelayerFactory.deploy(wallet.address, { gasPrice });
  console.log(`Transaction hash: ${relayer.deployTransaction.hash}`);
  await relayer.deployed();
  console.log(`✅ StealthRelayer deployed to: ${relayer.address}`);

  console.log('\n' + '='.repeat(60));
  console.log('DEPLOYMENT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nContract Address:');
  console.log(`  StealthRelayer: ${relayer.address}`);
  console.log('\nAdd to your .env file:');
  console.log(`NEXT_PUBLIC_STEALTH_RELAYER_ADDRESS=${relayer.address}`);

  // Verify contract works
  console.log('\n' + '='.repeat(60));
  console.log('VERIFYING CONTRACT...');
  console.log('='.repeat(60));

  // Check settings
  const feeBps = await relayer.feeBps();
  const minFee = await relayer.minFee();
  const feeRecipient = await relayer.feeRecipient();
  const owner = await relayer.owner();

  console.log(`\nContract Settings:`);
  console.log(`  Fee: ${feeBps.toNumber() / 100}%`);
  console.log(`  Min Fee: ${ethers.utils.formatEther(minFee)} ETH`);
  console.log(`  Fee Recipient: ${feeRecipient}`);
  console.log(`  Owner: ${owner}`);

  // Test fee calculation
  const testAmount = ethers.utils.parseEther('1.0');
  const calculatedFee = await relayer.calculateFee(testAmount);
  console.log(`\nFee calculation test:`);
  console.log(`  Amount: ${ethers.utils.formatEther(testAmount)} ETH`);
  console.log(`  Fee: ${ethers.utils.formatEther(calculatedFee)} ETH`);

  console.log('\n🎉 StealthRelayer deployed and verified successfully!');

  // Output JSON for easy import
  const deploymentInfo = {
    chainId: network.chainId,
    relayer: relayer.address,
    feeRecipient: feeRecipient,
    feeBps: feeBps.toNumber(),
    minFee: ethers.utils.formatEther(minFee),
    deployer: wallet.address,
    timestamp: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, '../relayer-deployment.json');
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${outputPath}`);

  console.log('\n' + '='.repeat(60));
  console.log('NEXT STEPS');
  console.log('='.repeat(60));
  console.log('\n1. Add to .env:');
  console.log(`   NEXT_PUBLIC_STEALTH_RELAYER_ADDRESS=${relayer.address}`);
  console.log('\n2. Start the relayer service:');
  console.log(`   RELAYER_PRIVATE_KEY=${PRIVATE_KEY} \\`);
  console.log(`   STEALTH_RELAYER_ADDRESS=${relayer.address} \\`);
  console.log('   node relayer/index.js');
  console.log('\n3. Fund the relayer wallet to pay for gas');
}

main().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
