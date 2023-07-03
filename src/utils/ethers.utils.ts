import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

export function getKeccac(signatureEvent: string) {
    const signatureEvent_ = toUtf8Bytes(signatureEvent)
    return keccak256(signatureEvent_)
}

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