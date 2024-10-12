import { Boom } from "@hapi/boom";
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { MessageMapper } from "../infrastructure/mappers/message.mapper";

export async function connectToWhatsApp() {


    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket(
        {
            // can provide additional config here
            printQRInTerminal: true,
            auth: state
        }
    );

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {

        const { connection, lastDisconnect } = update;

        if (connection === 'close') {

            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ ' + 'connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {

            console.log('💠 ' + 'opened connection');
        }
    });


    sock.ev.on('messages.upsert', async m => {

        const msg = MessageMapper.createMessage(m);
        console.log(msg);
        // TODO: implementar los entidades MEDIA para descargar los archivos
    });

}