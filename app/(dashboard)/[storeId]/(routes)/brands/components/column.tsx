"use client"

import { ColumnDef } from "@tanstack/react-table"
import {CellAction} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/cell-action";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BrandColumn= {
    id: string
    name: string
    billboardLabel: string
    createdAt: string
}

export const columns: ColumnDef<BrandColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "billboard",
        header: "Billboard",
        cell:({row})=>row.original.billboardLabel
    },{
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell:({row})=> <CellAction data={row.original}/>
    }

]