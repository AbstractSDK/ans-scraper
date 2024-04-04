import { ContractRegistry } from '../registry/contractRegistry'
import { Chain } from './chain'
import { PoolRegistry } from '../registry/poolRegistry'
import { AssetRegistry } from '../registry/assetRegistry'
import { Pion1 } from '../networks/pion1'
import { Neutron1 } from '../networks/neutron1'

const testnet = new Pion1(
  new AssetRegistry({
    assetRegistry: new Map([
      [
        'eth>axelar>weth',
        {
          native: 'ibc/CC8B40E3F3536D003C6ED7C65421067215453AECE1517A6F0935470C634A036B',
        },
      ],
      [
        'nolus>nls',
        {
          native: 'ibc/830F6CA3E33406586DFAADB25908769CB111046755EDAAD1D8D6A6E72A5E0C87',
        },
      ],
      [
        'mars>mars',
        {
          native: 'ibc/584A4A23736884E0C198FD1EE932455A9357A492A7B94324E4A02B5628687831',
        },
      ],
    ]),
  }),
  new ContractRegistry(),
  new PoolRegistry()
)
const mainnet = new Neutron1(
  new AssetRegistry({
    assetRegistry: new Map([
      [
        'eth>axelar>usdc',
        {
          native: 'ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349',
        },
      ],
      [
        'dydx>dydx',
        {
          native: 'ibc/2CB87BCE0937B1D1DFCEE79BE4501AAF3C265E923509AEAC410AD85D27F35130',
        },
      ],
      [
        'cerberus>osmosis>crbrus',
        {
          native: 'ibc/58923AAE6E879D7CB5FB0F2F05550FD4F696099AB0F5CDF0A05CC0309DD8BC78',
        },
      ],
      [
        'neutron>astropepe',
        {
          native: 'factory/neutron14henrqx9y328fjrdvz6l6d92r0t7g5hk86q5nd/uastropepe',
        },
      ],
      [
        'neutron>goddard',
        {
          native: 'factory/neutron1t5qrjtyryh8gzt800qr5vylhh2f8cmx4wmz9mc/ugoddard',
        },
      ],
      [
        'stride>sttia',
        {
          native: 'ibc/6569E05DEE32B339D9286A52BE33DFCEFC97267F23EF9CFDE0C055140967A9A5',
        },
      ],
      [
        'stride>stdym',
        {
          native: 'ibc/8D0C1AC5A72FB7EC187632D01BACBB68EF743CA1AF16A15C00ACBB9CF49A0070',
        },
      ],
      [
        'dymension>dym',
        {
          native: 'ibc/4A6A46D4263F2ED3DCE9CF866FE15E6903FB5E12D87EB8BDC1B6B1A1E2D397B4',
        },
      ],
      [
        'kujira>mnta',
        {
          native: 'ibc/83794D4DD229BCBA72347244EE5FC4594880FF236F9A0A98680D10954DE9641C',
        },
      ],
    ]),
  }),
  new ContractRegistry(),
  new PoolRegistry()
)

export class Neutron extends Chain {
  constructor() {
    super('neutron', [mainnet, testnet])
  }
}
