import { chains } from 'chain-registry'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { AnsAssetEntry, AnsContractEntry, AnsPoolEntry, AssetInfo } from '../objects'
import { IbcExtension, QueryClient, setupIbcExtension } from '@cosmjs/stargate'
import { Exchange } from '../exchanges'
import { ContractRegistry } from '../registry/contractRegistry'
import { PoolRegistry } from '../registry/poolRegistry'
import { AssetRegistry } from '../registry/assetRegistry'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { ChainRegistry } from '../objects/ChainRegistry'


interface INetwork {
  networkId: string
  assetRegistry: AssetRegistry
  contractRegistry: ContractRegistry
  poolRegistry: PoolRegistry
  exchanges: Exchange[]
}

export abstract class Network {
  networkId: string
  assetRegistry: AssetRegistry
  contractRegistry: ContractRegistry
  poolRegistry: PoolRegistry
  private exchanges: Exchange[]

  protected constructor({
    networkId,
    assetRegistry,
    contractRegistry,
    poolRegistry,
    exchanges,
  }: INetwork) {
    this.networkId = networkId
    this.assetRegistry = assetRegistry
    this.contractRegistry = contractRegistry
    this.poolRegistry = poolRegistry
    this.exchanges = exchanges
  }

  /**
   * if it's a native asset, we check if its registered already. If not registered, it is not a preknown asset, so we generate a new entry
   */
  public async registerChainNativeAsset({ denom, symbol }: { denom: string; symbol?: string }) {
    const assetInfo = AssetInfo.native(denom)

    if (!symbol) {
      symbol = this.findNativeAssetSymbol(denom)
    }

    // If it's not IBC, register it!
    if (!AssetInfo.isIbcDenom(denom)) {
      return this.assetRegistry.register(new AnsAssetEntry(symbol, assetInfo))
    }

    // TODO: check IBC registration

    // We don't know any ibc denoms by default
    this.assetRegistry.unknownAsset(symbol, denom)
  }

  public async queryClient(): Promise<CosmWasmClient> {
    return CosmWasmClient.connect(await this.rpcUrl())
  }

  public async ibcQueryClient(): Promise<QueryClient & IbcExtension> {
    const tendermintClient = await Tendermint34Client.connect(await this.rpcUrl())
    return QueryClient.withExtensions(tendermintClient, setupIbcExtension)
  }

  private async rpcUrl(): Promise<string> {
    // const chain_name = chains.find(({ chain_id }) => chain_id === this.networkId)?.apis?.rpc?.[0]?.address
    const chain_name = chains.find(({ chain_id }) => chain_id === this.networkId)?.chain_name
    if (!chain_name) throw new Error(`Chain ${this.networkId} not found in chain-registry`)

    return `https://rpc.cosmos.directory/${chain_name}`
  }

 protected findNativeAssetSymbol(denom: string): string {
    return ChainRegistry.findSymbol(this.networkId, denom)
  }

  async exportAssets(): Promise<AnsAssetEntry[]> {
    await Promise.all(this.exchanges.map((exchange) => exchange.registerAssets(this)))
    return this.assetRegistry.export()
  }

  async exportContracts(): Promise<AnsContractEntry[]> {
    await Promise.all(this.exchanges.map((exchange) => exchange.registerContracts(this)))
    return this.contractRegistry.export()
  }

  async exportPools(): Promise<AnsPoolEntry[]> {
    await Promise.all(this.exchanges.map((exchange) => exchange.registerPools(this)))
    return this.poolRegistry.export()
  }


}
