import Chain from '../models/chains'

/*export const gnosisChain: Chain = {
  id: '0x64',
  token: 'xDai',
  shortName: 'gno',
  label: 'Gnosis Chain',
  rpcUrl: 'https://rpc.gnosischain.com',
  blockExplorerUrl: 'https://gnosisscan.io',
  color: '#3e6957',
  transactionServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global',
  isStripePaymentsEnabled: false
}

export const goerliChain: Chain = {
  id: '0x5',
  token: 'gETH',
  label: 'Görli',
  shortName: 'gor',
  rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  color: '#fbc02d',
  transactionServiceUrl: 'https://safe-transaction-goerli.safe.global',
  isStripePaymentsEnabled: false
}

export const mainnetChain: Chain = {
  id: '0x1',
  token: 'ETH',
  label: 'Ethereum',
  shortName: 'eth',
  rpcUrl: 'https://cloudflare-eth.com',
  blockExplorerUrl: 'https://etherscan.io',
  color: '#DDDDDD',
  transactionServiceUrl: 'https://safe-transaction-mainnet.safe.global',
  isStripePaymentsEnabled: false
}

export const polygonChain: Chain = {
  id: '0x89',
  token: 'matic',
  shortName: 'matic',
  label: 'Polygon',
  rpcUrl: 'https://polygon-rpc.com',
  blockExplorerUrl: 'https://polygonscan.com',
  color: '#8248E5',
  transactionServiceUrl: 'https://safe-transaction-polygon.safe.global',
  isStripePaymentsEnabled: false
}

export const mumbaiChain: Chain = {
  id: '0x13881',
  token: 'matic',
  shortName: 'matic',
  label: 'Mumbai',
  rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
  blockExplorerUrl: 'https://mumbai.polygonscan.com',
  color: '#8248E5',
  isStripePaymentsEnabled: true,
  faucetUrl: 'https://mumbaifaucet.com/'
}
*/
export const goerliChain: Chain = {
  id: '0x5',
  token: 'gETH',
  label: 'Görli',
  shortName: 'gor',
  rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  color: '#fbc02d',
  transactionServiceUrl: 'https://safe-transaction-goerli.safe.global',
  isStripePaymentsEnabled: false
}

export const optimismGoerli: Chain = {
  id: '0x1a4',
  token: 'ETH',
  shortName: 'op',
  label: 'Optimism Goerli',
  rpcUrl: 'https://optimism-goerli.public.blastapi.io',
  blockExplorerUrl: 'https://goerli-optimism.etherscan.io',
  color: '#3e6957',
  isStripePaymentsEnabled: false
}

export const baseGoerli: Chain = {
  id: '0x14a33',
  token: 'ETH',
  shortName: 'baseg',
  label: 'Base Goerli',
  rpcUrl: 'https://goerli.base.org',
  blockExplorerUrl: 'https://goerli.basescan.org',
  color: '#3e6957',
  isStripePaymentsEnabled: false
}

export const zoraGoerli: Chain = {
  id: '0x3e7',
  token: 'ETH',
  shortName: 'zorag',
  label: 'Zora Goerli',
  rpcUrl: 'https://testnet.rpc.zora.energy',
  blockExplorerUrl: 'https://testnet.explorer.zora.energy',
  color: '#3e6957',
  isStripePaymentsEnabled: false
}

export const modeTestnet: Chain = {
  id: '0x397',
  token: 'ETH',
  shortName: 'mode',
  label: 'Mode Testnet',
  rpcUrl: 'https://sepolia.mode.network/',
  blockExplorerUrl: 'https://sepolia.explorer.mode.network/',
  color: '#3e6957',
  isStripePaymentsEnabled: false
}
const chains: Chain[] = [optimismGoerli,baseGoerli,zoraGoerli,modeTestnet,goerliChain]

export const initialChain = optimismGoerli

export default chains