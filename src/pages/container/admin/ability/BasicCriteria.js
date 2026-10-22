import React from "react";
import styled from "styled-components";

// Props를 받아 동적으로 스타일을 적용하는 Styled Component
const BasicCriteriaMainDivBox = styled.div`
  background: ${(props) => props.$bgColor || "#ffffff"};
  border: ${(props) => props.$borderWidth || "1px"} solid
    ${(props) => props.$borderColor || "#e2e8f0"};
  border-radius: ${(props) => props.$borderRadius || "12px"};
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;

  .scale-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    .scale-title {
      color: ${(props) => props.$titleColor || "#0369a1"};
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 12px;
    }
    .scale-labels {
      display: flex;
      color: ${(props) => props.$labelColor || "#64748b"};
      font-size: 0.85rem;
      font-weight: 600;
    }
    .scale-labels span {
      flex: 1;
      text-align: center;
    }
    .scale-axis {
      display: flex;
      position: relative;
      margin-top: 8px;
    }
    .axis-line {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: ${(props) => props.$lineThickness || "2px"};
      background: ${(props) => props.$themeColor || "#bae6fd"};
    }
    .tick {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: ${(props) => props.$scoreColor || "#0ea5e9"};
      font-size: 0.85rem;
      font-weight: 700;
      z-index: 1;
    }
    .tick-mark {
      width: ${(props) => props.$lineThickness || "2px"};
      height: 6px;
      background: ${(props) => props.$themeColor || "#bae6fd"};
      margin-bottom: 6px;
    }
  }
`;

/**
 * BasicCriteria 컴포넌트
 * @param {string} themeColor - 축 선과 틱 마크의 색상 (기본: 연한 파란색)
 * @param {string} titleColor - 제목 색상 (기본: 진한 파란색)
 * @param {string} labelColor - 평가 라벨(매우 뛰어남 등) 색상 (기본: 슬레이트 그레이)
 * @param {string} scoreColor - 점수 색상 (기본: 스카이 블루)
 */
const BasicCriteria = ({
  themeColor = "#bae6fd",
  titleColor = "#0369a1",
  labelColor = "#64748b",
  scoreColor = "#0ea5e9",
  bgColor = "#ffffff",
  borderColor = "#e2e8f0",
  lineThickness = "2px",
  borderRadius = "12px",
}) => {
  return (
    <BasicCriteriaMainDivBox
      $themeColor={themeColor}
      $titleColor={titleColor}
      $labelColor={labelColor}
      $scoreColor={scoreColor}
      $bgColor={bgColor}
      $borderColor={borderColor}
      $lineThickness={lineThickness}
      $borderRadius={borderRadius}
    >
      <div className="scale-box">
        <div className="scale-title">※ 평정기준</div>
        <div className="scale-labels">
          <span>매우 뛰어남</span>
          <span>뛰어남</span>
          <span>보통</span>
          <span>미흡</span>
          <span>매우 부족</span>
        </div>
        <div className="scale-axis">
          <div className="axis-line"></div>
          <div className="tick">
            <div className="tick-mark"></div>
            <span>20</span>
          </div>
          <div className="tick">
            <div className="tick-mark"></div>
            <span>16</span>
          </div>
          <div className="tick">
            <div className="tick-mark"></div>
            <span>12</span>
          </div>
          <div className="tick">
            <div className="tick-mark"></div>
            <span>8</span>
          </div>
          <div className="tick">
            <div className="tick-mark"></div>
            <span>4</span>
          </div>
        </div>
      </div>
    </BasicCriteriaMainDivBox>
  );
};

export default BasicCriteria;
