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
        console.log('This was the error in name route')
        console.log(error)
        return new NextResponse(
            'Something went wrong when getting the orphacodes, please try again later',
            { status: 500 }
        );
    }
}