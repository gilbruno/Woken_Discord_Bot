import { Template } from "./types";

export const templates: Template = {
    'ForceOpenTimelock': `
Hey Woken Members ! 
A new event was emitted by the Dex Admin

:rotating_light: **ForceOpenTimelock (48h)**

Symbol: {{pairSymbol}}
Bool: {{value}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
        `,
    'TimekeeperProposal': `
Hey Woken Team !
A new event awaiting for approval was emitted

:clock3: **TimekeeperProposal** 

Symbol: {{pairSymbol}}
DaysOpenLP: {{daysOpen}}
OpeningHours: {{openingHours}}:{{openingMinutes}}
ClosingHours: {{closingHours}}:{{closingMinutes}}
utcOffset: {{utcOffset}}
isOnlyDay: {{isOnlyDay}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'TimekeeperProposal_isOnlyDay': `
Hey Woken Members !
A new event awaiting for approval was emitted

:clock3: **TimekeeperProposal** 

Symbol: {{pairSymbol}}
DaysOpenLP: {{daysOpen}}
utcOffset: {{utcOffset}}
isOnlyDay: {{isOnlyDay}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'TimekeeperEnableProposal': `
Hey Woken Members !
A new event awaiting for approval was emitted
        
:gear: **TimekeeperEnableProposal**

Symbol: {{pairSymbol}}
Bool : {{value}}
     
Chain: {{chain}}
Pair : {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'PairCreated': `
Hey Woken Team ! 
A new event was emitted

:fire: **PairCreated**

Symbol: {{pairSymbol}}
Pair : {{pairAddress}}
Chain: {{chain}}
Signer: {{signer}}
------------------------------------
    `,
    'TimekeeperChange': `
:clock3: **TimekeeperChange** event

Symbol: {{pairSymbol}}
Days open: {{daysOpen}}
Opening hours: {{openingHours}}:{{openingMinutes}}
Closing hours: {{closingHours}}:{{closingMinutes}}
UTC: {{utcOffset}}
24h/day: {{isOnlyDay}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'TimekeeperChange_isOnlyDay': `
:clock3: **TimekeeperChange** event

Symbol: {{pairSymbol}}
Days open: {{daysOpen}}
UTC: {{utcOffset}}
24h/day: {{isOnlyDay}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'TimekeeperEnable': `
:gear: **TimekeeperEnable** event

Symbol: {{pairSymbol}}
Bool: {{value}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'ForceOpen': `
:rotating_light: **ForceOpen** event

Symbol: {{pairSymbol}}
Bool: {{value}}

Chain: {{chain}}
Pair: {{pairAddress}}
Signer: {{signer}}
------------------------------------
    `,
    'RolePairAdminDaoRequested': `
Hey Woken Team,
A new event awaiting for approval was emitted by signer address 
{{signer}}

:bust_in_silhouette: **RolePairAdminDaoRequested**

Symbol: {{pairSymbol}}
Chain: {{chain}}
Pair: {{pairAddress}}
PairAdmin: {{pairAdmin}}
------------------------------------
    `,
    'RolePairAdminRequested': `
Hey Woken Team,
A new event awaiting approval was emitted by signer address 
{{signer}}

:bust_in_silhouette: **RolePairAdminRequested**

Symbol: {{pairSymbol}}
Chain: {{chain}}
Pair: {{pairAddress}}
PairAdminDao: {{pairAdminDao}}
------------------------------------
    `,

} 

