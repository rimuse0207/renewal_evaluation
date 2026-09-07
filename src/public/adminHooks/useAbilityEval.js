import { useState, useEffect, useMemo, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const useAbilityEval = (evalYear, userId) => {
  const Navigation = useNavigate();

  const [loading, setLoading] = useState(true);
  const [myRole, setMyRole] = useState(null);
  const [targetInfo, setTargetInfo] = useState({});
  const [competencyData, setCompetencyData] = useState({
    ability: [],
    attitude: [],
  });

  const [scores1st, setScores1st] = useState({});
  const [scores2nd, setScores2nd] = useState({});
  const [isBoth, setIsBoth] = useState(false);
  const [batchScore, setBatchScore] = useState("20");

  // 1. API 데이터 패칭
  useEffect(() => {
    const fetchEvalData = async () => {
      try {
        const response = await Request_Get_Axios(`/Admin/userAbilityDetail`, {
          evalYear,
          userId,
        });

        if (response.status || response.data?.success) {
          const data = response.data;
          setMyRole(data.myRole);
          setTargetInfo(data.targetInfo);
          setCompetencyData(data.competencyData);
          setScores1st(data.scores1st || {});
          setScores2nd(data.scores2nd || {});
          setIsBoth(data.isBoth);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert(
          error.response?.data?.message ||
            "데이터를 불러오는 중 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvalData();
  }, [evalYear, userId]);

  // 2. 현재 내 권한에 따른 State Setter 매핑
  const myScores = myRole === "1ST" ? scores1st : scores2nd;
  const setMyScores = myRole === "1ST" ? setScores1st : setScores2nd;

  // 3. 서브토탈 및 총점 계산 로직 (Memoized)
  const calculateSubtotal = (scoreData, categoryArray) => {
    return categoryArray.reduce(
      (sum, item) => sum + (Number(scoreData[item.id]) || 0),
      0,
    );
  };

  const subtotals = useMemo(() => {
    const ability1st = calculateSubtotal(scores1st, competencyData.ability);
    const attitude1st = calculateSubtotal(scores1st, competencyData.attitude);
    const ability2nd = calculateSubtotal(scores2nd, competencyData.ability);
    const attitude2nd = calculateSubtotal(scores2nd, competencyData.attitude);

    return {
      ability1st,
      attitude1st,
      total1st: (ability1st + attitude1st) / 2,
      ability2nd,
      attitude2nd,
      total2nd: (ability2nd + attitude2nd) / 2,
    };
  }, [scores1st, scores2nd, competencyData]);

  // 진행 상태 파악
  const myTotalScore =
    myRole === "1ST" ? subtotals.total1st : subtotals.total2nd;
  const totalItemsCount =
    competencyData.ability.length + competencyData.attitude.length;
  const evaluatedCount = Object.keys(myScores).length;
  const isAllEvaluated =
    totalItemsCount > 0 && evaluatedCount === totalItemsCount;

  // 4. 핸들러
  const handleScoreChange = useCallback(
    (id, value) => {
      setMyScores((prev) => ({ ...prev, [id]: Number(value) }));
    },
    [setMyScores],
  );

  const handleBatchApply = useCallback(() => {
    if (!window.confirm(`평가 항목에 ${batchScore}점을 일괄 부여하시겠습니까?`))
      return;
    const newScores = { ...myScores };
    competencyData.ability.forEach(
      (item) => (newScores[item.id] = Number(batchScore)),
    );
    competencyData.attitude.forEach(
      (item) => (newScores[item.id] = Number(batchScore)),
    );
    setMyScores(newScores);
  }, [batchScore, competencyData, myScores, setMyScores]);

  const handleSubmit = useCallback(async () => {
    if (!isAllEvaluated)
      return alert(
        "평가되지 않은 항목이 있습니다. 모든 항목에 점수를 부여해주세요.",
      );

    const confirmMessage = isBoth
      ? "1·2차 평가 대상자 입니다.\n제출 시 1차와 2차 평가 점수가 동일하게 동시 반영됩니다.\n최종 제출하시겠습니까?"
      : `${myRole === "1ST" ? "1차" : "2차"} 역량평가 점수를 최종 제출하시겠습니까?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const abilitySubtotal =
        myRole === "1ST" ? subtotals.ability1st : subtotals.ability2nd;
      const attitudeSubtotal =
        myRole === "1ST" ? subtotals.attitude1st : subtotals.attitude2nd;

      const response = await Request_Post_Axios("/Admin/saveUserAbility", {
        masterId: targetInfo.masterId,
        evalStep: myRole,
        myScores: myScores,
        isBoth: isBoth,
        abilScore: abilitySubtotal,
        attScore: attitudeSubtotal,
        comment: "",
        evalYear,
      });
      if (response.status) alert("역량평가 점수가 성공적으로 제출되었습니다.");
      Navigation(-1);
    } catch (error) {
      console.error("점수 제출 실패:", error);
      alert(
        error.response?.data?.message ||
          "점수 제출 중 서버 오류가 발생했습니다.",
      );
    }
  }, [
    isAllEvaluated,
    isBoth,
    myRole,
    targetInfo.masterId,
    myScores,
    subtotals,
    Navigation,
  ]);

  return {
    state: {
      loading,
      myRole,
      targetInfo,
      competencyData,
      scores1st,
      scores2nd,
      isBoth,
      batchScore,
    },
    computed: {
      subtotals,
      myTotalScore,
      totalItemsCount,
      evaluatedCount,
      isAllEvaluated,
    },
    actions: {
      setBatchScore,
      handleScoreChange,
      handleBatchApply,
      handleSubmit,
    },
  };
};
