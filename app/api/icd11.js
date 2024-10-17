import { fetchJson, fetchStatus, fetchClassificationLevel, fetchSynonyms } from "./utils.js";

// fetches ORPHAcodes from RD-CODE API by ICD-10code and then remaining information
export async function fetchICD11Info(icd11) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    let diseaseList = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ICD11/${icd11}`, { ...options })
        .then((values) => {
            return values.References.map(icd11Disease => {
                return {
                    orphacode: icd11Disease.ORPHAcode,
                    preferredTerm: icd11Disease["Preferred term"] || "-",
                    referencesICD10: [icd11Disease.ICD],
                };
            });
        }).catch(error => {

            if (error.message.includes('404')) {
                return [];  // Return an empty array for 404 errors
            }
            throw error;  // Re-throw other errors
        });


    if (diseaseList.length === 0) {
        return diseaseList;  // Return early if no diseases found
    } else if (diseaseList.length > 500) { // If more than 50 results are found, search term is considered too wide and an error is returned
        throw new Error('413:To many results, please refine your search by only including the most');
    } else {
        
        // Fetch additional data for each disease
        return Promise.allSettled([
            fetchStatus(diseaseList),
            fetchSynonyms(diseaseList),
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