"use client"

import { ListUpload} from '@/components/list/listupload'
import React from 'react'
import {ListResultTable} from "@/components/list/listresulttable"
import { Toaster } from 'react-hot-toast'

export default function ListPage() {

    //TODO: Add functionality to export list result data
    //TODO: Update columns to display all data after backend updates are complete

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4">
      <Toaster />
      <ListUpload />
      <ListResultTable />
    </main>
  );
}
