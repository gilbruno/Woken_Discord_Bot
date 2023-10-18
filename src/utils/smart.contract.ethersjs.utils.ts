import { Contract } from "@ethersproject/contracts";
import { getAbi } from "./ethers.utils";
import { JsonRpcProvider } from "@ethersproject/providers";


export type tokenNumber = 0 | 1

class EtherJsSmartContractUtils {

    private static FACTORY_CONTRACT_NAME = 'UniswapV2Factory' as const 

    private static UNISWAP_PAIR_CONTRACT_NAME = 'UniswapV2Pair' as const 

    private static ERC20_CONTRACT_NAME = 'IERC20' as const 

    //----------------------------------------------------------------------------------------------------------
    public static getContractFactoryInstance(factoryAddress: string, provider: JsonRpcProvider) {
        //const 
        const factoryAbi = getAbi(this.FACTORY_CONTRACT_NAME)
        // Load the contract
        const contract = new Contract(factoryAddress, factoryAbi, provider);
        return contract
    }

    //----------------------------------------------------------------------------------------------------------
    public static getUniswapPairInstance(uniswapPairAddress: string, provider: JsonRpcProvider) {
        //const 
        const uniswapPairAbi = getAbi(this.UNISWAP_PAIR_CONTRACT_NAME)
        // Load the contract
        const contract = new Contract(uniswapPairAddress, uniswapPairAbi, provider);
        return contract
    }

    //----------------------------------------------------------------------------------------------------------
    public static getERC20Instance(erc20Address: string, provider: JsonRpcProvider) {
        //const JsonRpcProvider
        const erc20Abi = getAbi(this.ERC20_CONTRACT_NAME)
        // Load the contract
        const contract = new Contract(erc20Address, erc20Abi, provider);
        return contract
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getChainName(provider: JsonRpcProvider) {
        try {
            const network = await provider.getNetwork();
            return network.name;
        } catch (error) {
            console.error("Failed to get chain name:", error);
            return undefined;
        }
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getTokenAddress(addressPair: string, tokenNumber: tokenNumber, provider: JsonRpcProvider) {

        let tokenAddress: string
        if (tokenNumber == 0) {
            tokenAddress = await this.getUniswapPairInstance(addressPair, provider).token0()
        }
        else {
            tokenAddress = await this.getUniswapPairInstance(addressPair, provider).token1()
        }
        return tokenAddress
    } 

    //----------------------------------------------------------------------------------------------------------
    public static async getTokenSymbol(tokenAddress: string, provider: JsonRpcProvider) {
        const tokenSymbol = await this.getERC20Instance(tokenAddress, provider).symbol()
        return tokenSymbol
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getPairAdmin(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const pairAdmin = await this.getContractFactoryInstance(factoryAddress, provider).pairAdmin(addressPair)
        return pairAdmin
    }

    //----------------------------------------------------------------------------------------------------------
    public static async isTimekeeperEnabledLP(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const isTimekeeperEnabledLP = await this.getContractFactoryInstance(factoryAddress, provider).isTimekeeperEnabledLP(addressPair)
        return isTimekeeperEnabledLP
    }
    //----------------------------------------------------------------------------------------------------------
    public static async isTimekeeperEnabledLPProposal(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const isTimekeeperEnabledLPProposal = await this.getContractFactoryInstance(factoryAddress, provider).isTimekeeperEnabledLPProposal(addressPair)
        return isTimekeeperEnabledLPProposal
    }
    
    //----------------------------------------------------------------------------------------------------------
    public static async isForceOpen(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const isForceOpen = await this.getContractFactoryInstance(factoryAddress, provider).isForceOpen(addressPair)
        return isForceOpen
    }

    //----------------------------------------------------------------------------------------------------------
    public static async isForceOpenProposal(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const isForceOpenProposal = await this.getContractFactoryInstance(factoryAddress, provider).isForceOpenProposal(addressPair)
        return isForceOpenProposal
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getPairAdminDao(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const pairAdminDao = await this.getContractFactoryInstance(factoryAddress, provider).pairAdminDao(addressPair)
        return pairAdminDao
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getDaysOpenLP(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const daysOpenLP = await this.getContractFactoryInstance(factoryAddress, provider).getDaysOpenLP(addressPair)
        return daysOpenLP
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getDaysOpenLPProposal(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const daysOpenLP = await this.getContractFactoryInstance(factoryAddress, provider).getDaysOpenLPProposal(addressPair)
        return daysOpenLP
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getTimeKeeperPerLp (factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
    const timeKeeperPerLp = await this.getContractFactoryInstance(factoryAddress, provider).TimekeeperPerLp(addressPair)
    return timeKeeperPerLp
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getTimeKeeperPerLpWaitingForApproval (factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const timeKeeperPerLp = await this.getContractFactoryInstance(factoryAddress, provider).TimekeeperPerLpWaitingForApproval(addressPair)
        return timeKeeperPerLp
    }
    
}    

export default EtherJsSmartContractUtils