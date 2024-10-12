import { S_WHATSAPP_NET } from "@whiskeysockets/baileys";
import { z } from "zod";

export const ConversationValidation = z.object({

    id: z.string(),
    isFromMe: z.boolean(),
    messageTimestamp: z.number()
        .int() // Asegura que sea un entero
        .min(0, { message: "El timestamp no puede ser negativo" }) // Valor mínimo (1970 en UNIX)
        .max(2147483647, { message: "El timestamp no puede exceder el rango de 2038" }) // Valor máximo (2038)
        .refine(
            (val) => new Date(val * 1000).getTime() > 0, // Multiplicamos por 1000 para convertir a milisegundos
            { message: "El número no parece ser un timestamp válido" }
        ),

    remoteJid: z.string().refine((value) => {
        return value.endsWith(S_WHATSAPP_NET);
    }, {
        message: "El remoteJid debe comenzar con números y terminar con '@s.whatsapp.net'."
    }),

    conversation: z.string().optional(),
    pushName: z.string().optional(),
});