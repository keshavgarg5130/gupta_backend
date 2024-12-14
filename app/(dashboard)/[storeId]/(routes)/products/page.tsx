import React from 'react'

import prismadb from "@/lib/prismadb";

import {format} from "date-fns";
import {ProductColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/column";
import {ProductClient} from "@/app/(dashboard)/[storeId]/(routes)/products/components/client";
import {formatter} from "@/lib/utils";

const ProductsPage = async ({
    params}:{
    params:{ storeId: string }
}) => {
    const products = await prismadb.product.findMany({
        where:{
            storeId:params.storeId,
        },
        include:{
            category: true,
            currentRating: true,
            poles: true,
        },
        orderBy:{
            createdAt: 'desc'
        }
    });
    const formattedProducts: ProductColumn[] = products.map((item)=>({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        mPrice: formatter.format(item.mPrice.toNumber()),
        price: formatter.format(item.price.toNumber()),
        gstRate: Number(item.gstRate),
        category: item.category.name,
        currentRating: item.currentRating.name,
        poles: item.poles.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy"),

    }))
    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}
export default ProductsPage
