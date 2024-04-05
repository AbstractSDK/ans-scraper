import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { Network } from './network'
import { OsmosisDex } from '../exchanges'
import { AssetRegistry } from '../registry/assetRegistry'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OsmoTest5Options {}

const CHAIN_ID = 'osmo-test-5'

export class OsmoTest5 extends Network {
  private options: OsmoTest5Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: OsmoTest5Options = {}
  ) {
    super({
      networkId: CHAIN_ID,
      assetRegistry: assetRegistry,
      contractRegistry: contractRegistry,
      poolRegistry: poolRegistry,
      exchanges: [
        new OsmosisDex({
          gammPoolUrl:
            'https://lcd.testnet.osmosis.zone/osmosis/gamm/v1beta1/pools?pagination.limit=1000',
          concentratedPoolUrl:
            'https://lcd.testnet.osmosis.zone/osmosis/concentratedliquidity/v1beta1/pools?pagination.limit=1000',
          volumeUrl: undefined,
        }),
        // Currently not available
        // new AstroportGql({
        //   contractsUrl:
        //     'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/osmosis/osmo-test-5/core_testnet.json',
        //   cacheSuffix: CHAIN_ID,
        //   graphQlEndpoint: 'https://multichain-api.astroport.fi/graphql',
        //   tokenListUrl:
        //     'https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/main/tokenLists/testnets/osmosis.json',
        //   poolListUrl:
        //     'https://app.astroport.fi/api/trpc/pools.getAll?input=%7B%22json%22%3A%7B%22chainId%22%3A%5B%22osmo-test-5%22%5D%7D%7D',
        // }),
      ],
    })
    this.options = options
  }
}
