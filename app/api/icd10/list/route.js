import { NextResponse } from 'next/server';
import { fetchICD10InfoWithOrphaCodes } from '@/lib/serverfunctions/list'

export async function POST(req) {

    try {
        const body = await req.json();

        let indata = body.values
        let codecolumn = body.column - 1
        let headerRow = body.headerRow
        let inDataArray = Array.from([...indata])

        const diseaseData = await fetchICD10InfoWithOrphaCodes(inDataArray, codecolumn, headerRow);

        if (diseaseData.length === 1) {
            return new NextResponse(

                JSON.stringify({ message: `No data to return, please verify your inputs` }),
                { status: 404 }
            );
        }
        return new NextResponse(
            JSON.stringify(diseaseData),
            { status: 200 }
        );
    } catch (error) {

        if (error.message.includes('413')) {
            return new NextResponse(
                JSON.stringify({ message: `To many results for ICD-10 "${icd10}", please choose another search method` }),
                { status: 413 }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Something went wrong when getting the orphacodes, please try again later' }),
            { status: 500 }
        );
    }
}
