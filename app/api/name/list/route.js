import { NextResponse } from 'next/server';
import { fetchORPHAcodesByName } from '@/lib/serverfunctions/list'

export async function POST(req) {

    try {
        const body = await req.json();

        let indata = body.values
        let namecolumn = body.column - 1
        let headerRow = body.headerRow
        let inDataArray = Array.from([...indata])

        const diseaseData = await fetchORPHAcodesByName(inDataArray, namecolumn, headerRow);

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
                JSON.stringify({ message: `To many results for list, please choose another search method or split your list` }),
                { status: 413 }
            );
        }
        return new NextResponse(
            JSON.stringify({ message: 'Something went wrong when getting the orphacodes, please try again later' }),
            { status: 500 }
        );
    }
}

export async function GET(
) {
    try {

        return new NextResponse(
            JSON.stringify({ message: `Route not implemented yet` }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            'Something went wrong when getting the orphacode, please try again later',
            { status: 500 }
        );
    }
}
