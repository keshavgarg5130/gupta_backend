"use client"

import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";
import {columns, CurrentRatingColumn} from "@/app/(dashboard)/[storeId]/(routes)/currentRating/components/column";

interface CurrentRatingClientProps{
    data: CurrentRatingColumn[]
}
export const CurrentRatingClient: React.FC<CurrentRatingClientProps> = ({
    data
                                                                }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between ">
                <Heading title={`Current Rating [${data.length}]`} description="Manage current rating for your products." />
                <Button
                onClick={()=>router.push(`/${params.storeId}/currentRating/new`) }><Plus className='mr-2 h-4 w-4'/>Add new</Button>
            </div>
            <Separator/>
            <DataTable searchKey='name'  columns={columns} data={data}/>
            <Heading title="API" description="Api calls for CurrentRating" />
            <Separator/>
            <ApiList entityName='currentRating' entityIdName='CurrentRatingId'/>
        </>
    )
}