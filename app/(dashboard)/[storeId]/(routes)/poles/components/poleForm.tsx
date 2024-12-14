"use client"

import * as z from "zod"
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import { Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";

import { Poles} from "@prisma/client";


const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

type PoleFormValues = z.infer<typeof formSchema>;

interface CurrentRatingFormProps {
    initialData: Poles | null;
}

export const PoleForm: React.FC<CurrentRatingFormProps> = ({initialData})=> {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Poles" : "Add Poles";
    const description = initialData ? "Edit a Poles" : "Add a Poles";
    const toastMessage = initialData ? "Poles Updated." : "Poles Created.";
    const action = initialData ? "Save changes" : "create";

    const form = useForm<PoleFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name:'',
            value:'',
        },
    })

    const onSubmit = async (values:PoleFormValues)=>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/poles/${params.poleId}`, values);
            }else{
            await axios.post(`/api/${params.storeId}/poles`, values);}
            router.refresh()
            router.push(`/${params.storeId}/poles`);
            toast.success(toastMessage)
        }catch(error){
            toast.error("something went wrong");
        }finally{
            setLoading(false);
        }
    }
    const onDelete = async () =>{
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/poles/${params.poleId}`)
            router.refresh()
            router.push('/')
            toast.success("Pole Deleted.");
        }catch{
            toast.error("Make sure you delete all the products with that Pole first");
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
                                    <Input disabled={loading} placeholder='Pole Name' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name='value' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Pole Value' {...field}/>
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