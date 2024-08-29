"use client"

import { Clipboard, ArrowUpDown } from "lucide-react"
import { ActionButtons } from "./actionbuttons"
import { Button } from "@/components/ui/button"

export const columns = [
    {
        accessorKey: "orphacode",
        header: ({ column }) => {

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ORPHAcode
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rowcontent = row.original

            return (
                <div className="flex fler-row gap-2">
                    {rowcontent.orphacode}
                    <div >
                        <Clipboard className="-my-2 hover:bg-sky-700 rounded" onClick={() => navigator.clipboard.writeText(rowcontent.orphacode)} size={16} />
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "referencesICD10",
        header: ({ column }) => {

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ICD-10
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rowcontent = row.original
            const ICD10Arr = rowcontent.referencesICD10.map((ICD10code, index) => {

                return (
                    <div key={rowcontent.ORPHAcode + ICD10code + index}>
                        {ICD10code}
                    </div>
                )

            })

            return (
                <div className="flex flex-col gap-2">
                    {ICD10Arr}
                </div>
            )
        },
    },
    {
        accessorKey: "preferredTerm",
        header: ({ column }) => {

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Preferred name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rowcontent = row.original

            return (
                <div className="flex flex-col gap-2">
                    {rowcontent.preferredTerm}
                </div>
            )
        },
    },
    {
        accessorKey: "synonym",
        header: "Synonyms",
        cell: ({ row }) => {
            const rowcontent = row.original
            const synonymArr = rowcontent.synonyms.map((synonym, index) => {

                return (
                    <div key={rowcontent.ORPHAcode + synonym + index}>
                        {synonym}
                    </div>
                )
            })
            return (
                <div className="flex flex-col gap-2">
                    {synonymArr}
                </div>
            )
        },
    },
    {
        accessorKey: "classificationLevel",
        header: ({ column }) => {
            
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Classification level
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const rowcontent = row.original

            return (
                <div className="flex fler-row gap-2">
                    {rowcontent.classificationLevel}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const rowcontent = row.original

            return (
                <ActionButtons disease={{ ...rowcontent }} />
            )
        },
    },
]