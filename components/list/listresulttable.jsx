import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import {ListTableheader} from "./listtableheader"

import React from 'react';
import useStore from '@/zustandstore/orphastore';

export function ListResultTable() {

    const searchResultList = useStore((state) => state.searchResultList);
   
    
    
    return (
        <div className="m-2 w-5/6">
            <h1>Search results</h1>
            <ListTableheader/>
            <DataTable columns={columns} data={searchResultList} />
        </div>
    )
}