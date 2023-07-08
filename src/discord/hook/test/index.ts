import { WokenHook } from "../woken.hook";


export async function test() {

    let msgNotification = 'TEST EMOJI\n'
    msgNotification += ':fire:'

    const wokenHook = new WokenHook()
    wokenHook.setMsgNotification(msgNotification)
    wokenHook.sendNotification()
}