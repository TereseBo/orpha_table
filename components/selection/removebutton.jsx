/* 
import useStore from '@/zustandstore/orphastore'
export function RemoveButton(disease) {

    const removeItemFromSelectedDiseaseList = useStore((state) => state.removeItemFromSearchResultList);

    function handleRemove() {
        console.log('clicked')
        console.log({ ...disease })
        removeItemFromSelectedDiseaseList({ ...disease });
    }


    return (
        <div>

            <button
                onClick={removeItemFromSelectedDiseaseList(disease)}
                className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded"
            >
                X
            </button>

        </div>
    )
} */
    import React from 'react';
    import useStore from '@/zustandstore/orphastore';
    
    export const RemoveButton = ({ item }) => {
      const removeItemFromSearchResultList = useStore((state) => state.removeItemFromSearchResultList);
    
      const handleRemove = () => {
        removeItemFromSearchResultList(item);
      };
    
      return <button onClick={handleRemove}>Remove</button>;
    };
    
    export default RemoveButton;