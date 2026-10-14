import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import SidebarPage from "../../nav/SidebarPage";

import { useOverallEval } from "../../../../public/adminHooks/useOverallEval";
import { EvalHeader, EvalTargetPanel } from "../common/EvalSharedUI";

import PerformanceResultTable from "./Table/PerformanceResultTable";
import CompetencyResultTable from "./Table/AbilityResultTable";
import GradeSummaryCards from "./Card/GradeSummaryCards";
import CommentSectionBox from "./Card/CommentSectionBos";
import { useSelector } from "react-redux";

export default function OverallMainPage() {
  const Navigation = useNavigate();
  const { evalYear, userId } = useParams();

  const { state, computed, actions } = useOverallEval(evalYear, userId);
  const Login_Info = useSelector(
    (state) => state.Login_Info_Reducer_State?.Login_Info,
  );

  if (state.loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        종합 의견 데이터를 불러오는 중입니다...
      </div>
    );
  }

  const roleLabel =
    state.myRole === "1ST"
      ? "1차 평가자"
      : state.myRole === "2ND"
        ? "2차 평가자"
        : state.myRole === "SELECT"
          ? "조회 전용"
          : "";

  const isDone = state.targetInfo.status === "DONE";

  const handlePrintOpen = () => {
    window.open(
      `/Print/OverallEval/${evalYear}/${userId}`,
      "_blank",
      "width=900,height=800",
    );
  };

  return (
    <LayoutContainer>
      <SidebarPage />
      <MainContent>
        <ContentWrapper>
          <EvalHeader
            title={`${roleLabel} 종합 의견 작성`}
            desc={
              <>
                대상자의 <strong>성과평가</strong> 및 <strong>역량평가</strong>{" "}
                세부 결과를 종합적으로 확인하고, 종합 의견을 작성해주세요.
              </>
            }
            onBack={() => Navigation(-1)}
          />

          <EvalTargetPanel
            targetInfo={state.targetInfo}
            roleLabel={roleLabel}
            showBatch={false}
          />

          <SectionTitle>1. 성과평가 결과 (조회용)</SectionTitle>
          <PerformanceResultTable
            tasks={state.performanceTasks}
            totalPerf1={computed.scores.perf1}
            totalPerf2={computed.scores.perf2}
          />

          <SectionTitle>2. 역량평가 결과 (조회용)</SectionTitle>
          <CompetencyResultTable
            abilityItems={state.competencyAbility}
            attitudeItems={state.competencyAttitude}
            scores={computed.scores}
          />

          <SectionTitle>3. 최종 평가 등급 점수</SectionTitle>
          <GradeSummaryCards
            scores={computed.scores}
            isBoth={state.isBoth}
            getGrade={computed.getGrade}
          />

          <SectionTitle>4. 종합 의견 작성</SectionTitle>
          <CommentSectionBox
            myRole={state.myRole}
            isBoth={state.isBoth}
            comments={state.comments}
            onCommentChange={actions.handleCommentChange}
            isDone={isDone || state.myRole === "SELECT"}
          />

          <ActionArea>
            {/* 프린터 출력 버튼 (SELECT 권한일 때만 활성화) */}
            {state.myRole === "SELECT" && Login_Info?.isEvalAccessHRMenu ? (
              <PrintButton onClick={handlePrintOpen}>프린터 출력</PrintButton>
            ) : (
              ""
            )}

            {/* 기존 제출 버튼 */}
            {!isDone && (state.myRole === "2ND" || state.myRole === "1ST") && (
              <FinalSubmitButton onClick={actions.handleSubmit}>
                종합 의견 및 최종 평가 제출
              </FinalSubmitButton>
            )}
          </ActionArea>
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f4f6f8;
`;
const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;
const ContentWrapper = styled.div`
  margin: 0 auto;
  padding: 20px 24px 100px 24px;
`;
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 18px;
    background-color: #0ea5e9;
    border-radius: 2px;
  }
`;
const ActionArea = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;
const PrintButton = styled.button`
  padding: 16px 40px;
  background-color: #475569;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.3);
  &:hover {
    background-color: #334155;
  }
`;
const FinalSubmitButton = styled.button`
  padding: 16px 40px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  &:hover {
    background-color: #0284c7;
  }
`;
