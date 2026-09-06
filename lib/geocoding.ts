/**
 * Geocoding utility for Seoul Expat Cafe website.
 * Supports Naver Maps Geocoding API with fallback coordinate resolution.
 */

// Fallback dictionary for common Seoul district & neighborhood centers
const KNOWN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Seongsu addresses
  '성동구 아차산로11길 12': { lat: 37.5451, lng: 127.0583 },
  '성동구 성수이로18길 31': { lat: 37.5422, lng: 127.0598 },
  '성동구 성수일로12길 23': { lat: 37.5468, lng: 127.0515 },
  '성수동': { lat: 37.5445, lng: 127.0560 },
  '연남동': { lat: 37.5627, lng: 126.9248 },
  '이태원': { lat: 37.5345, lng: 126.9946 },
  '한남동': { lat: 37.5348, lng: 127.0022 },
  '강남': { lat: 37.4979, lng: 127.0276 },
};

export async function resolveCoordinates(
  address: string,
  existingLat: number | null,
  existingLng: number | null
): Promise<{ lat: number; lng: number }> {
  // 1. If explicit valid coordinates exist, use them
  if (existingLat !== null && existingLng !== null && existingLat > 0 && existingLng > 0) {
    return { lat: existingLat, lng: existingLng };
  }

  // 2. Try Naver Geocoding API if Client ID and Secret are configured
  const clientId = process.env.NAVER_MAP_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;

  if (clientId && clientSecret && address) {
    try {
      const response = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': clientId,
            'X-NCP-APIGW-API-KEY': clientSecret,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.addresses && data.addresses.length > 0) {
          const first = data.addresses[0];
          const lat = parseFloat(first.y);
          const lng = parseFloat(first.x);
          if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
          }
        }
      }
    } catch (error) {
      console.warn('Naver Geocoding API fetch failed, using fallback coordinates:', error);
    }
  }

  // 3. Match against known address patterns
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (address.includes(key)) {
      return coords;
    }
  }

  // 4. Default fallback: Center of Seongsu/Seoul
  return { lat: 37.5445, lng: 127.0560 };
}
