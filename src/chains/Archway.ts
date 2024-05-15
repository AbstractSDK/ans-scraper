import { ContractRegistry } from '../registry/contractRegistry'
import { Chain } from './chain'
import { PoolRegistry } from '../registry/poolRegistry'
import { AssetRegistry } from '../registry/assetRegistry'
import { Archway1 } from '../networks/archway1'
import { Constantine3 } from '../networks/constantine3'
import { AnsContractEntry, AnsPoolEntry } from '../objects'

// https://gist.github.com/7Two1/2a818845794d4cbb293180f96dcf9678
const archway_1 = new Archway1(
  new AssetRegistry({
    assetRegistry: new Map([
      [
        'eth>axelar>usdc',
        {
          native: 'ibc/B9E4FD154C92D3A23BEA029906C4C5FF2FE74CB7E3A058290B77197A263CF88B',
        },
      ],
      [
        'jackal>jkl',
        {
          native: 'ibc/926432AE1C5FA4F857B36D970BE7774C7472079506820B857B75C5DE041DD7A3',
        },
      ],
      [
        'archway>xjkl',
        {
          cw20: 'archway1yjdgfut7jkq5xwzyp6p5hs7hdkmszn34zkhun6mglu3falq3yh8sdkaj7j',
        },
      ],
      [
        'axelar>axl',
        {
          native: 'ibc/E21808AEBCB7E02F594897100186C126E3BC9A36B0974196AF116750A4573F06',
        },
      ],
      [
        'archway>xaxl',
        {
          cw20: 'archway135pmrdfsu8le852q5xztwdlxpmzqrp2t589lrqtw2athnr70wgcqg26ecc',
        },
      ],
    ]),
  }),
  new ContractRegistry({
    contractRegistry: [
      // https://github.com/archid-protocol/archid-registry
      new AnsContractEntry(
        'archid',
        'registry',
        'archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0'
      ),
    ],
  }),
  new PoolRegistry()
)

const constantine_3 = new Constantine3(
  new AssetRegistry({
    assetRegistry: new Map([
      [
        'archway>const',
        {
          native: 'aconst',
        },
      ],
      [
        "archway>xconst",
        {
          "cw20": "archway1sdzaas0068n42xk8ndm6959gpu6n09tajmeuq7vak8t9qt5jrp6sjjtnka"
        }
      ],
      [
        "archway>usdc",
        {
          "cw20": "archway1mmu32f7hn0fyw8gh57xl5uhaqu4pq5xx59ynf0tju60n2nzha0as3vtmcm"
        }
      ],
      [
        "astrovault/archway>usdc,archway>xconst",
        {
          "cw20": "archway1st6764z62hxxvausxlj0fd2rmq06f9dekhnzdajlc45c2fxpfk5sdllcqu"
        }
      ]
    ]),
  }),
  new ContractRegistry({
    contractRegistry: [
      // https://github.com/archid-protocol/archid-registry
      new AnsContractEntry(
        'archid',
        'registry',
        'archway1lr8rstt40s697hqpedv2nvt27f4cuccqwvly9gnvuszxmcevrlns60xw4r'
      ),
      AnsContractEntry.fromEntry(
        [
          {
            "protocol": "astrovault",
            "contract": "staking/astrovault/archway>const,archway>xconst"
          },
          "archway14mwujg8f3qleemetthz4ndphr82q2r2gt2hul6qgaerxn4dnlnuqgsm82e"
        ]
      ),
      AnsContractEntry.fromEntry(
        [
          {
            "protocol": "astrovault",
            "contract": "staking/astrovault/archway>usdc,archway>xconst"
          },
          "archway1gyucz0m7qgl450n7hmj24ckthdt2sap5phk0zyrwcj8hjprv9vss4nn8kw"
        ])
    ],
  }),
  new PoolRegistry(
    {
      contractRegistry: [
        new AnsPoolEntry(
          {
            "contract": "archway1flsdgve559shl8fvqfrk3p2wdxn82ykqyqk7w2wjaw7p3gnhj3esfmq8t0"
          },
          {
            "dex": "astrovault",
            "pool_type": "Stable",
            "assets": [
              "archway>const",
              "archway>xconst"
            ]
          }
        ),
        new AnsPoolEntry(
          {
            "contract": "archway1jdrvvzd2tcfvhvyaedy7e8s92lh2m3a3jklvn74768fh6n5quh4sl6rgkx"
          },
          {
            "dex": "astrovault",
            "pool_type": "ConstantProduct",
            "assets": [
              "archway>usdc",
              "archway>xconst"
            ]
          }
        )
      ]
    }
  )
)

export class Archway extends Chain {
  constructor() {
    super('archway', [constantine_3])
  }
}
