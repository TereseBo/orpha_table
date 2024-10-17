/* This route expects an ICD-10 code and utilizes the function fetchICD10Info 
to fetch all corresponding active ORPHAcodes populated with synonyms, classification level and name. */
import { NextResponse } from 'next/server';
import { fetchICD10Info } from '../../icd10';

export async function GET(req, { params }) {
    const icd10 = params.term;

    try {
        const diseaseData = await fetchICD10Info(icd10);
        if (diseaseData.length === 0) {
            return new NextResponse(
                JSON.stringify({ message: `No data found for ICD-10 code ${icd10}` }),
                { status: 404 }
            );
        }
        return new NextResponse(
            JSON.stringify(diseaseData),
            { status: 200 }
        );
    }  catch (error) {
      if ( error.message.includes('413')) {
          return new NextResponse(
              JSON.stringify({ message: `To many results for ICD-10 "${icd10}", please choose another search method` }),
              { status: 413 }
          );
      }
      return new NextResponse(
          JSON.stringify({message:'Something went wrong when getting the orphacodes, please try again later'}),
          { status: 500 }
      );
  }
}