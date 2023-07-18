import { CONTRACT_NAME, FORCE_OPEN_PROPOSAL, PAIR_CREATED, TIME_KEEPER_ENABLE_PROPOSAL, TIME_KEEPER_PROPOSAL } from "../../../const/constants"
import { Log } from "../../../logger/log"
import { templates } from "../../../templates/template"
import { decodeLogs, getLogsByTx, getSigner, getTransactionInfos } from "../../../utils/ethers.utils"
import SmartContractUtils from "../../../utils/smart.contract.utils"
import { buildNotificationText } from "../../../utils/utils"
import { WokenHook } from "../woken.hook"
import { AlchemyLogTransaction, EventName, replacementsTemplate } from "./types"
import { Alchemy, AlchemyProvider } from 'alchemy-sdk';

export interface INotificationSender {
    sendNotificationsToDiscordChannel(eventName: EventName, tx: AlchemyLogTransaction): Promise<void>
}
  

/**
 * NotificationSender class
 */
export class NotificationSender implements INotificationSender {
    constructor(private readonly alchemy: Alchemy, private readonly factoryAddress: string, private readonly provider: AlchemyProvider,
        private readonly wokenHook: WokenHook, private readonly log: Log) {}
  
    public async sendNotificationsToDiscordChannel(eventName: EventName, tx: AlchemyLogTransaction) {
      const txHash    = tx.transactionHash
      const blockHash = tx.blockHash
      const logs     = await getLogsByTx(this.alchemy, tx)
      const signerTx  = await getSigner(await getTransactionInfos(this.alchemy, txHash))
  
      let pairAddress: string
      let value: number | string
      let pairAdmin: string
  
      let replacements: replacementsTemplate = {} 
      
      const parsedLog = decodeLogs(CONTRACT_NAME, eventName, logs[0])
      pairAddress = parsedLog.args[0]
      pairAdmin   = await SmartContractUtils.getPairAdmin(this.factoryAddress, this.provider, pairAddress)
  
      if (eventName === TIME_KEEPER_ENABLE_PROPOSAL || eventName === FORCE_OPEN_PROPOSAL) {
        value              = parsedLog.args[1]
        replacements.value = value
      } else if (eventName === PAIR_CREATED) {
        //Do nothing
      } else if (eventName === TIME_KEEPER_PROPOSAL) {
        const timeKeeperPerLp = await SmartContractUtils.getTimeKeeperPerLp(this.factoryAddress, this.provider, pairAddress)
        const daysOpenLP      = await SmartContractUtils.getDaysOpenLP(this.factoryAddress, this.provider, pairAddress)
        replacements.openingHours   = timeKeeperPerLp.openingHour
        replacements.openingMinutes = timeKeeperPerLp.openingMinute
        replacements.closingHours   = timeKeeperPerLp.closingHour
        replacements.closingMinutes = timeKeeperPerLp.closingMinute
        replacements.utcOffset      = timeKeeperPerLp.utcOffset
        replacements.isOnlyDay      = timeKeeperPerLp.isOnlyDay
        replacements.daysOpen       = daysOpenLP
      } 
  
      replacements = {...replacements, ...{
          signer: signerTx,
          pairAdmin: pairAdmin,
          pairAddress: pairAddress
        }
      }
  
      let msgNotification = buildNotificationText(templates, eventName, replacements)
  
      this.log.logger.info(msgNotification)
      this.wokenHook.setMsgNotification(msgNotification)
      this.wokenHook.sendNotification()
  
    }
  }
  