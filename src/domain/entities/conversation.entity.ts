import { IMessageCommons, MessageCommons } from "./message-commons.entity";

export class ConversationEntity {

    readonly isFromMe: boolean;
    readonly messageCommons: IMessageCommons;
    readonly conversation?: string;
    private constructor(
        messageCommons: IMessageCommons,
        isFromMe: boolean,
        conversation?: string,
    ) {
        this.messageCommons = messageCommons;
        this.isFromMe = isFromMe;
        this.conversation = conversation;
    }

    static create(
        id: string,
        isFromMe: boolean,
        messageTimestamp: number,
        remoteJid: string,
        conversation?: string,
        pushName?: string,
    ) {
        return new ConversationEntity(
            new MessageCommons(id, messageTimestamp, remoteJid, pushName),
            isFromMe,
            conversation,
        );
    }

}