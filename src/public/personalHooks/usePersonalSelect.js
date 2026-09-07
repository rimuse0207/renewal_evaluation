import { useState, useEffect } from "react";
import { Request_Get_Axios } from "../../API";

export const usePersonalSelect = (selectedYear) => {
  const [personalStatus, setPersonalStatus] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvaluation = async (year) => {
    if (!year || isLoading) return;

    setIsLoading(true);
    try {
      const request = await Request_Get_Axios(
        "/Personal/publicPersonalStatus",
        {
          selectedYear: year,
        },
      );

      if (request.status) {
        setPersonalStatus(request.data);
        setCurrentData(request.data.personalTask || []);
      } else {
        setPersonalStatus(null);
        setCurrentData([]);
      }
    } catch (error) {
      console.error("평가 데이터 조회 실패:", error);
      setPersonalStatus(null);
      setCurrentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // selectedYear가 변경될 때마다 자동 호출
  useEffect(() => {
    fetchEvaluation(selectedYear);
  }, [selectedYear]);

  // 컴포넌트에서 하던 데이터 분류 작업을 훅 안에서 처리하여 깔끔하게 만듭니다.
  const commonTasks = currentData.filter((item) => item.category === "공통");
  const personalTasks = currentData.filter((item) => item.category === "개인");
  const hasData = currentData.length > 0;

  // 컴포넌트에서 사용할 상태와 함수들만 반환
  return {
    personalStatus,
    currentData,
    commonTasks,
    personalTasks,
    hasData,
    refetch: () => fetchEvaluation(selectedYear), // 필요시 수동 재요청 기능
  };
};
