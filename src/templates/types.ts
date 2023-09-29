export type Template = Record<TemplateType, string>

type TemplateType = 
    'ForceOpenProposal' 
    |'TimekeeperProposal' 
    | 'TimekeeperEnableProposal' 
    | 'PairCreated' 
    | 'TimekeeperChange' 
    | 'TimekeeperEnable'
    | 'ForceOpen'
    | 'RolePairAdminDaoRequested'
    | 'RolePairAdminRequested'