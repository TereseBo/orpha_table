// performs a request and resolves with JSON
export const fetchJson = async (url, init = {}) => {
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
};

// fetches ICD-10, ORPHAcode and all names from RD-CODE API
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
        console.log(values);
        let reducedData = values.reduce((accumulator, currentValue) => Object.assign({}, accumulator, currentValue))
        reducedData.ReferencesICD10 = reducedData.References;
        delete reducedData.References
        reducedData.PreferredTerm = reducedData["Preferred term"]
        delete reducedData["Preferred term"]
        console.log(reducedData)
        return reducedData
    });
};


