import { Network } from './network'
import { AssetRegistry } from '../registry/assetRegistry'
import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { AstroportGql } from '../exchanges/astroportgql'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Injective888Options {}

const INJECTIVE_888 = 'injective-888'

export class Injective888 extends Network {
  private options: Injective888Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: Injective888Options = {}
  ) {
    super({
      networkId: INJECTIVE_888,
      assetRegistry: assetRegistry,
      contractRegistry: contractRegistry,
      poolRegistry: poolRegistry,
      exchanges: [
        new AstroportGql({
          contractsUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/injective/injective-888/core_testnet.json',
          cacheSuffix: INJECTIVE_888,
          graphQlEndpoint: 'https://multichain-api.astroport.fi/graphql',
          tokenListUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/main/tokenLists/testnets/injective.json',
          poolListUrl:
            'https://app.astroport.fi/api/trpc/pools.getAll?input=%7B%22json%22%3A%7B%22chainId%22%3A%5B%22injective-888%22%5D%7D%7D',
        }),
      ],
    })
    this.options = options
  }
}
