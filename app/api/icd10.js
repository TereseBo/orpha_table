import { fetchJson, fetchStatus, fetchClassificationLevel, fetchSynonyms } from "./utils.js";

// fetches ORPHAcodes from RD-CODE API by ICD-10code and then remaining information
export async function fetchICD10Info(icd10) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    let diseaseList = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ICD10/${icd10}`, { ...options })
        .then((values) => {
            return values.References.map(icd10Disease => {
                return {
                    orphacode: icd10Disease.ORPHAcode,
                    preferredTerm: icd10Disease["Preferred term"] || "-",
                    referencesICD10: [icd10Disease.ICD],
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
    } else if (diseaseList.length > 500) { // If more than 500 results are found, search term is considered too wide and an error is returned
        throw new Error('413:To many results, please refine your search');
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