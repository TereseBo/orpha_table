"use client"

import { SearchBox } from "@/components/searchbox"
import React from 'react'
import { ResultsTable } from "@/components/result/resultstable"
import { SelectionTable } from "@/components/selection/selectiontable"
import { Toaster } from 'react-hot-toast'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4">
      <Toaster />
      <SearchBox />
      <ResultsTable />
      <SelectionTable />

    </main>
  );
}
