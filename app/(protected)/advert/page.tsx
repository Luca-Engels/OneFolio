'use server'
import {Table} from '@/components/addInvestment/Table'
import AdvertUpload from '@/components/addsBar/AdvertUpload'
import { Input } from '@/components/ui/input'
import { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "OneFolio | Hinzufügen",
    description: "Fügen sie jetzt ihre Investments manuell, mittels Excel oder simple über ihre Bank hinzu",
  }
}

async function Adverts(props:{params:{},searchParams:{[key:string]:any}}) {
  //* useful props to automatically implement in the list are: Summe, Währung, Name, Beschreibung, date

  return (
    <main className="h-full w-full flex flex-col gap-8 items-center justify-start pb-2 px-4 xl:py-0">
        <h1 className={"h1"}>Werbungen Erstellen</h1>
        <div className="flex w-full h-[100%] border-def bg-sec xl:flex-row gap-y-4 flex-col rounded-md xl:overflow-hidden overflow-y-auto p-4">
          <AdvertUpload/>
        </div>
    </main>
  )
}

export default Adverts