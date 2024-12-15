import React from 'react'
import prismadb from "@/lib/prismadb";
import {CategoryColumn} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/column";
import {format} from "date-fns";
import {CategoryClient} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/client";

const CategoriesPage = async ({
    params}:{
    params:{ storeId: string }
}) => {
    const Categories = await prismadb.category.findMany({
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
    const formattedCategories: CategoryColumn[] = Categories.map((item: { id: string; name: string; billboard: { label: string; }; createdAt: string | number | Date; })=>({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    )
}
export default CategoriesPage
