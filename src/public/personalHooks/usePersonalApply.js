import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { usePersonalSelect } from "./usePersonalSelect";
import { Request_Post_Axios } from "../../API";

export const usePersonalApply = () => {
  const Navigation = useNavigate();
  const userApplyYear = useSelector(
    (state) => state.Now_Apply_Year_State.userApplyYear,
  );

  // 1. 데이터 로드 로직
  const { personalStatus, currentData } = usePersonalSelect(userApplyYear);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (personalStatus && personalStatus.status) {
      if (personalStatus.status !== "TEMP") {
        alert(
          "이미 제출이 완료되었거나 마감된 평가입니다. 수정할 수 없습니다.",
        );
        Navigation("/Home", { replace: true });
      }
    }
  }, [personalStatus, Navigation]);

  useEffect(() => {
    if (currentData && currentData.length > 0) {
      setTasks(currentData);
    } else if (currentData && currentData.length === 0) {
      setTasks([
        {
          task_id: Date.now(),
          category: "공통",
          task_name: "",
          task_result: "",
          weight: "",
          self_score: "10",
        },
      ]);
    }
  }, [currentData]);

  // 2. 비중 계산 로직
  const totalWeight = tasks.reduce(
    (sum, item) => sum + (Number(item.weight) || 0),
    0,
  );
  const isWeightValid = totalWeight === 100;

  // 3. 폼 제어 로직 (추가, 삭제, 변경)
  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        task_id: Date.now(),
        category: "공통",
        task_name: "",
        task_result: "",
        weight: "",
        self_score: "10",
      },
    ]);
  };

  const handleRemoveTask = (id) => {
    if (tasks.length === 1) {
      alert("최소 1개의 업무실적 항목이 필요합니다.");
      return;
    }
    setTasks(tasks.filter((task) => task.task_id !== id));
  };

  const handleChange = (id, field, value) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.task_id === id ? { ...task, [field]: value } : task,
      ),
    );
  };

  // 4. API 통신 로직 (JSON 전송)
  const saveToServer = async (actionType) => {
    try {
      if (!personalStatus.master_id) return;

      const payload = {
        master_id: personalStatus.master_id,
        tasks: tasks,
        action_type: actionType,
      };

      const res = await Request_Post_Axios(
        "/Personal/savePersonalTasks",
        payload,
      );

      if (res.status) {
        if (actionType === "SUBMIT") {
          alert("성공적으로 최종 제출되었습니다!");
          Navigation("/Home");
        } else {
          alert("임시저장 되었습니다.");
        }
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleTempSave = () => saveToServer("TEMP_SAVE");

  const handleFinalSubmit = () => {
    if (!isWeightValid) {
      alert(
        `업무비중의 총합이 100%가 되어야 최종 제출이 가능합니다.\n현재 총합: ${totalWeight}%`,
      );
      return;
    }

    const hasEmptyField = tasks.some(
      (t) => !t.task_name.trim() || !t.task_result.trim(),
    );
    if (hasEmptyField) {
      alert("작성되지 않은 추진업무나 추진실적이 있습니다.");
      return;
    }
    saveToServer("SUBMIT");
  };

  return {
    Navigation,
    tasks,
    personalStatus,
    totalWeight,
    isWeightValid,
    handleAddTask,
    handleRemoveTask,
    handleChange,
    handleTempSave,
    handleFinalSubmit,
  };
};
