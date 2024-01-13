import { Nav, Search, Dictionary } from "@/app/_components"

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <Nav />
      <div className='container mx-auto flex flex-1 flex-col py-5 md:max-w-5xl'>
        <Search />
        <Dictionary />
      </div>
    </main>
  )
}
