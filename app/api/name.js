import { fetchJson, fetchStatus, fetchClassificationLevel, fetchSynonyms, fetchICD10Codes } from "./utils.js";

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
    const diseaseRawList = await Promise.allSettled([
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}`, { ...options }),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}/Synonym`, { ...options }),
    ]).then((values) => {
        // Combine and return results from both endpoints
        let diseaseData = [];
        values.forEach((value) => {
            if (value.status === 'fulfilled') {

                diseaseData = [...diseaseData, ...value.value];
            }
        });

        return diseaseData

    }).catch(error => {

        if (error.message.includes('404')) {

            return [];  // Return an empty array for 404 errors
        }
        throw error;  // Re-throw other errors
    });

    let diseaseList = diseaseRawList.map((disease, index) => {

        return {
            orphacode: disease.ORPHAcode,
            preferredTerm: disease["Preferred term"] || "-",
        }

    });
    //Remove any responses missing orphacode
    diseaseList = diseaseList.filter(disease => disease.orphacode !== undefined)

    if (diseaseList.length === 0) {
        return diseaseList;  // Return early if no diseases found
    } else if (diseaseList.length > 500) { // If more than 50 results are found, search term is considered too wide and an error is returned
        throw new Error('413:To many results, please refine your search by only including the most');
    } else {
        
        // Fetch additional data for each disease
        return Promise.allSettled([
            fetchStatus(diseaseList),
            fetchSynonyms(diseaseList),
            fetchICD10Codes(diseaseList),
            fetchClassificationLevel(diseaseList)
        ]).then((values) => {

            //Populate disease list with additional data found
            values.forEach((value) => {

                if (value.status === 'fulfilled') {
                    diseaseList = diseaseList.map(disease => {
                        let additionalData = value.value.find((obj) => obj.orphacode === disease.orphacode)
                        if (additionalData !== undefined) {
                            return { ...disease, ...additionalData }
                        } else {
                            return disease
                        }
                    })
                }
            });

            //Return data only for avtive codes
            return diseaseList.filter(disease => disease.status === 'Active');

        }).catch(error => {

            throw error;  // Re-throw other errors
        });
    }
}