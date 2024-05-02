import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
    ? process.env.NEXT_PUBLIC_API_KEY
    : "";

  //? get body data
  const body = await req.json();
  const token = body.token;
  const id_payment = body.id_payment;
  const query = await fetch(`${apiUrl}payment/delete_payment`, {
    headers: {
      "X-Api-Key": apiKey,
      Authorization: token,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ id_payment: id_payment }),
  });

  const response = await query.json();
  return NextResponse.json(response);
}
