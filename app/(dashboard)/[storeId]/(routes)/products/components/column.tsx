"use client"

import { ColumnDef } from "@tanstack/react-table"
import {CellAction} from "@/app/(dashboard)/[storeId]/(routes)/products/components/cell-action";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn= {
    id: string
    name: string
    currentRating: string
    price: string
    poles: string
    isFeatured: boolean
    isArchived: boolean
    gstRate: number
    mPrice: string
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },{
        accessorKey: "mPrice",
        header: "Price",
    },{
        accessorKey: "price",
        header: "Price",
    },{
        accessorKey: "gstRate",
        header: "GST %",
    },{
        accessorKey: "isArchived",
        header: "IsArchived",
    },{
        accessorKey: "isFeatured",
        header: "IsFeatured",
    },{
        accessorKey: "currentRating",
        header: "Current Rating",
    },{
        accessorKey: "poles",
        header: "Poles",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell:({row})=> <CellAction data={row.original}/>
    }

]