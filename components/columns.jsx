"use client"
import { CopyIcon } from "lucide-react"
import { Clipboard } from "lucide-react"

export const columns = [
    {
        accessorKey: "orphacode",
        header: "ORPHAcode",
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
        accessorKey: "icd10",
        header: "ICD-10",
    },
    {
        accessorKey: "name",
        header: "Prefered name",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const rowcontent = row.original

            return (
                <div>
                    <button
                        onClick={() => navigator.clipboard.writeText(rowcontent.orphacode)}
                        className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded"
                    >
                        X
                    </button>
                </div>
            )
        },
    },
]