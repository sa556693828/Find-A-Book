import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    // const PersonaModel = await getPersonaModel();
    const client = await clientPromise;
    const db = client.db("MarketingAgent");

    const { searchParams } = new URL(req.url);
    const getAllPersona = searchParams.get("getAllPersona");

    if (getAllPersona) {
      const personas = await db.collection("persona").find({}).toArray();

      return NextResponse.json({
        success: true,
        personas: personas,
      });
    }

    return NextResponse.json({
      success: false,
      error: "缺少必要參數",
    });
  } catch (error: unknown) {
    console.error("API錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取persona資料失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
