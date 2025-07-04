import { useState } from "react"
import readXlsxFile from 'read-excel-file'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useStore from '@/zustandstore/orphastore'
import { Switch } from "@/components/ui/switch"
import toast from 'react-hot-toast';


export function ListUpload() {
    //TODO: Add functionality to handle search by ORPHAcode list
    //TODO: Add validation for fileformat and contents

    const [searchMode, setSearchMode] = useState("icd10")
    const [file, setFile] = useState(null)
    const [column, setColumn] = useState(null)
    const [fileHasHeader, setFileHasHeader] = useState(false);

    const setListResultList = useStore((state) => state.setListResultList)
    const setListHeader = useStore((state) => state.setListHeader)

    const handleHeaderChange = (checked) => {
        setFileHasHeader(checked);
    };


    function handleSearchModeChange(e) {
        setSearchMode(e.target.value)
    }

    function handleColumnChange(e) {
        setColumn(e.target.value)
    }

    function handleFileChange(e) {
        setFile(e.target.files[0])
        setListResultList([])
        setListHeader([])
    }

    function validateInput() {

        if (file === null) {
            toast.error('Please add a file to map')
            return false
        }
        if (column === null) {
            toast.error('Please add the column where code data to map is found')
            return false
        }

        switch (true) {
            case column < 1:
            case !new RegExp("^[a-zA-Z0-9]*$").test(column):
                toast.error('Your column input has an error, allowed values are 1-26 and A-Z')
                return false
            case column > 26:
            case isNaN(column) && column.length > 1:
                toast.error('Your file contains to many columns, allowed values are 1-26 and A-Z')
                return false
            case isNaN(column):

                if (column.toLowerCase().charCodeAt(0) - 96 < 1 || column.toLowerCase().charCodeAt(0) - 96 > 26) {
                    toast.error('Your file contains to many columns, allowed values are 1-26 and A-Z')
                    return false
                }
        }

        return true
    }

    function convertColumn(columnValue) {

        return isNaN(column) ? (columnValue.toLowerCase().charCodeAt(0) - 96).toString() : columnValue

    }


    async function getData() {

        setListResultList([])
        setListHeader([])

        if (!validateInput()) {
            return;
        }

        let body = {}

        try {
            let inputData = await readXlsxFile(file); // Wait for read of file

            // Create body containing file and input data
            body = { values: [...inputData], searchMode: searchMode, column: convertColumn(column), headerRow: fileHasHeader };
        } catch (error) {
            toast.error("File could not be read. Please make sure it is in xlsx format and contains one code per cell");
            return; // End if file could not be read
        }

        try {
            // Fetch data from api
            const response = await fetch(`/api/${searchMode}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.status === 200) {
                toast.success("Success!");
                //Data from backend always contain a header row
                const header = data.shift()
                setListHeader(header)

                setListResultList(data)
            }

            if (data.message) {
                toast.error(data.message); // Toast message from backend if present
                return;
            }

        } catch (error) {
            setListResultList([]);
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
                <div className="flex flex-col mx-8">
                    <label htmlFor="name">Name</label>
                    <input type="radio" name="options" value="name" id="name" checked={searchMode === "name"} onChange={handleSearchModeChange} />
                </div>
            </div>
            <div className="flex flex-row my-2 content-center">
                <div className="flex flex-row my-2 content-center">
                    <Label className="text-nowrap self-center" htmlFor="columninput" >Column with code:</Label>
                    <Input className="mx-4 rounded w-24" id="columninput" data-testid="columninput" type="text" onChange={handleColumnChange} />
                </div>

                <div className="flex items-center space-x-2">

                    <Label className="text-nowrap self-center" htmlFor="headerinput">Does file have a header-row?</Label>
                    <Switch id="headerinput"
                        checked={fileHasHeader} // Bind the state to the Switch component
                        onCheckedChange={handleHeaderChange} // Handle toggle events
                    />
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