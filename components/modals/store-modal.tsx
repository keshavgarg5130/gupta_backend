"use client"

import React, {useCallback, useState} from 'react'
import {Modal} from "@/components/ui/modal";

import {useStoreModal} from "@/hooks/use-store-modal";
import * as z from"zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1),
})
export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name:"",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post('api/stores', values)
            toast.success("store created successfully.")
            window.location.assign(`/${response.data.id}`)
        }catch(error){
            toast.error("Something went wrong")
        }finally{
            setLoading(false)
        }

    }
    return (
    <Modal
    title='create store'
    description='add a new store '
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}>
        <div>
            <div className='space-y-4 pb-4 py-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='e-commerce' {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                                   name="name"
                                   control={form.control} />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button disabled={loading} variant='outline' onClick={storeModal.onClose}>Cancel</Button>
                            <Button disabled={loading} type='submit' >Continue</Button>
                        </div>
                    </form>
                </Form>

            </div>
        </div>
    </Modal>
    )
}

