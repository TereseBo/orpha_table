// performs a request and resolves with JSON
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
    ]).then((values) => {
        const disease = {};
        let reducedData = values.reduce((accumulator, currentValue) => Object.assign({}, accumulator, currentValue));
        disease.referencesICD10 = reducedData.References.map(item => item["Code ICD10"]) || ["-"];
        disease.orphacode = reducedData.ORPHAcode;
        disease.preferredTerm = reducedData["Preferred term"] || ["-"];
        disease.synonyms = reducedData.Synonym || ["-"];
        return [disease];
    });
};

export async function fetchICD10Codes(diseaseData) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/ICD10`, { ...options })
            .catch(error => {
                if (error.message.includes('404')) {
                    return { References: [] };  // Fallback for missing ICD-10 codes
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {
            const icd10Data = values[index];
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
                    return { Synonym: ['-'] };  // Fallback for missing synonyms
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {
            const synonymsData = values[index];
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
                    return { ClassificationLevel: '-' };  // Fallback for missing classification level
                }
                throw error;  // Re-throw other errors
            });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {
            const classificationLevelData = values[index];
            disease.classificationLevel = classificationLevelData.ClassificationLevel || '-';
        });
        return diseaseData;
    });
}
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
                return ['-'];  // Return an empty array for 404 errors
            }
            throw error;  // Re-throw other errors
        });

    if (diseaseData.length === 0) {
        return diseaseData;  // Return early if no diseases found
    }

    const diseaseWithSynonyms = await fetchSynonyms(diseaseData);


    // Fetch classification level for each disease
    const completeDiseaseData = await fetchClassificationLevel(diseaseWithSynonyms);

    return completeDiseaseData;
}

export async function fetchApproximateNameInfo(name) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    // Fetch data using ApproximateName endpoint
    const diseaseData = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}`, { ...options })
        .then((values) => {
            return values.map(disease => {
                return {
                    orphacode: disease.ORPHAcode,
                    preferredTerm: disease["Preferred term"] || "-",
                };
            });
        }).catch(error => {
            if (error.message.includes('404')) {
                return [];  // Return an empty array for 404 errors
            }
            throw error;  // Re-throw other errors
        });

    if (diseaseData.length === 0) {
        return diseaseData;  // Return early if no diseases found
    }

    // Fetch synonyms for each disease
    let diseaseWithSynonyms = await fetchSynonyms(diseaseData);

    // Fetch synonyms using ApproximateName endpoint
    const synonymData = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ApproximateName/${name}/Synonym`, { ...options })
        .catch(error => {
            if (error.message.includes('404')) {
                return [];  // Return an empty array for 404 errors
            }
            throw error;  // Re-throw other errors
        });

    // Merge synonym data with disease data based on ORPHAcode
    synonymData.forEach(synonym => {
        const existingDisease = diseaseWithSynonyms.find(disease => disease.orphacode === synonym.ORPHAcode);
        if (existingDisease) {
            existingDisease.synonyms = Array.isArray(synonym.Synonym) && synonym.Synonym.length > 0
                ? [...new Set([...existingDisease.synonyms, ...synonym.Synonym])]
                : existingDisease.synonyms;
        } else {
            diseaseWithSynonyms.push({
                orphacode: synonym.ORPHAcode,
                preferredTerm: synonym["Preferred term"] || "-",
                synonyms: Array.isArray(synonym.Synonym) && synonym.Synonym.length > 0 ? synonym.Synonym : ['-'],
            });
        }
    });


    // Fetch ICD-10 codes for each disease
    const diseaseWithICD10 = await fetchICD10Codes(diseaseWithSynonyms);

    // Fetch classification level for each disease
    const completeDiseaseData = await fetchClassificationLevel(diseaseWithICD10);



    return completeDiseaseData;
}