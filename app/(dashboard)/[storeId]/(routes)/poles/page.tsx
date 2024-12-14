import React from 'react'

import prismadb from "@/lib/prismadb";

import {format} from "date-fns";
import {PoleColumn} from "@/app/(dashboard)/[storeId]/(routes)/poles/components/column";
import {PolesClient} from "@/app/(dashboard)/[storeId]/(routes)/poles/components/client";


const PolesPage = async ({
    params}:{
    params:{ storeId: string }
}) => {
    const poles = await prismadb.poles.findMany({
        where:{
            storeId:params.storeId,
        },
        orderBy:{
            createdAt: 'desc'
        }
    });
    const formattedCurrentRatings: PoleColumn[] = poles.map((item)=>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <PolesClient data={formattedCurrentRatings} />
            </div>
        </div>
    )
}
export default PolesPage
