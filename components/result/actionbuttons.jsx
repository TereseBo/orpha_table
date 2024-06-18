import { FolderDownIcon} from 'lucide-react'
import useStore from '@/zustandstore/orphastore'
export function ActionButtons({disease}) {
    console.log(disease)

    const removeItemFromResultList = useStore((state) => state.removeItemFromSearchResultList);
    const addItemToSelectedDiseaseList = useStore((state) => state.addItemToSelectedDiseaseList);
    const transferToSelected = useStore((state) => state.transferToSelected);
    function handleSelection(){
        console.log('clicked')
        console.log({...disease})
        removeItemFromResultList({...disease});
        addItemToSelectedDiseaseList({...disease});
    }
    function handleRemove(){
        console.log('clicked')
        console.log({...disease})
        removeItemFromResultList(disease);
    }

    return (
        <div>
            <button
                onClick={handleSelection}
                className="bg-green-700 hover:bg-green-500 text-white font-bold py2 px-1 rounded"
            >
              Add to list  <FolderDownIcon/>
            </button>
            <button
                onClick={handleRemove}
                className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded"
            >
                X
            </button>

        </div>
    )
}