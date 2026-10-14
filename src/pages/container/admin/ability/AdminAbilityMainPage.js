import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import SidebarPage from "../../nav/SidebarPage";

import { useAbilityEval } from "../../../../public/adminHooks/useAbilityEval";
import { EvalHeader, EvalSummaryBar } from "../common/EvalSharedUI";
import CompetencySection from "./Section/AblilitySection";
import { Avatar } from "../main/Table/TargetTableRow";

export default function CompetencyEvalPage() {
  const Navigation = useNavigate();
  const { evalYear, userId } = useParams();

  const { state, computed, actions } = useAbilityEval(evalYear, userId);

  if (state.loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        평가 데이터를 불러오는 중입니다...
      </div>
    );

  const roleLabel = state.myRole === "1ST" ? "1차 평가자" : "2차 평가자";
  const isDone = state.targetInfo.status === "DONE";

  return (
    <LayoutContainer>
      <SidebarPage />
      <MainContent>
        <ContentWrapper>
          {/* 1. 공통 헤더 (재사용) */}
          <EvalHeader
            title={`${roleLabel} 역량평가`}
            desc={
              <>
                각 부문(능력,태도)별 점수 합산 후{" "}
                <strong>최종 100점 만점</strong>
                으로 자동 환산됩니다.
              </>
            }
            onBack={() => Navigation(-1)}
          />

          {/* 2. 공통 대상자 & 일괄 적용 패널 (재사용) - Select Option 커스텀을 위해 약간의 변형이 필요하다면 EvalSharedUI 쪽에 children으로 받게 고도화할 수 있습니다 */}
          <ControlPanel>
            <TargetInfo>
              <Avatar>
                {state.targetInfo.UrlPath && (
                  <img
                    src={`http://192.168.2.245/download/image/${state.targetInfo.UrlPath}`}
                    alt="User_Image"
                    width={"100%"}
                  ></img>
                )}
              </Avatar>
              <div>
                <TargetName>
                  {state.targetInfo.name} {state.targetInfo.title}
                </TargetName>
                <TargetDept>{state.targetInfo.dept}</TargetDept>
              </div>
            </TargetInfo>
            {!isDone && (
              <BatchActionBox>
                <span className="label"> {roleLabel} 일괄 점수 부여:</span>
                <BatchSelect
                  value={state.batchScore}
                  onChange={(e) => actions.setBatchScore(e.target.value)}
                >
                  {[...Array(21)].map((_, i) => (
                    <option key={20 - i} value={20 - i}>
                      {20 - i}점
                    </option>
                  ))}
                </BatchSelect>
                <BatchButton onClick={actions.handleBatchApply}>
                  적용하기
                </BatchButton>
              </BatchActionBox>
            )}
          </ControlPanel>

          {/* 3. 공통 요약 바 (재사용) */}
          <EvalSummaryBar
            roleLabel={roleLabel}
            isBoth={state.isBoth}
            score={computed.myTotalScore}
            isValid={computed.isAllEvaluated}
            validMsg="모든 항목 평가 완료 (제출 가능)"
            invalidMsg={`평가 대기 중 (${computed.totalItemsCount - computed.evaluatedCount}항목 남음)`}
          />

          {/* 4. 역량평가 섹션 (능력 / 태도 재사용 컴포넌트로 렌더링) */}
          <EvalSection>
            <CompetencySection
              title="1. 역량평가 - 능력 부문"
              items={state.competencyData.ability}
              scores1st={state.scores1st}
              scores2nd={state.scores2nd}
              myRole={state.myRole}
              isBoth={state.isBoth}
              subtotal1st={computed.subtotals.ability1st}
              subtotal2nd={computed.subtotals.ability2nd}
              maxScore={100}
              onScoreChange={actions.handleScoreChange}
              isDone={isDone}
            />

            <CompetencySection
              title="2. 역량평가 - 태도 부문"
              items={state.competencyData.attitude}
              scores1st={state.scores1st}
              scores2nd={state.scores2nd}
              myRole={state.myRole}
              isBoth={state.isBoth}
              subtotal1st={computed.subtotals.attitude1st}
              subtotal2nd={computed.subtotals.attitude2nd}
              maxScore={100}
              onScoreChange={actions.handleScoreChange}
              isDone={isDone}
            />
          </EvalSection>

          {/* 5. 제출 버튼 영역 */}
          {state.targetInfo.status !== "DONE" && (
            <ActionArea>
              <FinalSubmitButton
                onClick={actions.handleSubmit}
                $isValid={computed.isAllEvaluated}
              >
                {roleLabel} 평가 제출
              </FinalSubmitButton>
            </ActionArea>
          )}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

// --- Styled Components ---
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

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
`;

const TargetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TargetName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`;

const TargetDept = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 4px;
`;

const BatchActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f0f9ff;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px dashed #7dd3fc;

  .label {
    font-size: 0.95rem;
    font-weight: 600;
    color: #0369a1;
  }
`;

const BatchSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  outline: none;
  font-weight: 600;
  color: #0c4a6e;
`;

const BatchButton = styled.button`
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0284c7;
  }
`;

const EvalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
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
  padding: 14px 36px;
  background-color: ${(props) => (props.$isValid ? "#0ea5e9" : "#cbd5e1")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.$isValid ? "pointer" : "not-allowed")};
  box-shadow: ${(props) =>
    props.$isValid ? "0 4px 12px rgba(14, 165, 233, 0.3)" : "none"};
  &:hover {
    background-color: ${(props) => (props.$isValid ? "#0284c7" : "#cbd5e1")};
  }
`;
