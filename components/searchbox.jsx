import { useState } from "react"
import { Input } from "@/components/ui/input"
export function SearchBox({setSearchResults}) {
    const [searchMode, setSearchMode] = useState("orphacode")
    const [searchTerm, setSearchTerm] = useState("")
    function handleSearchModeChange(e) {
        console.log(e.target.value)
        setSearchMode(e.target.value)
    }
    function handleSearchTermChange(e) {
        console.log(e.target.value)
    }
    function getData() {
        fetch(`/api/${searchMode}`)
        .then(response => response.json())
        .then(data => console.log(data))

    }
    return (
        <div className="bg-white rounded p-2">
            <div className="flex flex-row" onChange={handleSearchModeChange}>
                <div className="flex flex-col mx-8">
                    <label for="orphacode">ORPHAcode</label>
                    <input type="radio" name="options" value="orphacode" id="orphacode" checked={searchMode === "orphacode"}/>
                </div>
                <div className="flex flex-col mx-8">
                    <label for="icd10">ICD-10</label>
                    <input type="radio" name="options" value="icd10" id="icd10" checked={searchMode === "icd10"}/>
                </div>
                <div className="flex flex-col mx-8">
                    <label for="name">name</label>
                    <input type="radio" name="options" value="name" id="name" checked={searchMode === "name"}/>
                </div>
            </div>
            <div className="flex flex-row my-2">
                <label className="text-nowrap" for="input">Search disease:</label>
                <Input onChange={handleSearchTermChange} className="mx-4 rounded" type="text" id="input" />
                <button className="bg-sky-700 text-white rounded px-2" onClick={getData}>Search</button>
            </div>
        </div>
    );
}