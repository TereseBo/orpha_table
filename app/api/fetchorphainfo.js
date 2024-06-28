// performs a request and resolves with JSON
export const fetchJson = async (url, init = {}) => {
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
};

// fetches ICD-10, and all names from RD-CODE API by code
export async function fetchOrphaInfo(code) {

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,

        },
    }

    return Promise.all([

        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/ICD10`,
            { ...options }
        ),
        fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/Synonym`,
            { ...options }

        ),
    ]).then((values) => {

        const disease = {}
        let reducedData = values.reduce((accumulator, currentValue) => Object.assign({}, accumulator, currentValue))
        disease.referencesICD10 = reducedData.References.map(item => item["Code ICD10"]) || ["-"]
        disease.orphacode = reducedData.ORPHAcode
        disease.preferredTerm = reducedData["Preferred term"] || ["-"]
        disease.synonyms = reducedData.Synonym || ["-"]
        return [disease]
    });
};

// fetches ICD-10, and all names from RD-CODE API by code
export async function fetchSynonyms(diseaseData) {
    console.log('in fetch synonyms ')


    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,

        },
    }

    const apiCalls = diseaseData.map(disease => {
        return fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/Synonym`,
            { ...options }

        )
    })


    return Promise.all(apiCalls).then((values) => {
        console.log("In  fetch synonyms, VALUES")
       console.log(values)
       console.log("In  fetch synonyms, DISEASEDATA")
       console.log(diseaseData)
       console.log('The type check should be here')
       Array.isArray(diseaseData)
        diseaseData.array.forEach(element => {
            const matchedItem = values.find(item => item.ORPHAcode === element.orphacode)
            element.synonyms = matchedItem.Synonym || ['-']

        });
        console.log(diseaseData)
        return diseaseData
    })
}

