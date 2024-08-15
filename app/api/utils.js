export const fetchJson = async (url, init = {}) => {
    const res = await fetch(url, init);
    if (!res.ok) {
        const errorMessage = `${res.status}: ${await res.text()}`;
        if (res.status === 404) {
            throw new Error(`404: Resource not found at ${url}`);
        }
        throw new Error(errorMessage);
    }
    return res.json();
};

// fetches ICD-10 by ORPHAcode for disease objects in an array
export async function fetchICD10Codes(diseaseData) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    //Create an array of fetch calls for each disease 
    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/ICD10`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { ORPHAcode: disease.orphacode, References: [] };  // Fallback for missing ICD-10 codes
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {

            const icd10Data = values.find(item => { return item.ORPHAcode === disease.orphacode });
            disease.referencesICD10 = Array.isArray(icd10Data.References) && icd10Data.References.length > 0
                ? icd10Data.References.map(ref => ref["Code ICD10"])
                : ['-'];
        });
        return diseaseData;
    });
}
export async function fetchSynonyms(diseaseData) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/Synonym`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { ORPHAcode: disease.orphacode, Synonym: ['-'] };  // Fallback for missing synonyms
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {
            const synonymsData = values.find(item => { return item.ORPHAcode === disease.orphacode });
            disease.synonyms = Array.isArray(synonymsData.Synonym) && synonymsData.Synonym.length > 0 ? synonymsData.Synonym : ['-'];
        });
        return diseaseData;
    });
}

export async function fetchClassificationLevel(diseaseData) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/ClassificationLevel`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { ORPHAcode: disease.orphacode, ClassificationLevel: '-' };  // Fallback for missing classification level
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {
            const classificationLevelData = values.find(item => { return item.ORPHAcode === disease.orphacode });
            disease.classificationLevel = classificationLevelData.ClassificationLevel || '-';
        });
        return diseaseData;
    });
}

//Removes inactive diseases from diseaseData
export async function removeInactive(diseaseData) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/Status`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { ORPHAcode: disease.orphacode, Status: 'Active' };  // Fallback for missing status
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        return diseaseData.filter((disease, index) => {
            const statusData = values.find(item => { return item.ORPHAcode === disease.orphacode });
            return statusData.Status === 'Active';
        });
    });
}