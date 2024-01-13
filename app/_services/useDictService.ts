import { create } from "zustand"
import { useFetch } from "@/app/_helper/useFetch"

const initialState = {
  keyword: "未来",
  dictionary: undefined,
}
const dictStore = create<IDictStore>(() => initialState)

function useDictService(): IDictService {
  const fetch = useFetch()
  const { keyword, dictionary } = dictStore()

  return {
    keyword,
    dictionary,
    search: async (word = keyword) => {
      const data = await fetch.get(`/api/word?keyword=${word}`)
      dictStore.setState({ dictionary: data })
    },
    changeKeyword: (keyword: string) => {
      dictStore.setState({ keyword })
    },
  }
}

interface IDictStore {
  keyword: any
  dictionary?: any
}

interface IDictService extends IDictStore {
  search: (word?: string) => Promise<void>
  changeKeyword: (keyword: string) => void
}

export { useDictService }
