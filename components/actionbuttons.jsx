import { FolderDownIcon} from 'lucide-react'

export function ActionButtons() {

    return (
        <div>
            <button
                onClick={() => navigator.clipboard.writeText(rowcontent.orphacode)}
                className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded"
            >
                <FolderDownIcon/>
            </button>
            <button
                onClick={() => navigator.clipboard.writeText(rowcontent.orphacode)}
                className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded"
            >
                X
            </button>

        </div>
    )
}