import { NextResponse } from 'next/server';
import { fetchApproximateNameInfo } from '../../name';

export async function GET(req, { params }) {
    const name = params.term;

    try {
        const diseaseData = await fetchApproximateNameInfo(name);
        console.log(diseaseData)
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
                JSON.stringify({ message: `To many results for "${name}", please refine your search` }),
                { status: 413 }
            );
        }
        return new NextResponse(
            JSON.stringify({message:'Something went wrong when getting the orphacodes, please try again later'}),
            { status: 500 }
        );
    }
}