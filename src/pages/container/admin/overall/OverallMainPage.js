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

export default function OverallMainPage() {
  const Navigation = useNavigate();
  const { evalYear, userId } = useParams();

  const { state, computed, actions } = useOverallEval(evalYear, userId);
  console.log("overallstate", state);
  if (state.loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        종합평가 데이터를 불러오는 중입니다...
      </div>
    );
  }

  const roleLabel =
    state.myRole === "1ST"
      ? "1차 평가자"
      : state.myRole === "2ST"
        ? "2차 평가자"
        : "";
  const isDone = state.targetInfo.status === "DONE";
  console.log("ADASDASDASD", state.targetInfo);
  return (
    <LayoutContainer>
      <SidebarPage />
      <MainContent>
        <ContentWrapper>
          {/* 1. 공통 헤더 */}
          <EvalHeader
            title={`${roleLabel} 종합평가 작성`}
            desc={
              <>
                대상자의 <strong>성과평가</strong> 및 <strong>역량평가</strong>{" "}
                세부 결과를 종합적으로 확인하고, 최종 평가 의견을 작성해주세요.
              </>
            }
            onBack={() => Navigation(-1)}
          />

          {/* 2. 공통 대상자 패널 (종합평가는 일괄 적용 버튼이 없으므로 showBatch=false) */}
          <EvalTargetPanel
            targetInfo={state.targetInfo}
            roleLabel={roleLabel}
            showBatch={false}
          />

          {/* 3. 성과평가 결과 (조회용 테이블) */}
          <SectionTitle>1. 성과평가 결과 (조회용)</SectionTitle>
          <PerformanceResultTable
            tasks={state.performanceTasks}
            totalPerf1={computed.scores.perf1}
            totalPerf2={computed.scores.perf2}
          />

          {/* 4. 역량평가 결과 (조회용 테이블) */}
          <SectionTitle>2. 역량평가 결과 (조회용)</SectionTitle>
          <CompetencyResultTable
            abilityItems={state.competencyAbility}
            attitudeItems={state.competencyAttitude}
            scores={computed.scores}
          />

          {/* 5. 최종 평가 등급 산출 UI */}
          <SectionTitle>3. 최종 평가 등급 점수</SectionTitle>
          <GradeSummaryCards
            scores={computed.scores}
            isBoth={state.isBoth}
            getGrade={computed.getGrade}
          />

          {/* 6. 종합 의견(코멘트) 작성 */}
          <SectionTitle>4. 종합 의견 작성</SectionTitle>
          <CommentSectionBox
            myRole={state.myRole}
            isBoth={state.isBoth}
            comments={state.comments}
            onCommentChange={actions.handleCommentChange}
            isDone={isDone}
          />

          {/* 7. 최종 제출 영역 */}
          {!isDone && (
            <ActionArea>
              <FinalSubmitButton onClick={actions.handleSubmit}>
                종합 의견 및 최종 평가 제출
              </FinalSubmitButton>
            </ActionArea>
          )}
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
