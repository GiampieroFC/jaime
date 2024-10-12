export interface IMessageCommons {
    id: string;
    messageTimestamp: number;
    remoteJid: string;
    pushName?: string;
}


export class MessageCommons implements IMessageCommons {
    readonly id: string;
    readonly messageTimestamp: number;
    readonly remoteJid: string;
    readonly pushName?: string;

    constructor(
        id: string,
        messageTimestamp: number,
        remoteJid: string,
        pushName?: string,
    ) {
        this.id = id;
        this.messageTimestamp = messageTimestamp;
        this.remoteJid = remoteJid;
        this.pushName = pushName;
    }

}