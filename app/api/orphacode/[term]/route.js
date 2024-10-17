/* This route expects an ORPHAcode and utilizes the function fetchOrphaInfo
to populate with synonyms, classification level, ICD-10, and name. Only active codes are returned. */

import { NextResponse } from 'next/server';
import { fetchOrphaInfo } from '../../orphacode';

export async function GET(req,
  { params }) {
  const searchterm = params.term.toLowerCase();
  const code = searchterm.replace("orpha", '').replace(":", '');

  try {
    let diseaseData = await fetchOrphaInfo(code)
    if (diseaseData.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: `No data found for ORPHA code ${code}` }),
        { status: 404 }
      );
    }
    return new NextResponse(
      JSON.stringify(diseaseData),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      'Something went wrong when getting the orphacode, please try again later',
      { status: 500 }
    );
  }
}