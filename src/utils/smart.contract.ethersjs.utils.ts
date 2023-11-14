import { Contract } from "@ethersproject/contracts";
import { getAbi } from "./ethers.utils";
import { JsonRpcProvider, Network, getNetwork } from "@ethersproject/providers";
import { ChainInfo } from "../discord/hook/websocket/types";


export type tokenNumber = 0 | 1

class EtherJsSmartContractUtils {

    public static FACTORY_CONTRACT_NAME = 'WokenFactory' as const 

    private static UNISWAP_PAIR_CONTRACT_NAME = 'WokenPair' as const 

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
    public static getAllChains(): ChainInfo[] {
        const predefinedChains = [1, 5].map((id): ChainInfo => {
            const network: Network = getNetwork(id);
            return {
                chainName: network.name,
                chainId: network.chainId
            };
        });
    
        const customChains: ChainInfo[] = [
            { chainName: "BSC Mainnet", chainId: 56 },
            { chainName: "BSC Testnet", chainId: 97 },
            { chainName: "Optimism Mainnet", chainId: 10 },
            { chainName: "Optimism Testnet", chainId: 69 },
            { chainName: "Arbitrum Mainnet", chainId: 42161 },
            { chainName: "Arbitrum Testnet", chainId: 421611 },
            { chainName: "Fantom Mainnet", chainId: 250 },
            { chainName: "Fantom Testnet", chainId: 4002 },
            // Note: The chain IDs for "Base" are placeholders; you'll need to replace them.
            { chainName: "Base Mainnet", chainId: -1 },
            { chainName: "Base Testnet", chainId: -2 }
        ];
    
        return [...predefinedChains, ...customChains];
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
    public static async isForceOpenTimelock(factoryAddress: string, provider: JsonRpcProvider, addressPair: string) {
        const isForceOpenTimelock = await this.getContractFactoryInstance(factoryAddress, provider).isForceOpenTimelock(addressPair)
        return isForceOpenTimelock
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