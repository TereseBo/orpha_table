
import { Input } from "@/components/ui/input"
export function SearchBox() {
    return (
        <div className="bg-white rounded p-2">
            <div className="flex flex-row">
                <div className="flex flex-col mx-8">
                    <label for="ORPHAcode">ORPHAcode</label>
                    <input type="radio" name="options" value="ORPHAcode" id="ORPHAcode" />
                </div>
                <div className="flex flex-col mx-8">
                    <label for="ICD-10">ICD-10</label>
                    <input type="radio" name="options" value="ICD-10" id="ICD-10" />
                </div>
                <div className="flex flex-col mx-8">
                    <label for="name">name</label>
                    <input type="radio" name="options" value="name" id="name" />
                </div>
            </div>
            <div className="flex flex-row my-2">
                <label className="text-nowrap" for="input">Search disease:</label>
                <Input className="mx-4 rounded" type="text" id="input" />
            </div>
        </div>
    );
}