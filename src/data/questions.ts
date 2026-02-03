export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    type: "T" | "E";
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    question: "친구와 약속이 갑자기 취소됐을 때 나는?",
    options: [
      { text: "아쉽지만 다른 할 일을 찾는다", type: "T" },
      { text: "마음이 상하고 걱정이 된다", type: "E" }
    ]
  },
  {
    id: 2,
    question: "새로운 프로젝트를 시작할 때 나는?",
    options: [
      { text: "목표를 세우고 계획적으로 진행한다", type: "T" },
      { text: "직감을 따라 유연하게 진행한다", type: "E" }
    ]
  },
  {
    id: 3,
    question: "스트레스를 받을 때 나는?",
    options: [
      { text: "운동이나 활동적인 걸로 푼다", type: "T" },
      { text: "혼자만의 시간을 가지며 힐링한다", type: "E" }
    ]
  },
  {
    id: 4,
    question: "친구가 고민을 털어놓을 때 나는?",
    options: [
      { text: "해결책을 제시하고 조언한다", type: "T" },
      { text: "공감하고 위로를 건넨다", type: "E" }
    ]
  },
  {
    id: 5,
    question: "주말에 하고 싶은 일은?",
    options: [
      { text: "등산, 헬스 등 활동적인 취미", type: "T" },
      { text: "영화, 독서 등 조용한 취미", type: "E" }
    ]
  },
  {
    id: 6,
    question: "의견 충돌이 생겼을 때 나는?",
    options: [
      { text: "논리적으로 설명하며 해결한다", type: "T" },
      { text: "상대방 감정을 먼저 배려한다", type: "E" }
    ]
  },
  {
    id: 7,
    question: "쇼핑할 때 나는?",
    options: [
      { text: "필요한 것만 빠르게 구매한다", type: "T" },
      { text: "여러 제품을 둘러보며 고민한다", type: "E" }
    ]
  },
  {
    id: 8,
    question: "팀 프로젝트에서 내 역할은?",
    options: [
      { text: "리더십을 발휘하며 이끈다", type: "T" },
      { text: "팀원들을 조율하고 지원한다", type: "E" }
    ]
  },
  {
    id: 9,
    question: "감동적인 영화를 봤을 때 나는?",
    options: [
      { text: "재밌었다고 생각하고 넘어간다", type: "T" },
      { text: "여운이 오래 남고 감동받는다", type: "E" }
    ]
  },
  {
    id: 10,
    question: "새로운 사람을 만날 때 나는?",
    options: [
      { text: "적극적으로 먼저 다가간다", type: "T" },
      { text: "상대방이 다가오길 기다린다", type: "E" }
    ]
  }
];
