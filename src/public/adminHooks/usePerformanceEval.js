import { useState, useEffect, useMemo, useCallback } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const usePerformanceEval = (evalYear, userId) => {
  const [loading, setLoading] = useState(true);
  const [targetStatus, setTargetStatus] = useState("TEMP");
  const [myRole, setMyRole] = useState(null);
  const [isBoth, setIsBoth] = useState(false);
  const [targetInfo, setTargetInfo] = useState({});
  const [tasks, setTasks] = useState([]);

  const [evalScores, setEvalScores] = useState({});
  const [batchScore, setBatchScore] = useState("");

  // 1. API 데이터 패칭
  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const response = await Request_Get_Axios(
          `/Admin/userPerformanceDetail`,
          { evalYear, userId },
        );
        if (response.status) {
          const data = response.data;
          setTargetStatus(data.targetStatus);
          setTargetInfo(data.targetInfo);
          setMyRole(data.myRole);
          setIsBoth(data.isBoth);
          setTasks(data.tasks || []);

          // 초기 점수 셋업
          const initialScores = {};
          (data.tasks || []).forEach((task) => {
            if (data.isBoth || data.myRole === "1ST") {
              if (task.eval1_score)
                initialScores[task.task_id] = task.eval1_score;
            } else if (data.myRole === "2ND") {
              if (task.eval2_score)
                initialScores[task.task_id] = task.eval2_score;
            }
          });
          setEvalScores(initialScores);
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
    fetchPerformanceData();
  }, [evalYear, userId]);

  // 2. 점수 계산 로직
  const totalCalculatedScore = useMemo(() => {
    let sum = 0;
    tasks.forEach((task) => {
      if (evalScores[task.task_id]) {
        sum += (evalScores[task.task_id] / 10) * task.weight;
      }
    });
    return parseFloat(sum.toFixed(2));
  }, [tasks, evalScores]);

  const isAllEvaluated = useMemo(() => {
    return tasks.length > 0 && tasks.every((task) => evalScores[task.task_id]);
  }, [tasks, evalScores]);

  // 3. 핸들러
  const handleScoreChange = useCallback((taskId, score) => {
    setEvalScores((prev) => ({ ...prev, [taskId]: Number(score) }));
  }, []);

  const handleBatchApply = useCallback(() => {
    if (!batchScore) return alert("일괄 적용할 점수를 선택해주세요.");
    if (!window.confirm(`모든 항목에 ${batchScore}점을 일괄 적용하시겠습니까?`))
      return;

    const newScores = { ...evalScores };
    tasks.forEach((task) => {
      newScores[task.task_id] = Number(batchScore);
    });
    setEvalScores(newScores);
    setBatchScore("");
  }, [batchScore, evalScores, tasks]);

  const handleSubmit = useCallback(async () => {
    if (!isAllEvaluated)
      return alert(
        "평가되지 않은 항목이 있습니다. 모든 항목에 점수를 부여해주세요.",
      );

    const confirmMsg = isBoth
      ? `1·2차 평가 대상자 입니다.\n제출 시 1차/2차 모두 총 ${totalCalculatedScore}점으로 동시 반영됩니다.\n최종 제출하시겠습니까?`
      : `총 ${totalCalculatedScore}점으로 성과평가를 제출하시겠습니까?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await Request_Post_Axios("/Admin/saveUserPerformance", {
        masterId: targetInfo.masterId,
        evalStep: myRole,
        isBoth,
        scores: evalScores,
        totalScore: totalCalculatedScore,
        evalYear,
      });
      if (response.status) alert("성과평가가 성공적으로 제출되었습니다.");
    } catch (error) {
      console.error("점수 제출 실패:", error);
      alert(
        error.response?.data?.message || "제출 중 서버 오류가 발생했습니다.",
      );
    }
  }, [
    isAllEvaluated,
    isBoth,
    totalCalculatedScore,
    targetInfo.masterId,
    myRole,
    evalScores,
  ]);

  return {
    state: {
      loading,
      targetStatus,
      myRole,
      isBoth,
      targetInfo,
      tasks,
      evalScores,
      batchScore,
      totalCalculatedScore,
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
