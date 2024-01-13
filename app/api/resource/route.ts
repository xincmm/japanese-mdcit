import { openDb, readDict } from "@/app/_helper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword")
  const index = req.nextUrl.searchParams.get("index")

  if (!keyword || keyword === `""`) {
    return NextResponse.json({ message: "请输入关键字" }, { status: 200 })
  }

  const db = await openDb()
  const forvoIndex = await db.get(`SELECT * FROM ${index} where key_text = ?`, keyword)

  if (forvoIndex) {
    const fname = `${process.cwd()}/${process.env.DICT_DIRECTORY}/${forvoIndex.fname}`

    const { definition } = readDict({ ...forvoIndex, fname })

    return new Response(definition, {
      headers: { "Content-Type": "audio/mp3" },
      status: 200,
    })
  }
}
