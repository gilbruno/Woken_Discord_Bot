import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { Interface } from "ethers";
import { AlchemyLogTransaction } from "../discord/hook/websocket/types";
import { Alchemy, TransactionReceipt } from "alchemy-sdk";
const path = require('path')

//----------------------------------------------------------------------------------------------------------
export function getKeccac(signatureEvent: string) {
    const signatureEvent_ = toUtf8Bytes(signatureEvent)
    return keccak256(signatureEvent_)
}

//----------------------------------------------------------------------------------------------------------
export function getSignature(eventName: string, inputs: any[]) {
    let str = `${eventName}(`
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        if (i !== inputs.length-1) {
            str += input.type+','
        }
        else {
            str += input.type
        }
    }
    str += ')'
    return str
}

//----------------------------------------------------------------------------------------------------------
export function getAbi(contractName: string) {
    const rootDir = process.cwd()
    const abiPath = path.join(rootDir, `/.abi/${contractName}.json`);
    const abi = require(abiPath)
    return abi
} 

//----------------------------------------------------------------------------------------------------------
export function getAbiEvents(contractName: string)
    {
        const rootDir = process.cwd()
        const abiPath = path.join(rootDir, `/.abi/${contractName}.json`);
        const abi = require(abiPath)
        //Filter by 'event' type
        const abiEvents = abi.filter((elt:any) => {
            return elt.type === 'event'
        })
        return abiEvents
    }

//----------------------------------------------------------------------------------------------------------
export function getAbiEvent(contractName: string, eventName: string)
{
    //Filter ABi Events by 'event' name
    const abiEvent = getAbiEvents(contractName).filter((elt:any) => {
        return elt.name === eventName
    })
    return abiEvent
}

//----------------------------------------------------------------------------------------------------------
export const getTransactionInfos = async(alchemy: Alchemy, txHash: string) => {
    //Call the method to return array of logs
    let txInfos = await alchemy.core.getTransactionReceipt(txHash)
    return txInfos
}

//----------------------------------------------------------------------------------------------------------
export const getSigner = async(txInfos: TransactionReceipt) => {
    return txInfos.from
}

//----------------------------------------------------------------------------------------------------------
export const getLogs = async(alchemy: Alchemy, contractName: string, blockHash: string, eventName?: string, blockNumber?: number) => {
    //Call the method to return array of logs
    let logs = await alchemy.core.getLogs({blockHash})

    //Filter response by blockNumber if exists
    if (eventName !== undefined) {
        logs = logs.filter(
        (response_elt: any) => {
            return (response_elt.topics[0] == getKeccacByEventName(contractName, eventName))
        }
        )  
        return logs
    }

    //Filter response by blockNumber if exists
    if (blockNumber !== undefined) {
        logs = logs.filter(
        (response_elt: any) => {
            return (response_elt.blockNumber === blockNumber)
        }
        )  
        return logs
    }
    //Logging the response to the console
    //log.logger.info(JSON.stringify(logs, null, 2))
    return logs
}

//----------------------------------------------------------------------------------------------------------
export async function getLogsByTx(alchemy: Alchemy, tx: AlchemyLogTransaction, indexLog?: number)
{
    const txInfos  = await getTransactionInfos(alchemy, tx.transactionHash)
    return (indexLog!==undefined)?txInfos.logs[indexLog]:txInfos.logs
}

//----------------------------------------------------------------------------------------------------------
export function reverseJsonObject(object: any) {
    const flipped = Object
        .entries(object)
        .map(([key, value]) => [value, key]);

    const reverseObject = Object.fromEntries(flipped);
    return reverseObject
}

export function getSignatureEvent(contractName: string, eventName: string) {
    let mappingEventKeccac = {}

    const abiEvents = getAbiEvents(contractName)
    //Filter by 'event' Name
    const abiEvents_ = abiEvents.filter((elt:any) => {
        return elt.name === eventName
    })

    const evt  = abiEvents_[0];
    const evtName = evt.name 
    const signatureEvent = getSignature(evtName, evt.inputs)
    return signatureEvent
}


//----------------------------------------------------------------------------------------------------------
export function getMappingEventNameKeccac(contractName: string) {
    let mappingEventKeccac = {}

    const abiEvents = getAbiEvents(contractName)
    for (let index = 0; index < abiEvents.length; index++) {
        const evt     = abiEvents[index];
        const evtName = evt.name 
        const signatureEvent = getSignature(evtName, evt.inputs)
        const keccac = getKeccac(`${signatureEvent}`)
        mappingEventKeccac[evtName] = keccac
    }
    return mappingEventKeccac
}

//----------------------------------------------------------------------------------------------------------
export function getKeccacByEventName(contractName: string, eventName: string) {
    const mapping = getMappingEventNameKeccac(contractName)
    return mapping[eventName]
}    

export function getMappingKeccacEventName(contractName: string) {
    return reverseJsonObject(getMappingEventNameKeccac(contractName))
}

export function decodeLogs(contractName: string, eventName: string, logs: any) {
    const abiEvent = getAbiEvent(contractName, eventName)
    const abiEventString = JSON.stringify(abiEvent)
    const iFace = new Interface(abiEventString)
    const parsedLog = iFace.parseLog(logs)
    return parsedLog
   
}
