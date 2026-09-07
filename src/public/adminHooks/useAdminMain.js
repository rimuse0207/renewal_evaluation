import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Request_Get_Axios } from "../../API";

export const useAdminMain = () => {
  const Navigation = useNavigate();
  const Login_Info = useSelector(
    (state) => state.Login_Info_Reducer_State?.Login_Info,
  );

  const [filterDept, setFilterDept] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchName, setSearchName] = useState("");
  const [targets, setTargets] = useState([]);

  // 데이터 가공 로직
  const processTargetData = useCallback((rawData) => {
    const map = new Map();
    rawData.forEach((row) => {
      if (!map.has(row.master_id)) {
        map.set(row.master_id, {
          id: row.email,
          master_id: row.master_id,
          name: row.fullName || "이름없음",
          position: row.titleName || "",
          dept: row.departmentName || "소속없음",
          evaluator_1st: row.eval1_id,
          evaluator_2nd: row.eval2_id,
          evaluator_1st_name: row.eval1_name,
          evaluator_2nd_name: row.eval2_name,
          master_status: row.status,
          perf_status: row.status,
          performance_status:
            row.status === "WAIT" ? "USER_WAITING" : "EVAL_WAITING",
          competency_status: "EVAL_WAITING",
          comprehensive_status:
            row.status === "DONE" || row.status === "COMPLETED"
              ? "COMPLETED"
              : "EVAL_WAITING",
          perf_score_1st: null,
          perf_score_2nd: null,
          comp_score_1st: null,
          comp_score_2nd: null,
          comment_1st: null,
          comment_2nd: null,
          final_grade_1st: null,
          final_grade_2nd: null,
          UrlPath: row.UrlPath,
        });
      }

      const target = map.get(row.master_id);
      if (row.eval_step === "1ST") {
        target.perf_score_1st = row.perf_score;
        if (row.abil_score != null && row.att_score != null) {
          target.comp_score_1st = (row.abil_score + row.att_score) / 2;
        }
        target.comment_1st = row.comment;
        target.final_grade_1st = row.final_grade;
      } else if (row.eval_step === "2ND") {
        target.perf_score_2nd = row.perf_score;
        if (row.abil_score != null && row.att_score != null) {
          target.comp_score_2nd = (row.abil_score + row.att_score) / 2;
        }
        target.comment_2nd = row.comment;
        target.final_grade_2nd = row.final_grade;
      }
    });
    return Array.from(map.values());
  }, []);

  // API 호출
  useEffect(() => {
    const fetchTargetList = async () => {
      try {
        const res = await Request_Get_Axios(`/Admin/adminUserList`, {
          selectedYear: Login_Info?.selectedAdminYear,
        });

        if (res.status) {
          setTargets(processTargetData(res.data));
        }
      } catch (error) {
        console.error("리스트 불러오기 실패:", error);
      }
    };
    fetchTargetList();
  }, [Login_Info?.selectedAdminYear, processTargetData]);

  // 요약 카운트 및 부서 목록
  const totalCount = targets.length;
  const completedCount = useMemo(
    () =>
      targets.filter((t) => {
        const myTargetRole =
          t.evaluator_1st === Login_Info?.email ? "1st" : "2nd";
        return myTargetRole === "1st" ? !!t.comment_1st : !!t.comment_2nd;
      }).length,
    [targets, Login_Info?.email],
  );
  const waitingCount = totalCount - completedCount;
  const departments = ["ALL", ...new Set(targets.map((t) => t.dept))];

  // 필터링 적용
  const filteredTargets = useMemo(() => {
    return targets.filter((target) => {
      const matchDept = filterDept === "ALL" || target.dept === filterDept;
      const matchName =
        searchName.trim() === "" || target.name.includes(searchName.trim());

      const myTargetRole =
        target.evaluator_1st === Login_Info?.email ? "1st" : "2nd";
      const isMyPartCompleted =
        myTargetRole === "1st" ? !!target.comment_1st : !!target.comment_2nd;

      let matchStatus = true;
      if (filterStatus === "WAITING") matchStatus = !isMyPartCompleted;
      else if (filterStatus === "COMPLETED") matchStatus = isMyPartCompleted;

      return matchDept && matchName && matchStatus;
    });
  }, [targets, filterDept, filterStatus, searchName, Login_Info?.email]);

  // 네비게이션
  const handleNavigate = useCallback(
    (path, targetId, isDisabled) => {
      if (isDisabled) {
        alert("대상자가 아직 성과 실적을 제출하지 않아 평가할 수 없습니다.");
        return;
      }
      Navigation(`/Admin/${path}/${Login_Info?.selectedAdminYear}/${targetId}`);
    },
    [Navigation, Login_Info?.selectedAdminYear],
  );

  // 상태 계산 함수들 반환
  const getEvalState = useCallback(
    (target, type) => {
      const isBoth = target.evaluator_1st === target.evaluator_2nd;
      const myTargetRole =
        target.evaluator_1st === Login_Info?.email ? "1st" : "2nd";
      const status = target[`${type}_status`];
      const score1st = target[`${type}_score_1st`];
      const score2nd = target[`${type}_score_2nd`];
      const myScore = myTargetRole === "1st" ? score1st : score2nd;
      const isBothDone =
        (score1st !== null && score2nd !== null) ||
        target.master_status === "DONE";

      if (status === "TEMP")
        return {
          text: "대상자 미제출",
          color: "gray",
          btnText: "평가하기",
          disabled: true,
          done: false,
        };
      if (isBothDone || (isBoth && score1st !== null))
        return {
          text: "평가 완료",
          color: "green",
          btnText: "확인",
          disabled: false,
          done: true,
        };
      if (myScore !== null && myScore !== undefined)
        return {
          text: "평가 완료",
          color: "blue",
          btnText: "확인",
          disabled: false,
          done: true,
        };
      return {
        text: "평가 필요",
        color: "orange",
        btnText: "평가하기",
        disabled: false,
        done: false,
      };
    },
    [Login_Info?.email],
  );

  const getComprehensiveState = useCallback(
    (target) => {
      const isBoth = target.evaluator_1st === target.evaluator_2nd;
      const myTargetRole =
        target.evaluator_1st === Login_Info?.email ? "1st" : "2nd";
      const myComment =
        myTargetRole === "1st" ? target.comment_1st : target.comment_2nd;
      const isFullyCompleted = isBoth
        ? !!target.comment_1st
        : (!!target.comment_1st && !!target.comment_2nd) ||
          target.master_status === "DONE";

      if (isFullyCompleted) {
        const finalCombinedGrade =
          target.final_grade_2nd || target.final_grade_1st || "확인";
        return {
          text: "평가 완료",
          color: "green",
          btnText: `확인`,
          disabled: false,
          done: true,
        };
      }
      if (myComment)
        return {
          text: "평가 완료",
          color: "blue",
          btnText: "확인",
          disabled: false,
          done: true,
        };
      return {
        text: "평가 필요",
        color: "orange",
        btnText: "종합 작성",
        disabled: false,
        done: false,
      };
    },
    [Login_Info?.email],
  );

  return {
    state: {
      selectedYear: Login_Info?.selectedAdminYear,
      filterDept,
      filterStatus,
      searchName,
      filteredTargets,
      totalCount,
      waitingCount,
      completedCount,
      departments,
    },
    actions: {
      setFilterDept,
      setFilterStatus,
      setSearchName,
      handleNavigate,
    },
    calculators: { getEvalState, getComprehensiveState },
  };
};
