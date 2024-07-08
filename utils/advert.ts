"use server"
import {createAdvert} from "@/utils/db"
import * as z from "zod"
import { advertSchema } from "@/utils/zod"

export const addAdvert = async (values: z.infer<typeof advertSchema>,userId:string)=> {
    const validatedFields = advertSchema.safeParse(values)

    if(!validatedFields.success){
        return {error: "Es gab einen Fehler!"}
    }   
    const { image,link,title}= validatedFields.data
    await createAdvert({
        advertiser:userId,
        title: title,
        link: link,
        image: image
    });

    return {success: "JETZT ANMELDEN!"}
}