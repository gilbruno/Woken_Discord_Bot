import { CONTRACT_NAME, FORCE_OPEN, FORCE_OPEN_TIMELOCK, PAIR_CREATED, ROLE_PAIR_ADMIN_DAO_REQUESTED, ROLE_PAIR_ADMIN_REQUESTED, TIME_KEEPER_CHANGE, TIME_KEEPER_ENABLE, TIME_KEEPER_ENABLE_PROPOSAL, TIME_KEEPER_PROPOSAL } from "../../../const/constants"
import { Log } from "../../../logger/log"
import { templates } from "../../../templates/template"
import { decodeLogs, getLogsByTx, getSigner, getTransactionInfos } from "../../../utils/ethers.utils"
import SmartContractUtils from "../../../utils/smart.contract.utils"
import { buildNotificationText, isSmartContractEventProposal, isSmartContractEventRole, leftPadWithZero, transformBinaryListByDaysOfWeek } from "../../../utils/utils"
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
      let token0: string
      let token1: string
      let tokenSymbol0: string
      let tokenSymbol1: string
      let boolValue: number | string
      let pairAdmin: string
      let pairAdminDao: string
      let pairSymbol: string
      let chainName: string

      let replacements: replacementsTemplate = {} 
      
      //Parse all logs given by its tx hash and send notifications
      for (let i = 0; i < logs.length; i++) {
        const parsedLog = decodeLogs(CONTRACT_NAME, eventName, logs[i])
        pairAddress = parsedLog.args[0]
  
        chainName    = await SmartContractUtils.getChainName(this.provider)   
        pairAdmin    = await SmartContractUtils.getPairAdmin(this.factoryAddress, this.provider, pairAddress)
        pairAdminDao = await SmartContractUtils.getPairAdminDao(this.factoryAddress, this.provider, pairAddress)
        
        token0 = await SmartContractUtils.getTokenAddress(pairAddress, 0, this.provider)
        token1 = await SmartContractUtils.getTokenAddress(pairAddress, 1, this.provider)
  
        tokenSymbol0 = await SmartContractUtils.getTokenSymbol(token0, this.provider)
        tokenSymbol1 = await SmartContractUtils.getTokenSymbol(token1, this.provider)
        pairSymbol = tokenSymbol0+'-'+tokenSymbol1
  
        if (eventName === TIME_KEEPER_ENABLE_PROPOSAL 
            || eventName === FORCE_OPEN_TIMELOCK 
            || eventName === FORCE_OPEN 
            || eventName === TIME_KEEPER_ENABLE) {
              
              switch (eventName) {
                case FORCE_OPEN :
                  boolValue = await SmartContractUtils.isForceOpen(this.factoryAddress, this.provider, pairAddress)
                  break;
                case FORCE_OPEN_TIMELOCK :
                  boolValue = await SmartContractUtils.isForceOpenTimelock(this.factoryAddress, this.provider, pairAddress)
                  break;
                case TIME_KEEPER_ENABLE :
                  boolValue = await SmartContractUtils.isTimekeeperEnabledLP(this.factoryAddress, this.provider, pairAddress)
                  break;
                case TIME_KEEPER_ENABLE_PROPOSAL :
                  boolValue = await SmartContractUtils.isTimekeeperEnabledLPProposal(this.factoryAddress, this.provider, pairAddress)
                  break;
              }  
              replacements.value = boolValue
        } else if (eventName === TIME_KEEPER_PROPOSAL) {
          const timeKeeperPerLp = await SmartContractUtils.getTimeKeeperPerLpWaitingForApproval(this.factoryAddress, this.provider, pairAddress)
          const daysOpenLP      = await SmartContractUtils.getDaysOpenLPProposal(this.factoryAddress, this.provider, pairAddress)
          replacements.openingHours   = leftPadWithZero(timeKeeperPerLp.openingHour)
          replacements.openingMinutes = leftPadWithZero(timeKeeperPerLp.openingMinute)
          replacements.closingHours   = leftPadWithZero(timeKeeperPerLp.closingHour)
          replacements.closingMinutes = leftPadWithZero(timeKeeperPerLp.closingMinute)
          replacements.utcOffset      = timeKeeperPerLp.utcOffset
          replacements.isOnlyDay      = timeKeeperPerLp.isOnlyDay
          const daysOpen              = transformBinaryListByDaysOfWeek(daysOpenLP)
          replacements.daysOpen       = daysOpen
        } else if (eventName === TIME_KEEPER_CHANGE) {
          const timeKeeper = await SmartContractUtils.getTimeKeeperPerLp(this.factoryAddress, this.provider, pairAddress)
          const daysOpenLP      = await SmartContractUtils.getDaysOpenLP(this.factoryAddress, this.provider, pairAddress)
          replacements.openingHours   = leftPadWithZero(timeKeeper.openingHour)
          replacements.openingMinutes = leftPadWithZero(timeKeeper.openingMinute)
          replacements.closingHours   = leftPadWithZero(timeKeeper.closingHour)
          replacements.closingMinutes = leftPadWithZero(timeKeeper.closingMinute)
          replacements.utcOffset      = timeKeeper.utcOffset
          replacements.isOnlyDay      = timeKeeper.isOnlyDay
          const daysOpen              = transformBinaryListByDaysOfWeek(daysOpenLP)
          replacements.daysOpen       = daysOpen
        } else if (eventName === PAIR_CREATED 
          || eventName === ROLE_PAIR_ADMIN_DAO_REQUESTED 
          || eventName === ROLE_PAIR_ADMIN_REQUESTED) {
          //Do nothing = Use generic data like 'signer', 'pairAdmin', etc ...
        } 
    
        replacements = {...replacements, ...{
            signer: signerTx,
            pairAdmin: pairAdmin,
            pairAdminDao: pairAdminDao,
            pairAddress: pairAddress,
            pairSymbol: pairSymbol,
            chain: chainName
          }
        }
    
        let msgNotification = buildNotificationText(templates, eventName, replacements)
    
        this.log.logger.info(msgNotification)
        this.wokenHook.setMsgNotification(msgNotification)
        //If the smart contract event is a Proposal (<=> eventName ends with 'Proposal'), send it to the appropriate channel
        if (isSmartContractEventProposal(eventName) || isSmartContractEventRole(eventName)) {
          await this.wokenHook.sendNotificationProposal()  
        }
        else {
          await this.wokenHook.sendNotificationEvents()
        }
            
      }

    
    }
  }
  