import { NextResponse } from 'next/server';
import { getMergedCafes, getNeighborhoods, getAllCurators } from '@/lib/curators';

export async function GET(request: Request) {
  try {
    const includeClosed = new URL(request.url).searchParams.get('includeClosed') === '1';
    const cafes = await getMergedCafes({ includeClosed });
    const neighborhoods = await getNeighborhoods();
    const curators = await getAllCurators();

    return NextResponse.json({
      curators,
      cafes,
      neighborhoods,
    });
  } catch (error) {
    console.error('Error fetching cafe data:', error);
    return NextResponse.json({ error: 'Failed to load cafes' }, { status: 500 });
  }
}
