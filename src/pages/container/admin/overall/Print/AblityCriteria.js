import React from "react";
import styled from "styled-components";

const AblityCriteriaMainDivBox = styled.div`
  background-color: #fff;
  .scale-box {
    border: 1px solid blue;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .scale-title {
      color: blue;
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 8px;
    }
    .scale-labels {
      display: flex;
      color: blue;
      font-size: 9px;
    }

    .scale-labels span {
      flex: 1;
      text-align: center;
    }
    .scale-axis {
      display: flex;
      position: relative;
      margin-top: 4px;
    }

    .axis-line {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 1px;
      background: blue;
    }

    .tick {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: blue;
      font-size: 9px;
      z-index: 1;
    }
    .tick-mark {
      width: 1px;
      height: 5px;
      background: blue;
      margin-bottom: 2px;
    }
  }
`;

const AblityCriteria = () => {
  return (
    <AblityCriteriaMainDivBox>
      <div
        className="scale-box"
        style={{ marginBottom: "15px", width: "100%" }}
      >
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
    </AblityCriteriaMainDivBox>
  );
};

export default AblityCriteria;
