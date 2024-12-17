import React from 'react'
import prismadb from "@/lib/prismadb";

import {format} from "date-fns";

import {BrandColumn} from "@/app/(dashboard)/[storeId]/(routes)/brands/components/column";
import {BrandClient} from "@/app/(dashboard)/[storeId]/(routes)/brands/components/client";

const BrandsPage = async ({
    params}:{
    params:{ storeId: string }
}) => {
    const brands = await prismadb.brand.findMany({
        where:{
            storeId:params.storeId,
        },
        include:{
            billboard: true,
        },
        orderBy:{
            createdAt: 'desc'
        }
    });
    const formattedBrands: BrandColumn[] = brands.map((item: { id: string; name: string; billboard: { label: string; }; createdAt: string | number | Date; })=>({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BrandClient data={formattedBrands} />
            </div>
        </div>
    )
}
export default BrandsPage
