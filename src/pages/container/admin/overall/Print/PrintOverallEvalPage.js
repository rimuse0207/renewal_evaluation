import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useOverallEval } from "../../../../../public/adminHooks/useOverallEval";

export default function PrintOverallEvalPage() {
  const { evalYear, userId } = useParams();
  const { state, computed } = useOverallEval(evalYear, userId);

  useEffect(() => {
    if (!state.loading && state.targetInfo) {
      setTimeout(() => {
        // window.print();
      }, 800);
    }
  }, [state.loading, state.targetInfo]);

  if (state.loading) {
    return (
      <div style={{ padding: "20px" }}>출력용 데이터를 준비 중입니다...</div>
    );
  }

  // 줄바꿈 문자열을 배열로 변환하여 렌더링하는 헬퍼 함수
  const renderText = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 역량평가 평가착안점 파싱 헬퍼
  const renderDescription = (desc) => {
    if (!desc) return "";
    let descArray = [];

    if (Array.isArray(desc)) {
      descArray = desc;
    } else if (typeof desc === "string" && desc.trim().startsWith("[")) {
      try {
        descArray = JSON.parse(desc);
      } catch (e) {
        descArray = [desc];
      }
    } else if (typeof desc === "string" && desc.includes("\n")) {
      descArray = desc.split("\n");
    } else {
      descArray = [desc];
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          textAlign: "left",
        }}
      >
        {descArray.map((line, idx) => (
          <div key={idx}>● {line}</div>
        ))}
      </div>
    );
  };

  // 1, 2차 독립 점수 및 등급 계산
  const score1ST =
    (Number(computed.scores.comp1 || 0) + Number(computed.scores.perf1 || 0)) /
    2;
  const grade1ST = computed.getGrade(score1ST);

  const score2ND =
    (Number(computed.scores.comp2 || 0) + Number(computed.scores.perf2 || 0)) /
    2;
  const grade2ND = computed.getGrade(score2ND);

  // 바닥글 렌더러
  const renderFooter = (pageNum) => (
    <PageFooterWrapper>
      <span>
        [소속] {state.targetInfo?.dept} &nbsp;|&nbsp; [직급]{" "}
        {state.targetInfo?.title} &nbsp;|&nbsp; [성명] {state.targetInfo?.name}
      </span>
      {/* <span style={{ color: "#555" }}>- {pageNum} / 3 Page -</span> */}
    </PageFooterWrapper>
  );

  return (
    <PrintContainer>
      {/* ========================================================
          PAGE 1 : 평가자 정보, 점수 요약 및 종합의견
          ======================================================== */}
      <PageSection>
        <YellowHeader>{evalYear}년도 인사평가</YellowHeader>
        <SectionTitle>Ⅰ. 평가 점수 및 종합 의견</SectionTitle>

        <table
          className="info-table approval-table"
          style={{ marginBottom: "20px" }}
        >
          <colgroup>
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>피 평가자 소속</th>
              <td align="center">{state.targetInfo?.dept}</td>

              <th rowSpan={2}>성명</th>
              <td rowSpan={2} align="center">
                {state.targetInfo?.name}
              </td>
            </tr>
            <tr>
              <th>직급</th>
              <td align="center">{state.targetInfo?.title}</td>
            </tr>
            <tr>
              <th style={{ backgroundColor: "#e2efda" }}>1차 평가자</th>
              <td align="center">{state.targetInfo?.FIRST_EV_Name}</td>
              <th style={{ backgroundColor: "#e2efda" }}>2차 평가자</th>
              <td align="center">{state.targetInfo?.SECOND_EV_Name}</td>
            </tr>
          </tbody>
        </table>

        {/* 🌟 (수정) 역량평가를 능력, 태도, 총점으로 세분화한 요약 테이블 */}
        <SubTitle>■ 평가 점수</SubTitle>
        <table className="main-table">
          <thead>
            <tr>
              <th rowSpan="2">구분</th>
              <th rowSpan="2">평가자</th>
              <th colSpan="3">역량평가 점수 (50%)</th>
              <th rowSpan="2">성과평가 점수 (50%)</th>
              <th rowSpan="2">종합 점수</th>
              <th rowSpan="2">최종 등급</th>
            </tr>
            <tr>
              <th style={{ fontSize: "9px" }}>능력부문</th>
              <th style={{ fontSize: "9px" }}>태도부문</th>
              <th style={{ fontSize: "9px", backgroundColor: "#eef2ff" }}>
                역량총점
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{ backgroundColor: "#f0f0f0" }}>1차 평가자</th>
              <td align="center">{state.targetInfo?.FIRST_EV_Name}</td>
              <td align="center">{computed.scores.abil1} 점</td>
              <td align="center">{computed.scores.att1} 점</td>
              <td
                align="center"
                style={{ fontWeight: "bold", backgroundColor: "#eef2ff" }}
              >
                {computed.scores.comp1} 점
              </td>
              <td align="center" style={{ fontWeight: "bold" }}>
                {computed.scores.perf1} 점
              </td>
              <td align="center" style={{ fontWeight: "bold", color: "blue" }}>
                {score1ST} 점
              </td>
              <td
                align="center"
                style={{ fontWeight: "bold", color: "red", fontSize: "12px" }}
                rowSpan={2}
              >
                {computed.getGrade((score1ST + score2ND) / 2) || "-"}
              </td>
            </tr>
            <tr>
              <th style={{ backgroundColor: "#f0f0f0" }}>2차 평가자</th>
              <td align="center">{state.targetInfo?.SECOND_EV_Name}</td>
              <td align="center">{computed.scores.abil2} 점</td>
              <td align="center">{computed.scores.att2} 점</td>
              <td
                align="center"
                style={{ fontWeight: "bold", backgroundColor: "#eef2ff" }}
              >
                {computed.scores.comp2} 점
              </td>
              <td align="center" style={{ fontWeight: "bold" }}>
                {computed.scores.perf2} 점
              </td>
              <td align="center" style={{ fontWeight: "bold", color: "blue" }}>
                {score2ND} 점
              </td>
            </tr>
          </tbody>
        </table>
        <div className="reference-text">
          ※등급평가 참고: 성과+역량을 평균하여 90이상:A, 80이상:B, 70이상:C,
          70미만:D
        </div>

        <SubTitle>■ 평가자 종합 의견</SubTitle>
        <div className="comment-grid" style={{ flex: 1 }}>
          <table className="comment-table">
            <tbody>
              <tr>
                <th width="15%">
                  1차 평가자
                  <br />
                  종합 의견
                </th>
                <td className="comment-text">
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {state.comments.comment1ST}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="comment-table">
            <tbody>
              <tr>
                <th width="15%">
                  2차 평가자
                  <br />
                  종합 의견
                </th>
                <td className="comment-text">
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {state.comments.comment2ND}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {renderFooter(1)}
      </PageSection>

      {/* ========================================================
          PAGE 2 : 역량평가
          ======================================================== */}
      <PageSection>
        <SectionTitle>Ⅱ. 역량평가</SectionTitle>

        {/* 단독 풀사이즈로 변경된 척도 박스 */}
        {/* <div
          className="scale-box"
          style={{ marginBottom: "15px", width: "100%" }}
        >
          <div className="scale-title">※ 평정기준</div>
          <div className="scale-labels">
            <span>매우 뛰어남(A)</span>
            <span style={{ marginRight: "15px" }}>뛰어남(B)</span>
            <span style={{ marginRight: "20px" }}>보통(C)</span>
            <span>미흡(D)</span>
          </div>
          <div className="scale-axis">
            <div className="axis-line"></div>
            <div className="tick">
              <div className="tick-mark"></div>
              <span>10</span>
            </div>
            <div className="tick">
              <div className="tick-mark"></div>
              <span>8</span>
            </div>
            <div className="tick">
              <div className="tick-mark"></div>
              <span>6</span>
            </div>
            <div className="tick">
              <div className="tick-mark"></div>
              <span>4</span>
            </div>
          </div>
        </div> */}

        <div className="competency-grid">
          {/* I-1. 능력부문 */}
          <div className="comp-panel">
            <div className="comp-title">I -1. 역량평가표 - 능력부문</div>
            <table className="comp-table">
              <colgroup>
                <col width="20%" />
                <col width="60%" />
                <col width="10%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr>
                  <th>평가항목</th>
                  <th>평가착안점</th>
                  <th>1차평가</th>
                  <th>2차평가</th>
                </tr>
              </thead>
              <tbody>
                {state.competencyAbility.map((item, idx) => (
                  <tr key={idx}>
                    <th className="item-name">{item.name}</th>
                    <td>{renderDescription(item.desc)}</td>
                    <td align="center" className="score-cell">
                      {item.eval1_score != null ? item.eval1_score : ""} /20
                    </td>
                    <td align="center" className="score-cell">
                      {item.eval2_score != null ? item.eval2_score : ""} /20
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="2">평점 합계</th>
                  <td align="center" className="score-cell">
                    {computed.scores.abil1} /100
                  </td>
                  <td align="center" className="score-cell">
                    {computed.scores.abil2} /100
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* I-2. 태도부문 */}
          <div className="comp-panel">
            <div className="comp-title">I -2. 역량평가표 - 태도부문</div>
            <table className="comp-table">
              <colgroup>
                <col width="20%" />
                <col width="60%" />
                <col width="10%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr>
                  <th>평가항목</th>
                  <th>평가착안점</th>
                  <th>1차평가</th>
                  <th>2차평가</th>
                </tr>
              </thead>
              <tbody>
                {state.competencyAttitude.map((item, idx) => (
                  <tr key={idx}>
                    <th className="item-name">{item.name}</th>
                    <td>{renderDescription(item.desc)}</td>
                    <td align="center" className="score-cell">
                      {item.eval1_score != null ? item.eval1_score : ""} /20
                    </td>
                    <td align="center" className="score-cell">
                      {item.eval2_score != null ? item.eval2_score : ""} /20
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="2">평점 합계</th>
                  <td align="center" className="score-cell">
                    {computed.scores.att1} /100
                  </td>
                  <td align="center" className="score-cell">
                    {computed.scores.att2} /100
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <table className="comp-final-table">
          <tbody>
            <tr>
              <th className="final-label">
                역량평가 합계 = (능력부문합계 + 태도부문합계) / 2
              </th>
              <td className="final-score" width="10%" align="center">
                {computed.scores.comp1} /100
              </td>
              <td className="final-score" width="10%" align="center">
                {computed.scores.comp2} /100
              </td>
            </tr>
          </tbody>
        </table>

        {renderFooter(2)}
      </PageSection>

      {/* ========================================================
          PAGE 3 : 성과평가
          ======================================================== */}
      <PageSection>
        <SectionTitle>Ⅲ. 성과평가</SectionTitle>

        {/* 🌟 (수정) 테두리가 복구된 평정기준 박스 */}
        <div
          className="legend-box"
          style={{ marginBottom: "15px", width: "100%" }}
        >
          <div className="legend-title">
            평정
            <br />
            기준
          </div>
          <div className="legend-content">
            우수(10~9) - 실적이 목표수준대비 110% 이상 성취되었거나, 업무성과가
            예년에 비해 높은 수준
            <br />
            보통(8~7) - 실적이 목표수준대비 100% 내외 수준으로 성취되었거나,
            업무성과가 예년과 유사한 수준
            <br />
            미흡(6~5) - 실적이 목표수준대비 80% 내외 수준으로 성취되었거나,
            업무성과가 예년보다 조금 낮은 수준
            <br />
            불량(4~3) - 실적이 목표수준대비 60% 내외 수준으로 성취되었거나,
            업무성과가 예년에 비해 훨씬 낮은 수준
          </div>
        </div>

        <SubTitle>■ 업무 실적 상세 내역</SubTitle>
        <table className="main-table">
          <colgroup>
            <col width="4%" />
            <col width="22%" />
            <col width="49%" />
            <col width="7%" />
            <col width="6%" />
            <col width="6%" />
            <col width="6%" />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan="2">NO.</th>
              <th rowSpan="2">추진업무</th>
              <th rowSpan="2">추진실적</th>
              <th rowSpan="2" style={{ fontSize: "10px" }}>
                업무비중
                <br />
                (100%)
              </th>
              <th colSpan="3">실적 평가(10점~3점)</th>
            </tr>
            <tr>
              <th>본인 평가</th>
              <th>1차 평가</th>
              <th>2차 평가</th>
            </tr>
          </thead>
          <tbody>
            {state.performanceTasks.map((task, idx) => (
              <tr key={task.task_id || idx}>
                <td align="center" style={{ verticalAlign: "middle" }}>
                  {idx + 1}
                </td>
                <td style={{ verticalAlign: "top", textAlign: "left" }}>
                  <div
                    style={{
                      color: task.category === "개인" ? "blue" : "red",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    ({task.category}업무)
                  </div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{task.task_name}</div>
                </td>
                <td style={{ verticalAlign: "top", textAlign: "left" }}>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.3" }}>
                    {task.task_result}
                  </div>
                </td>
                <td
                  align="center"
                  style={{ fontWeight: "bold", verticalAlign: "middle" }}
                >
                  {task.weight}%
                </td>
                <td align="center" style={{ verticalAlign: "middle" }}>
                  {task.self_score != null ? task.self_score : ""} /10
                </td>
                <td align="center" style={{ verticalAlign: "middle" }}>
                  {task.eval1_score != null ? task.eval1_score : ""} /10
                </td>
                <td align="center" style={{ verticalAlign: "middle" }}>
                  {task.eval2_score != null ? task.eval2_score : ""} /10
                </td>
              </tr>
            ))}

            {Array.from({
              length: Math.max(0, 4 - state.performanceTasks.length),
            }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td align="center">
                  {state.performanceTasks.length + idx + 1}
                </td>
                <td></td>
                <td></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="5" className="tfoot-label">
                업무실적 평가점수 합계
              </th>
              <td align="center" style={{ fontWeight: "bold" }}>
                {computed.scores.perf1} /100
              </td>
              <td align="center" style={{ fontWeight: "bold" }}>
                {computed.scores.perf2} /100
              </td>
            </tr>
            <tr>
              <th colSpan="5" className="tfoot-label blue-text">
                업무비중 환산평점(1-2차평가자가 환산 후 기입): 평가점수 / 10점 X
                업무비중(%)
              </th>
              <td align="center" style={{ fontWeight: "bold", color: "blue" }}>
                {computed.scores.perf1} /100
              </td>
              <td align="center" style={{ fontWeight: "bold", color: "blue" }}>
                {computed.scores.perf2} /100
              </td>
            </tr>
          </tfoot>
        </table>

        {renderFooter(3)}
      </PageSection>
    </PrintContainer>
  );
}

// ==========================================
// 💅 Styled Components
// ==========================================

const PrintContainer = styled.div`
  width: 100%;
  background: white;
  color: #000;
  font-family: "Malgun Gothic", "맑은 고딕", sans-serif;
  font-size: 10px;

  * {
    box-sizing: border-box;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    border: 1px solid #000;
    padding: 4px;
    font-size: 10px;
    word-break: break-word;
    white-space: pre-wrap;
  }

  @media print {
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    background: transparent;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ===== 공통 정보 테이블 스타일 ===== */
  .info-table {
    border: 2px solid #000;
    th {
      font-weight: bold;
      text-align: center;
      background-color: #f8f9fa;
      font-size: 12px;
    }
    td {
      height: 24px;
      text-align: center;
      font-size: 12px;
    }
  }

  /* ===== 1, 3페이지 메인 테이블 스타일 ===== */
  .main-table {
    border: 2px solid #000;

    th {
      background-color: #f8f9fa;
      text-align: center;
      font-weight: bold;
    }

    .tfoot-label {
      text-align: right;
      padding-right: 20px;
    }
    .blue-text {
      color: blue;
    }
  }

  /* 🌟 1페이지 의견/코멘트 테이블 스타일 */
  .comment-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    page-break-inside: avoid;
  }

  .comment-table {
    border: 2px solid #000;
    height: 100%;
    min-height: 140px;

    th {
      text-align: center;
      font-weight: bold;
      background-color: #f0f0f0;
    }
    .comment-text {
      vertical-align: top;
      padding: 10px;
    }
  }

  .reference-text {
    font-size: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    color: #555;
  }

  /* ===== 2페이지 역량평가 테이블 결재선/상단 스타일 ===== */
  .approval-table {
    th {
      background-color: #e2efda !important;
    }
  }

  /* 🌟 (수정) 어디서든 동일하게 렌더링되도록 Root 스타일로 뺀 평정기준 박스 */
  .legend-box {
    border: 1px solid #000;
    display: flex;
    font-size: 10px;

    .legend-title {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-right: 1px solid #000;
      background-color: #f8f8f8;
      font-weight: bold;
    }
    .legend-content {
      flex: 1;
      padding: 6px 10px;
      line-height: 1.5;
    }
  }

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
      justify-content: space-between;
      color: blue;
      font-size: 9px;
      padding: 0 8px;
    }
    .scale-axis {
      display: flex;
      justify-content: space-between;
      position: relative;
      padding: 0 20px;
      margin-top: 4px;
    }
    .axis-line {
      position: absolute;
      top: 0;
      left: 20px;
      right: 20px;
      height: 1px;
      background: blue;
    }
    .tick {
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

  /* ===== 2페이지 역량평가 본문 스타일 ===== */
  .competency-grid {
    display: flex;
    gap: 10px;
    flex: 1;

    .comp-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .comp-title {
      border: 2px solid #000;
      text-align: center;
      font-weight: bold;
      padding: 6px;
      margin-bottom: 4px;
    }

    .comp-table {
      border: 2px solid #000;
      flex: 1;

      th {
        background-color: #bfbfbf;
        text-align: center;
      }
      .item-name {
        background-color: #bfbfbf;
      }
      .score-cell {
        background-color: #fce4d6;
        font-weight: bold;
      }
    }
  }

  .comp-final-table {
    border: 2px solid #000;
    border-top: none;

    .final-label {
      background-color: #e2efda;
      text-align: center;
    }
    .final-score {
      background-color: #e2efda;
      font-weight: bold;
    }
  }
`;

const PageSection = styled.div`
  width: 100%;
  min-height: 100vh;
  page-break-after: always;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;

  &:last-child {
    page-break-after: auto;
  }
`;

// 🌟 신규 바닥글 래퍼
const PageFooterWrapper = styled.div`
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: bold;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 900;
  margin-top: 0;
  margin-bottom: 10px;
  flex-shrink: 0;
`;

const SubTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

const TopGrid = styled.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  flex-shrink: 0;
`;

const YellowHeader = styled.div`
  background-color: #ffff99;
  border: 1px solid #000;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  padding: 6px;
  margin-bottom: 15px;
`;
