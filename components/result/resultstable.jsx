import { DataTable } from "@/components/ui/datatable";

import { columns } from "./columns";

import React from 'react';
import useStore from '@/zustandstore/orphastore';
export function ResultsTable() {


    const searchResultList = useStore((state) => state.searchResultList);
    return (
        <DataTable columns={columns} data={searchResultList} />
    )
}