"use client"

import { SunIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

function Nav() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex flex-row items-center justify-between md:max-w-5xl'>
        <a
          href='/'
          className='flex items-center text-2xl font-bold text-zinc-800 no-underline hover:no-underline lg:text-4xl'
        >
          <h1>Japanese Mdict</h1>
        </a>
        <nav>
          <Button variant='outline' size='icon'>
            <SunIcon className='h-4 w-4' />
          </Button>
        </nav>
      </div>
    </header>
  )
}

export { Nav }
