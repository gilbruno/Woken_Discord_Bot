import inquirer from "inquirer"
import { showTitleAndBanner } from "./utils"
import { HELP_ACTION_GET_KECCAC_ALL_EVENTS_NAME, HELP_ACTION_GET_KECCAC_EVENT_NAME, HELP_ACTION_QUIT, eventNameChoice, helpList, quit } from "./question"
import { getAbiEvents, getKeccac, getMappingEventNameKeccac, getMappingKeccacEventName, getSignature, reverseJsonObject } from "../utils/ethers.utils"


export class Inquirer {

    public answers : Answer
    
    private readonly CONTRACT_NAME = 'WokenFactory'

    //----------------------------------------------------------------------------------------------------------
    private async buildQuestions() {
        const suggestedQuestions = []
        suggestedQuestions.push(helpList)
        suggestedQuestions.push(eventNameChoice)
        suggestedQuestions.push(quit)
        return suggestedQuestions
    }

    //----------------------------------------------------------------------------------------------------------
    private async handleAnswers() 
    {
        if (this.answers.helpAction === HELP_ACTION_GET_KECCAC_EVENT_NAME) {
            const abiEvents = getAbiEvents(this.CONTRACT_NAME)

            const eventName = this.answers.eventName

            //Filter abiEvents by 'name'
            const abiEvents_ = abiEvents.filter((elt:any) => {
                return elt.name === eventName
            })

            console.log(JSON.stringify(abiEvents_, null, 2))
            if (abiEvents_.length === 0) {
                console.log('No event matching what you typed in the ABI ! Try again')
            }
            else {
                const signatureEvent = getSignature(eventName, abiEvents_[0].inputs)
                console.log('signatureEvent : ' +signatureEvent)
                const keccac = getKeccac(`${signatureEvent}`)
                console.log(`The keccac of the signature event is : ${keccac}`)
            }
        }
        else if (this.answers.helpAction === HELP_ACTION_GET_KECCAC_ALL_EVENTS_NAME) {
            console.log('Mapping Event Name <===> Keccac : ')
            console.log(getMappingEventNameKeccac(this.CONTRACT_NAME))
            console.log('---------------')
            //console.log(getMappingKeccacEventName())
        }
        else if (this.answers.helpAction === HELP_ACTION_QUIT) {
            console.log('Quit')
        }
    }
    
    //----------------------------------------------------------------------------------------------------------
    private async inquirerPrompt()
    {
        const suggestedQuestions = await this.buildQuestions()
        this.answers = await inquirer.prompt(suggestedQuestions)
        await this.handleAnswers()
        if (!this.answers.quit) {
            await this.inquirerPrompt()
        }
        else {
            process.exit(1)
        }
    }

    //----------------------------------------------------------------------------------------------------------
    public async run() {
        showTitleAndBanner()
        await this.inquirerPrompt()
    }    
    
}
