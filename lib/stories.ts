export interface Story {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  curator_ids: string[];
  place_ids: string[];
  paragraphs: string[];
}
// Editorial notes assembled from existing curator records, not invented interviews or visits.
export const stories: Story[] = [
  {
    id: 'seongsu-work-and-coffee',
    title: '성수에서 고르는, 서로 다른 두 작업 공간',
    subtitle: '높은 층고의 쿠코와 아늑한 지하의 로우키. 같은 목적에도 선택은 달라집니다.',
    author: 'KULT 편집 노트', curator_ids: ['founder'], place_ids: ['cuco-seongsu', 'lowkey-seongsu'],
    paragraphs: [
      '작업할 공간을 고를 때 무엇을 먼저 보나요? 공간의 넓이, 빛이 들어오는 방식, 혼자 머무를 때의 편안함. 같은 동네에서도 선택의 기준은 사람마다 다릅니다.',
      'KULT에 등록된 Founder의 쿠코 추천에는 공장을 개조한 높은 층고와 통창, 노트북 작업, 예약 가능한 브런치가 함께 등장합니다. 일을 하다가 식사까지 이어가고 싶은 날에 살펴볼 만한 기록입니다.',
      '로우키 성수의 추천에는 아늑한 지하 작업 공간과 스페셜티 원두, 혼자 집중해서 글쓰는 시간이 담겨 있습니다. 탁 트인 공간과 아늑한 공간 중 어느 쪽에서 더 오래 머물고 싶은지 생각해 보세요.',
      '아래 공간을 열어 큐레이터의 원래 추천 이유를 읽고, 다음에 가보고 싶은 곳을 내 KULT에 저장해 보세요. 이 글은 기존 큐레이터 기록을 연결한 편집 노트이며 새 방문 후기나 인터뷰가 아닙니다. 영업 정보는 방문 전에 확인해 주세요.',
    ],
  },
  {
    id: 'seoul-forest-coffee-pause',
    title: '커피를 고르는 날, 공간을 고르는 날',
    subtitle: '서울숲의 센터커피에서 성수의 로우키까지, 큐레이션을 따라 읽는 커피 공간.',
    author: 'KULT 편집 노트', curator_ids: ['founder'], place_ids: ['center-coffee-seoulforest', 'lowkey-seongsu'],
    paragraphs: [
      '좋은 공간을 발견하는 출발점은 꼭 검색어일 필요가 없습니다. 한 사람이 왜 그곳을 골랐는지 읽다 보면, 내가 중요하게 생각하는 조건도 조금 더 선명해집니다.',
      'Founder의 센터커피 서울숲점 기록은 서울숲 공원 조망과 필터 커피, 바리스타의 메뉴 설명에 주목합니다. 커피 자체를 천천히 알아보고 싶은 날에 읽어볼 추천입니다.',
      '같은 큐레이터의 로우키 기록에서는 혼자 머물며 집중하는 시간이 앞에 옵니다. 한 사람의 리스트에도 서로 다른 상황을 위한 선택이 함께 있습니다.',
      '두 공간의 상세 정보를 비교하고 마음에 드는 곳을 저장해 보세요. 이 글은 기존 KULT 장소 기록을 바탕으로 정리한 편집 노트이며, 별도의 방문 검증이나 셀럽 추천을 뜻하지 않습니다.',
    ],
  },
];
export const getStory = (id:string) => stories.find(story => story.id === id);
export const storiesForPlace = (id:string) => stories.filter(story => story.place_ids.includes(id));
export const storiesForCurator = (id:string) => stories.filter(story => story.curator_ids.includes(id));
