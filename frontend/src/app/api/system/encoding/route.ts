import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/system/encoding`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { encoding: "cpu", error: "Could not fetch encoding status" },
        { status: 200 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { encoding: "cpu", error: "Could not reach backend" },
      { status: 200 }
    );
  }
}
