import { AlchemyProvider, Contract } from "alchemy-sdk";
import { getAbi } from "./ethers.utils";


export type tokenNumber = 0 | 1

class SmartContractUtils {

    private static FACTORY_CONTRACT_NAME = 'UniswapV2Factory' as const 

    private static UNISWAP_PAIR_CONTRACT_NAME = 'UniswapV2Pair' as const 

    private static ERC20_CONTRACT_NAME = 'IERC20' as const 

    //----------------------------------------------------------------------------------------------------------
    public static getContractFactoryInstance(factoryAddress: string, provider: AlchemyProvider) {
        //const 
        const factoryAbi = getAbi(this.FACTORY_CONTRACT_NAME)
        // Load the contract
        const contract = new Contract(factoryAddress, factoryAbi, provider);
        return contract
    }

    //----------------------------------------------------------------------------------------------------------
    public static getUniswapPairInstance(uniswapPairAddress: string, provider: AlchemyProvider) {
        //const 
        const uniswapPairAbi = getAbi(this.UNISWAP_PAIR_CONTRACT_NAME)
        // Load the contract
        const contract = new Contract(uniswapPairAddress, uniswapPairAbi, provider);
        return contract
    }

    //----------------------------------------------------------------------------------------------------------
    public static getERC20Instance(erc20Address: string, provider: AlchemyProvider) {
        //const 
        const erc20Abi = getAbi(this.ERC20_CONTRACT_NAME)
        // Load the contract
        const contract = new Contract(erc20Address, erc20Abi, provider);
        return contract
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getChainName(provider: AlchemyProvider) {
        let chainName = '';
        try {
            const chainId = (await provider.getNetwork()).chainId;
            let chainName = '';
    
            switch (chainId) {
                case 1:
                    chainName = 'Ethereum Mainnet';
                    break;
                case 3:
                    chainName = 'Ropsten Testnet';
                    break;
                case 4:
                    chainName = 'Rinkeby Testnet';
                    break;
                case 42:
                    chainName = 'Kovan Testnet';
                    break;
                case 5:
                    chainName = 'Goerli Testnet';
                    break;
                case 137:
                    chainName = 'Polygon Mainnet';
                    break;
                case 80001:
                    chainName = 'Polygon Testnet (Mumbai)';
                    break;
                case 42161:
                    chainName = 'Arbitrum Mainnet';
                    break;
                case 421611:
                    chainName = 'Arbitrum Testnet';
                    break;
                case 250:
                    chainName = 'Fantom Opera Mainnet';
                    break;
                case 4002:
                    chainName = 'Fantom Opera Testnet';
                    break;
                default:
                        chainName = 'Unknown';
                } 
        } catch (error) {
            console.error('Error fetching blockchain name:', error);
        }         
        return chainName  
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getTokenAddress(addressPair: string, tokenNumber: tokenNumber, provider: AlchemyProvider) {

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
    public static async getTokenSymbol(tokenAddress: string, provider: AlchemyProvider) {
        const tokenSymbol = await this.getERC20Instance(tokenAddress, provider).symbol()
        return tokenSymbol
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getPairAdmin(factoryAddress: string, provider: AlchemyProvider, addressPair: string) {
        const pairAdmin = await this.getContractFactoryInstance(factoryAddress, provider).pairAdmin(addressPair)
        return pairAdmin
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getDaysOpenLP(factoryAddress: string, provider: AlchemyProvider, addressPair: string) {
        const daysOpenLP = await this.getContractFactoryInstance(factoryAddress, provider).getDaysOpenLP(addressPair)
        return daysOpenLP
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getDaysOpenLPProposal(factoryAddress: string, provider: AlchemyProvider, addressPair: string) {
        const daysOpenLP = await this.getContractFactoryInstance(factoryAddress, provider).getDaysOpenLPProposal(addressPair)
        return daysOpenLP
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getTimeKeeperPerLp (factoryAddress: string, provider: AlchemyProvider, addressPair: string) {
    const timeKeeperPerLp = await this.getContractFactoryInstance(factoryAddress, provider).TimekeeperPerLp(addressPair)
    return timeKeeperPerLp
    }

    //----------------------------------------------------------------------------------------------------------
    public static async getTimeKeeperPerLpWaitingForApproval (factoryAddress: string, provider: AlchemyProvider, addressPair: string) {
        const timeKeeperPerLp = await this.getContractFactoryInstance(factoryAddress, provider).TimekeeperPerLpWaitingForApproval(addressPair)
        return timeKeeperPerLp
    }
    
}    

export default SmartContractUtils