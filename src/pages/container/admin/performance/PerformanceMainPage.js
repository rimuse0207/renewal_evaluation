import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import SidebarPage from "../../nav/SidebarPage";
import Criteria from "../../home/criteria/Criteria";
import { usePerformanceEval } from "../../../../public/adminHooks/usePerformanceEval";
import {
  EvalHeader,
  EvalTargetPanel,
  EvalEmptyState,
  EvalSummaryBar,
} from "../common/EvalSharedUI";
import TaskTableRow from "./Table/TaskTableRow";

export default function PerformanceMainPage() {
  const Navigation = useNavigate();
  const { evalYear, userId } = useParams();

  const { state, actions } = usePerformanceEval(evalYear, userId);

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
          {/* 1. 공통 헤더 */}
          <EvalHeader
            title={`${roleLabel} 성과평가 작성`}
            desc={
              <>
                피평가자가 작성한 업무 실적을 확인하고 평가 점수를 부여해주세요.
                <br />
                환산 점수는 <strong>(평가점수 / 10점) × 업무비중(%)</strong> 로
                자동 계산됩니다.
              </>
            }
            onBack={() => Navigation(-1)}
          />

          {/* 2. 공통 대상자 & 일괄 점수 패널 */}
          <EvalTargetPanel
            targetInfo={state.targetInfo}
            roleLabel={roleLabel}
            batchScore={state.batchScore}
            onBatchChange={(e) => actions.setBatchScore(e.target.value)}
            onBatchApply={actions.handleBatchApply}
            showBatch={state.targetStatus !== "TEMP" && !isDone}
          />

          {/* 3. 분기 처리 (제출 전 vs 제출 후) */}
          {state.targetStatus === "TEMP" ? (
            <EvalEmptyState
              targetInfo={state.targetInfo}
              onBack={() => Navigation(-1)}
            />
          ) : (
            <>
              {/* 4. 공통 상단 요약 바 */}
              <EvalSummaryBar
                roleLabel={roleLabel}
                isBoth={state.isBoth}
                score={state.totalCalculatedScore}
                isValid={state.isAllEvaluated}
                validMsg="모든 항목 평가 완료 (제출 가능)"
                invalidMsg="평가되지 않은 항목이 있습니다."
              />

              <Criteria></Criteria>

              {/* 5. 성과평가 전용 테이블 */}
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th width="8%" align="center">
                        분류
                      </Th>
                      <Th width="40%">추진 업무 및 실적</Th>
                      <Th width="8%" align="center">
                        비중
                      </Th>
                      <Th width="10%" align="center">
                        본인 평가
                      </Th>
                      <Th
                        width="12%"
                        align="center"
                        $isMyTurn={state.myRole === "1ST" || state.isBoth}
                      >
                        1차 평가
                      </Th>
                      <Th
                        width="12%"
                        align="center"
                        $isMyTurn={state.myRole === "2ND" || state.isBoth}
                      >
                        2차 평가
                      </Th>
                      <Th width="10%" align="center">
                        환산 점수
                      </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.tasks.map((item, index) => (
                      <TaskTableRow
                        key={item.task_id}
                        index={index}
                        item={item}
                        currentScore={state.evalScores[item.task_id]}
                        myRole={state.myRole}
                        isBoth={state.isBoth}
                        onScoreChange={actions.handleScoreChange}
                        isDone={isDone}
                      />
                    ))}
                  </tbody>
                </Table>
              </TableContainer>

              {!isDone && (
                <ActionArea>
                  <FinalSubmitButton
                    onClick={actions.handleSubmit}
                    $isValid={state.isAllEvaluated}
                  >
                    내 권한({roleLabel}) 평가 제출
                  </FinalSubmitButton>
                </ActionArea>
              )}
            </>
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
  scroll-behavior: smooth;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
  padding: 20px 24px 100px 24px;
`;

// --- 4. Table Styles ---
const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: ${(props) => (props.$isMyTurn ? "#e0f2fe" : "#f8fafc")};
  color: ${(props) => (props.$isMyTurn ? "#0369a1" : "#475569")};
  font-weight: 700;
  font-size: 0.95rem;
  padding: 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 2px solid #e2e8f0;
  border-left: 1px solid #f1f5f9;
  &:first-child {
    border-left: none;
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
  background-color: ${(props) => (props.$isValid ? "#0ea5e9" : "#cbd5e1")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: ${(props) => (props.$isValid ? "pointer" : "not-allowed")};
  transition: all 0.2s;
  box-shadow: ${(props) =>
    props.$isValid ? "0 4px 12px rgba(14, 165, 233, 0.3)" : "none"};
  &:hover {
    background-color: ${(props) => (props.$isValid ? "#0284c7" : "#cbd5e1")};
  }
`;
