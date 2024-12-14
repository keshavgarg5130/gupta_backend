import React from 'react'

import prismadb from "@/lib/prismadb";

import {format} from "date-fns";
import {CurrentRatingColumn} from "@/app/(dashboard)/[storeId]/(routes)/currentRating/components/column";
import {CurrentRatingClient} from "@/app/(dashboard)/[storeId]/(routes)/currentRating/components/client";

const CurrentRatingPage = async ({
    params}:{
    params:{ storeId: string }
}) => {
    const currentRatings = await prismadb.currentRating.findMany({
        where:{
            storeId:params.storeId,
        },
        orderBy:{
            createdAt: 'desc'
        }
    });
    const formattedCurrentRatings: CurrentRatingColumn[] = currentRatings.map((item)=>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CurrentRatingClient data={formattedCurrentRatings} />
            </div>
        </div>
    )
}
export default CurrentRatingPage
