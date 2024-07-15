import { Input } from "@/components/ui/input"
import useStore from '@/zustandstore/orphastore'

export function Tableheader() {
    function handleHeaderChange(e) {
        console.log(e.target.value)
    }

    function printData() {
        console.log("print data")
    }
    return (
        <>
            <h1>Selected Diseases</h1>
            <div className="rounded-md border">

                <div className="flex flex-row m-2 content-center">
                    <label className="text-nowrap self-center" htmlFor="input">Table header:</label>
                    <Input onChange={handleHeaderChange} className="mx-4 rounded" type="text" id="input" />
                    <button className="bg-sky-700 text-white rounded px-2" onClick={printData}>Print</button>
                </div>

            </div>
        </>
    )
}