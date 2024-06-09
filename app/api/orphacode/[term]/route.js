import { NextResponse } from 'next/server';
import { fetchJson } from '../../fetchall';

export async function GET(req,
  { params }) {
  const searchterm = params.term.toLowerCase();
  const code = searchterm.replace("orpha", '')
  try {
    let data = await fetchJson(`https://api.orphacode.org/EN/ClinicalEntity/orphacode/${code}/Name`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.ORPHA_API_KEY,

        },
      },
    )
    //let data = await response.json()
    console.log(data)
    return new NextResponse(
      JSON.stringify(data),
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