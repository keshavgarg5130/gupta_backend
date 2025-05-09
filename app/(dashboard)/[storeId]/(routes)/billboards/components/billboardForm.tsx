"use client"

import * as z from "zod"
import {Billboard} from "@prisma/client";
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


import ImageUpload from "@/components/ui/image_upload";


const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({initialData})=> {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Billboard" : "Add Billboard";
    const description = initialData ? "Edit a Billboard" : "Add a Billboard";
    const toastMessage = initialData ? "Billboard Updated." : "Billboard Created.";
    const action = initialData ? "Save changes" : "create";

    const form = useForm<BillboardFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label:'',
            imageUrl:'',
        },
    })

    const onSubmit = async (values:BillboardFormValues)=>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
            }else{
            await axios.post(`/api/${params.storeId}/billboards`, values);}
            router.refresh()
            router.push(`/${params.storeId}/billboards`);
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push('/')
            toast.success("Billboard Deleted.");
        }catch{
            toast.error("Make sure you delete the billboard first");
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
                    <FormField name='imageUrl' control={form.control} render={({field}) => (
                        <FormItem>
                            <FormLabel>Billboard Image</FormLabel>
                            <FormControl>
                                <ImageUpload onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")} disabled={loading} value={field.value ? [field.value] : []}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField name='label' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Bilboard Name' {...field}/>
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