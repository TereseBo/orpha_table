/* This route expects a string and utilizes the function fetchApproximateNameInfo
to fetch all ORPHAcodes with approximately matching name or synonym, populated with 
synonyms, classification level, ICD-10, and name. */
import { NextResponse } from 'next/server';
import { fetchApproximateNameInfo } from '../../name';

export async function GET(req, { params }) {
    const name = params.term;

    try {
        const diseaseData = await fetchApproximateNameInfo(name);

        if (diseaseData.length === 0) {
            return new NextResponse(
                JSON.stringify({ message: `No data found for name ${name}` }),
                { status: 404 }
            );
        }
        return new NextResponse(
            JSON.stringify(diseaseData),
            { status: 200 }
        );
    } catch (error) {
        if ( error.message.includes('413')) {
            return new NextResponse(
                JSON.stringify({ message: `To many results for "${name}", please refine your search by only including the most specific term` }),
                { status: 413 }
            );
        }
        return new NextResponse(
            JSON.stringify({message:'Something went wrong when getting the orphacodes, please try again later'}),
            { status: 500 }
        );
    }
}