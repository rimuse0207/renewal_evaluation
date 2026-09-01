import React from "react";
import styled from "styled-components";

const renderDescription = (desc) => {
  if (!desc) return "-";

  let descArray = [];

  if (Array.isArray(desc)) {
    descArray = desc;
  } else if (typeof desc === "string" && desc.trim().startsWith("[")) {
    try {
      descArray = JSON.parse(desc); // 여기서 배열 문자열을 진짜 배열로 변환합니다.
    } catch (e) {
      descArray = [desc];
    }
  } else if (typeof desc === "string" && desc.includes("\n")) {
    descArray = desc.split("\n");
  } else {
    descArray = [desc];
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {descArray.map((line, idx) => (
        <div key={idx} style={{ color: "#475569", lineHeight: "1.4" }}>
          • {line}
        </div>
      ))}
    </div>
  );
};
export default function CompetencyResultTable({
  abilityItems,
  attitudeItems,
  scores,
}) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th width="12%" align="center">
              구분
            </Th>
            <Th width="15%">평가항목</Th>
            <Th width="43%">평가착안점</Th>
            <Th width="15%" align="center">
              1차 평가점수
            </Th>
            <Th width="15%" align="center">
              2차 평가점수
            </Th>
          </tr>
        </thead>
        <tbody>
          {abilityItems.map((item) => (
            <tr key={`abil-${item.id}`}>
              <Td align="center">
                <CategoryTag>능력 부문</CategoryTag>
              </Td>
              <Td>
                <strong style={{ color: "#1e293b" }}>{item.name}</strong>
              </Td>
              <Td>{renderDescription(item.desc)}</Td>
              <Td align="center" className="readonly-score">
                {item.eval1_score ? `${item.eval1_score}점` : "-"}
              </Td>
              <Td align="center" className="readonly-score">
                {item.eval2_score ? `${item.eval2_score}점` : "-"}
              </Td>
            </tr>
          ))}
          <InnerSubtotalRow>
            <td colSpan="3" className="subtotal-label">
              능력 부문 합계 (최대 100점)
            </td>
            <td align="center">{scores.abil1}점</td>
            <td align="center">{scores.abil2}점</td>
          </InnerSubtotalRow>

          {attitudeItems.map((item) => (
            <tr key={`att-${item.id}`}>
              <Td align="center">
                <CategoryTag $isAttitude>태도 부문</CategoryTag>
              </Td>
              <Td>
                <strong style={{ color: "#1e293b" }}>{item.name}</strong>
              </Td>
              <Td>{renderDescription(item.desc)}</Td>
              <Td align="center" className="readonly-score">
                {item.eval1_score ? `${item.eval1_score}점` : "-"}
              </Td>
              <Td align="center" className="readonly-score">
                {item.eval2_score ? `${item.eval2_score}점` : "-"}
              </Td>
            </tr>
          ))}
          <InnerSubtotalRow>
            <td colSpan="3" className="subtotal-label">
              태도 부문 합계 (최대 100점)
            </td>
            <td align="center">{scores.att1}점</td>
            <td align="center">{scores.att2}점</td>
          </InnerSubtotalRow>

          <SubtotalRow>
            <td colSpan="3" className="subtotal-label">
              역량평가 환산 총점 ( (능력+태도) / 2 )
            </td>
            <td align="center" className="highlight">
              {scores.comp1}점
            </td>
            <td align="center" className="highlight">
              {scores.comp2}점
            </td>
          </SubtotalRow>
        </tbody>
      </Table>
    </TableContainer>
  );
}

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 14px 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  text-align: ${(props) => props.align || "left"};
  .readonly-score {
    font-size: 1.05rem;
    font-weight: 800;
    color: #334155;
  }
`;

const SubtotalRow = styled.tr`
  background-color: #f1f5f9;
  border-top: 2px solid #cbd5e1;
  td {
    padding: 16px;
    font-weight: 700;
    color: #334155;
    font-size: 1.05rem;
  }
  .subtotal-label {
    text-align: right;
    padding-right: 24px;
    color: #475569;
  }
  .highlight {
    color: #0ea5e9;
    font-size: 1.15rem;
  }
`;
const CategoryTag = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;

  /* 기본 (능력 부문 - 파란색) */
  background-color: ${(props) => (props.$isAttitude ? "#fdf4ff" : "#f0f9ff")};
  color: ${(props) => (props.$isAttitude ? "#a21caf" : "#0369a1")};
  border: 1px solid ${(props) => (props.$isAttitude ? "#f5d0fe" : "#bae6fd")};
`;

const InnerSubtotalRow = styled.tr`
  background-color: #f8fafc;
  border-top: 1px dashed #cbd5e1;
  td {
    padding: 12px 16px;
    font-weight: 600;
    color: #64748b;
    font-size: 0.95rem;
  }
  .subtotal-label {
    text-align: right;
    padding-right: 24px;
  }
`;
