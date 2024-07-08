'use client'
import React, { ChangeEvent, FormEvent, useRef, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Label } from '@radix-ui/react-dropdown-menu'
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { useForm } from 'react-hook-form'
import { advertSchema } from '@/utils/zod'
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { addAdvert } from '@/utils/advert'
import { useSession } from 'next-auth/react'


type Props = {}

const AdvertUpload = (props: Props) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const imageRefSmall = useRef<HTMLImageElement>(null)
    const imageCardRef = useRef<HTMLDivElement>(null)
    const imageCardRefSmall = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState<string>("")
    //get session
    const { data: session , status } = useSession();
    const form = useForm<z.infer<typeof advertSchema>>({
        resolver: zodResolver(advertSchema),
        defaultValues: {
            title: "",
            link: "",
            image:undefined,
        }
    })


    const onChangeImage = (e:ChangeEvent<HTMLInputElement>) => {
        if(imageRef && imageRef.current && imageRefSmall && imageRefSmall.current){
            const url = URL.createObjectURL(e.target.files![0])
        
            imageRef.current.src= url
            imageRefSmall.current.src = url
        }
    }
    const onChangeTitle = (e:ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    const onChangeSwitch = (e:boolean) => {
        imageCardRef.current?.classList.toggle('hidden')
        imageCardRef.current?.classList.toggle('flex')
        imageCardRefSmall.current?.classList.toggle('hidden')
        imageCardRefSmall.current?.classList.toggle('flex')
        console.log("OnChange")
    }
    if(!session || !session.user){
        return <div>Bitte einloggen</div>
    }
    const onSubmit = (values: z.infer<typeof advertSchema>) => {
        setError("")
        setSuccess("")
        startTransition(()=> {
            addAdvert(values,session.user!.id!).then(data=>{
                setError(data.error)
                setSuccess(data.success)
            })
        })
    }
    return (
    <div className='flex xl:flex-row flex-col gap-2 w-full h-full'>
        <div className='basis-1/2 flex flex-col gap-2'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name={'image'}  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">Vorname <p className="text-destructive">*</p></FormLabel>
                        <FormControl className=" border-def rounded-lg">
                            <Input {...field} type='file' accept="image/gif, image/jpeg, image/png" disabled={isPending} onChange={onChangeImage} value=""/>
                        </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>
                <FormField control={form.control} name={'title'}  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">Titel <p className="text-destructive">*</p></FormLabel>
                        <FormControl className=" border-def rounded-lg" onChange={onChangeTitle}>
                            <Input {...field} disabled={isPending}  type='text' placeholder='Werbung'className='h-fit'/>
                        </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>
                <FormField control={form.control} name={'link'}  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">URL <p className="text-destructive">*</p></FormLabel>
                        <FormControl className=" border-def rounded-lg">
                            <Input {...field} disabled={isPending}  type='text' placeholder='https://onefolio.de' className='h-fit'/>
                        </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>                
                <FormError message={error}  href="/auth/login"/>
                <FormSuccess message={success} href="/auth/login"/>
                <Button disabled={isPending} className="w-full mt-8" type="submit">
                    Werbung erstellen
                </Button>
            </form>
        </Form>
        </div>
        <div className='flex-col w-full h-full basis-1/2'>
            <h2 className='h2'>Vorschau:</h2>
            <div className='flex-row flex gap-2'>
                <Switch onCheckedChange={onChangeSwitch}/>
                <Label className={"text-medium font-semibold"}>Desktop | Mobile</Label>
            </div>
            <div className='flex xl:flex-row flex-col h-[70vh] w-full gap-2'>
                <Card className='flex-col w-full h-[15vh] relative hidden' ref={imageCardRef}>
                    <CardHeader className="flex items-start justify-center mt-2 z-10 p-0 absolute top-0 transform w-full">
                        <div className='bg-primary/50'>
                            {title!=''&&<CardTitle className='py-1 px-4 text-left' >{title}</CardTitle>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center p-0 xl:h-full h-full">
                        <Image ref={imageRefSmall} src={''} width={0} height={0} alt={''} sizes="50vh" className='object-cover z-0 w-full h-full rounded-md' />
                    </CardContent>
                    <CardFooter className='z-10 w-fit p-0 absolute bottom-0'>
                        <p className='bg-primary/50 py-0 px-2 text-xs'>Werbung</p>
                    </CardFooter>
                </Card>
                <Card className='flex flex-col w-[15vw] h-full relative' ref={imageCardRefSmall}>
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