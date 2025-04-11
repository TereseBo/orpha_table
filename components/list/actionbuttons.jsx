import { FolderDownIcon } from 'lucide-react'
import useStore from '@/zustandstore/orphastore'
export function ActionButtons({ disease }) {

    const removeItemFromList = useStore((state) => state.removeItemFromListResultList);

    function handleRemove() {
        console.log(disease)
        removeItemFromList(disease);
    }

    return (
        <div className="flex flex-row items-center gap-1">
            <button
                onClick={handleRemove}
                className="text-red-700 h font-bold py2 px-1 rounded border-solid border-2 border-red-700 hover:text-red-500 hover:border-red-500"
            >
                X
            </button>

        </div>
    )
}