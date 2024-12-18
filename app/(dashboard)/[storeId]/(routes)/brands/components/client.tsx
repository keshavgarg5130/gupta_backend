"use client"

import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";

import {columns} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/column";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";

import {BrandColumn} from "@/app/(dashboard)/[storeId]/(routes)/brands/components/column";

interface BrandClientProps{
    data: BrandColumn[]
}
export const BrandClient: React.FC<BrandClientProps> = ({
    data
                                                                }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between ">
                <Heading title={`Brands [${data.length}]`} description="Manage brands ." />
                <Button
                onClick={()=>router.push(`/${params.storeId}/brands/new`) }><Plus className='mr-2 h-4 w-4'/>Add new</Button>
            </div>
            <Separator/>
            <DataTable searchKey='name'  columns={columns} data={data}/>
            <Heading title="API" description="Api calls for brands" />
            <Separator/>
            <ApiList entityName='brands' entityIdName='brandId'/>
        </>
    )
}