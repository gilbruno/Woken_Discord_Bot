type InputChoice = {
    type: 'input'
    name: string
    message: string,
    when?: any
}

type Answer = {
    helpAction: string
    eventName: string
    quit: boolean
}
