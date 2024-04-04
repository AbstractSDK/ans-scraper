import { Network } from './network'
import { AssetRegistry } from '../registry/assetRegistry'
import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { AstroportGql } from '../exchanges/astroportgql'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Injective1Options {}

const INJECTIVE_1 = 'injective-1'

export class Injective1 extends Network {
  private options: Injective1Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: Injective1Options = {}
  ) {
    super({
      networkId: INJECTIVE_1,
      assetRegistry: assetRegistry,
      contractRegistry: contractRegistry,
      poolRegistry: poolRegistry,
      exchanges: [
        new AstroportGql({
          contractsUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/injective/injective-1/core_mainnet.json',
          cacheSuffix: INJECTIVE_1,
          graphQlEndpoint: 'https://multichain-api.astroport.fi/graphql',
          tokenListUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/main/tokenLists/injective.json',
          poolListUrl:
            'https://app.astroport.fi/api/trpc/pools.getAll?input=%7B%22json%22%3A%7B%22chainId%22%3A%5B%22injective-1%22%5D%7D%7D',
        }),
      ],
    })
    this.options = options
  }
}
