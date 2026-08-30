/**
 * KULT Official Brand Press Asset Registry
 * Stores genuine, verified official brand photography (Wikimedia Commons & Press Kits).
 */

export const OFFICIAL_BRAND_ASSETS = {
    'vacheron_constantin': {
        brandName: 'Vacheron Constantin (바쉐론 콘스탄틴)',
        heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Vacheron_Constantin_Patrimony_gold_watch.jpg', // Genuine Vacheron Constantin Patrimony Gold Watch
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/4/47/Vacheron_Constantin_Patrimony_gold_watch.jpg', // Vacheron Constantin Patrimony Gold Watch
            'https://upload.wikimedia.org/wikipedia/commons/c/c5/Vacheron_Constantin_Americaine_del_1921.jpg', // Vacheron Constantin Historiques American 1921
            'https://upload.wikimedia.org/wikipedia/commons/3/30/Particolare_del_Vacheron_Constantin_ref._6087.jpg' // Vacheron Constantin Ref 6087 Chronograph Detail
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
