import { fetchJson, fetchStatus } from "./utils.js";

// Helper function to fetch ORPHA codes for a single ICD-10 code
async function fetchOrphaForIcd10(icd10, index) {

    //TODO: Populate collected data with level and status and filter inactive
    //TODO: Allow for separate use and handeling of header row in data
    //TODO: Handle errors in list fetching, allowing for return of incomplete results

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.ORPHA_API_KEY,
        },
    };
    console.log("In helper, will build diseaselist")

    let diseaseList = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ICD10/${icd10}`, { ...options })
        .then((values) => {
            // If there are references, return them, else indicate no match
            if (values.References && values.References.length > 0) {
                return values.References.map((icd10Disease) => ({
                    orphacode: icd10Disease.ORPHAcode,
                    preferredTerm: icd10Disease["Preferred term"] || "-",
                    referencesICD10: [icd10Disease.ICD],
                    originalIndex: index, // Save the original index for later sorting
                }));
            } else {
                return [{
                    orphacode: "No match",
                    preferredTerm: "-",
                    referencesICD10: ["-"],
                    originalIndex: index // Save the original index for later sorting
                }];
            }
        })
        .catch(error => {
            if (error.message.includes('404')) {
                return [{
                    orphacode: "No match",
                    preferredTerm: "-",
                    referencesICD10: ["-"],
                    originalIndex: index // Save the original index for later sorting
                }];
            } else {
                console.log("error fetching data by ICD-10")
                return [{
                    orphacode: "Error fetching data",
                    preferredTerm: "-",
                    referencesICD10: ["-"],
                    originalIndex: index // Save the original index for later sorting
                }];
            }

        });

    if (diseaseList.length === 0) {
        return [];  // If no results, return an empty array
    }
    console.log(diseaseList)
    return [...diseaseList]
    
    // Fetch additional data for each disease (status, synonyms, classification)
    /*     try {
            const additionalData = await Promise.allSettled([
                fetchStatus(diseaseList),
                // fetchSynonyms(diseaseList),
                // fetchClassificationLevel(diseaseList)
            ]);
    
            // Populate disease list with additional data found
            additionalData.forEach((value) => {
                if (value.status === 'fulfilled') {
                    diseaseList = diseaseList.map(disease => {
                        let additional = value.value.find((obj) => obj.orphacode === disease.orphacode);
                        if (additional !== undefined) {
                            return { ...disease, ...additional };
                        }
                        return disease;
                    });
                }
            });
    
            // Return only active diseases
            return diseaseList.filter(disease => disease.status === 'Active');
    
        } catch (error) {
            console.log("error fetching status data for collected orphacodes")
            throw error;  // Re-throw errors from additional data fetch
        } */
}

// Fetches ORPHAcodes from RD-CODE API by ICD-10code and then remaining information
export async function fetchICD10InfoWithOrphaCodes(icd10Array, icd10Index) {

    try {
        // Fetch Orpha codes for all ICD-10 codes in file data
        const results = await Promise.allSettled(
            icd10Array.map((row, index) => {
                return fetchOrphaForIcd10(row[icd10Index], index)
            })
        );

        let finalResults = [];
        // Add results from API calls to filedata before returning completed data
        results.forEach((result, index) => {
            // if (result.status === 'fulfilled') {
            result.value.forEach((disease) => {
                // For each Orphanet code, duplicate the original row 
                finalResults.push({
                    ...icd10Array[index], // Copy the complete original row
                    icd10original: icd10Array[index][icd10Index],//name original icd-10 for which search was performed 
                    orphacode: disease.orphacode,
                    preferredTerm: disease.preferredTerm,
                    referencesICD10: disease.referencesICD10,
                    originalIndex: disease.originalIndex
                });
            });
            // } else {
            //   console.error(`Error fetching data for ICD-10 code ${icd10Array[index]}: ${result.reason}`);
            // }
        });

        // Sort the results to ensure the original order is maintained
        finalResults.sort((a, b) => a.originalIndex - b.originalIndex);

        return finalResults;

    } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
}
