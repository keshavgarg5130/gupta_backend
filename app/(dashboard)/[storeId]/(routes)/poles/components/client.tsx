"use client"

import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";
import {PoleColumn} from "@/app/(dashboard)/[storeId]/(routes)/poles/components/column";
import {columns} from "@/app/(dashboard)/[storeId]/(routes)/poles/components/column";

interface PoleClientProps{
    data: PoleColumn[]
}
export const PolesClient: React.FC<PoleClientProps> = ({
    data
                                                                }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between ">
                <Heading title={`Poles [${data.length}]`} description="Manage poles for your products." />
                <Button
                onClick={()=>router.push(`/${params.storeId}/poles/new`) }><Plus className='mr-2 h-4 w-4'/>Add new</Button>
            </div>
            <Separator/>
            <DataTable searchKey='name'  columns={columns} data={data}/>
            <Heading title="API" description="Api calls for Poles" />
            <Separator/>
            <ApiList entityName='poles' entityIdName='poleId'/>
        </>
    )
}