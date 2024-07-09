// performs a request and resolves with JSON
export const fetchJson = async (url, init = {}) => {
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
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


export async function fetchSynonyms(diseaseData) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };

    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/Synonym`, { ...options });
    });

    return Promise.all(apiCalls).then((values) => {
        diseaseData.forEach((disease, index) => {
            const synonymsData = values[index];
            disease.synonyms = synonymsData?.Synonym?.length > 0 ? synonymsData.Synonym : ['-'];
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
        });

    const completeDiseaseData = await fetchSynonyms(diseaseData);
    return completeDiseaseData;
}
