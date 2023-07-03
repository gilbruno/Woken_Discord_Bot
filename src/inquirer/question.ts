const HELP_ACTION_GET_KECCAC_EVENT_NAME      = 'Get Keccac Event Name'
const HELP_ACTION_GET_KECCAC_ALL_EVENTS_NAME = 'Get Keccac All Events Name'
const HELP_ACTION_QUIT                       = 'Quit'

const helpActions = [
    HELP_ACTION_GET_KECCAC_EVENT_NAME,
    HELP_ACTION_GET_KECCAC_ALL_EVENTS_NAME,
    HELP_ACTION_QUIT
]

let helpList = 
{
    type: 'list',
    name: 'helpAction',
    message: 'Choose an action',
    choices: helpActions
}

let eventNameChoice: InputChoice = 
{
    type: 'input',
    name: 'eventName',
    message: 'Choose an event name',
    when: function when(answers:any) {
        return answers.helpAction === HELP_ACTION_GET_KECCAC_EVENT_NAME
    }
}

let quit = {
    type: 'confirm',
    name: 'quit',
    message: 'Quit the application ?',
    when: function when(answers:any) {
        return answers.helpAction === HELP_ACTION_QUIT
    }
}


export {
    helpList,
    helpActions,
    eventNameChoice,
    quit,
    HELP_ACTION_GET_KECCAC_EVENT_NAME,
    HELP_ACTION_GET_KECCAC_ALL_EVENTS_NAME,
    HELP_ACTION_QUIT
}