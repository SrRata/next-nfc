import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const response = await resend.emails.send({
      from: "Sistema <no-reply@jlmbgroup.com>", // dominio de pruebas
      to: "informaticauemffb@gmail.com", 
      subject: "Prueba de Resend",
      html: `
        <h1>Correo de prueba</h1>
        <p>Si estás viendo esto, Resend funciona correctamente 🚀</p>
      `,
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando correo", details: error.message },
      { status: 500 }
    );
  }
}


