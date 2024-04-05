import { Exchange } from './exchange'
import { AnsAssetEntry, AnsPoolEntry, AssetInfo, PoolId } from '../objects'
import { NotFoundError } from '../registry/IRegistry'
import wretch from 'wretch'
import { jsonrepair } from 'jsonrepair'
import { Network } from '../networks/network'
import { match, P } from 'ts-pattern'
import { AssetInfo as AstroportAssetInfo } from '../clients/astroport/AstroportFactory.types'
import LocalCache from '../helpers/LocalCache'
import { ASTROPORT_POOLS } from './astroportResponses'

const ASTROPORT = 'Astroport'

const GRAPHQL_QUERY = `
  query AstrportQuery($chains: [String]!) {
    pools(chains: $chains) {
      assets {
        address
        amount
        symbol
      }
      poolType
      lpAddress
      poolAddress
      stakeable
    }
  }
`

interface AstroportOptions {
  // queryUrl: string
  contractsUrl: string
  cacheSuffix: string
  graphQlEndpoint: string
  astroContractsOverrides?: {
    astro_token_address?: string
    incentives_address?: string
  }
  tokenListUrl?: string
  poolListUrl?: string
}

const MAX_POOLS = 35

/**
 * Astroport scraper.
 * @todo: register the staking contracts
 */
export class AstroportGql extends Exchange {
  private options: AstroportOptions
  private localCache: LocalCache

  constructor(options: AstroportOptions) {
    super(ASTROPORT)
    this.options = options
    this.localCache = new LocalCache(`astroport-${options.cacheSuffix}`)
  }

  async registerAssets(network: Network) {
    // TODO: check if not cw20
    const { astro_token_address } = await this.retrieveAstroContracts()

    const { pools } = await this.fetchGraphql(network)

    if (AssetInfo.isIbcDenom(astro_token_address)) {
      await network.registerNativeAsset({ denom: astro_token_address })
    } else {
      await network.registerCw20Asset(astro_token_address)
    }

    for (const { assets } of pools) {
      for (const { address, symbol } of assets) {
        await match(AssetInfo.from(address))
          .with({ cw20: P.select() }, async (_, cw20Info) => {
            await network.registerCw20Info(cw20Info)
          })
          .with({ native: P.select() }, async (_, nativeInfo) => {
            await network.registerNativeAssetInfo(nativeInfo)
          })
          .otherwise((a) => {
            throw new Error(`Unknown asset type ${a}`)
          })
      }
    }

    console.log(
      `Registered ${JSON.stringify(network.assetRegistry.assetRegistry)} assets for ${
        this.name
      } on ${network.networkId}`
    )
  }

  private async fetchGraphql(network: Network): Promise<AstroportPoolsQueryResponse> {
    let pools: AstroportPoolsQueryResponse['pools']
    // check for the pool list
    if (this.options.poolListUrl) {
      console.log(`Fetching pools from ${this.options.poolListUrl}`)
      pools = await wretch(this.options.poolListUrl)
        .get()
        .json<{ result: { data: { json: AstroportPool[] } } }>()
        .then(
          ({
            result: {
              data: { json: pools },
            },
          }) => pools
        )
    }
    // then check for manual overrides
    else if (ASTROPORT_POOLS[network.networkId as keyof typeof ASTROPORT_POOLS]) {
      pools = ASTROPORT_POOLS[network.networkId as keyof typeof ASTROPORT_POOLS]
    }
    // finally, try the graphql endpoint (which doesn't work because we don't have an API key)
    else {
      pools = await wretch(this.options.graphQlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: GRAPHQL_QUERY,
          variables: {
            chains: [network.networkId],
          },
        }),
      })
        .get()
        .json<{ data: AstroportPoolsQueryResponse }>()
        .then(({ data: { pools } }) => pools)
    }

    // Sort the pools by their liquidity
    const sortedPools = pools
      .sort((a, b) => {
        return a.poolLiquidityUsd > b.poolLiquidityUsd ? -1 : 1
      })
      .slice(0, MAX_POOLS)

    return {
      pools: sortedPools,
    }
  }

  private astroportInfoToAssetInfo(assetInfo: AstroportAssetInfo) {
    return match<AstroportAssetInfo>(assetInfo)
      .with({ native_token: { denom: P.select() } }, (denom) => AssetInfo.native(denom))
      .with({ token: { contract_addr: P.select() } }, (token) => AssetInfo.cw20(token))
      .exhaustive()
  }

  async registerPools(network: Network) {
    const astroContracts = await this.retrieveAstroContracts()

    if (!astroContracts.incentives_address) {
      throw new Error('Could not find generator address')
    }

    const { incentives_address: stakingAddress } = astroContracts

    const { pools } = await this.fetchGraphql(network)

    pools.forEach(({ assets, poolAddress, lpAddress, poolType, stakeable }) => {
      let assetNames
      try {
        // Use the already-registered asset names
        assetNames = network.assetRegistry.getNamesByInfos(
          assets.map(({ address }) => AssetInfo.from(address))
        )
      } catch (e) {
        if (e instanceof NotFoundError) {
          // TODO
          // if (network.assetRegistry.hasSkipped(token1_address)) {
          //
          // }
        }
        console.error(`Could not resolve assets for pool with addr ${poolAddress}`)
        return
      }

      if (poolType === 'transmuter') {
        console.log(`Skipping transmuter pool for ${assetNames}`)
        return
      }

      const poolMetadata = this.poolMetadata(poolType, assetNames)

      network.poolRegistry.register(new AnsPoolEntry(PoolId.contract(poolAddress), poolMetadata))

      // TODO: this is in the wrong place lol
      const lpTokenName = this.lpTokenName(assetNames)
      network.assetRegistry.register(new AnsAssetEntry(lpTokenName, AssetInfo.from(lpAddress)))

      const stakingContract = this.stakingContractEntry(assetNames, stakingAddress)

      network.contractRegistry.register(stakingContract)
    })
  }

  /**
   * @todo we need to be able to resolve the staking contracts
   */
  async registerContracts(network: Network) {}

  private async retrieveAstroContracts(): Promise<{
    incentives_address: string
    factory_address: string
    astro_token_address: string
    [k: string]: string
  }> {
    const contracts = await wretch(this.options.contractsUrl)
      .get()
      .text((j) => {
        return jsonrepair(j.replace(': ,', ': null,'))
      })
      .then(JSON.parse)

    return {
      ...contracts,
      ...this.options.astroContractsOverrides,
    }
  }

  toAbstractPoolType(poolType: string): PoolType {
    return match(poolType)
      .with('xyk', () => 'ConstantProduct' as const)
      .with('astroport-pair-xyk-sale-tax', () => 'ConstantProduct' as const)
      .with('stable', () => 'Stable' as const)
      .with('concentrated', () => 'ConcentratedLiquidity' as const)
      .otherwise((c) => {
        return match(c)
          .with('concentrated', () => 'ConcentratedLiquidity' as const)
          .otherwise(() => {
            throw new Error(`Unknown custom type: ${JSON.stringify(c)}`)
          })
      })
  }

  private poolMetadata(pairType: string, assets: string[]): AbstractPoolMetadata {
    return {
      dex: this.name.toLowerCase(),
      pool_type: this.toAbstractPoolType(pairType),
      assets: assets.sort(),
    }
  }
}

type AstroportPoolsQueryResponse = {
  pools: AstroportPool[]
}

interface AstroportPool {
  assets: PoolAsset[]
  poolType: string
  lpAddress: string
  poolAddress: string
  stakeable: boolean
  poolLiquidityUsd: number
}

interface PoolAsset {
  address: string
  amount: string
  symbol: string
}
