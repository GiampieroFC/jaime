import { MessageUpsertType, proto, WAMessage } from "@whiskeysockets/baileys";
import { ConversationEntity } from "../../domain/entities/conversation.entity";
import { ConversationValidation } from "../../validations/conversation.validation";
import { DeletedEntity } from "../../domain/entities/deleted.entity";
import { DeletedValidation } from "../../validations/deleted.validation";

interface Arg {
    messages: WAMessage[];
    type: MessageUpsertType;
    requestId?: string;
}



export class MessageMapper {

    // private static isMediaMessage(message: any): boolean {
    //     return (
    //         !!message.message?.imageMessage ||
    //         !!message.message?.videoMessage ||
    //         !!message.message?.audioMessage ||
    //         !!message.message?.stickerMessage
    //     );
    // }

    private static isConversation(arg: Arg): boolean {
        return !!arg.messages[0].message?.conversation;
    }

    private static isDeleted(arg: Arg): boolean {
        return arg.messages[0].message?.protocolMessage?.type === proto.Message.ProtocolMessage.Type.REVOKE;
    }

    public static createMessage(arg: Arg) {

        if (this.isConversation(arg)) {
            return this.createConversation(arg);
        }

        if (this.isDeleted(arg)) {
            return this.createDeleted(arg);
        }

        console.error("🔴 Not supported messate yet:", arg);
        return;
    }

    private static createDeleted(arg: Arg): DeletedEntity {
        const data = {
            id: arg.messages[0].key.id,
            messageTimestamp: arg.messages[0].messageTimestamp,
            remoteJid: arg.messages[0].key.remoteJid,
            deletedMessageId: arg.messages[0].message?.protocolMessage?.key?.id,
            pushName: arg.messages[0].pushName,
        };
        const validatedData = DeletedValidation.safeParse(data);
        if (!validatedData.success) {
            console.error(validatedData.error.errors);
            throw new Error(validatedData.error.message);
        }
        return DeletedEntity.create(
            validatedData.data.id,
            validatedData.data.messageTimestamp,
            validatedData.data.remoteJid,
            validatedData.data.deletedMessageId,
            validatedData.data.pushName,
        );
    }

    private static createConversation(arg: Arg): ConversationEntity {

        const data = {
            id: arg.messages[0].key.id,
            isFromMe: arg.messages[0].key.fromMe,
            messageTimestamp: arg.messages[0].messageTimestamp,
            remoteJid: arg.messages[0].key.remoteJid,
            conversation: arg.messages[0].message?.conversation,
            pushName: arg.messages[0].pushName,
        };

        const validatedData = ConversationValidation.safeParse(data);

        if (!validatedData.success) {
            console.error(validatedData.error.errors);
            throw new Error(validatedData.error.message);
        }

        return ConversationEntity.create(
            validatedData.data.id,
            validatedData.data.isFromMe,
            validatedData.data.messageTimestamp,
            validatedData.data.remoteJid,
            validatedData.data.conversation,
            validatedData.data.pushName,
        );

    }
}