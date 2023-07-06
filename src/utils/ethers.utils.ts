import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
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
export function getAbiEvents()
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
export function reverseJsonObject(object: any) {
    const flipped = Object
        .entries(object)
        .map(([key, value]) => [value, key]);

    const reverseObject = Object.fromEntries(flipped);
    return reverseObject
}

//----------------------------------------------------------------------------------------------------------
export function getMappingEventNameKeccac() {
    let mappingEventKeccac = {}

    const abiEvents = getAbiEvents()
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
export function getKeccacByEventName(eventName: string) {
    const mapping = getMappingEventNameKeccac()
    return mapping[eventName]
}    

export function getMappingKeccacEventName() {
    return reverseJsonObject(getMappingEventNameKeccac())
}

