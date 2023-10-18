import { TIME_KEEPER_CHANGE, TIME_KEEPER_PROPOSAL } from "../const/constants";
import { networkSchema, network } from "../discord/hook/websocket/types";
import { Template } from "../templates/types";

//----------------------------------------------------------------------------------------------------------
export function joinString<T extends string[]>(...strings: T): Concat<T> {
    return strings.join("") as Concat<T>;
  }

  export type Concat<T extends string[]> = T extends [
    infer F,
    ...infer R
  ]
    ? F extends string
      ? R extends string[]
        ? `${F}${Concat<R>}`
        : never
      : never
    : '';

//----------------------------------------------------------------------------------------------------------
function keyExists<T extends object>(obj: T, key: keyof any): key is keyof T {
  return key in obj;
}

//----------------------------------------------------------------------------------------------------------
export function buildNotificationText(templates: Template, eventName: string, replacements: any) {
  let template = templates[eventName]
  if (eventName == TIME_KEEPER_CHANGE || eventName == TIME_KEEPER_PROPOSAL) {
    if (keyExists(replacements, 'isOnlyDay') && replacements['isOnlyDay'] === true) {
      template = templates[eventName+'_isOnlyDay']
    }
  }
  
  for (const key in replacements) {
    template = template.replace(`{{${key}}}`, replacements[key])
  }
  
  return template
}    

//----------------------------------------------------------------------------------------------------------
export async function isNetworkValid(network: network) {
  let errorMsg = ''
  let parsedObj = null
  try {
      parsedObj = networkSchema.parse(network);
    } catch (error: any) {
      errorMsg = 'Invalid Network set ! '  
      errorMsg += error.issues[0].message
    }
    finally {
      return errorMsg
    }
}

//----------------------------------------------------------------------------------------------------------
export function leftPadWithZero(inputString: number): string {
  const str = inputString.toString()
  return (str.length === 1) ? '0' + str : str;
}

//----------------------------------------------------------------------------------------------------------
export function isSmartContractEventProposal(eventName: string): boolean {
  return eventName.endsWith('Proposal');
}

//----------------------------------------------------------------------------------------------------------
export function isSmartContractEventRole(eventName: string): boolean {
  return eventName.startsWith('Role');
}

//----------------------------------------------------------------------------------------------------------
export function transformBinaryListByDaysOfWeek(input: number[]): string {

  enum DAYS_OF_WEEK {
    MONDAY    = 'Mon',
    TUESDAY   = 'Tue',
    WEDNESDAY = 'Wed',
    THURSDAY  = 'Thu',
    FRIDAY    = 'Fri',
    SATURDAY  = 'Sat',
    SUNDAY    = 'Sun'
  }

  type DaysOfWeek = 
    DAYS_OF_WEEK.MONDAY 
    | DAYS_OF_WEEK.TUESDAY 
    | DAYS_OF_WEEK.WEDNESDAY 
    | DAYS_OF_WEEK.THURSDAY 
    | DAYS_OF_WEEK.FRIDAY 
    | DAYS_OF_WEEK.SATURDAY 
    | DAYS_OF_WEEK.SUNDAY;

  const days: DaysOfWeek[] = [
    DAYS_OF_WEEK.MONDAY, 
    DAYS_OF_WEEK.TUESDAY, 
    DAYS_OF_WEEK.WEDNESDAY, 
    DAYS_OF_WEEK.THURSDAY, 
    DAYS_OF_WEEK.FRIDAY, 
    DAYS_OF_WEEK.SATURDAY, 
    DAYS_OF_WEEK.SUNDAY
  ]
    ;


  // Ensure the input is valid
  if (input.length !== 7 || !input.every(val => val === 0 || val === 1)) {
      throw new Error('Invalid input! Please provide a list of seven 0s or 1s separated by commas.');
  }

  const transformedDays = input.map((value, index) => {
      if (value === 0) {
          return days[index];
      } else {
          return `~~${days[index]}~~`;
      }
  });
  return transformedDays.join(',');
}