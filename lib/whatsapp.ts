import twilio from "twilio";

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage(
    phone: string,
    message: string
) {
    try {

        const response = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${phone}`,
            body: message,
        });

        console.log("WhatsApp enviado:", response.sid);

        return {
            success: true,
            sid: response.sid,
        };

    } catch (error) {

        console.error("Error enviando WhatsApp:", error);

        return {
            success: false,
            error,
        };
    }
}


export function normalizePhone(phone: string) {

    phone = phone.replace(/\s+/g, "");

    if (phone.startsWith("0")) {
        return `+593${phone.substring(1)}`;
    }

    return phone;
}