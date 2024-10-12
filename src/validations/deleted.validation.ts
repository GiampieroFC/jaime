import { S_WHATSAPP_NET } from "@whiskeysockets/baileys";
import { object, string, number } from "zod";

export const DeletedValidation = object({

    id: string(),
    messageTimestamp: number()
        .int()
        .min(0, { message: "El timestamp no puede ser negativo" })
        .max(2147483647, { message: "El timestamp no puede exceder el rango hasta el año 2038" })
        .refine(
            // TODO: mejorar esta validación, además no puede ser una fecha futura
            (val) => new Date(val * 1000).getTime() > 0,
            { message: "El número no parece ser un timestamp válido" }
        ),

    remoteJid: string().refine((value) => {
        return value.endsWith(S_WHATSAPP_NET);
    }, {
        message: "El remoteJid debe comenzar con números y terminar con '@s.whatsapp.net'."
    }),
    deletedMessageId: string(),
    pushName: string().optional(),
});