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

    // Fetch orphacodes using ApproximateName and ApproximateSynonyms endpoint
    const diseaseList= await Promise.allSettled([
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}`, { ...options }),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}/Synonym`, { ...options }),
    ]).then((values) => {
        // Combine and return results from both endpoints
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
            if (error.message.includes('404')) {

                return [];  // Return an empty array for 404 errors
            }
            throw error;  // Re-throw other errors
        });

        if (diseaseList.length === 0) {
            return diseaseData;  // Return early if no diseases found
        }else if(diseaseList.length>500){ // If more than 50 results are found, search term is considered too wide and an error is returned
            throw new Error('413:To many results, please refine your search');
        }else{
            // Fetch additional data for each disease
            return Promise.allSettled([
                removeInactive(diseaseList),
                fetchSynonyms(diseaseList),
                fetchICD10Codes(diseaseList),
                fetchClassificationLevel(diseaseList)
            ]).then((values) => {
                let diseaseData = [];
                values.forEach((value) => {
                    if (value.status === 'fulfilled') {
                        diseaseData = [...diseaseData, ...value.value];
                    }
                });
                return diseaseData;
            }).catch(error => {
                throw error;  // Re-throw other errors
            }); 
        }
    }