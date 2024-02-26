import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
    ? process.env.NEXT_PUBLIC_API_KEY
    : "";

  //? get body data
  const body = await req.json();
  const token = body.token;
  const id_sub_category = body.id_sub_category;
  const query = await fetch(`${apiUrl}category/delete_sub_category`, {
    headers: {
      "X-Api-Key": apiKey,
      Authorization: token,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ id_sub_category: id_sub_category }),
  });

  const response = await query.json();
  return NextResponse.json(response);
}
