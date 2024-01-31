import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
    ? process.env.NEXT_PUBLIC_API_KEY
    : "";

  //? get body data
  const body = await req.json();
  const token = body.token;
  const category_name = body.category_name;
  const query = await fetch(`${apiUrl}category/add_category`, {
    headers: {
      "X-Api-Key": apiKey,
      Authorization: token,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ category_name: category_name }),
  });

  const response = await query.json();
  return NextResponse.json(response);
}
