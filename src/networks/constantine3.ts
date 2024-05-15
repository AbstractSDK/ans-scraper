import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { Network } from './network'
import { AssetRegistry } from '../registry/assetRegistry'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Constantine3Options {}

const NETWORK_ID = 'constantine-3'

export class Constantine3 extends Network {
  private options: Constantine3Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: Constantine3Options = {}
  ) {
    super({
      networkId: NETWORK_ID,
      assetRegistry,
      contractRegistry,
      poolRegistry,
      exchanges: [],
    })
    this.options = options
  }
}
