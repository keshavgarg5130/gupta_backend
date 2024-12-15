"use client"

import * as z from "zod"
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



import {CurrentRating} from "@prisma/client";


const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

type CurrenRatingFormValues = z.infer<typeof formSchema>;

interface CurrentRatingFormProps {
    initialData: CurrentRating | null;
}

export const CurrentRatingForm: React.FC<CurrentRatingFormProps> = ({initialData})=> {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Current Rating" : "Add Current Rating";
    const description = initialData ? "Edit a Current Rating" : "Add a Current Rating";
    const toastMessage = initialData ? "Current Rating Updated." : "Current Rating Created.";
    const action = initialData ? "Save changes" : "create";

    const form = useForm<CurrenRatingFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name:'',
            value:'',
        },
    })

    const onSubmit = async (values:CurrenRatingFormValues)=>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/currentRating/${params.currentRatingId}`, values);
            }else{
            await axios.post(`/api/${params.storeId}/currentRating`, values);}
            router.refresh()
            router.push(`/${params.storeId}/currentRating`);
            toast.success(toastMessage)
        }catch(error){
            console.log(error)
            toast.error("something went wrong");
        }finally{
            setLoading(false);
        }
    }
    const onDelete = async () =>{
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/currentRating/${params.currentRatingId}`)
            router.refresh()
            router.push('/')
            toast.success("CurrentRating Deleted.");
        }catch{
            toast.error("Make sure you delete all the products with that currentRating first");
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>
            <AlertModal isOpen={open} onClose={()=>setOpen(false)} loading={loading} onConfirm={onDelete}/>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description}/>
                {initialData && (<Button disabled={loading} variant='destructive' size='icon' onClick={() => setOpen(true)}>
                    <Trash className='h-4 w-4'/>
                </Button>)}

            </div>

            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField name='name' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Current Rating Name' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name='value' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Current Rating Value' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit' >
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
              </>
    )
}