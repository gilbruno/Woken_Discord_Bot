import { Template } from "./types";

export const templates: Template = {
    'ForceOpenProposal': `
Hey Woken Team ! 
A new event awaiting approval was emitted by signer address {{signer}}

Event : :rotating_light: **ForceOpenProposal**
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
Bool : {{value}}

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
     
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
    'PairCreated': `
Hey Woken Team ! 
A new event was emitted by signer address {{signer}}

Event : :fire: **PairCreated**
Pair : {{pairAddress}}
Symbol: {{pairSymbol}}
PairAdmin : {{pairAdmin}}
------------------------------------
    `,
} 

