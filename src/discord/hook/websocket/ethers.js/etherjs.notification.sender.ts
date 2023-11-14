import { Log } from "../../../../logger/log"
import { templates } from "../../../../templates/template"
import { decodeLogs } from "../../../../utils/ethers.utils"
import { WokenHook } from "../../woken.hook"
import { replacementsTemplate } from "../types"
import { buildNotificationText, isSmartContractEventProposal, isSmartContractEventRole, leftPadWithZero, transformBinaryListByDaysOfWeek } from "../../../../utils/utils"
import { CONTRACT_NAME, FORCE_OPEN, FORCE_OPEN_TIMELOCK, PAIR_CREATED, ROLE_PAIR_ADMIN_DAO_REQUESTED, ROLE_PAIR_ADMIN_REQUESTED, TIME_KEEPER_CHANGE, TIME_KEEPER_ENABLE, TIME_KEEPER_ENABLE_PROPOSAL, TIME_KEEPER_PROPOSAL } from "../../../../const/constants"
import EtherJsSmartContractUtils from "../../../../utils/smart.contract.ethersjs.utils"
import { JsonRpcProvider } from "@ethersproject/providers"
import { EventDescriptor } from "./ethersjs.event.handler"


export interface IEthersJsNotificationSender {
    sendNotificationsToDiscordChannel(event: EventDescriptor, blockchainLog: any): Promise<void>
}
  

/**
 * NotificationSender class
 */
export class EthersJsNotificationSender implements IEthersJsNotificationSender {
    constructor(private readonly factoryAddress: string, private readonly provider: JsonRpcProvider, private readonly wokenHook: WokenHook, private readonly log: Log) {}
  
    public async sendNotificationsToDiscordChannel(event: EventDescriptor, blockchainLog: any) {
      const eventName = event.name
      const txHash    = blockchainLog.transactionHash
      const receipt = await this.provider.getTransactionReceipt(txHash);
      // const blockHash = tx.blockHash
      // const logs     = await getLogsByTx(this.alchemy, tx)
      const signerTx  = receipt.from

      const parsedLog = decodeLogs(CONTRACT_NAME, eventName, blockchainLog)
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

      pairAddress = parsedLog.args[0]
      chainName    = await EtherJsSmartContractUtils.getChainName(this.provider)   
      pairAdmin    = await EtherJsSmartContractUtils.getPairAdmin(this.factoryAddress, this.provider, pairAddress)
      pairAdminDao = await EtherJsSmartContractUtils.getPairAdminDao(this.factoryAddress, this.provider, pairAddress)
      
      token0 = await EtherJsSmartContractUtils.getTokenAddress(pairAddress, 0, this.provider)
      token1 = await EtherJsSmartContractUtils.getTokenAddress(pairAddress, 1, this.provider)

      tokenSymbol0 = await EtherJsSmartContractUtils.getTokenSymbol(token0, this.provider)
      tokenSymbol1 = await EtherJsSmartContractUtils.getTokenSymbol(token1, this.provider)
      pairSymbol = tokenSymbol0+'-'+tokenSymbol1


      let replacements: replacementsTemplate = {} 

      if (eventName === TIME_KEEPER_ENABLE_PROPOSAL 
        || eventName === FORCE_OPEN_TIMELOCK 
        || eventName === FORCE_OPEN 
        || eventName === TIME_KEEPER_ENABLE) {
          
          switch (eventName) {
            case FORCE_OPEN :
              boolValue = await EtherJsSmartContractUtils.isForceOpen(this.factoryAddress, this.provider, pairAddress)
              break;
            case FORCE_OPEN_TIMELOCK :
              boolValue = await EtherJsSmartContractUtils.isForceOpenTimelock(this.factoryAddress, this.provider, pairAddress)
              break;
            case TIME_KEEPER_ENABLE :
              boolValue = await EtherJsSmartContractUtils.isTimekeeperEnabledLP(this.factoryAddress, this.provider, pairAddress)
              break;
            case TIME_KEEPER_ENABLE_PROPOSAL :
              boolValue = await EtherJsSmartContractUtils.isTimekeeperEnabledLPProposal(this.factoryAddress, this.provider, pairAddress)
              break;
          }  
          replacements.value = boolValue
      } else if (eventName === TIME_KEEPER_PROPOSAL) {
        const timeKeeperPerLp = await EtherJsSmartContractUtils.getTimeKeeperPerLpWaitingForApproval(this.factoryAddress, this.provider, pairAddress)
        const daysOpenLP      = await EtherJsSmartContractUtils.getDaysOpenLPProposal(this.factoryAddress, this.provider, pairAddress)
        replacements.openingHours   = leftPadWithZero(timeKeeperPerLp.openingHour)
        replacements.openingMinutes = leftPadWithZero(timeKeeperPerLp.openingMinute)
        replacements.closingHours   = leftPadWithZero(timeKeeperPerLp.closingHour)
        replacements.closingMinutes = leftPadWithZero(timeKeeperPerLp.closingMinute)
        replacements.utcOffset      = timeKeeperPerLp.utcOffset
        replacements.isOnlyDay      = timeKeeperPerLp.isOnlyDay
        const daysOpen              = transformBinaryListByDaysOfWeek(daysOpenLP)
        replacements.daysOpen       = daysOpen
      } else if (eventName === TIME_KEEPER_CHANGE) {
        const timeKeeper = await EtherJsSmartContractUtils.getTimeKeeperPerLp(this.factoryAddress, this.provider, pairAddress)
        const daysOpenLP      = await EtherJsSmartContractUtils.getDaysOpenLP(this.factoryAddress, this.provider, pairAddress)
        replacements.openingHours   = leftPadWithZero(timeKeeper.openingHour)
        replacements.openingMinutes = leftPadWithZero(timeKeeper.openingMinute)
        replacements.closingHours   = leftPadWithZero(timeKeeper.closingHour)
        replacements.closingMinutes = leftPadWithZero(timeKeeper.closingMinute)
        replacements.utcOffset      = timeKeeper.utcOffset
        replacements.isOnlyDay      = timeKeeper.isOnlyDay
        const daysOpen              = transformBinaryListByDaysOfWeek(daysOpenLP)
        replacements.daysOpen       = daysOpen
      } else if (eventName === PAIR_CREATED 
        || eventName === ROLE_PAIR_ADMIN_DAO_REQUESTED 
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
  