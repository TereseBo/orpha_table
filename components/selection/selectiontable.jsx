import { DataTable } from "@/components/ui/datatable";
import { Tableheader } from "./tableheader";
import { columns } from "./columns";

import React from 'react';
import useStore from '@/zustandstore/orphastore';
export function SelectionTable() {


    const selectedDiseaseList = useStore((state) => state.selectedDiseaseList);
    return (
        <div>
        <Tableheader/>
        <DataTable columns={columns} data={selectedDiseaseList} />
        </div>
    )
}