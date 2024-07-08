'use client'
import React, { ChangeEvent, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

type Props = {}

const AdvertUpload = (props: Props) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const [title, setTitle] = useState("")


    const onChangeImage = (e:ChangeEvent<HTMLInputElement>) => {
        if(imageRef && imageRef.current){
            imageRef.current.src= URL.createObjectURL(e.target.files![0])
        }
    }
    const onChangeTitel = (e:ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    return (
    <div className='flex flex-row gap-2 w-full h-full'>
        <div className='basis-1/2 flex flex-col gap-2'>
            <Input type='text' placeholder='Titel'className='h-fit' onChange={onChangeTitel}/>
            <Input type='file' accept="image/gif, image/jpeg, image/png" className='h-fit' onChange={onChangeImage}/>
            <Input type='text' placeholder='URL'className='h-fit'/>
            <Input type='submit' placeholder='Hochladen' /> 
        </div>
        <div className='flex flex-col h-[100%] w-[14vw] '>
            <h2 className='h2'>Vorschau:</h2>
            <div className='relative w-full h-full'>
                <Card className='flex flex-col w-full h-full'>
                    <CardHeader className="flex items-center justify-center max-w-full mt-2 z-10 p-0 absolute top-0 right-1/2 transform translate-x-1/2 w-full">
                        <div className='bg-primary/50'>
                            {title!=''&&<CardTitle className='xl:py-2 py-1 px-4 text-center' >{title}</CardTitle>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center p-0 xl:h-full h-full">
                        <Image ref={imageRef} src={''} width={0} height={0} alt={''} sizes="50vh" className='object-cover z-0 w-full h-full rounded-md' />
                    </CardContent>
                    <CardFooter className='z-10 w-fit p-0 absolute bottom-0'>
                        <p className='bg-primary/50 xl:p1 py-0 px-2 text-xs'>Werbung</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
    )
}





export default AdvertUpload