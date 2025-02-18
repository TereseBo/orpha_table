import { Input } from "@/components/ui/input"
import useStore from '@/zustandstore/orphastore'
import writeXlsxFile from 'write-excel-file'
import { headerStyle, schema } from "./excelschema/schema"
import { useState } from "react"
import { getDateString } from "@/utils/getDateString"
import toast from 'react-hot-toast';

export function ListTableheader() {
    const diseaseList = useStore((state) => state.searchResultList);
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

    async function printDataExcel() {

        if (!validateDownload()) return

        try {
            let listSchema =listHeader.map((item=>{
                return(
                    {
                        column: item,
                        type: String,
                        value: disease => disease[item],
                
                        //Cell styling
                        width: 10,
                        fontSize: 12,
                        alignVertical: 'center',
                        align: 'center',
                
                    }
                )
            }))

            console.log(diseaseList)

                await writeXlsxFile(diseaseList.map(row=>{return[...row]}), {
                    listSchema,
                    headerStyle,
                    fileName: heading === "" ? 'orphalist_mapping' + getDateString() + '.xlsx' : heading + '_' + getDateString() + '.xlsx',
                    stickyRowsCount: 1,
                    sheet: heading === "" ? 'mappedList' : heading + ''
                })

            toast.success('Excel file created')

        } catch (error) {
            console.log(error)
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