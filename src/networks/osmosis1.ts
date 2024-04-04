import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { Network } from './network'
import { OsmosisDex } from '../exchanges'
import { AssetRegistry } from '../registry/assetRegistry'
import { AstroportGql } from '../exchanges/astroportgql'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Osmosis1Options {}

const CHAIN_ID = 'osmosis-1'

export class Osmosis1 extends Network {
  private options: Osmosis1Options

  constructor(
    assetRegistry: AssetRegistry,
    contractRegistry: ContractRegistry,
    poolRegistry: PoolRegistry,
    options: Osmosis1Options = {}
  ) {
    super({
      networkId: CHAIN_ID,
      assetRegistry: assetRegistry,
      contractRegistry: contractRegistry,
      poolRegistry: poolRegistry,
      exchanges: [
        new OsmosisDex({
          gammPoolUrl:
            'https://lcd-osmosis.keplr.app/osmosis/gamm/v1beta1/pools?pagination.limit=1500',
          concentratedPoolUrl:
            'https://lcd-osmosis.keplr.app/osmosis/concentratedliquidity/v1beta1/pools?pagination.limit=1500',
          volumeUrl: 'https://api-osmosis.imperator.co/fees/v1/pools',
        }),
        new AstroportGql({
          contractsUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-changelog/main/osmosis/osmosis-1/core_mainnet.json',
          cacheSuffix: CHAIN_ID,
          graphQlEndpoint: 'https://multichain-api.astroport.fi/graphql',
          tokenListUrl:
            'https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/main/tokenLists/osmosis.json',
          poolListUrl:
            'https://app.astroport.fi/api/trpc/pools.getAll?input=%7B%22json%22%3A%7B%22chainId%22%3A%5B%22osmosis-1%22%5D%7D%7D',
        }),
      ],
    })
    this.options = options
  }
}
