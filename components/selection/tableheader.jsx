import { Input } from "@/components/ui/input"
import useStore from '@/zustandstore/orphastore'
import writeXlsxFile from 'write-excel-file'
import { headerStyle, schema } from "./excelschema/schema";
import Link from 'next/link'


export function Tableheader() {
    const selectedDiseaseList = useStore((state) => state.selectedDiseaseList);
    function handleHeaderChange(e) {
        console.log(e.target.value)
    }

    async function printDataExcel() {
        console.log("print data")

   

        await writeXlsxFile(selectedDiseaseList, {
            schema,
            headerStyle,
            fileName: 'file.xlsx',
            stickyRowsCount: 1
          })
    }

    
    return (
        <>
            <h1>Selected Diseases</h1>
            <div className="rounded-md border p-2 ">

                <div className="flex flex-rowcontent-center my-2">
                    <label className="text-nowrap self-center" htmlFor="input">Table header:</label>
                    <Input onChange={handleHeaderChange} className="mx-4 rounded" type="text" id="input" />
                    
                </div>
                <div  className="flex flex-rowcontent-center my-2 gap-2">
                <button className="bg-sky-700 text-white rounded px-2" onClick={printDataExcel}>Download Excel</button>
                <Link className="bg-sky-700 text-white rounded px-2" href={'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedDiseaseList, null, '\t'))} download='file' target="_blank">Download JSON</Link>
                </div>
            </div>
        </>
    )
}