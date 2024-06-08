"use client"


export const columns = [
    {
        accessorKey: "orphacode",
        header: "ORPHAcode",
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