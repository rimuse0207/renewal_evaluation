import { useState, useEffect, useMemo } from "react";
import { Request_Get_Axios } from "../../API";

export const DEPT_GROUPS = {
  전체: "ALL",
  "경영지원 전체": [
    "경영지원2",
    "경영지원1",
    "재무팀",
    "인사총무팀",
    "IT팀",
    "재무/회계/비서",
    "인사/총무/IT",
  ],
  "CE 전체": [
    "A_grinder",
    "A_dicer",
    "A_laser",
    "grinder",
    "dicer",
    "laser",
    "ce지원",
    "기술교육팀",
    "안전팀",
    "Dicer(동탄)",
    "Grinder(동탄)",
    "Laser(동탄)",
    "Dicer(아산)",
    "Grinder(아산)",
    "Laser(아산)",
  ],
  "영업 전체": [
    "영업1팀",
    "영업2팀",
    "영업3팀",
    "장비영업",
    "영업기술",
    "부품소재",
    "OEM",
    "부품소재팀",
    "영업기술팀",
    "영업 1그룹",
    "영업 2그룹",
    "영업 3그룹",
  ],
};
export const useAdminResult = () => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedGroup, setSelectedGroup] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchAllResults = async () => {
      setLoading(true);
      try {
        const res = await Request_Get_Axios(`/Admin/getAdminAllResults`, {
          evalYear: selectedYear,
        });

        if (res.status) {
          setRawData(res.data || []);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllResults();
  }, [selectedYear]);

  const filteredData = useMemo(() => {
    if (selectedGroup === "전체") return rawData;
    const targetTeams = DEPT_GROUPS[selectedGroup] || [];
    return rawData.filter((user) => targetTeams.includes(user.dept));
  }, [rawData, selectedGroup]);

  const groupedData = useMemo(() => {
    const groups = { A: [], B: [], C: [], D: [], None: [] };

    filteredData.forEach((user) => {
      // 1. 점수 합산 로직 (1차, 2차)
      const total1 = (Number(user.perf1 || 0) + Number(user.comp1 || 0)) / 2;
      const total2 = (Number(user.perf2 || 0) + Number(user.comp2 || 0)) / 2;
      const isBoth = user.eval1_id === user.eval2_id;

      // 2. 1차/2차 평균을 통한 최종 점수 산출
      let finalTotal = 0;
      if (isBoth) finalTotal = total1;
      else if (total1 > 0 && total2 > 0) finalTotal = (total1 + total2) / 2;
      else finalTotal = total1 > 0 ? total1 : total2;

      // 🌟 3. 최종 등급 판정 (수정된 부분)
      // 기존 DB의 grade1, grade2를 무시하고 오직 finalTotal(환산점수) 기준으로 절대평가 등급을 강제 부여합니다.
      let finalGrade = null;

      if (finalTotal >= 90) {
        finalGrade = "A";
      } else if (finalTotal >= 80) {
        finalGrade = "B";
      } else if (finalTotal >= 70) {
        finalGrade = "C";
      } else if (finalTotal > 0) {
        // 점수가 1점이라도 있으면 D등급
        finalGrade = "D";
      }

      const parsedUser = { ...user, total1, total2, finalTotal, finalGrade };

      // 4. 리스트 분배
      if (finalGrade && groups[finalGrade]) {
        groups[finalGrade].push(parsedUser);
      } else {
        groups.None.push(parsedUser); // 점수가 0점(아예 평가 안함)인 경우
      }
    });

    return groups;
  }, [filteredData]);

  const chartData = useMemo(() => {
    // 💡 S등급 관련 컬러 제거
    const colorMap = {
      A: "#3b82f6",
      B: "#22c55e",
      C: "#f59e0b",
      D: "#64748b",
      미완료: "#cbd5e1",
    };

    const barData = [
      { grade: "A", count: groupedData.A.length, color: colorMap.A },
      { grade: "B", count: groupedData.B.length, color: colorMap.B },
      { grade: "C", count: groupedData.C.length, color: colorMap.C },
      { grade: "D", count: groupedData.D.length, color: colorMap.D },
    ];

    // 💡 전체 인원수를 구해서 퍼센트(비율) 계산
    const totalEvaluated = barData.reduce((acc, cur) => acc + cur.count, 0);

    const pieData = barData
      .filter((d) => d.count > 0)
      .map((d) => ({
        id: d.grade,
        label: `${d.grade}등급`,
        value: d.count,
        color: d.color,
        // 소수점 1자리까지 비율 계산
        percentage:
          totalEvaluated > 0
            ? ((d.count / totalEvaluated) * 100).toFixed(1)
            : 0,
      }));

    return { barData, pieData, totalEvaluated };
  }, [groupedData]);

  return {
    selectedYear,
    setSelectedYear,
    selectedGroup,
    setSelectedGroup,
    loading,
    groupedData,
    chartData,
  };
};
