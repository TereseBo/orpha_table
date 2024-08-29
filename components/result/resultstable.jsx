import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";

import React from 'react';
import useStore from '@/zustandstore/orphastore';

export function ResultsTable() {

    const searchResultList = useStore((state) => state.searchResultList);
    
    return (
        <div className="m-2 w-5/6">
            <h1>Search results</h1>
            <DataTable columns={columns} data={searchResultList} />
        </div>
    )
}