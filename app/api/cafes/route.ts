import { NextResponse } from 'next/server';
import { getMergedCafes, getNeighborhoods, getAllCurators } from '@/lib/curators';

export async function GET() {
  try {
    const cafes = await getMergedCafes();
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
