import { useState, useEffect, useMemo, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const useOverallEval = (evalYear, userId) => {
  const Navigation = useNavigate();

  const [loading, setLoading] = useState(true);
  const [myRole, setMyRole] = useState(null);
  const [isBoth, setIsBoth] = useState(false);
  const [targetInfo, setTargetInfo] = useState({});

  const [performanceTasks, setPerformanceTasks] = useState([]);
  const [competencyAbility, setCompetencyAbility] = useState([]);
  const [competencyAttitude, setCompetencyAttitude] = useState([]);
  const [comments, setComments] = useState({ comment1ST: "", comment2ND: "" });

  // 1. API 호출
  useEffect(() => {
    const fetchComprehensiveData = async () => {
      setLoading(true);
      try {
        const response = await Request_Get_Axios(`/Admin/userOverallDetail`, {
          evalYear,
          userId,
        });

        const data = response.data;
        if (response.status || data?.success) {
          setTargetInfo(data.targetInfo);
          setMyRole(data.myRole);
          setIsBoth(data.isBoth);
          setPerformanceTasks(data.performanceTasks || []);
          setCompetencyAbility(data.competencyAbility || []);
          setCompetencyAttitude(data.competencyAttitude || []);
          setComments({
            comment1ST: data.comments?.comment1ST || "",
            comment2ND: data.comments?.comment2ND || "",
          });
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
    fetchComprehensiveData();
  }, [evalYear, userId]);

  // 2. 점수 및 등급 자동 산출 로직 (Memoized)
  const scores = useMemo(() => {
    // 성과 점수 (100점 환산)
    const perf1 = performanceTasks.reduce(
      (acc, cur) => acc + ((Number(cur.eval1_score) || 0) / 10) * cur.weight,
      0,
    );
    const perf2 = performanceTasks.reduce(
      (acc, cur) => acc + ((Number(cur.eval2_score) || 0) / 10) * cur.weight,
      0,
    );

    // 역량 점수 (능력 + 태도 평균 100점 환산)
    const abil1 = competencyAbility.reduce(
      (acc, cur) => acc + (Number(cur.eval1_score) || 0),
      0,
    );
    const abil2 = competencyAbility.reduce(
      (acc, cur) => acc + (Number(cur.eval2_score) || 0),
      0,
    );
    const att1 = competencyAttitude.reduce(
      (acc, cur) => acc + (Number(cur.eval1_score) || 0),
      0,
    );
    const att2 = competencyAttitude.reduce(
      (acc, cur) => acc + (Number(cur.eval2_score) || 0),
      0,
    );

    const comp1 = (abil1 + att1) / 2;
    const comp2 = (abil2 + att2) / 2;

    // 성과 50% + 역량 50%
    const total1 = (perf1 + comp1) / 2;
    const total2 = (perf2 + comp2) / 2;

    // 겸직 및 1·2차 진행 상황에 따른 최종점수 산출
    let finalTotal = 0;
    if (isBoth) {
      finalTotal = total1;
    } else if (total1 > 0 && total2 > 0) {
      finalTotal = (total1 + total2) / 2;
    } else {
      finalTotal = total1 > 0 ? total1 : total2;
    }

    return {
      perf1: parseFloat(perf1.toFixed(1)),
      perf2: parseFloat(perf2.toFixed(1)),
      abil1,
      abil2,
      att1,
      att2,
      comp1: parseFloat(comp1.toFixed(1)),
      comp2: parseFloat(comp2.toFixed(1)),
      total1: parseFloat(total1.toFixed(1)),
      total2: parseFloat(total2.toFixed(1)),
      finalTotal: parseFloat(finalTotal.toFixed(1)),
    };
  }, [performanceTasks, competencyAbility, competencyAttitude, isBoth]);

  // 등급 계산 함수
  const getGrade = useCallback((score) => {
    if (!score || score === 0) return "-";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "D";
  }, []);

  // 3. 핸들러
  const handleCommentChange = useCallback((field, value) => {
    setComments((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const myComment =
      myRole === "1ST" ? comments.comment1ST : comments.comment2ND;
    if (!myComment.trim()) return alert("종합 의견을 작성해주세요.");

    const confirmMsg = isBoth
      ? "1·2차 통합 평가 대상자입니다. 종합 의견을 제출하시겠습니까?"
      : `${myRole === "1ST" ? "1차" : "2차"} 평가 종합 의견을 제출하시겠습니까?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await Request_Post_Axios("/Admin/saveOverallDetail", {
        masterId: targetInfo.masterId,
        evalStep: myRole,
        isBoth: isBoth,
        comment1ST: comments.comment1ST,
        comment2ND: comments.comment2ND,
        finalGrade: getGrade(myRole === "1ST" ? scores.total1 : scores.total2),
        evalYear,
      });

      if (response.status) {
        alert("종합 의견이 성공적으로 제출되었습니다.");
        Navigation(-1);
      }
    } catch (error) {
      alert("제출 중 오류가 발생했습니다.");
    }
  }, [
    myRole,
    comments,
    isBoth,
    targetInfo.masterId,
    scores.finalTotal,
    getGrade,
    Navigation,
  ]);

  return {
    state: {
      loading,
      myRole,
      isBoth,
      targetInfo,
      performanceTasks,
      competencyAbility,
      competencyAttitude,
      comments,
    },
    computed: { scores, getGrade },
    actions: { handleCommentChange, handleSubmit },
  };
};
