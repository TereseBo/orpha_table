import { FolderDownIcon } from 'lucide-react'
import useStore from '@/zustandstore/orphastore'
export function ActionButtons({ disease }) {

    const removeItemFromResultList = useStore((state) => state.removeItemFromSearchResultList);
    const transferToSelected = useStore((state) => state.transferToSelected);
    function handleSelection() {
        removeItemFromResultList({ ...disease });
        transferToSelected({ ...disease });
    }
    function handleRemove() {
        removeItemFromResultList(disease);
    }

    return (
        <div className="flex flex-row items-center gap-1">
            <button
                onClick={handleSelection}
                className="text-green-700 hover:text-green-500  text-xs text-white font-bold py2 px-1 rounded"
            >
                <FolderDownIcon className='' />
            </button>
            <button
                onClick={handleRemove}
                className="text-red-700 hover:text-white font-bold py2 px-1 rounded border-solid border-2 border-red-700 hover:bg-red-400"
            >
                X
            </button>

        </div>
    )
}