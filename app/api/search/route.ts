import { openDb } from "@/app/_helper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword")

  if (!keyword || keyword === `""`) {
    return NextResponse.json({ message: "请输入关键字" }, { status: 200 })
  }

  const db = await openDb()
  const items = await db.all(
    "SELECT * FROM SHOGAKUKAN_MDX_INDEX where key_text LIKE ?",
    `${keyword}%`
  )

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
}
