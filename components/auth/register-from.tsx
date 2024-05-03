"use client"
import React, { useState, useTransition } from "react"
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


export const RegisterForm = () => {
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
            city:"",
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
        <CardWrapper headerLabel="Account erstellen!" backButtonLabel="Mit vorhandenem Account anmelden" backButtonHref="/auth/login">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <FormField control={form.control} name="firstname" render={({field})=>(
                            <FormItem>
                                <FormLabel className="p-2 pb-1 flex flex-row gap-2">Vorname <p className="text-red-500">*</p></FormLabel>
                                <FormControl className=" border-def rounded-lg">
                                    <Input {...field} disabled={isPending} placeholder="Max" className="text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)} />
                            <FormField control={form.control} name="lastname" render={({field})=>(
                            <FormItem>
                            <FormLabel className="p-2 pb-1 flex flex-row gap-2">Nachname <p className="text-red-500">*</p></FormLabel>
                                <FormControl className=" border-def rounded-lg">
                                    <Input {...field} disabled={isPending} placeholder="Mustermann" className="text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)} />
                            <FormField control={form.control} name="street" render={({field})=>(
                            <FormItem>
                            <FormLabel className="p-2 pb-1 flex flex-row gap-2">Addresse</FormLabel>
                                <FormControl className=" border-def rounded-lg">
                                    <Input {...field} disabled={isPending} placeholder="Musterstraße 31" className="text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)} />
                            <FormField control={form.control} name="city" render={({field})=>(
                            <FormItem>
                            <FormLabel className="p-2 pb-1 flex flex-row gap-2">Wohnort</FormLabel>
                                <FormControl className=" border-def rounded-lg">
                                    <Input {...field} disabled={isPending} placeholder="12345 Musterstadt" className="text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)} />
                        </div>
                        <FormField control={form.control} name="country" render={({field})=>(
                            <FormItem>
                            <FormLabel className="p-2 pb-1 flex flex-row gap-2">Heimatland</FormLabel>
                                <FormControl className=" border-def rounded-lg">
                                    <Input {...field} disabled={isPending} placeholder="Deutschland" className="text-black" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)} />
                        <FormField control={form.control} name="phone" render={({field})=>(
                            <FormItem>
                            <FormLabel className="p-2 pb-1 flex flex-row gap-2">Telefonnummer</FormLabel>
                                <FormControl className=" border-def rounded-lg">
                                    <Input {...field} disabled={isPending} placeholder="+49 123 123456789" className="text-black" />
                                </FormControl>
                            <FormMessage />
                        </FormItem>)} />
                        <FormField control={form.control} name="email" render={({field})=>(
                        <FormItem>
                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">E-Mail <p className="text-red-500">*</p></FormLabel>
                            <FormControl className=" border-def rounded-lg">
                                <Input {...field} disabled={isPending} placeholder="Mustermann@example.com" type="email" className="text-black" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)} />
                        <FormField control={form.control} name="password" render={({field})=>(
                        <FormItem>
                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">Password <p className="text-red-500">*</p></FormLabel>
                            <FormControl className=" border-def rounded-lg">
                                <Input {...field} disabled={isPending} placeholder="********" type="password" className="text-black" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)} />
                        <FormField control={form.control} name="passwordConfirm" render={({field})=>(
                        <FormItem>
                        <FormLabel className="p-2 pb-1 flex flex-row gap-2">Password bestätigen <p className="text-red-500">*</p></FormLabel>
                            <FormControl className=" border-def rounded-lg">
                                <Input {...field} disabled={isPending} placeholder="********" type="password" className="text-black" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)} />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} className="btn-nav w-full " type="submit">
                        Account erstellen
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}