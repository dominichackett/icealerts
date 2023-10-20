import Chain from '../models/chains'



export const calibrationFilecoin: Chain = {
  id: '0x4cb2f',
  token: 'TFIL',
  shortName: 'cal',
  label: 'Filecoin Calibration',
  rpcUrl: 'https://api.calibration.node.glif.io/rpc/v1',
  blockExplorerUrl: 'https://calibration.filfox.info/en',
  color: '#3e6957',
  isStripePaymentsEnabled: false
}


const chains: Chain[] = [calibrationFilecoin]

export const initialChain = calibrationFilecoin

export default chains