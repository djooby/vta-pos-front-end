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

  const query = await fetch(`${apiUrl}auth/login`, {
    headers: {
      "X-Api-Key": apiKey,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const result = await query.json();

  return NextResponse.json(result);
}
