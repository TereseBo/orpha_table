import { NextResponse } from 'next/server';
import { fetchJson, fetchSynonyms } from '../../fetchorphainfo';
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
    const diseaseData = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/ICD10/${icd10}`, { ...options }).then((values) => {
      console.log("in then values")
      // console.log("values: ", values.References)
      let icd10Diseases = values.References.map(icd10Disease => {
        let disease = {}
        disease.orphacode = icd10Disease.ORPHAcode
        disease.preferredTerm = icd10Disease["Preferred term"] || ["-"]
        disease.referencesICD10 = [icd10Disease.ICD]
        disease.synonyms = ['-']

        return disease
      })
      // console.log(icd10Diseases)


      return icd10Diseases
    });

    const completeDiseaseData = await diseaseData.map(async disease => {
      console.log('diseasse')
      console.log(disease)
       fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${disease.orphacode}/Synonym`,
        { ...options }).then(res => {
          console.log('res.')
          console.log(res)
          if (res.Synonym) {
            disease.synonyms = res.Synonym
          }else{
            disease.synonyms=['-']
          }
          const completeDisease = { ...disease }
       console.log('completedisease')
       console.log(completeDisease)
          return completeDisease
        })

    })
    console.log('completeDiseaseData')
    console.log(completeDiseaseData)
    return new NextResponse(
      JSON.stringify(completeDiseaseData),
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