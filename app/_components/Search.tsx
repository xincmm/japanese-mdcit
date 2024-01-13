"use client"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDictService } from "@/app/_services/useDictService"

function Search() {
  const router = useRouter()
  const dictService = useDictService()

  const { keyword = "" } = dictService

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword !== "") router.push(`?keyword=${keyword}`)
  }

  return (
    <div className='mx-auto h-16 w-full'>
      <div className='flex w-full items-center space-x-4'>
        <Input
          value={keyword}
          onKeyDown={handleKeyDown}
          onChange={(e) => dictService.changeKeyword(e.target.value)}
          placeholder='请输入关键字'
        />
        <Button type='submit' onClick={() => router.push(`?keyword=${keyword}`)}>
          搜索
        </Button>
      </div>
    </div>
  )
}

export { Search }
