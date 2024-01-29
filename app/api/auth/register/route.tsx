import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const data = await req.json();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
    ? process.env.NEXT_PUBLIC_API_KEY
    : "";
  // ** recuperation des données du formulaire
  const email = data.email;
  const password = data.password;
  const last_name = data.last_name;
  const first_name = data.first_name;

  const query = await fetch(`${apiUrl}auth/register`, {
    headers: {
      "X-Api-Key": apiKey,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ email, password, last_name, first_name }),
  });

  const result = await query.json();

  return NextResponse.json(result);
}
