import zlib from "zlib"
import BufferList from "bl"
import { readChunkSync } from "read-chunk"

const pako: any = {}
pako.inflate = zlib.inflateSync

const UTF_8_DECODER = new TextDecoder("utf-8")

type Params = {
  fname: string
  type: string
  key_text: string
  start_offset: number
  comp_size: number
  record_start: number
  record_end: number
}

export function readDict({
  fname,
  type,
  key_text,
  start_offset,
  comp_size,
  record_start,
  record_end,
}: Params) {
  const rbCompBuff = readChunkSync(fname, { length: comp_size, startPosition: start_offset })
  const rbCompType = new BufferList(rbCompBuff.slice(0, 4))

  let recordBlock

  if (rbCompType.toString("hex") === "00000000") {
    recordBlock = rbCompBuff.slice(8, rbCompBuff.length)
  } else {
    let blockBufDecrypted = null
    blockBufDecrypted = rbCompBuff.slice(8, rbCompBuff.length)
    recordBlock = pako.inflate(blockBufDecrypted)
  }

  recordBlock = new BufferList(recordBlock)

  const data = recordBlock.slice(record_start, record_end)
  if (type === "mdd") {
    return { word: key_text, definition: data }
  }
  return { word: key_text, definition: UTF_8_DECODER.decode(data) }
}
