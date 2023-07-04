import inquirer from "inquirer"
import { showTitleAndBanner } from "./utils"
import { HELP_ACTION_GET_KECCAC_ALL_EVENTS_NAME, HELP_ACTION_GET_KECCAC_EVENT_NAME, HELP_ACTION_QUIT, eventNameChoice, helpList, quit } from "./question"
import { getKeccac, getSignature } from "../utils/ethers.utils"
const path = require('path')

export class Inquirer {

    public answers : Answer
    
    //----------------------------------------------------------------------------------------------------------
    private async buildQuestions() {
        const suggestedQuestions = []
        suggestedQuestions.push(helpList)
        suggestedQuestions.push(eventNameChoice)
        suggestedQuestions.push(quit)
        return suggestedQuestions
    }

    //----------------------------------------------------------------------------------------------------------
    private getAbiEvents()
    {
        const rootDir = process.cwd()
        const abiPath = path.join(rootDir, '/.abi/UniswapV2Factory.json');
        const abi = require(abiPath)
        //Filter by 'event' type
        const abiEvents = abi.filter((elt:any) => {
            return elt.type === 'event'
        })
        return abiEvents
    }

    //----------------------------------------------------------------------------------------------------------
    private async handleAnswers() 
    {
        if (this.answers.helpAction === HELP_ACTION_GET_KECCAC_EVENT_NAME) {
            const abiEvents = this.getAbiEvents()

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
            let mappingEventKeccac = {}

            const abiEvents = this.getAbiEvents()
            for (let index = 0; index < abiEvents.length; index++) {
                const evt     = abiEvents[index];
                const evtName = evt.name 
                const signatureEvent = getSignature(evtName, evt.inputs)
                const keccac = getKeccac(`${signatureEvent}`)
                mappingEventKeccac[evtName] = keccac
            }
            console.log('Mapping Event Name <===> Keccac : ')
            console.log(mappingEventKeccac)
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
