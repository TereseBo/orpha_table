import { useState } from "react"
import { Input } from "@/components/ui/input"
import useStore from '@/zustandstore/orphastore'
import toast from 'react-hot-toast';

export function SearchBox() {
    const [searchMode, setSearchMode] = useState("orphacode")
    const [searchTerm, setSearchTerm] = useState("")
    const setSearchResultList = useStore((state) => state.setSearchResultList)

    function handleSearchModeChange(e) {
        setSearchMode(e.target.value)
    }

    function handleSearchTermChange(e) {
        setSearchTerm(e.target.value)
    }

    function validateSearch() {
        
        if (searchTerm === "") {
            toast.error('Please enter a search term')
            return false
        }

        switch (searchMode) {
            case "orphacode":
                if (!searchTerm.match(/^\d+$/)) {
                    toast.error('ORPHA code must be numbers only')
                    return false
                }
                break
            case "icd10":
                if (!searchTerm.match(/[A-Za-z][0-9]+\.[0-9]+/i)) {
                    toast.error('ICD-10 code must be in the format A12.3')
                    return false
                }
                break
            case "name":
                if (searchTerm.length < 3) {
                    toast.error('Name must be at least 3 characters long')
                    return false
                }
                break
            default:
                toast.error('Please select a search mode')
                return false
        }
        
        return true
    }

    function getData() {

        if (!validateSearch()) {
            setSearchResultList([])
            return
        }
        fetch(`/api/${searchMode}/${searchTerm}`)
            .then(response => response.json())
            .then(data => {

                if (data.message) {
                    setSearchResultList([])
                    toast.error(data.message)
                    return
                }
                setSearchResultList(data)
            }).catch(error => {
                setSearchResultList([])
                toast.error('Something went wrong, please try again later')
            })
    }
    function submitHandler(e) {
        e.preventDefault();
    }

    return (
        <form className="bg-white rounded p-2" id="searchbox" name="searchbox" data-testid="searchbox" onSubmit={submitHandler}>
            <div className="flex flex-row" >
                <div className="flex flex-col mx-8">
                    <label htmlFor="orphacode">ORPHAcode</label>
                    <input type="radio" name="options" value="orphacode" id="orphacode" checked={searchMode === "orphacode"} onChange={handleSearchModeChange} />
                </div>
                <div className="flex flex-col mx-8">
                    <label htmlFor="icd10">ICD-10</label>
                    <input type="radio" name="options" value="icd10" id="icd10" checked={searchMode === "icd10"} onChange={handleSearchModeChange} />
                </div>
                <div className="flex flex-col mx-8">
                    <label htmlFor="name">name</label>
                    <input type="radio" name="options" value="name" id="name" checked={searchMode === "name"} onChange={handleSearchModeChange} />
                </div>
            </div>
            <div className="flex flex-row my-2 content-center">
                <label className="text-nowrap self-center" htmlFor="input">Search disease:</label>
                <Input onChange={handleSearchTermChange} data-testid="searchtextinput" className="mx-4 rounded" type="text" id="input" />
                <button className="bg-sky-700 text-white rounded px-2" onClick={getData} name="searchbutton" data-testid="searchbutton">Search</button>
            </div>
        </form>
    );
}