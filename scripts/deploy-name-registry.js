/**
 * Deploy StealthNameRegistry to Thanos Sepolia
 *
 * Usage: PRIVATE_KEY=<key> node scripts/deploy-name-registry.js
 */

const { ethers } = require('ethers');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Read contract source
const nameRegistrySource = fs.readFileSync(
  path.join(__dirname, '../contracts/StealthNameRegistry.sol'),
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
    output.errors.filter(e => e.severity === 'warning').forEach(w => {
      console.warn('Warning:', w.formattedMessage);
    });
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
    console.error('Usage: PRIVATE_KEY=<your_key> node scripts/deploy-name-registry.js');
    process.exit(1);
  }

  console.log('Compiling StealthNameRegistry...');
  const compiled = compileContract(nameRegistrySource, 'StealthNameRegistry');
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

  // Deploy StealthNameRegistry
  console.log('\nDeploying StealthNameRegistry...');
  const Factory = new ethers.ContractFactory(
    compiled.abi,
    compiled.bytecode,
    wallet
  );
  const nameRegistry = await Factory.deploy({ gasPrice });
  console.log(`Transaction hash: ${nameRegistry.deployTransaction.hash}`);
  await nameRegistry.deployed();
  console.log(`✅ StealthNameRegistry deployed to: ${nameRegistry.address}`);

  // Verify deployment
  console.log('\n' + '='.repeat(60));
  console.log('VERIFYING DEPLOYMENT...');
  console.log('='.repeat(60));

  // Check NAME_SUFFIX
  const suffix = await nameRegistry.NAME_SUFFIX();
  console.log(`Name suffix: ${suffix}`);

  // Test name registration
  const testName = 'deploytest' + Date.now().toString().slice(-6);
  const testMetaAddress = '0x' + '02' + '00'.repeat(32) + '03' + '00'.repeat(32);

  console.log(`\nTesting with name: ${testName}`);

  const isAvailable = await nameRegistry.isNameAvailable(testName);
  console.log(`Name available: ${isAvailable}`);

  if (isAvailable) {
    console.log('Registering test name...');
    const tx = await nameRegistry.registerName(testName, testMetaAddress);
    await tx.wait();
    console.log('Name registered!');

    const resolved = await nameRegistry.resolveName(testName);
    console.log(`Resolved meta-address: ${resolved.slice(0, 20)}...`);

    const owner = await nameRegistry.getOwner(testName);
    console.log(`Owner: ${owner}`);

    if (resolved === testMetaAddress && owner === wallet.address) {
      console.log('✅ All tests passed!');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('DEPLOYMENT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nAdd to your .env file:');
  console.log(`NEXT_PUBLIC_STEALTH_NAME_REGISTRY_ADDRESS=${nameRegistry.address}`);

  // Save deployment info
  const deploymentInfo = {
    contract: 'StealthNameRegistry',
    address: nameRegistry.address,
    chainId: network.chainId,
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
    txHash: nameRegistry.deployTransaction.hash
  };

  const outputPath = path.join(__dirname, '../stealth-name-registry-deployment.json');
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
