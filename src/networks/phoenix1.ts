import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { Network } from './network'
import { AssetRegistry } from '../registry/assetRegistry'
import { AstroportGql } from '../exchanges/astroportgql'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Phoenix1Options {}

const PHOENIX_1 = 'phoenix-1'

export class Phoenix1 extends Network {
  private options: Phoenix1Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: Phoenix1Options = {}
  ) {
    super({
      networkId: PHOENIX_1,
      assetRegistry,
      contractRegistry,
      poolRegistry,
      exchanges: [
        // new Astroport({
        //   contractsUrl:
        //     'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/terra-2/phoenix-1/core_phoenix.json',
        //     cacheSuffix: PHOENIX_1
        // }),
        new AstroportGql({
          contractsUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/terra-2/phoenix-1/core_phoenix.json',
          cacheSuffix: PHOENIX_1,
          graphQlEndpoint: 'https://multichain-api.astroport.fi/graphql',
          tokenListUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/main/tokenLists/terra2.json',
          poolListUrl:
            'https://app.astroport.fi/api/trpc/pools.getAll?input=%7B%22json%22%3A%7B%22chainId%22%3A%5B%22phoenix-1%22%5D%7D%7D',
        }),
      ],
    })
    this.options = options
  }
}
