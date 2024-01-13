"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PlayCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDictService } from "@/app/_services/useDictService"

function Dictionary() {
  const searchParams = useSearchParams()
  const dictService = useDictService()

  const { dictionary } = dictService
  const router = useRouter()
  const search = searchParams.get("keyword")

  const handleClickAudio = (item: any) => () => {
    const mdict_player = document.createElement("audio")
    mdict_player.id = "mdict_player"
    mdict_player.src = item.url
    mdict_player.play()
  }

  const handleClickLink = (e: any) => {
    e.preventDefault()
    const word = e.target.text
    if (word) {
      dictService.changeKeyword(word)
      router.push(`?keyword=${word}`)
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    if (search) {
      dictService.changeKeyword(search)
      dictService.search(search)
    } else {
      dictService.search()
    }
    //eslint-disable-next-line
  }, [search])

  return (
    <Card>
      <CardHeader>
        <CardTitle>词典</CardTitle>
      </CardHeader>
      {dictionary && (
        <CardContent onClick={handleClickLink}>
          {dictionary?.forvo?.length > 0 && (
            <div className='mb-2 border-b'>
              <p className='mb-2 text-lg font-semibold'>真人发音</p>
              <div className='-m-1 mb-2 flex flex-wrap items-center'>
                {dictionary?.forvo.map((item: any, index: any) => (
                  <div
                    className='m-1 flex cursor-pointer items-center space-x-2 text-gray-800'
                    onClick={handleClickAudio(item)}
                    key={index}
                  >
                    <PlayCircle width={20} height={20} />
                    <span> {item.user}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            className='shogakukan mb-2 border-b'
            dangerouslySetInnerHTML={{ __html: dictionary?.shogakukan?.definition }}
          />
          <div dangerouslySetInnerHTML={{ __html: dictionary?.weblio?.definition }} />
        </CardContent>
      )}
    </Card>
  )
}

export { Dictionary }
