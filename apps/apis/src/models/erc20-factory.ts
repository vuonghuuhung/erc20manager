import { ERC20FactoryCreateEventArgs, EventMetadata } from "../types/events.js";

export const insertNewERC20 = async (metadata: EventMetadata, args: ERC20FactoryCreateEventArgs) => {
    try {
        // console.log('inserting erc20', metadata, args);
    } catch (error) {
        console.error(
            `Failed to insert ERC20FactoryEvent (tx: ${metadata.transactionHash}):`,
            error
        );
    }
}
