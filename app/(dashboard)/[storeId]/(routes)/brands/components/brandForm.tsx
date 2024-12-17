"use client"

import * as z from "zod"
import {Billboard, Brand} from "@prisma/client";
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


import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";



const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
})

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
    initialData: Brand | null;
    billboards: Billboard[];
}

export const BrandForm: React.FC<BrandFormProps> = ({initialData, billboards})=> {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Brand" : "Add Brand";
    const description = initialData ? "Edit a Brand" : "Add a Brand";
    const toastMessage = initialData ? "Brand Updated." : "Brand Created.";
    const action = initialData ? "Save changes" : "create";

    const form = useForm<BrandFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData || {
           name: '',
           billboardId: '',
        },
    })

    const onSubmit = async (values:BrandFormValues)=>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/brands/${params.brandId}`, values);
            }else{
            await axios.post(`/api/${params.storeId}/brands`, values);}
            router.refresh()
            router.push(`/${params.storeId}/brands`);
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
            await axios.delete(`/api/${params.storeId}/brands/${params.brandId}`)
            router.refresh()
            router.push('/')
            toast.success("Brand Deleted.");
        }catch{
            toast.error("Make sure you delete the brands first");
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
                        <FormField name="name" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Brand Name' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name="billboardId" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a Billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboards)=>(
                                                <SelectItem key={billboards.id} value={billboards.id}>
                                                    {billboards.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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