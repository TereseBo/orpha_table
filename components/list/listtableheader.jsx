import { Input } from "@/components/ui/input"
import useStore from '@/zustandstore/orphastore'
import writeXlsxFile from 'write-excel-file'
import { useState } from "react"
import { getDateString } from "@/utils/getDateString"
import {headerStyle} from "@/components/selection/excelschema/schema"
import toast from 'react-hot-toast';

export function ListTableheader() {
    const diseaseList = useStore((state) => state.listResultList);
    const listHeader = useStore((state) => state.listHeader);
    const [heading, setHeading] = useState("")

    function validateDownload() {
        if (diseaseList.length === 0) {
            toast.error('No selected diseases to download')
            return false
        }
        return true
    }
    function handleHeaderChange(e) {
        setHeading(e.target.value)
    }

    //TODO: Fix excel formatting
    //This function uses write-excel-file to print the diseaselist with mappings to excel
    async function printDataExcel() {

        if (!validateDownload()) return

        try {
            let excelList = createFileData()

            await writeXlsxFile(excelList, {
                // listSchema,
                headerStyle,
                fileName: heading === "" ? 'orphalist_mapping' + getDateString() + '.xlsx' : heading + '_' + getDateString() + '.xlsx',
                //stickyRowsCount: 1,
                sheet: heading === "" ? 'mappedList' : heading + ''
            })

            toast.success('Excel file created')

        } catch (error) {
            toast.error('Something went wrong creating excel file')
        }
    }

    function createFileData() {
        let excelData = []

        //Restructure disease data to the format expected by write-excel-file
        diseaseList.forEach(item => {

            let excelRow = []
            for (const [key, value] of Object.entries(item)) {
    
                if (!isNaN(key)) {
                    excelRow[Number(key)] = { value: value }
                }
            }
            excelRow = [...excelRow, { value: item.orphacode }, { value: item.preferredTerm }, { value: item.referencesICD10.toString()}, item.originalIndex ]
            excelData.push([...excelRow])
        })

        //Sort data by original index to ensure order in output file matches order in input file
        excelData.sort((a, b) => a[-1] - b[-1] )

        //Create data for header row of excel
        let excelHeader = []
        for (const [key, value] of Object.entries(listHeader)) {
       
            if (!isNaN(key)) {
                excelHeader[Number(key)] = { value: value }
            }
        }

        excelHeader = [...excelHeader, { value: listHeader.orphacode }, { value: listHeader.preferredTerm }, { value: listHeader.referencesICD10.toString() }]

        //Add header first in data
        excelData.unshift([...excelHeader])
        
        //Return disease data, including header in format expected by write-excel-file
        return excelData

    }

    //TODO: Update this function
    async function printDataJSON() {

        if (!validateDownload()) return

        try {
            const jsonString = `data:application/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(selectedDiseaseList, null, '\t')
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = heading === "" ? 'orphalist_' + getDateString() + '.json' : heading + '_' + getDateString() + '.json'
            link.target = '_blank'
            link.click();

            toast.success('JSON file created')

        } catch (error) {
            toast.error('Something went wrong creating JSON file')
        }
    }

    return (
        <>
            <h1>Diseases mapped to uploaded list</h1>
            <div className="rounded-md border-x border-t px-2 pt-2 pb-4 -mb-2">
                <div className="flex flex-rowcontent-center my-2">
                    <label className="text-nowrap self-center" htmlFor="input">File name:</label>
                    <Input onChange={handleHeaderChange} className="mx-4 rounded" type="text" id="input" />

                </div>
                <div className="flex flex-rowcontent-center my-2 gap-2">
                    <button className="bg-sky-700 text-white rounded px-2" onClick={printDataExcel}>Download Excel</button>
                    <button className="bg-sky-700 text-white rounded px-2" onClick={printDataJSON}>Download JSON</button>
                </div>
            </div>
        </>
    )
}