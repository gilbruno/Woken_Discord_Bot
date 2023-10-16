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
PairAdmin : {{pairAdmin}}
------------------------------------
        `,
    'TimekeeperProposal': `
Hey Woken Team !
A new event awaiting approval was emitted by signer address {{signer}}

Event : :clock3: **TimekeeperProposal** 
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
DaysOpenLP: {{daysOpen}}
OpeningHours: {{openingHours}}
OpeningMinutes: {{openingMinutes}}
ClosingHours: {{closingHours}}
ClosingMinutes: {{closingMinutes}}
utcOffset: {{utcOffset}}
isOnlyDay: {{isOnlyDay}}

Chain: {{chain}}
PairAdmin : {{pairAdmin}}
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
PairAdmin : {{pairAdmin}}
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
Days open: 
Opening hours: {{openingHours}}:{{openingMinutes}}
Closing hours: {{closingHours}}: {{closingMinutes}}
UTC: {{utcOffset}}
24h/day: {{isOnlyDay}}

Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin(Dao) : {{pairAdmin}}
------------------------------------
    `,
    'TimekeeperEnable': `
:clock3: TimekeeperChange event by signer address
{{signer}}

Symbol: {{pairSymbol}}
Bool: 

Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin(Dao) : {{pairAdmin}}
------------------------------------
    `,
    'ForceOpen': `
:clock3: TimekeeperChange event by signer address
{{signer}}

Symbol: {{pairSymbol}}
Bool: 

Chain: {{chain}}
Pair : {{pairAddress}}
PairAdmin(Dao) : {{pairAdmin}}
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

