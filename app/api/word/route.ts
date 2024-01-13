import { openDb, readDict, parseForvo } from "@/app/_helper"
import { NextRequest, NextResponse } from "next/server"

type DictIndex = {
  fname: string
  type: string
  key_text: string
  start_offset: number
  comp_size: number
  record_start: number
  record_end: number
}

export async function GET(req: NextRequest) {
  let keyword = req.nextUrl.searchParams.get("keyword")

  if (!keyword || keyword === `""`) {
    return NextResponse.json({ message: "请输入关键字" }, { status: 200 })
  }

  const result: any = {
    forvo: [],
  }

  const db = await openDb()

  let shogakukanIndex: DictIndex | undefined = await db.get(
    "SELECT * FROM SHOGAKUKAN_MDX_INDEX WHERE key_text = ?",
    keyword
  )

  if (shogakukanIndex) {
    const fname = `${process.cwd()}/${process.env.DICT_DIRECTORY}/${shogakukanIndex.fname}`
    const shogakukan = readDict({ ...shogakukanIndex, fname })
    const definition = shogakukan.definition as string
    if (definition.startsWith("@@@LINK")) {
      const word = definition.split("=")[1].replaceAll("\n\x00", "")
      keyword = word
      shogakukanIndex = await db.get(
        "SELECT * FROM SHOGAKUKAN_MDX_INDEX WHERE key_text = ?",
        keyword
      )
      if (shogakukanIndex) {
        result.shogakukan = readDict({ ...shogakukanIndex, fname })
      }
    } else {
      result.shogakukan = shogakukan
    }
    result.shogakukan.definition = result.shogakukan.definition.replaceAll(
      '<link rel="stylesheet" type="text/css" href="Shogakukanjcv3.css">\n',
      ""
    )
  }

  const forvoIndexList: DictIndex[] | undefined = await db.all(
    "SELECT * FROM FORVO_MDX_INDEX WHERE key_text = ?",
    keyword
  )

  if (forvoIndexList && forvoIndexList.length > 0) {
    const fname = `${process.cwd()}/${process.env.DICT_DIRECTORY}/${forvoIndexList[0].fname}`

    forvoIndexList.forEach(function (forvoIndex) {
      result.forvo.push(parseForvo(readDict({ ...forvoIndex, fname })))
    })
  }

  const weblioIndex: DictIndex | undefined = await db.get(
    "SELECT * FROM WEBLIO_MDX_INDEX WHERE key_text = ?",
    keyword
  )

  if (weblioIndex) {
    const fname = `${process.cwd()}/${process.env.DICT_DIRECTORY}/${weblioIndex.fname}`
    result.weblio = readDict({ ...weblioIndex, fname })
    result.weblio.definition = result.weblio.definition.replaceAll(
      '<link rel="stylesheet" type="text/css" href="thesaurus.css">',
      ""
    )
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
}
