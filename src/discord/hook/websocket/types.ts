export type AlchemyLogTransaction = {
    blockNumber: number,
    blockHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    data: string,
    topics: string[],
    transactionHash: string,
    logIndex: number
}