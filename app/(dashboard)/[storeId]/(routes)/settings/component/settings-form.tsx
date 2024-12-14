"use client"

import * as z from "zod"
import {Store} from "@prisma/client";
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import { Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Fragment, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({initialData})=> {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const origin = useOrigin();
    const router = useRouter();

    const form = useForm<SettingsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData,
    })

    const onSubmit = async (values:SettingsFormValues)=>{
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, values);
            router.refresh()
            toast.success("Successfully updated stores")
        }catch(error){
            toast.error("something went wrong");
        }finally{
            setLoading(false);
        }
    }
    const onDelete = async () =>{
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
        }catch{
            toast.error("Make sure you delete all the products and categories first");
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>
            <AlertModal isOpen={open} onClose={()=>setOpen(false)} loading={loading} onConfirm={onDelete}/>

        <div className='flex items-center justify-between'>
            <Heading title='Settings' description='manage store settings'/>
            <Button disabled={loading} variant='destructive' size='icon' onClick={()=> setOpen(true)}>
                <Trash className='h-4 w-4'/>
            </Button>
        </div>
        <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField name='name' control={form.control} render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='store name' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit' >
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title={`${origin}/api/${params.storeId}`} description='test' variant="public"/>
        </>
    )
}