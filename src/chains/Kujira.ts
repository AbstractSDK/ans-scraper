import { ContractRegistry } from '../registry/contractRegistry'
import { Chain } from './chain'
import { PoolRegistry } from '../registry/poolRegistry'
import { AssetRegistry } from '../registry/assetRegistry'
import { Harpoon4 } from '../networks/harpoon4'
import { AnsContractEntry } from '../objects'

/*
borrow
{
        "pair": "KUJI/USK",
        "vault_address": "kujira1yqh4gfa75jh2q82e9ada98l9qz7xf0xvwa399cl52a4vrv3kxzvstrjuy0",
        "performance": "0.0%",
        "profit_in_usdc": "$0.00",
        "liquidity": "$456",
        "base_denom": "ukuji",
        "quote_denom": "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk",
        "fin_address": "kujira193dzcmy7lwuj4eda3zpwwt9ejal00xva0vawcvhgsyyp5cfh6jyq66wfrf",
        "btoken_value": "$2.95"
    }
 */

const harpoon_4 = new Harpoon4(
  new AssetRegistry({
    assetRegistry: new Map([
      [
        'kujira>kuji',
        {
          native: 'ukuji',
        },
      ],
      [
        'kujira>usk',
        {
          native: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
        },
      ],
      [
        'kujira>hans',
        {
          native: 'factory/kujira1mc8r0mcrye0tcwldn82fyyaa4zv6vve9j2me6h/uhans',
        },
      ],
    ]),
  }),
  new ContractRegistry({
    contractRegistry: [
      // vault/lending
      new AnsContractEntry(
        'ghost',
        'vault/kujira>kuji',
        'kujira18txj8dep8n9cfgmhgshut05d9t4vjdphcd3dwl32vu4898w9uxnslaflur'
      ),
      // market/lending/collateral
      new AnsContractEntry(
        'ghost',
        'market/kujira>kuji/kujira>usk',
        'kujira193dzcmy7lwuj4eda3zpwwt9ejal00xva0vawcvhgsyyp5cfh6jyq66wfrf'
      ),
    ],
  }),
  new PoolRegistry()
)

export class Kujira extends Chain {
  constructor() {
    super('kujira', [harpoon_4])
  }
}
