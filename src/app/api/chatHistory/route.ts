import { NextRequest, NextResponse } from "next/server";
// import { getHistoryModel } from "@/models/History";
import clientPromise from "@/lib/mongodb";
export async function GET(req: NextRequest) {
  try {
    // const HistoryModel = await getHistoryModel();
    const client = await clientPromise;
    const db = client.db("MarketingAgent");
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const personaId = searchParams.get("personaId");

    if (userId && personaId) {
      const userHistory = await db
        .collection("User_History_queryAgent")
        .findOne({ user_id: userId, persona_id: personaId });
      if (!userHistory) {
        return NextResponse.json({
          success: true,
          userMessages: [],
        });
      }
      return NextResponse.json({
        success: true,
        userMessages: userHistory.messages,
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
        error: "獲取聊天紀錄失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    // 從 URL 參數中獲取 userId 和 personaId
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const personaId = searchParams.get("personaId");

    if (!userId || !personaId) {
      return NextResponse.json({
        success: false,
        error: "缺少必要參數",
      });
    }

    const client = await clientPromise;
    const db = client.db("MarketingAgent");
    const result = await db.collection("User_History_queryAgent").deleteOne({
      user_id: userId,
      persona_id: personaId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: "找不到要刪除的記錄",
      });
    }

    return NextResponse.json({
      success: true,
      message: "聊天記錄已成功刪除",
    });
  } catch (error) {
    console.error("刪除聊天記錄時發生錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        error: "刪除聊天記錄失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
