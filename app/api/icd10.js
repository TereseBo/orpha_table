import { fetchJson, removeInactive, fetchClassificationLevel, fetchSynonyms } from "./utils.js";

// fetches ORPHAcodes from RD-CODE API by ICD-10code and then remaining information
export async function fetchICD10Info(icd10) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const diseaseData = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ICD10/${icd10}`, { ...options })
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

    if (diseaseData.length === 0) {
        return diseaseData;
    }

    //Remove inactive diseases
    const activeDiseaseData = await removeInactive(diseaseData);

    //Fetch synonyms for each disease
    const diseaseWithSynonyms = await fetchSynonyms(activeDiseaseData);


    // Fetch classification level for each disease
    const completeDiseaseData = await fetchClassificationLevel(diseaseWithSynonyms);

    return completeDiseaseData;
}