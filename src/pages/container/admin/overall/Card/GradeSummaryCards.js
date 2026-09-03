import React from "react";
import styled from "styled-components";

export default function GradeSummaryCards({ scores, isBoth, getGrade }) {
  return (
    <GradeSection>
      <div className="top-row">
        <GradeCard>
          <div className="title">1차 평가 결과 (성과 50% + 역량 50%)</div>
          <div className="score-area">
            <span className="score">{scores.total1}</span>
            <span className="max"> / 100점</span>
          </div>
          <div className={`grade-badge ${getGrade(scores.total1)}`}>
            {getGrade(scores.total1)} 등급
          </div>
        </GradeCard>

        <GradeCard>
          <div className="title">
            {isBoth
              ? "2차 평가 결과 (1차 통합 동일 반영)"
              : "2차 평가 결과 (성과 50% + 역량 50%)"}
          </div>
          <div className="score-area">
            <span className="score">{scores.total2}</span>
            <span className="max"> / 100점</span>
          </div>
          <div className={`grade-badge ${getGrade(scores.total2)}`}>
            {getGrade(scores.total2)} 등급
          </div>
        </GradeCard>
      </div>

      <div className="bottom-row">
        <GradeCard $isFinal>
          <div className="title">
            최종 종합 점수{" "}
            {isBoth ? "(통합 평가 100% 반영)" : "(1차 + 2차 평균 점수)"}
          </div>
          <div className="score-area">
            <span className="score">{scores.finalTotal}</span>
            <span className="max"> / 100점</span>
          </div>
          <div className={`grade-badge ${getGrade(scores.finalTotal)}`}>
            {getGrade(scores.finalTotal)} 등급
          </div>
        </GradeCard>
      </div>
    </GradeSection>
  );
}

const GradeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;

  .top-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .bottom-row {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const GradeCard = styled.div`
  background: white;
  border: ${(props) =>
    props.$isFinal ? "2px solid #0ea5e9" : "1px solid #e2e8f0"};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: ${(props) =>
    props.$isFinal
      ? "0 4px 12px rgba(14, 165, 233, 0.15)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"};

  .title {
    font-size: ${(props) => (props.$isFinal ? "1.1rem" : "0.95rem")};
    font-weight: 700;
    margin-bottom: 16px;
    color: ${(props) => (props.$isFinal ? "#0369a1" : "#64748b")};
  }
  .score-area {
    margin-bottom: 16px;
    .score {
      font-size: ${(props) => (props.$isFinal ? "2.5rem" : "2rem")};
      font-weight: 800;
      color: #1e293b;
    }
    .max {
      font-size: 1.1rem;
      font-weight: 600;
      color: #94a3b8;
    }
  }
  .grade-badge {
    display: inline-block;
    padding: 8px 24px;
    border-radius: 8px;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 1px;
    &.S {
      background-color: #fef2f2;
      color: #ef4444;
      border: 1px solid #fca5a5;
    }
    &.A {
      background-color: #eff6ff;
      color: #3b82f6;
      border: 1px solid #bfdbfe;
    }
    &.B {
      background-color: #f0fdf4;
      color: #22c55e;
      border: 1px solid #bbf7d0;
    }
    &.C,
    &.D {
      background-color: #f8fafc;
      color: #64748b;
      border: 1px solid #cbd5e1;
    }
    &.- {
      background-color: #f1f5f9;
      color: #94a3b8;
    }
  }
`;
