import { NextResponse } from 'next/server';
import { fetchICD10Info } from '../../fetchorphainfo';

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
    } catch (error) {
        console.error(`Error fetching data for icdCode ${icd10}:`, error);
        return new NextResponse(
            'Oops, something went wrong when getting the ICD10 data',
            { status: 500 }
        );
    }
}