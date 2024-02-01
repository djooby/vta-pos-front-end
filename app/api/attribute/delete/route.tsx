import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
    ? process.env.NEXT_PUBLIC_API_KEY
    : "";

  //? get body data
  const body = await req.json();
  const token = body.token;
  const id_product_attribute = body.id_product_attribute;
  const query = await fetch(`${apiUrl}product/delete_product_attribute`, {
    headers: {
      "X-Api-Key": apiKey,
      Authorization: token,
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ id_product_attribute: id_product_attribute }),
  });

  const response = await query.json();
  return NextResponse.json(response);
}
