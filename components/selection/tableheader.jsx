import { Input } from "@/components/ui/input"
import useStore from '@/zustandstore/orphastore'
import writeXlsxFile from 'write-excel-file'
import { headerStyle, schema } from "./excelschema/schema"
import { useState } from "react"
import { getDateString } from "@/utils/getDateString"
import toast from 'react-hot-toast';

export function Tableheader() {
    const selectedDiseaseList = useStore((state) => state.selectedDiseaseList);
    const [heading, setHeading] = useState("")

    function validateDownload() {
        if (selectedDiseaseList.length === 0) {
            toast.error('No selected diseases to download')
            return false
        }
        return true
    }
    function handleHeaderChange(e) {
        setHeading(e.target.value)
    }

    async function printDataExcel() {

        if (!validateDownload()) return

        try {
            await writeXlsxFile(selectedDiseaseList, {
                schema,
                headerStyle,
                fileName: heading === "" ? 'orphalist_' + getDateString() + '.xlsx' : heading + '_' + getDateString() + '.xlsx',
                stickyRowsCount: 1,
                sheet: heading === "" ? 'codeList' : heading + ''
            })

            toast.success('Excel file created')

        } catch (error) {
            toast.error('Something went wrong creating excel file')
        }
    }

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
            <h1>Selected Diseases</h1>
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