import { DaoFactoryCreateEventArgs, EventMetadata } from "../types/events.js";

export const insertNewDao = async (
    metadata: EventMetadata,
    args: DaoFactoryCreateEventArgs
) => {
    try {
        console.log('inserting dao', metadata, args);
    } catch (error) {
        console.error(
            `Failed to insert DAOFactoryEvent (tx: ${metadata.transactionHash}):`,
            error
        );
    }
}