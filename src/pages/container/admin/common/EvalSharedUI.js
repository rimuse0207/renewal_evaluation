import React from "react";
import styled from "styled-components";
import { Avatar } from "../main/Table/TargetTableRow";

// 1. 공통 헤더
export const EvalHeader = ({ title, desc, onBack }) => (
  <PageHeader>
    <HeaderTop>
      <BackButton onClick={onBack}>
        <span className="icon">←</span> 목록으로 돌아가기
      </BackButton>
    </HeaderTop>
    <PageTitle>{title}</PageTitle>
    <PageDesc>{desc}</PageDesc>
  </PageHeader>
);

// 2. 공통 대상자 정보 & 일괄 적용 패널
export const EvalTargetPanel = ({
  targetInfo,
  roleLabel,
  batchScore,
  onBatchChange,
  onBatchApply,
  showBatch = true,
}) => (
  <ControlPanel>
    <TargetInfo>
      <Avatar>
        {targetInfo.UrlPath && (
          <img
            src={`http://192.168.2.245/download/image/${targetInfo.UrlPath}`}
            alt="User_Image"
            width={"100%"}
          ></img>
        )}
      </Avatar>
      <div>
        <TargetName>
          {targetInfo.name} {targetInfo.title}
        </TargetName>
        <TargetDept>{targetInfo.dept}</TargetDept>
      </div>
    </TargetInfo>
    {showBatch && (
      <BatchActionBox>
        <span className="label">{roleLabel} 일괄 점수 부여:</span>
        <BatchSelect value={batchScore} onChange={onBatchChange}>
          <option value="" disabled>
            점수 선택
          </option>
          {[...Array(10)].map((_, i) => (
            <option key={10 - i} value={10 - i}>
              {10 - i}점
            </option>
          ))}
        </BatchSelect>
        <BatchButton onClick={onBatchApply}>적용하기</BatchButton>
      </BatchActionBox>
    )}
  </ControlPanel>
);

// 3. 공통 빈 화면 (제출 대기 중)
export const EvalEmptyState = ({ targetInfo, onBack }) => (
  <EmptyStateWrapper>
    <div className="empty-icon"></div>
    <h2 className="empty-title">대상자 추진 업무 및 실적 제출 대기 중</h2>
    <p className="empty-desc">
      대상자{" "}
      <strong>
        {targetInfo.name} {targetInfo.title}
      </strong>
      가 아직 본인의 실적을 작성하지 않았습니다.
      <br />
      최종 제출한 이후에 평가를 진행할 수 있습니다.
    </p>
    <EmptyStateButton onClick={onBack}>대시보드로 돌아가기</EmptyStateButton>
  </EmptyStateWrapper>
);

// 4. 공통 상단 요약 바 (Sticky)
export const EvalSummaryBar = ({
  roleLabel,
  isBoth,
  score,
  isValid,
  validMsg,
  invalidMsg,
}) => (
  <SummaryStickyBar>
    <SummaryCard $isValid={isValid}>
      <SummaryInfo>
        <div className="label">
          {roleLabel} 평가 환산 총점
          {isBoth && <Badge>1·2차 통합</Badge>}
        </div>
        <div className="value">
          <span className="current">{score}</span>
          <span className="total"> / 100점</span>
        </div>
      </SummaryInfo>
      <SummaryStatus $isValid={isValid}>
        {isValid ? validMsg : invalidMsg}
      </SummaryStatus>
    </SummaryCard>
  </SummaryStickyBar>
);

// --- Styled Components (기존 코드의 해당 부분 이동) ---
const PageHeader = styled.div`
  margin-bottom: 24px;
`;
const HeaderTop = styled.div`
  margin-bottom: 16px;
`;
const BackButton = styled.button`
  /* 기존 스타일 */
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
`;
const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
`;
const PageDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
`;
const TargetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// const Avatar = styled.div`
//   width: 48px;
//   height: 48px;
//   border-radius: 50%;
//   background: linear-gradient(135deg, #38bdf8, #0284c7);
//   color: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 1.25rem;
//   font-weight: 700;
// `;
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
    font-weight: 600;
    color: #0369a1;
  }
`;
const BatchSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  font-weight: 600;
`;
const BatchButton = styled.button`
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
`;

const EmptyStateWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 20px;
  }
  .empty-title {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 12px;
  }
  .empty-desc {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 32px;
  }
`;
const EmptyStateButton = styled.button`
  padding: 12px 24px;
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const SummaryStickyBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  padding-bottom: 24px;
  background-color: #f4f6f8;
`;
const SummaryCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 20px 32px;
  border: 1px solid #e2e8f0;
  border-left: 6px solid ${(props) => (props.$isValid ? "#10b981" : "#f59e0b")};
`;
const SummaryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  .label {
    font-weight: 600;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .value .current {
    font-size: 1.75rem;
    font-weight: 800;
  }
  .value .total {
    color: #94a3b8;
    font-weight: 600;
  }
`;
const Badge = styled.span`
  background-color: #fef3c7;
  color: #d97706;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 800;
`;
const SummaryStatus = styled.div`
  font-weight: 700;
  color: ${(props) => (props.$isValid ? "#10b981" : "#d97706")};
  background-color: ${(props) => (props.$isValid ? "#ecfdf5" : "#fef3c7")};
  padding: 8px 16px;
  border-radius: 8px;
`;
