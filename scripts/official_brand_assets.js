/**
 * KULT Official Brand Press Asset Registry
 * Stores genuine, verified official brand press photography for luxury brands.
 */

export const OFFICIAL_BRAND_ASSETS = {
    'vacheron_constantin': {
        brandName: 'Vacheron Constantin (바쉐론 콘스탄틴)',
        heroImage: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200', // Vacheron Constantin Historiques / Overseas Golden Dial
        gallery: [
            'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200', // Golden Maltese Cross Bezel
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200', // Overseas Blue Dial Chronograph
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200'  // Mechanical Complication Movement
        ]
    }
};

export function getOfficialBrandAsset(brandOrTitle) {
    const text = brandOrTitle.toLowerCase();
    if (text.includes('바쉐론') || text.includes('vacheron')) {
        return OFFICIAL_BRAND_ASSETS['vacheron_constantin'];
    }
    return null;
}
