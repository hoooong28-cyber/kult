import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDq9NfEcmAI0Mzh825rDa4ZgIpTpYSB-7o",
    authDomain: "kult-discovery.firebaseapp.com",
    projectId: "kult-discovery",
    storageBucket: "kult-discovery.firebasestorage.app",
    messagingSenderId: "12131820673",
    appId: "1:12131820673:web:682dce3002a681d11b9980",
    measurementId: "G-LEERZ24PL9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const docRef = doc(db, "magazines", "ptnTEMnLpWJ7WR5WHjJQ");

const updateData = {
  description: "Welcome the blooming spring with Olive Young! From a radiant morning makeup routine to a relaxing afternoon tea time, and finishing with a fragrant bath. Discover the perfect beauty and lifestyle routine for this spring season.",
  descriptionKr: "올리브영과 함께 맞이하는 설렘 가득한 봄날! 아침의 화사한 메이크업부터 오후의 여유로운 홈카페, 그리고 하루를 마무리하는 향기로운 배쓰타임까지. 완벽한 봄맞이 뷰티&라이프 루틴을 대공개합니다.",
  sections: [
    {
      title: "11:00 AM - Morning Bloom",
      titleKr: "오전 11시 - 인간 벚꽃 룩",
      imageUrl: "/images/ig_post/2026-03-27_06-00-11_UTC_1.jpg",
      content: "Embrace the spring vibe with vibrant colors 🌸 Tint your cheeks with 'Dasique Blending Mood Cheek' and add a glossy shine with 'MERZY Double Glaze Lacquer'. Finish off with the jelly-like texture of 'WAKEMAKE Nail Gun' spring colors for a flawless lovely look!",
      contentKr: "봄기운을 가득 머금은 화사한 색감 🌸 '데이지크 블렌딩 무드 치크'로 두 뺨을 물들이고, 은은하고 영롱한 반짝임의 '머지 더블 글레이즈 락커'로 생기를 더해보세요. 손끝까지 완벽하게, 젤리 질감의 '웨이크메이크 네일건' 봄 시즌 컬러를 올려주면 완벽한 인간 벚꽃 룩 완성!"
    },
    {
      title: "3:00 PM - Afternoon Tea",
      titleKr: "오후 3시 - 따사로운 홈카페",
      imageUrl: "/images/ig_post/2026-03-27_06-00-11_UTC_2.jpg",
      content: "3:00 PM, a relaxing moment just for you ☕️ Take a bite of the healthy yet delicious 'Nuldam Cherry Blossom Fat-Caron' paired with warm coffee. The chewy shell and sweet cream instantly elevate your afternoon home cafe experience.",
      contentKr: "나른한 오후 3시, 온전한 나만의 휴식 시간 ☕️ 건강함과 맛을 동시에 잡은 '널담 벚꽃 에디션 뚱카롱' 한 입, 그리고 따뜻한 커피 한 잔. 쫀득한 꼬끄와 달콤한 체리블라썸 크림의 조화가 홈카페의 여유를 더욱 달콤하게 만들어줍니다."
    },
    {
      title: "9:00 PM - Evening Relaxation",
      titleKr: "밤 9시 - 핑크빛 배쓰타임",
      imageUrl: "/images/ig_post/2026-03-27_06-00-11_UTC_3.jpg",
      content: "9:00 PM, time to wash away the day's fatigue 🌙 Enjoy a rich bubble bath with the vegan 'ROUND A'ROUND Colorful Mood Bubble Bath Bomb'. Follow it up with 'WHIPPED Muwha Butter Vegan Body Butter' to lock in moisture with a sweet fig scent. A perfect, relaxing end to your day!",
      contentKr: "하루의 피로를 씻어내는 밤 9시 🌙 식물 유래 오일이 함유된 비건 입욕제 '라운드어라운드 컬러풀 무드 버블 배쓰밤'으로 풍성한 거품 목욕을 즐겨보세요. 목욕 후엔 달콤한 무화과 향이 매력적인 '휩드 무화버터 비건 바디버터'로 보습까지 탄탄하게 채우면 하루의 완벽한 마무리!"
    }
  ]
};

async function run() {
  try {
    await updateDoc(docRef, updateData);
    console.log("Successfully updated the magazine document.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating document: ", error);
    process.exit(1);
  }
}

run();
