import { getAvailableProviders } from "@/lib/ai/providers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const providers = getAvailableProviders();
    return NextResponse.json({ providers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get available providers" },
      { status: 500 }
    );
  }
}
