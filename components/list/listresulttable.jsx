import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import {ListTableheader} from "./listtableheader"

import React from 'react';
import useStore from '@/zustandstore/orphastore';

export function ListResultTable() {

    const listResultList = useStore((state) => state.listResultList);
   
    
    
    return (
        <div className="m-2 w-5/6">
            <ListTableheader/>
            <DataTable columns={columns} data={listResultList} />
        </div>
    )
}