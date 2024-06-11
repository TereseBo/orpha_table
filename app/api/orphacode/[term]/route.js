import { NextResponse } from 'next/server';
import { fetchOrphaInfo } from '../../fetchall';


export async function GET(req,
  { params }) {
  const searchterm = params.term.toLowerCase();
  const code = searchterm.replace("orpha", '')
  try {
    let diseaseData = await fetchOrphaInfo(code)
    console.log("in route")
    console.log(diseaseData)
    return new NextResponse(
      JSON.stringify(diseaseData),
      { status: 200 }
    );
  } catch (error) {
    console.log('api/orphacode/[term]/GET', error);
    return new NextResponse(
      'Ooops, something went wrong when getting the orphacode',
      { status: 500 }
    );
  }
}