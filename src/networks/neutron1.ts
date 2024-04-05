import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { Network } from './network'
import { AssetRegistry } from '../registry/assetRegistry'
import { AstroportGql } from '../exchanges/astroportgql'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Neutron1Options {}

const NEUTRON_1 = 'neutron-1'

export class Neutron1 extends Network {
  private options: Neutron1Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: Neutron1Options = {}
  ) {
    super({
      networkId: NEUTRON_1,
      assetRegistry,
      contractRegistry,
      poolRegistry,
      exchanges: [
        new AstroportGql({
          contractsUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/neutron/neutron-1/core_mainnet.json',
          cacheSuffix: NEUTRON_1,
          graphQlEndpoint: 'https://multichain-api.astroport.fi/graphql',
          tokenListUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/main/tokenLists/neutron.json',
          poolListUrl:
            'https://app.astroport.fi/api/trpc/pools.getAll?input=%7B%22json%22%3A%7B%22chainId%22%3A%5B%22neutron-1%22%5D%7D%7D',
        }),
      ],
    })
    this.options = options
  }
}
