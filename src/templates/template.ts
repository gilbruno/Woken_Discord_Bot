import { Template } from "./types";

export const templates: Template = {
    'ForceOpenProposal': `
Hey Woken Team ! 
A new event awaiting approval was emitted by signer address {{signer}}

Event : :rotating_light: **ForceOpenProposal**
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
Bool : {{value}}

Chain: {{chain}}
PairAdminDao : {{pairAdminDao}}
------------------------------------
        `,
    'TimekeeperProposal': `
Hey Woken Team !
A new event awaiting approval was emitted by signer address {{signer}}

Event : :clock3: **TimekeeperProposal** 
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
DaysOpenLP: {{daysOpen}}
OpeningHours: {{openingHours}}:{{openingMinutes}}
ClosingHours: {{closingHours}}:{{closingMinutes}}
utcOffset: {{utcOffset}}
isOnlyDay: {{isOnlyDay}}

Chain: {{chain}}
PairAdminDao : {{pairAdminDao}}
------------------------------------
    `,
    'TimekeeperEnableProposal': `
Hey Woken Team !
A new event awaiting approval was emitted by signer address {{signer}}
        
Event : :gear: **TimekeeperEnableProposal**
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
Bool : {{value}}
     
Chain: {{chain}}
PairAdminDao : {{pairAdminDao}}
------------------------------------
    `,
    'PairCreated': `
Hey Woken Team ! 
A new event was emitted by signer address {{signer}}

Event : :fire: **PairCreated**
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
Chain: {{chain}}
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
    'TimekeeperChange': `
:clock3: TimekeeperChange event by signer address
{{signer}}

Symbol: {{pairSymbol}}
Days open: {{daysOpen}}
Opening hours: {{openingHours}}:{{openingMinutes}}
Closing hours: {{closingHours}}:{{closingMinutes}}
UTC: {{utcOffset}}
24h/day: {{isOnlyDay}}

Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
    'TimekeeperEnable': `
:gear: TimekeeperEnable event by signer address
{{signer}}

Symbol: {{pairSymbol}}
Bool: {{value}}

Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
    'ForceOpen': `
:rotating_light: ForceOpen event by signer address
{{signer}}

Symbol: {{pairSymbol}}
Bool: {{value}}

Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
    'RolePairAdminDaoRequested': `
Hey Woken Team,
A new event awaiting approval was emitted by signer address 
{{signer}}

:bust_in_silhouette: RolePairAdminDaoRequested

Symbol: {{pairSymbol}}
Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
    'RolePairAdminRequested': `
Hey Woken Team,
A new event awaiting approval was emitted by signer address 
{{signer}}

:bust_in_silhouette: RolePairAdminRequested

Symbol: {{pairSymbol}}
Chain: {{chain}}
Pair : {{pairAddress}}
PairAdminDao : {{pairAdminDao}}
------------------------------------
    `,

} 

