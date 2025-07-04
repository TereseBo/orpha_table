import { NextResponse } from 'next/server';


export async function GET(req,
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