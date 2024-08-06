import { fetchJson } from "./utils";

// fetches ICD-10, and all synonyms from RD-CODE API by code
export async function fetchOrphaInfo(code) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    return Promise.all([
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/ICD10`, { ...options }),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/Synonym`, { ...options }),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/ClassificationLevel`, { ...options }),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/Status`, { ...options }),

    ]).then((values) => {

        const disease = {};
        let reducedData = values.reduce((accumulator, currentValue) => Object.assign({}, accumulator, currentValue));
        if (reducedData.Status !== "Active") {
            throw new Error(`404: Resource not active`);
        } else {
            disease.referencesICD10 = reducedData.References.map(item => item["Code ICD10"]) || ["-"];
            disease.orphacode = reducedData.ORPHAcode;
            disease.preferredTerm = reducedData["Preferred term"] || ["-"];
            disease.synonyms = reducedData.Synonym || ["-"];
            disease.classificationLevel = reducedData.ClassificationLevel || "-";

            return [disease];
        }
    }).catch(error => {
        if (error.message.includes('404')) {
            return [];  // Return an empty array for 404 errors
        }
        throw error;  // Re-throw other errors
    });
};