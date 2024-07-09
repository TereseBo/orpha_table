import React from 'react';
import useStore from '@/zustandstore/orphastore';

export const RemoveButton = ({ disease }) => {
    const removeItemFromSelectedDiseaseList = useStore((state) => state.removeItemFromSelectedDiseaseList);
    const handleRemove = () => {
        removeItemFromSelectedDiseaseList(disease);
    };

    return <button className="bg-red-700 hover:bg-red-500 text-white font-bold py2 px-1 rounded" onClick={handleRemove}>X</button>;
};

export default RemoveButton;