import React from 'react';
import useStore from '@/zustandstore/orphastore';

export const RemoveButton = ({ disease }) => {
    const removeItemFromSelectedDiseaseList = useStore((state) => state.removeItemFromSelectedDiseaseList);
    const handleRemove = () => {
        removeItemFromSelectedDiseaseList(disease);
    };

    return <button onClick={handleRemove}>Remove</button>;
};

export default RemoveButton;