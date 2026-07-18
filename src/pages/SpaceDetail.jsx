import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    MapPin, ChevronLeft,
    Instagram, Globe, ExternalLink, Bookmark, AlertCircle, Orbit, Loader2
} from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'

// Fallback dummy data indexed by slug
const dummySpaces = {
    'seongsu-route': {
        title: '72 Hours in Seongsu: The Brutalist & Sensory Route',
        titleKr: '성수에서의 72시간: 브루탈리즘과 감각의 여정',
        category: 'Curated Route',
        categoryKr: '큐레이션 루트',
        region: 'seongsu',
        imageUrl: '/seongsu_boutique_hero.png',
        galleryUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAIC80g9d0IWKmmqHudubq8mZ5BgpE2JbKahPBpTwYknXtx7pNYjTB8MuTD7frdR1RPdbfVCRqc8y2SDvlqo5_J7VBb2cyObOQqaxSEYKAFZVV4rDQR9T7sPiYiTxcaI3x7cU8AKha7JZ1qfiJRq7FytIK9BBEWwyjYqtjl9T8covdISOyqbEhz763wZHEDP0FezSxJ7BdchJ--ZXMrUsMBodxKasJnMdAFpmTc7WJSX525ndWmn9GP9SqT41tJaJSHA53GauLvWOiq',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
        ],
        description: `Seongsu-dong is a landscape where time and industry collide. Once filled with metal workshops and shoe factories, it has evolved into Seouls most avant-garde district. Here is our curated 24-hour spatial journey for the design-obsessed explorer.

🛑 STOP 1. [Cafe Onion Seongsu](/space/cafe-onion-seongsu)
- Theme: Raw Concrete & Bakery
- Experience: A 1970s metal factory transformed into a brutalist coffee sanctuary. The decay of brick, crumbling plaster, and linear glass frames create a striking visual narrative.

🛑 STOP 2. [Tamburins Seongsu](/space/tamburins-seongsu)
- Theme: Sensory Retail & Architectural Void
- Experience: A subterranean fragrance showroom built within an open-air concrete scaffolding. Experiencing scent between giant paintings, art installations, and concrete columns.

🛑 STOP 3. [LCDC Seoul](/space/lcdc-seoul)
- Theme: Curated Spatial Collage
- Experience: A multi-story automotive repair shop transformed into a sleek complex. Independent fashion boutiques and design stationary brands gathered like pages of an editorial magazine.

🛑 STOP 4. [Ofr. Seoul](/space/ofr-seoul)
- Theme: Metal & Printed Matter
- Experience: Browse global art magazines and posters stacked on industrial steel shelves, wrapping up the day with industrial street vibes.`,
        descriptionKr: `성수동은 시간과 산업이 격렬하게 충돌하는 도시적 풍경입니다. 한때 금속 정밀 공장 및 수제화 공장이 밀집했던 이곳은 이제 서울에서 가장 전위적인 미학의 지구가 되었습니다. 디자인에 깊은 애정을 가진 탐험가를 위해 엄선한 24시간 공간 여정을 소개합니다.

🛑 STOP 1. [어니언 성수](/space/cafe-onion-seongsu)
- 테마: 날것의 콘크리트와 빵 (Raw Concrete & Bakery)
- 경험: 1970년대 금속 부품 공장을 개조한 브루탈리즘의 안식처. 허물어진 붉은 벽돌, 뜯겨 나간 콘크리트 질감과 미니멀한 유리 프레임의 조화가 독특한 공간을 선사합니다.

🛑 STOP 2. [탬버린즈 성수](/space/tamburins-seongsu)
- 테마: 감각적 리테일과 공간의 여백
- 경험: 건물 기둥 뼈대 가설재만 남겨진 구조 아래 자리 잡은 전시장 같은 프래그런스 쇼룸. 거대한 현대 미술작품과 콘크리트 기둥 사이에서 감도 높은 향기를 호흡해 보세요.

🛑 STOP 3. [LCDC 서울](/space/lcdc-seoul)
- 테마: 큐레이션된 공간의 콜라주
- 경험: 옛 자동차 정비소 부지를 모던한 복합 공간으로 재탄생시킨 곳. 잡지 에디토리얼을 읽듯 중정을 둘러싼 독립 디자인 샵과 셀렉트 스토어를 탐험하세요.

🛑 STOP 4. [오프레 서울](/space/ofr-seoul)
- 테마: 날것의 메탈과 종이 예술
- 경험: 산업용 메탈 선반에 꽂혀 있는 전 세계의 다양한 예술 서적과 포스터 컬렉션을 뒤적이며, 성수동 특유의 에너제틱한 골목 정취와 함께 하루를 매듭짓습니다.`,
        googleMapsUrl: 'https://maps.google.com/maps?q=Seongsu-dong+Seoul',
        isPremium: false
    },
    'void-space': {
        title: 'Void Space Seoul',
        titleKr: '보이드 스페이스 서울',
        category: 'Architecture',
        categoryKr: '건축',
        region: 'hannam',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbwoL1fq_JksuTSIQIDc7aKzarYFCoKXSumbSeFD4TWpCcU4858QFMLYdYebKkiZR2jIFI1Ei9rgbQtdkXOHuljgW7VDJNzMAAwGaKuNkaLY6127SDCwTsk2kK1eC1_tfaDDAJHRQbbplp2pfiNDZuBrLhn6446CsRVlnIdLQvEPy5HilTe6nGGGoNYB8zN6L9ISkrK_tR1jP5sDMbVWukDfDARBmz7zviyycbc2XIbshKwgivg43cPtycFsPWD5743_ye5gxVo3r3',
        galleryUrls: [
            'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'A pioneering architectural studio in the heart of Hannam-dong, where the absence of conventional design elements speaks louder than their presence. Founded in 2018, Void Space Seoul has become a reference point for a generation of Korean designers who believe that emptiness is a form of fullness.',
        descriptionKr: '한남동 중심부에 위치한 선구적인 건축 스튜디오로, 일반적인 디자인 요소의 부재가 존재보다 더 큰 울림을 줍니다. 2018년에 설립된 보이드 스페이스 서울은 비어있음이 가득 참의 한 형태라고 믿는 한국 디자이너 세대의 레퍼런스 포인트가 되었습니다.',
        googleMapsUrl: 'https://maps.google.com',
        isPremium: true
    },
    'tamburins-sinsa': {
        title: 'The Silence of Tamburins: Rethinking Retail as a Sanctuary',
        titleKr: '탬버린즈의 침묵: 리테일을 성소로 재고하다',
        category: 'Retail / Beauty',
        categoryKr: '뷰티 / 리테일',
        region: 'sinsa',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf1blu6c8imp44TnDdmZGqeo88chuE6BEd1swlYnJerkGIzHeO-hj3Sj2OAdeA8_G-AmyulffbP2Kxn2WlS6yP2njTuxHUvlZ2tGnTDim9sB68oLr25Q1AQC0oA-xS4YPl_WnL2JGpAhVcPEeCN_378EtQwAF0pu4JDZMZkb8sI89gb3zsUuL1cRZPyiXChVsAxicZ2D395HMTOF2lneOnhNSmwTtTgFdC__NG7FpMBmQfv-J3moka4CRT7j2oGad8s3of5yjYtxyd',
        galleryUrls: [
            'https://web-resource.tamburins.com/image/share_banner_summer-tails.jpg',
            'https://web-resource.tamburins.com/catalog/catalog/category_home_candle.jpg/38e37148-66f0-44bd-9294-558ab01f337f/category_home_candle.jpg'
        ],
        description: 'How a fragrance brand transformed the bustling streets of Sinsa-dong into a spatial narrative of time, texture, and scent. The flagship store functions as an immersive art installation, challenging traditional retail spaces.',
        descriptionKr: '한 프래그런스 브랜드가 신사동의 분주한 거리를 시간, 질감, 향기의 공간적 내러티브로 변환한 방법입니다. 플래그십 스토어는 몰입형 예술 설치물처럼 기능하며 전통적인 판매 매장의 틀을 깨부눕니다.',
        googleMapsUrl: 'https://maps.google.com',
        isPremium: true
    },
    'arumjigi': {
        title: 'The Geometry of Solitude: On Arumjigi\'s Traditional-Modern Hybridity',
        titleKr: '고독의 기하학: 아름지기의 전통-현대 혼합성에 대하여',
        category: 'Heritage',
        categoryKr: '헤리티지',
        region: 'bukchon',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOeAEDReiO56NceRRAI74x11UkMAFpLTD8rCqj6Dt1pbF3arduDR00v0-ywXgvJV8TuH-x6mypHbt2yGFcQ2bkNRhYCFDYAUOO5qlimCTFvJ6yeN0tbXXHhSEv1PrWHsrBqlPg5uc11s0eSQEqTMSAMWxqC_IgFTc8TmkBMAh7gQGCkUbfhDSAy7xMO0NrAsZUO0eX83mN83tQ_lxjJMD1S2abzB2uQmcQmRQxtGUs5jIvKhCMXyT_UoSSIcB0hOsDt4_whSqdSjVN',
        galleryUrls: [
            'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'Exploring how Arumjigi Culture Keepers Foundation bridges the gap between Joseon-era aesthetics and 21st-century minimalism in the heart of Seoul. The building connects a traditional wooden Hanok with a modern concrete structure.',
        descriptionKr: '재단법인 아름지기가 서울 중심부에서 조선 시대의 미학과 21세기 미니멀리즘 사이의 간극을 어떻게 좁히고 있는지 탐구합니다. 이 사옥은 전통적인 목조 한옥과 현대적인 콘크리트 건축을 매끄럽게 연결합니다.',
        googleMapsUrl: 'https://maps.google.com',
        isPremium: true
    },
    'yuyeon-tea-house': {
        title: 'Yuyeon Tea House',
        titleKr: '유연다원',
        category: 'Heritage',
        categoryKr: '헤리티지',
        region: 'gyeongju',
        imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=2000',
        galleryUrls: [
            'https://images.unsplash.com/photo-1506057213367-028a17ec52e5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800'
        ],
           'cafe-onion-seongsu': {
        title: 'Cafe Onion Seongsu: Raw Concrete & Industrial Bread',
        titleKr: '어니언 성수: 거친 콘크리트와 금속이 빚어낸 베이커리 스페이스',
        category: 'Cafe',
        categoryKr: '카페',
        region: 'seongsu',
        imageUrl: '/cafe_onion_seongsu.png',
        galleryUrls: [
            '/cafe_onion_seongsu.png'
        ],
        description: 'Onion Seongsu is a sensory bakery cafe built inside a renovated 1970s metal part factory. It preserves the dilapidated brick walls, rusted steel gates, and decayed concrete structures, creating an aesthetic of collapse and reconstruction.',
        descriptionKr: '어니언 성수는 1970년대 금속 부품 공장을 개조하여 만든 감각적인 베이커리 카페입니다. 세월의 흐름을 고스란히 담은 낡은 벽돌 벽, 녹슨 철제 구조물, 그리고 떨어져 나간 콘크리트 기둥을 그대로 보존하여 파괴와 재구성의 미학을 담고 있습니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=Cafe+Onion+Seongsu',
        isPremium: false
    },
    'tamburins-seongsu': {
        title: 'Tamburins Seongsu: Fragrance Showroom in a Structural Frame',
        titleKr: '탬버린즈 성수: 가설재 기둥 아래 흩뿌려진 향기의 서사',
        category: 'Retail / Beauty',
        categoryKr: '뷰티 / 리테일',
        region: 'seongsu',
        imageUrl: '/tamburins_seongsu.png',
        galleryUrls: [
            '/tamburins_seongsu.png'
        ],
        description: 'Tamburins Seongsu flagship showroom is an architectural void. By stripping the building down to its structural concrete scaffolding, they created an open-air display that houses sensory fragrance art installations and concrete design elements.',
        descriptionKr: '탬버린즈 성수 플래그십 스토어는 기둥 구조(비계)만 남긴 채 벽면을 완전히 비워낸 건축학적 보이드 공간입니다. 날것의 노출 콘크리트 뼈대 구조물 아래, 거대한 현대 미술작품과 디자인적 향기 오브제를 전시하여 리테일의 새로운 경지를 보여줍니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=Tamburins+Seongsu',
        isPremium: false
    },
    'lcdc-seoul': {
        title: 'LCDC Seoul: The Spatial Collage of Independent Curation',
        titleKr: 'LCDC 서울: 감도 높은 라이프스타일 큐레이션 복합공간',
        category: 'Culture',
        categoryKr: '컬처',
        region: 'seongsu',
        imageUrl: '/lcdc_seoul.png',
        galleryUrls: [
            '/lcdc_seoul.png'
        ],
        description: 'LCDC Seoul is a multi-story lifestyle complex built in a repurposed automotive repair shop. Centered around a sleek concrete courtyard, it curates independent fashion, design stationery, and custom craft boutiques under one unified architectural editorial theme.',
        descriptionKr: 'LCDC 서울은 옛 자동차 정비소를 미니멀한 복합 문화 공간으로 탈바꿈시킨 공간입니다. 정방형의 모던한 콘크리트 중정을 중심으로, 감도 높은 패션, 스테이셔너리, 독립 공예 디자인 매장들이 조화롭게 들어서 있는 편집샵입니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=LCDC+Seoul',
        isPremium: false
    },
    'ofr-seoul': {
        title: 'Ofr. Seoul: Avant-garde Print Matter & Metallic Archives',
        titleKr: '오프레 서울: 가공되지 않은 금속 선반과 예술 서적의 미학',
        category: 'Culture',
        categoryKr: '컬처',
        region: 'seongsu',
        imageUrl: '/ofr_seoul.png',
        galleryUrls: [
            '/ofr_seoul.png'
        ],
        description: 'Ofr. Seoul is the Seoul branch of the Parisian independent art bookshop. Hidden inside a vintage brick building, it features global art books, fashion magazines, and indie prints stacked on industrial metallic racks.',
        descriptionKr: '오프레 서울은 프랑스 파리의 유서 깊은 독립 예술 서점 Ofr.의 서울 지점입니다. 오래된 주택 건물의 빈티지한 골조 속에서, 차가운 산업용 금속 렉 선반 위에 전 세계의 감각적인 예술 서적, 패션 독립 잡지, 포스터들을 아카이브해 둡니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=Ofr+Seoul',
        isPremium: false
    }�� 새로운 경지를 보여줍니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=Tamburins+Seongsu',
        isPremium: false
    },
    'lcdc-seoul': {
        title: 'LCDC Seoul: The Spatial Collage of Independent Curation',
        titleKr: 'LCDC 서울: 감도 높은 라이프스타일 큐레이션 복합공간',
        category: 'Culture',
        categoryKr: '컬처',
        region: 'seongsu',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
        galleryUrls: [
            'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'LCDC Seoul is a multi-story lifestyle complex built in a repurposed automotive repair shop. Centered around a sleek concrete courtyard, it curates independent fashion, design stationery, and custom craft boutiques under one unified architectural editorial theme.',
        descriptionKr: 'LCDC 서울은 옛 자동차 정비소를 미니멀한 복합 문화 공간으로 탈바꿈시킨 공간입니다. 정방형의 모던한 콘크리트 중정을 중심으로, 감도 높은 패션, 스테이셔너리, 독립 공예 디자인 매장들이 조화롭게 들어서 있는 편집샵입니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=LCDC+Seoul',
        isPremium: false
    },
    'ofr-seoul': {
        title: 'Ofr. Seoul: Avant-garde Print Matter & Metallic Archives',
        titleKr: '오프레 서울: 가공되지 않은 금속 선반과 예술 서적의 미학',
        category: 'Culture',
        categoryKr: '컬처',
        region: 'seongsu',
        imageUrl: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=800',
        galleryUrls: [
            'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'Ofr. Seoul is the Seoul branch of the Parisian independent art bookshop. Hidden inside a vintage brick building, it features global art books, fashion magazines, and indie prints stacked on industrial metallic racks.',
        descriptionKr: '오프레 서울은 프랑스 파리의 유서 깊은 독립 예술 서점 Ofr.의 서울 지점입니다. 오래된 주택 건물의 빈티지한 골조 속에서, 차가운 산업용 금속 렉 선반 위에 전 세계의 감각적인 예술 서적, 패션 독립 잡지, 포스터들을 아카이브해 둡니다.',
        googleMapsUrl: 'https://maps.google.com/maps?q=Ofr+Seoul',
        isPremium: false
    }
}

const renderDescription = (text, t) => {
    if (!text) return null;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        
        const linkText = match[1];
        const linkUrl = match[2];
        
        if (linkUrl.startsWith('/')) {
            parts.push(
                <Link 
                    key={match.index} 
                    to={linkUrl} 
                    className="text-primary hover:underline font-black bg-primary/5 px-2.5 py-1 rounded-xl inline-block mx-1 border border-primary/10 hover:bg-primary/20 transition-all"
                >
                    {linkText}
                </Link>
            );
        } else {
            parts.push(
                <a 
                    key={match.index} 
                    href={linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                >
                    {linkText}
                </a>
            );
        }
        lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    
    return parts;
};

const SpaceDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { currentUser, credits, isSubscribed, unlockedContent } = useAuth()
    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hasAccess, setHasAccess] = useState(false)
    const [isUnlocking, setIsUnlocking] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        if (id) {
            const savedList = JSON.parse(localStorage.getItem('kult_curation') || '[]')
            setIsSaved(savedList.includes(id))
        }
    }, [id])

    const handleSaveToCuration = () => {
        if (!id) return
        const savedList = JSON.parse(localStorage.getItem('kult_curation') || '[]')
        let newList
        if (isSaved) {
            newList = savedList.filter(item => item !== id)
            alert(t("Removed from your Curation", "큐레이션에서 삭제되었습니다"))
        } else {
            newList = [...savedList, id]
            alert(t("Saved to your Curation!", "큐레이션에 저장되었습니다!"))
        }
        localStorage.setItem('kult_curation', JSON.stringify(newList))
        setIsSaved(!isSaved)
    }

    useEffect(() => {
        const fetchSpace = async () => {
            setLoading(true)
            try {
                // First try Firebase
                const docRef = doc(db, 'spaces', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setSpace(docSnap.data())
                } else if (dummySpaces[id]) {
                    // Fallback to local dummy data
                    setSpace(dummySpaces[id])
                } else {
                    setError(t('Information not found.', '정보를 찾을 수 없습니다.'))
                }
            } catch (err) {
                // On Firebase error, try dummy data fallback
                if (dummySpaces[id]) {
                    setSpace(dummySpaces[id])
                } else {
                    console.error("Error fetching space:", err)
                    setError(t('Connection failure.', '연결 실패.'))
                }
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchSpace()
        } else {
            setError(t('Please select a space.', '공간을 선택해주세요.'))
            setLoading(false)
        }
        window.scrollTo(0, 0)
    }, [id, t])

    useEffect(() => {
        if (space) {
            if (!space.isPremium) {
                setHasAccess(true)
            } else {
                const hasPurchased = unlockedContent?.includes(id)
                setHasAccess(!!(isSubscribed || hasPurchased))
            }
        }
    }, [space, id, isSubscribed, unlockedContent])

    const handleUnlock = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!currentUser) {
            alert(t("Please sign in to unlock content", "로그인 후 콘텐츠를 잠금 해제해 주세요"))
            navigate('/join')
            return
        }

        if (credits < 5) {
            alert(t("Insufficient credits. Please refill in the store.", "크레딧이 부족합니다. 스토어에서 충전해 주세요."))
            navigate('/subscribe')
            return
        }

        const confirmUnlock = window.confirm(t(
            "Unlock this Premium Column for 5 credits?",
            "이 프리미엄 칼럼을 5 크레딧으로 잠금 해제하시겠습니까?"
        ))

        if (!confirmUnlock) return

        setIsUnlocking(true)
        try {
            const userRef = doc(db, 'users', currentUser.uid)
            await updateDoc(userRef, {
                credits: increment(-5),
                unlockedContent: arrayUnion(id)
            })
        } catch (error) {
            console.error("Error unlocking space:", error)
            alert(t("Failed to unlock. Please try again.", "잠금 해제에 실패했습니다. 다시 시도해 주세요."))
        } finally {
            setIsUnlocking(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcf9f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !space) {
        return (
            <div className="min-h-screen bg-[#fcf9f5]">
                <Header />
                <div className="max-w-xl mx-auto px-6 py-32 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("Notice", "안내")}</h2>
                    <p className="text-slate-500 mb-10">{error}</p>
                    <button onClick={() => navigate('/')} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold">
                        {t("Go Home", "홈으로 가기")}
                    </button>
                </div>
            </div>
        )
    }

    const regionLabel = space.region?.charAt(0).toUpperCase() + space.region?.slice(1)

    return (
        <div className="min-h-screen bg-[#fcf9f5] selection:bg-primary/10 selection:text-primary">
            <Header />

            {/* Content Container */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide lowercase">{t("Back to Home", "홈으로 돌아가기")}</span>
                </Link>

                {/* Hero Section */}
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-auto md:aspect-[21/9] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden mb-12 shadow-sm">
                    <img
                        src={space.imageUrl}
                        className="w-full h-full object-cover"
                        alt={space.title}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="flex flex-col gap-3 text-white text-left">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                                {t(space.category, space.categoryKr || space.category)}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight md:leading-none">
                                {t(space.title, space.titleKr || space.title)}
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-medium opacity-90">
                                <span className="flex items-center gap-1.5 uppercase">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {regionLabel}, Korea
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left: Main Info (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-16">
                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 lowercase tracking-tight">
                                {t("a story of discovery", "발견의 이야기")}
                            </h2>
                            <div className="relative">
                                <p className={`text-lg md:text-xl text-slate-500 leading-[1.7] whitespace-pre-wrap font-medium ${!hasAccess ? 'h-64 overflow-hidden' : 'mb-12'}`} style={!hasAccess ? { WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' } : {}}>
                                    {renderDescription(t(space.description, space.descriptionKr || space.description), t)}
                                    {!hasAccess && "\n\n" + t("This space is more than just architecture. We dive deep into the philosophy of its creator, uncovering the rituals, the obsessions, and the quiet revolution happening behind its walls.", "이 공간은 단순한 건축물 그 이상입니다. 창시자의 철학과 의식, 집착, 그리고 그 벽 뒤에서 일어나고 있는 조용한 혁명을 파헤칩니다.")}
                                    {!hasAccess && "\n\n" + t("Exclusive interview. Unseen photographs. The full story — unlocked only for KULT members.", "독점 인터뷰. 비공개 사진들. KULT 멤버에게만 공개되는 완전한 이야기.")}
                                </p>
                                {!hasAccess && (
                                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fcf9f5] to-transparent pointer-events-none" />
                                )}
                            </div>

                            {!hasAccess && (
                                <div className="bg-white rounded-[2rem] p-8 md:p-12 text-center border border-slate-200 shadow-lg mb-12 relative overflow-hidden mt-8">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Orbit className="w-48 h-48 text-primary" />
                                    </div>
                                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">Premium Column</span>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 relative z-10">{t("Keep reading this column", "이 칼럼을 계속 읽으시겠어요?")}</h3>
                                    <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto relative z-10">{t("Join KULT to unlock the full story, exclusive interviews, and spatial insights.", "KULT 멤버십에 가입하고 전체 스토리와 독점 인터뷰를 확인하세요.")}</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                        <Link to="/subscribe" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/30 transition-all">
                                            {t("Subscribe Now", "멤버십 구독하기")}
                                        </Link>
                                        <button 
                                            onClick={handleUnlock}
                                            disabled={isUnlocking}
                                            className="px-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            {isUnlocking && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-900" />}
                                            {isUnlocking ? t("Unlocking...", "잠금 해제 중...") : t("Use Credits", "크레딧으로 열람")}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Metadata Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 py-10 border-y border-slate-100 gap-8 sm:gap-0">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">{t("Location", "위치")}</span>
                                    <span className="text-sm font-bold text-slate-900 uppercase">{regionLabel}, KR</span>
                                </div>
                                <div className="flex flex-col gap-2 sm:border-x sm:border-slate-100 sm:px-8">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">{t("Category", "카테고리")}</span>
                                    <span className="text-sm font-bold text-slate-900 uppercase">{t(space.category, space.categoryKr)}</span>
                                </div>
                                <div className="flex flex-col gap-2 sm:pl-8">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">{t("Discovery", "발견일")}</span>
                                    <span className="text-sm font-bold text-slate-900 uppercase">KULT SELECTS #{(id || '072').substring(0, 3).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {space.galleryUrls && space.galleryUrls.length > 0 ? (
                                space.galleryUrls.map((url, idx) => (
                                    <div key={idx} className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                                            alt={`Gallery ${idx + 1}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                                        <img src={space.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" alt="Gallery 1" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                                        <img src={space.imageUrl || "/placeholder.svg"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Gallery 2" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="flex flex-col gap-10 text-left">
                        {/* Action Card */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <button 
                                onClick={handleSaveToCuration}
                                className={`w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-8 shadow-xl ${
                                    isSaved 
                                        ? 'bg-slate-100 text-slate-800 border border-slate-200 shadow-slate-200/20' 
                                        : 'bg-primary text-white shadow-primary/20'
                                }`}
                            >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-800' : 'fill-white'}`} />
                                {isSaved ? t("Saved in Curation", "큐레이션에 저장됨") : t("Save to Curation", "큐레이션에 저장")}
                            </button>

                            {/* Connectivity */}
                            <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t("Connect", "연결")}</h4>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between group transition-colors cursor-pointer" onClick={() => window.open(space.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent((t(space.title, space.titleKr || space.title)) + ' ' + (space.region || ''))}`, '_blank')}>
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">{t("Official Website", "공식 웹사이트")}</span>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                    <div className="flex items-center justify-between group transition-colors cursor-pointer" onClick={() => window.open(space.instagramUrl || `https://www.instagram.com/explore/tags/${encodeURIComponent((t(space.title, space.titleKr || space.title)).replace(/\s+/g, ''))}`, '_blank')}>
                                        <div className="flex items-center gap-3">
                                            <Instagram className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">Instagram</span>
                                        </div>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location / Map Widget */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t("Location", "위치")}</h4>
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer" onClick={() => window.open(space.googleMapsUrl || 'https://maps.google.com', '_blank')}>
                                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-slate-300" />
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="px-4 py-2 bg-white rounded-full text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t("View Map", "지도 보기")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-900 uppercase">{space.region?.toUpperCase()}, KR</span>
                                <span className="text-[10px] text-slate-400 font-medium">37.5446° N, 127.0560° E</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="w-full max-w-[1440px] mx-auto px-12 py-16 mt-32 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3 opacity-60">
                    <Orbit className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-[10px] font-black tracking-widest uppercase">© 2024 KULT Media. All rights reserved.</span>
                </div>
                <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Spaces</span>
                    <span>Manifesto</span>
                    <span>Privacy</span>
                </div>
            </footer>
        </div>
    )
}

export default SpaceDetail
