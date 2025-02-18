import { useState } from "react"
import readXlsxFile from 'read-excel-file'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import useStore from '@/zustandstore/orphastore'
import toast from 'react-hot-toast';


export function ListUpload() {
    //TODO: Add functionality to handle search by ORPHAcode list
    //TODO: Add validation for fileformat and contents

    const [searchMode, setSearchMode] = useState("icd10")
    const [file, setFile] = useState(null)
    const [column, setColumn] = useState(null)
    const [headerRow, setHeaderRow] = useState(true)

    const setSearchResultList = useStore((state) => state.setSearchResultList)
    const setListHeader = useStore((state) => state.setListHeader)

    function handleSearchModeChange(e) {
        setSearchMode(e.target.value)
    }

    function handleColumnChange(e) {
        setColumn(e.target.value)
    }

    function handleFileChange(e) {
        setFile(e.target.files[0])
    }

    function validateInput() {

        if (file === null || column === null) {
            toast.error('Please add a file and enter the column where code data to map is found')
            return false
        }
        return true
    }


    async function getData() {
        setSearchResultList([])
        setListHeader([])

        if (!validateInput()) {
            return;
        }

        let body = {}

        try {
            let inputData = await readXlsxFile(file); // Wait for read of file

            // Create body containing file and input data
            body = { values: [...inputData], searchMode: searchMode, column: column, headerRow: headerRow };
        } catch (error) {
            toast.error("File could not be read. Please make sure it is in xlsx format and contains one code per cell");
            return; // End if file could not be read
        }

        try {
            // Fetch data from api
            const response = await fetch(`/api/list/${searchMode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.status === 200) {
                toast.success("Success!");
                if (headerRow) {
                    const header = data.shift()
                    setListHeader(header)
                }
                setSearchResultList(data)
            }

            if (data.message) {
                toast.error(data.message); // Toast message from backend if present
                return;
            }

        } catch (error) {
            setSearchResultList([]);
            toast.error('Something went wrong, please try again later');
        }
    }

    function submitHandler(e) {
        e.preventDefault();
    }

    return (
        <form className="bg-white rounded p-2" id="searchbox" name="searchbox" data-testid="searchbox" onSubmit={submitHandler}>
            <div className="flex flex-row" >
                <div className="flex flex-col mx-8">
                    <label htmlFor="icd10">ICD-10</label>
                    <input type="radio" name="options" value="icd10" id="icd10" checked={searchMode === "icd10"} onChange={handleSearchModeChange} />
                </div>
            </div>
            <div className="flex flex-row my-2 content-center">
                <div className="flex flex-row my-2 content-center">
                    <Label className="text-nowrap self-center" htmlFor="columninput" >Column with code:</Label>
                    <Input className="mx-4 rounded w-24" id="columninput" data-testid="columninput" type="text" onChange={handleColumnChange} />
                </div>

                <div className="flex items-center space-x-2">
                    <Label className="text-nowrap self-center" htmlFor="headerinput" >Does file have a header-row?</Label>
                    <Checkbox id="headerinput"
                        onCheckedChange={(prevValue) => setHeaderRow(!prevValue)} />
                    <Label className="text-nowrap self-center" htmlFor="yes">Yes</Label>
                </div>

            </div>
            <div className="flex flex-row my-2 content-center">
                <Label className="text-nowrap self-center" htmlFor="fileinput" >Upload file: </Label>
                <Input className="mx-4 rounded" id="fileinput" data-testid="fileinput" type="file" onChange={handleFileChange} />
                <button className="bg-sky-700 text-white rounded px-2 text-nowrap" onClick={getData} name="searchbutton" data-testid="searchbutton">Map file</button>
            </div>
        </form>
    );
}