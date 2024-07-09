import { NextResponse } from 'next/server';
import { fetchApproximateNameInfo } from '../../fetchorphainfo';

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
        console.error(`Error fetching data for name ${name}:`, error);
        return new NextResponse(
            'Oops, something went wrong when getting the data',
            { status: 500 }
        );
    }
}