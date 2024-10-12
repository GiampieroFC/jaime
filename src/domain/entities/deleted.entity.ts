import { IMessageCommons, MessageCommons } from "./message-commons.entity";

export class DeletedEntity {

    readonly deletedMessageId: string;
    readonly messageCommons: IMessageCommons;

    private constructor(
        messageCommons: IMessageCommons,
        deletedMessageId: string,

    ) {
        this.messageCommons = messageCommons;
        this.deletedMessageId = deletedMessageId;
    }

    static create(
        id: string,
        messageTimestamp: number,
        remoteJid: string,
        deletedMessageId: string,
        pushName?: string,
    ) {
        return new DeletedEntity(
            new MessageCommons(id, messageTimestamp, remoteJid, pushName),
            deletedMessageId,
        );
    }

}