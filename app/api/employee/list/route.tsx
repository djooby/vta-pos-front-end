import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
    ? process.env.NEXT_PUBLIC_API_KEY
    : "";

  //? get body data
  const body = await req.json();
  const token = body.token;
  const query = await fetch(`${apiUrl}employee/all_employee`, {
    headers: {
      "X-Api-Key": apiKey,
      Authorization: token,
    },
    cache: "no-store",
    method: "GET",
  });

  const response = await query.json();
  return NextResponse.json(response);
}
