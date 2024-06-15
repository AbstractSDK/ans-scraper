import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { Network } from './network'
import { AssetRegistry } from '../registry/assetRegistry'
import { Astrovault } from '../exchanges/astrovault'

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
      exchanges: [
        new Astrovault({
          standardPoolFactoryAddress:
            'archway1ne86kmyx369qex266kuf062y0lzd86ruhr3l22l9ue85f6wl3ynqfy6f2q',
          stablePoolFactoryAddress:
            'archway1slxn0e464njg0f3dca9lug7kcacg0s9g3mf482ghe6t8qc5lmctszmth8m',
          cacheSuffix: NETWORK_ID,
        }),
      ],
    })
    this.options = options
  }
}
