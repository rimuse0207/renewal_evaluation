export const DOMAIN = "@dhk.co.kr";
export const COMPANY_NAME = "디에이치케이솔루션";
export const MAIN_TITLE_NAME = "인사평가 시스템";

export const LOGIN_LABELING = {
  initial_Login_Message: "사내 메일 계정을 입력하여 인증번호를 인증 해주세요.",
  sended_Mail_Message: "메일로 발송된 6자리 인증번호를 입력해주세요.",
  input_Label_Message: "사내 계정(이메일)",
  button_Label_Message: "인증번호 전송",
};

export const MOCK_CRITERIA = [
  {
    level: "우수 (10~9)",
    desc: "실적이 목표수준대비 110%이상 성취되었거나, 업무성과가 예년에 비해 높은 수준",
  },
  {
    level: "보통 (8~7)",
    desc: "실적이 목표수준대비 100%내외 수준으로 성취되었거나, 업무성과가 예년과 유사한 수준",
  },
  {
    level: "미흡 (6~5)",
    desc: "실적이 목표수준대비 80%내외 수준으로 성취되었거나, 업무성과가 예년보다 조금 낮은 수준",
  },
  {
    level: "불량 (4~3)",
    desc: "실적이 목표수준대비 60%내외 수준으로 성취되었거나, 업무성과가 예년에 비해 훨씬 낮은 수준",
  },
];

export const YearList = [
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
];

export const MOCK_ORG_BY_YEAR = {
  2026: {
    경영지원: ["재무/회계/비서", "인사/총무/IT"],
    CE: [
      "Dicer(동탄)",
      "Grinder(동탄)",
      "Laser(동탄)",
      "Dicer(아산)",
      "Grinder(아산)",
      "Laser(아산)",
      "기술교육팀",
      "안전팀",
    ],
    영업: [
      "영업 1그룹",
      "영업 2그룹",
      "영업 3그룹",
      "영업기술팀",
      "부품소재팀",
      "OEM",
    ],
  },
  2025: {
    경영지원: ["경영지원1", "경영지원2"],
    CE: [
      "dicer",
      "grinder",
      "laser",
      "A_dicer",
      "A_grinder",
      "A_laser",
      "CE 지원",
    ],
    영업: ["장비영업", "영업기술", "부품소재", "OEM"],
  },
  2024: {
    경영지원: ["경영지원1", "경영지원2"],
    CE: [
      "dicer",
      "grinder",
      "laser",
      "A_dicer",
      "A_grinder",
      "A_laser",
      "CE 지원",
    ],
    영업: ["장비영업", "영업기술", "부품소재", "OEM"],
  },
  2023: {
    경영지원: ["경영지원1", "경영지원2"],
    CE: [
      "dicer",
      "grinder",
      "laser",
      "A_dicer",
      "A_grinder",
      "A_laser",
      "아산CE총괄",
    ],
    영업: ["장비영업", "영업기술", "부품소재", "OEM"],
  },
  2022: {
    경영지원: ["경영지원1", "경영지원2"],
    CE: [
      "dicer",
      "grinder",
      "laser",
      "A_dicer",
      "A_grinder",
      "A_laser",
      "아산CE총괄",
    ],
    영업: ["장비영업", "영업기술", "부품소재", "OEM"],
  },
  2021: {
    경영지원: ["경영지원1", "경영지원2"],
    CE: [
      "dicer",
      "grinder",
      "laser",
      "A_dicer",
      "A_grinder",
      "A_laser",
      "아산CE총괄",
    ],
    영업: ["장비영업", "영업기술", "부품소재"],
  },
};
