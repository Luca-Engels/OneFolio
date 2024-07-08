import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from "next/image"

type Props = {
  name:string
  imageUrl?:string
  index:number
}

const AdvertCard = (props: Props) => {
  let imgUrl = props.imageUrl
  if(!imgUrl) imgUrl="/OneFolio.png"
  return (
    <div className="w-full h-full">
      <Link href={"https://www.google.com"} className='w-full h-full relative'>
        <Card className='h-full w-full flex flex-col'>
          <CardHeader className="flex xl:items-center items-start justify-center mt-2 z-10 p-0 absolute top-0 xl:right-1/2 transform xl:translate-x-1/2 w-full">
            <div className='bg-primary/50'>
              {props.name!=''&&<CardTitle className='text-center xl:my-2 my-1 mx-4'>{props.name}</CardTitle>}
            </div>
          </CardHeader>
          <CardContent className="flex justify-center p-0 xl:h-full h-full">
            <Image src={imgUrl} width={0} height={0} alt={props.name} sizes="50vh" className='object-cover z-0 w-full h-full rounded-md' />
          </CardContent>
          <CardFooter className='z-10 w-fit p-0 absolute bottom-0'>
            <p className='bg-primary/50 xl:p1 py-0 px-2 text-xs'>Werbung</p>
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
}

export default AdvertCard