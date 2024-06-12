"use client"
import { useState } from "react";

import { SearchBox } from "@/components/searchbox";
import { DataTable } from "@/components/datatable";
import { columns } from "@/components/columns";

export const diseases = [
  {
    orphacode: "ORPHA:166024",
    icd10: "Q87.1",
    name: "Albinism-deafness syndrome",
  },
  {
    orphacode: "ORPHA:166024",
    icd10: "Q87.1",
    name: "Albinism-deafness syndrome",
  },
];


export default function Home() {

  const [searchResults, setSearchResults] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-400">
      <SearchBox setSearchResults={setSearchResults}/>
      <DataTable columns={columns} data={searchResults}/>


    </main>
  );
}
