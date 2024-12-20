import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("tazze_user");

    const { searchParams } = new URL(req.url);
    const getAllUserIds = searchParams.get("getAllUserIds");

    if (getAllUserIds) {
      try {
        const users = await db
          .collection("basic")
          .find({})
          .project({ _id: 0, user_id: 1 })
          .toArray();
        const userIds = users.map((user) => user.user_id);
        const sortedUserIds = userIds.sort();
        const priorityUserIds = [
          "yehxuanyow@gmail.com",
          "elizachi",
          "FB1341554725",
          "GL039001235087290920",
        ];
        const finalUserIds = [
          ...priorityUserIds,
          ...sortedUserIds.filter((id) => !priorityUserIds.includes(id)),
        ];
        return NextResponse.json({
          success: true,
          users: finalUserIds,
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "獲取users data失敗",
          details: error instanceof Error ? error.message : "未知錯誤",
        });
      }
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
        error: "獲取users data失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
