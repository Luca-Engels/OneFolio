"use client"
import React, { useEffect, useState, useTransition } from "react"
import { CardWrapper } from "./CardWrapper"
import {useForm} from "react-hook-form"
import * as z from "zod"
import { signUpSchema } from "@/utils/zod"

import {zodResolver} from "@hookform/resolvers/zod"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { register } from "@/utils/register"
import { useRouter } from "next/navigation";


export const RegisterForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            firstname:"",
            lastname:"",
            street:"",
            streetnumber:"",
            city:"",
            zip:"",
            country:"",
            phone:"",
        }
    })
    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
        setError("")
        setSuccess("")
        startTransition(()=> {
            register(values).then(data=>{
                setError(data.error)
                setSuccess(data.success)
            })
        })
    }
    return (
        <CardWrapper className="w-[800px] " headerLabel="Erstellen Sie jetzt ihren OneFolio Account!" backButtonLabel="Mit vorhandenem Account anmelden" backButtonHref="/auth/login">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-8">
                            <div>
                                <div className="grid grid-cols-2 gap-x-4">
                                    <FormField control={form.control} name="firstname" render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">Vorname <p className="text-destructive">*</p></FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="Max" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />
                                    <FormField control={form.control} name="lastname" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Nachname <p className="text-destructive">*</p></FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="Mustermann" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />
                                </div>
                                <FormField control={form.control} name="email" render={({field})=>(
                                <FormItem>
                                <FormLabel className="p-2 pb-1 flex flex-row gap-2">E-Mail <p className="text-destructive">*</p></FormLabel>
                                    <FormControl className=" border-def rounded-lg">
                                        <Input {...field} disabled={isPending} placeholder="Mustermann@example.com" type="email"  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)} />
                                <FormField control={form.control} name="password" render={({field})=>(
                                <FormItem>
                                <FormLabel className="p-2 pb-1 flex flex-row gap-2">Password <p className="text-destructive">*</p></FormLabel>
                                    <FormControl className=" border-def rounded-lg">
                                        <Input {...field} disabled={isPending} placeholder="********" type="password"  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)} />
                                <FormField control={form.control} name="passwordConfirm" render={({field})=>(
                                <FormItem>
                                <FormLabel className="p-2 pb-1 flex flex-row gap-2">Password bestätigen <p className="text-destructive">*</p></FormLabel>
                                    <FormControl className=" border-def rounded-lg">
                                        <Input {...field} disabled={isPending} placeholder="********" type="password"  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)} />
                            </div>
                            <div>
                                
                            <div className="grid grid-cols-2 gap-x-4">
                                    <FormField control={form.control} name="street" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Straße</FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="Musterstraße"  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />
                                    <FormField control={form.control} name="streetnumber" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Hausnr.</FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="31a"  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />
                                    <FormField control={form.control} name="zip" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Plz.</FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="12345"  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />
                                    <FormField control={form.control} name="city" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Wohnort</FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="Musterstadt"  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />

                            </div>
                                <FormField control={form.control} name="phone" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Telefonnummer</FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="+49 123 123456789"  />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>)} />
                                <FormField control={form.control} name="country" render={({field})=>(
                                    <FormItem>
                                    <FormLabel className="p-2 pb-1 flex flex-row gap-2">Land</FormLabel>
                                        <FormControl className=" border-def rounded-lg">
                                            <Input {...field} disabled={isPending} placeholder="Deutschland"  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)} />
                            </div>
                        </div>
                    </div>
                    <FormError message={error}  href="/auth/login"/>
                    <FormSuccess message={success} href="/auth/login"/>
                    <Button disabled={isPending} className="btn-nav w-full " type="submit">
                        Account erstellen
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}