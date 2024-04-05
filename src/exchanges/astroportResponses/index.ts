import neutron1 from './neutron-1'
import osmosis1 from './osmosis-1'
import phoenix1 from './phoenix-1'
import pion1 from './pion-1'

export const ASTROPORT_POOLS = {
  ['neutron-1']: neutron1.result.data.json,
  ['phoenix-1']: phoenix1.result.data.json,
  ['pion-1']: pion1.result.data.json,
  ['osmosis-1']: osmosis1.result.data.json,
}
