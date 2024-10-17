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

        const icd10Data = []
        values.map(value => {

            icd10Data.push({
                orphacode: value.ORPHAcode, referencesICD10: Array.isArray(value.References) && value.References.length > 0
                    ? value.References.map(ref => ref["Code ICD10"])
                    : ['-']
            })
        })


        return icd10Data;
    });
}

// fetches ICD-10 by ORPHAcode for disease objects in an array
export async function fetchICD11Codes(diseaseData) {

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    //Create an array of fetch calls including all disease 
    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/ICD11`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { ORPHAcode: disease.orphacode, References: [] };  // Fallback for missing ICD-11 codes
                }else{
                    return { ORPHAcode: disease.orphacode, References: [{"Code ICD11":"Something went wrong"}] };  // Fallback for failed fetches
                }
            });
    });

    return Promise.all(apiCalls).then((values) => {

        const icd11Data = []
        values.map(value => {

            icd11Data.push({
                orphacode: value.ORPHAcode, referencesICD11: Array.isArray(value.References) && value.References.length > 0
                    ? value.References.map(ref => ref["Code ICD11"])
                    : ['-']
            })
        })


        return icd11Data;
    });
}



//Fetches synonyms by ORPHAcode for disease objects in an array
export async function fetchSynonyms(diseaseData) {

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const apiCalls = await diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/Synonym`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { ORPHAcode: disease.orphacode, synonyms: ['-'] };  // Fallback for missing synonyms
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        const synonymData = []
        values.map(value => {
            synonymData.push({ orphacode: value.ORPHAcode, synonyms: Array.isArray(value.Synonym) && value.Synonym.length > 0 ? value.Synonym : ['-'] })
        })

        return synonymData;
    });
}

//Fetches classificationlevel by ORPHAcode for disease objects in an array
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
        const classificationData = []
        values.map(value => {
            classificationData.push({ orphacode: value.ORPHAcode, classificationLevel: value.ClassificationLevel || '-' })
        })

        return classificationData;
    });
}

//Fetches status by ORPHAcode
export async function fetchStatus(diseaseData) {
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
                    return { orphacode: disease.orphacode, Status: 'Inactive' };  // Fallback for missing status
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        const statusData = []
        values.map(value => {
            statusData.push({ orphacode: value.ORPHAcode, status: value.Status })
        })

        return statusData;
    });
}