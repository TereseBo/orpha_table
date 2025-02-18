import { NextResponse } from 'next/server';
import { fetchICD10InfoWithOrphaCodes } from '@/app/api/list'

export async function POST(req, { params }) {

    try {
        const body = await req.json();

        let indata = body.values
        let codecolumn = body.column - 1
        let headerRow = body.headerRow
        let inDataArray = Array.from([...indata])

        const diseaseData = await fetchICD10InfoWithOrphaCodes(inDataArray, codecolumn);

        if (diseaseData.length === 0) {
            return new NextResponse(

                JSON.stringify({ message: `No data to return` }),
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
