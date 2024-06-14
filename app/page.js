"use client"

import { SearchBox } from "@/components/searchbox";
import { DataTable } from "@/components/datatable";
import { columns } from "@/components/columns";
import React from 'react';
import useStore from '@/zustandstore/orphastore';

export default function Home() {


  const searchResultList = useStore((state) => state.searchResultList);
  const selectedDiseaseList = useStore((state) => state.selectedDiseaseList);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-400">
      <SearchBox/>
      <DataTable columns={columns} data={searchResultList}/>


    </main>
  );
}
