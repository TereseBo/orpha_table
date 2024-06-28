import { NextResponse } from 'next/server';
import { fetchJson } from '../../fetchorphainfo';
import { fetchOrphaInfo } from '../../fetchorphainfo';


export async function GET(req, { params }) {
  console.log("GET in /api/icd10/term")
  const icd10 = params.term
  console.log("icd10: ", icd10)
  try {
    // Fetch the list of diseases associated with the icdCode
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.ORPHA_API_KEY,

      },
    }
    const response = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ICD10/${icd10}`, { ...options }).then((values) => {
      console.log("values: ", values)
      //TODO: Extractb arrvay of diseases from values
      /*       const disease = {}
            let reducedData = values.reduce((accumulator, currentValue) => Object.assign({}, accumulator, currentValue))
            disease.referencesICD10 = reducedData.References.map(item => item["Code ICD10"]) || ["-"]
            disease.orphacode = reducedData.ORPHAcode
            disease.preferredTerm = reducedData["Preferred term"] || ["-"]
            disease.synonyms = reducedData.Synonym || ["-"] */
      return []
    });;

    console.log(response)
    const icd10Diseases = response.data;
    console.log(icd10Diseases)
    // Fetch detailed information for each orphacode
    const diseaseData = icd10Diseases.map(async (disease) => await fetchOrphaInfo(disease.orphacode));


    return new NextResponse(
      JSON.stringify(diseaseData),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching data for icdCode ${icd10}:`, error);
    return new NextResponse(
      'Oops, something went wrong when getting the ICD10 data',
      { status: 500 }
    );
  }
}