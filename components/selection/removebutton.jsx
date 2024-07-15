import React from 'react';
import useStore from '@/zustandstore/orphastore';

export const RemoveButton = ({ disease }) => {
    const removeItemFromSelectedDiseaseList = useStore((state) => state.removeItemFromSelectedDiseaseList);
    const handleRemove = () => {
        removeItemFromSelectedDiseaseList(disease);
    };

    return <button className="text-red-700 hover:text-white font-bold py2 px-1 rounded border-solid border-2 border-red-700 hover:bg-red-400" onClick={handleRemove}>X</button>;
};

export default RemoveButton;