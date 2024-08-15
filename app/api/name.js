import { fetchJson, removeInactive, fetchClassificationLevel, fetchSynonyms, fetchICD10Codes } from "./utils.js";

//Fetches data from the Orphanet API using the ApproximateName and ApproximateName/Synonyms endpoint
export async function fetchApproximateNameInfo(name) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    // Fetch data using ApproximateName endpoint

    const diseaseList= await Promise.allSettled([
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}`, { ...options }),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}/Synonym`, { ...options }),
    ]).then((values) => {
        let diseaseData = [];
        values.forEach((value) => {
            if (value.status === 'fulfilled') {
                console.log('value.value.length')
                console.log(value.value.length)
                const valueSet=[... new Set([...value.value])]
                diseaseData = [...diseaseData, ...valueSet];
            }
        });
    
            return [... new Set([...diseaseData])]

        }).catch(error => {
            console.log('This was the error error')
            console.log(error)
            if (error.message.includes('404')) {

                return [];  // Return an empty array for 404 errors
            }
            throw error;  // Re-throw other errors
        });
        console.log(diseaseList)

        if (diseaseList.length === 0) {
            return diseaseData;  // Return early if no diseases found
        }else if(diseaseList.length>50){
            throw new Error('413:To many results, please refine your search');
        }else{
            return Promise.allSettled([
                removeInactive(diseaseList),
                fetchSynonyms(diseaseList),
                fetchICD10Codes(diseaseList),
                fetchClassificationLevel(diseaseList)
            ]).then((values) => {
                let diseaseData = [];
                console.log(values)
                values.forEach((value) => {
                    if (value.status === 'fulfilled') {
                        diseaseData = [...diseaseData, ...value.value];
                    }
                });
                return diseaseData;
            }).catch(error => {
                console.log('This was the error error')
                console.log(error)
                if (error.message.includes('404')) {
                    return [];  // Return an empty array for 404 errors
                }
                throw error;  // Re-throw other errors
            }); 
        }
    }