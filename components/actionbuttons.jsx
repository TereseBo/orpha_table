import { FolderDownIcon} from 'lucide-react'
import useStore from '@/zustandstore/orphastore'
export function ActionButtons(disease) {

    const removeItemFromResultList = useStore((state) => state.removeItemFromSearchResultList);
    const addItemToSelectedDiseaseList = useStore((state) => state.addItemToSelectedDiseaseList);

    return (
        <div>
            <button
                onClick={addItemToSelectedDiseaseList(disease)}
                className="bg-green-700 hover:bg-green-500 text-white font-bold py2 px-1 rounded"
            >
              Add to list  <FolderDownIcon/>
            </button>
            <button
                onClick={removeItemFromResultList(disease)}
                className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded"
            >
                X
            </button>

        </div>
    )
}