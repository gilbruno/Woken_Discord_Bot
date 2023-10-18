export type Template = Record<TemplateType, string>

type TemplateType = 
    'ForceOpenProposal' 
    |'TimekeeperProposal' 
    |'TimekeeperProposal_isOnlyDay' 
    | 'TimekeeperEnableProposal' 
    | 'PairCreated' 
    | 'TimekeeperChange' 
    | 'TimekeeperChange_isOnlyDay' 
    | 'TimekeeperEnable'
    | 'ForceOpen'
    | 'RolePairAdminDaoRequested'
    | 'RolePairAdminRequested'