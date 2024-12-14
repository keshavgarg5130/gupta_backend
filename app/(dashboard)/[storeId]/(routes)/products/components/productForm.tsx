"use client"

import * as z from "zod"
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import { Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image_upload";
import {Category, CurrentRating, Image, Poles, Product} from "@prisma/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";


const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string().min(1),}).array(),
    price: z.coerce.number().min(1),
    mPrice: z.coerce.number().min(1),
    gstRate: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    currentRatingId: z.string().min(1),
    polesId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {images: Image[]}| null;
    categories : Category[];
    currentRating: CurrentRating[];
    poles: Poles[];
}

export const ProductForm: React.FC<ProductFormProps> = ({initialData,categories,currentRating,poles})=> {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit product" : "Add product";
    const description = initialData ? "Edit a product" : "Add a product";
    const toastMessage = initialData ? "Product Updated." : "Product Created.";
    const action = initialData ? "Save changes" : "create";

    const form = useForm<ProductFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
            mPrice: parseFloat(String(initialData?.price)),
            gstRate: parseFloat(String(initialData?.price))
        } : {
            name:'',
            images:[],
            price:0,
            mPrice:0,
            gstRate:18,
            categoryId:'',
            currentRatingId:'',
            polesId:'',
            isFeatured: false,
            isArchived: false,
        },
    })

    const onSubmit = async (values:ProductFormValues)=>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
            }else{
            await axios.post(`/api/${params.storeId}/products`, values);}
            router.refresh()
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`);
            toast.success("Product Deleted.");
        }catch{
            toast.error("Something Went Wrong");
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    // @ts-ignore
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
                    <FormField name='images' control={form.control} render={({field}) => (
                        <FormItem>
                            <FormLabel> Images </FormLabel>
                            <FormControl>
                                <ImageUpload
                                    disabled={loading}
                                    onChange={(url) => {
                                        field.onChange([...(field.value || []), { url }]); // Ensure `url` is wrapped in an object
                                    }}
                                    onRemove={(url) => {
                                        field.onChange((field.value || []).filter((current) => current.url !== url)); // Safeguard for `undefined`
                                    }}
                                    value={(field.value || []).map((images) => images.url)} // Default to an empty array
                                />

                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField name='name' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Product Name' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name='mPrice' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>MRP</FormLabel>
                                <FormControl>
                                    <Input type='number' disabled={loading} placeholder='Product MRP' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name='price' control={form.control} render={({field}) => (
                        <FormItem>
                            <FormLabel>Sale Price</FormLabel>
                            <FormControl>
                                <Input type='number' disabled={loading} placeholder='Sale Price' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                        <FormField name='gstRate' control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>GST RATE(%)</FormLabel>
                                <FormControl>
                                    <Input type='number' disabled={loading} placeholder='18' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name="categoryId" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Categories</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange}
                                            defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category)=>(
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name="currentRatingId" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Current Rating</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange}
                                            defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a Current Rating" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currentRating.map((currentRating)=>(
                                                <SelectItem key={currentRating.id} value={currentRating.id}>
                                                    {currentRating.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name="polesId" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Poles</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange}
                                            defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a Pole" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {poles.map((poles)=>(
                                                <SelectItem key={poles.id} value={poles.id}>
                                                    {poles.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField name='isFeatured' control={form.control} render={({field}) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Featured
                                    </FormLabel>
                                    <FormDescription>This product will appear on the home page.</FormDescription>
                                </div>
                            </FormItem>
                        )}/>
                        <FormField name='isArchived' control={form.control} render={({field}) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Archived
                                    </FormLabel>
                                    <FormDescription>This product will not appear anywhere on the website.</FormDescription>
                                </div>
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