"use client"

import { ColumnDef } from "@tanstack/react-table"
import {CellAction} from "@/app/(dashboard)/[storeId]/(routes)/currentRating/components/cell-action";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CurrentRatingColumn= {
    id: string
    name: String
    value: string
    createdAt: string
}

export const columns: ColumnDef<CurrentRatingColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },{
        accessorKey: "value",
        header: "Value",
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