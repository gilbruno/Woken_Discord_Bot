import figlet from "figlet";
import { cyan } from "kleur";

//----------------------------------------------------------------------------------------------------------
export enum ConsoleMessage {
    TITLE = 'Woken Keccac Event Name',
    BANNER = 'Tool to get keccac of event name. \n',
    ERROR = 'ERROR: ',
    SUCCESS = 'SUCCESS: ',
    INFO = 'INFO: '
}


//----------------------------------------------------------------------------------------------------------
export const showTitleAndBanner = (): void => {
    console.log(cyan(figlet.textSync(ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
    console.info(cyan(ConsoleMessage.BANNER));
}
