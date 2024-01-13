import { parse } from "node-html-parser"

type Param = {
  word: string
  definition: any
}

function parseForvo({ word, definition }: Param) {
  const root = parse(definition)
  const attributes = root.querySelector("a")?.attributes

  if (attributes?.href) {
    const { href } = attributes
    const url = href.split("//")[1]
    const user = url.split("/")[1]
    return {
      word,
      user,
      url: `/api/resource?keyword=\\${url.replaceAll("/", "\\")}&index=FORVO_MDD_INDEX`,
    }
  }
  return {}
}

export { parseForvo }
