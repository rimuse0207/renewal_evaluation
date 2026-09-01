import React from "react";
import styled from "styled-components";

// 설명 파싱 헬퍼
const renderDescription = (desc) => {
  if (!desc) return "";
  let descArray = [];
  if (Array.isArray(desc)) descArray = desc;
  else if (typeof desc === "string" && desc.trim().startsWith("[")) {
    try {
      descArray = JSON.parse(desc);
    } catch {
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

export default function CompetencySection({
  title,
  items,
  scores1st,
  scores2nd,
  myRole,
  isBoth,
  subtotal1st,
  subtotal2nd,
  maxScore,
  onScoreChange,
  isDone,
}) {
  const renderScoreInput = (role, itemId, currentScores) => {
    const value = currentScores[itemId] || "";

    const isMyTurn = myRole === role || isBoth;

    if (!isMyTurn || isDone) {
      return (
        <ReadOnlyBadge $hasValue={!!value}>
          {value ? `${value}점` : "-"}
        </ReadOnlyBadge>
      );
    }

    return (
      <ScoreSelect
        value={value}
        onChange={(e) => onScoreChange(itemId, e.target.value)}
        $hasValue={!!value}
      >
        <option value="" disabled>
          선택
        </option>
        {[...Array(21)].map((_, i) => (
          <option key={20 - i} value={20 - i}>
            {20 - i}점
          </option>
        ))}
      </ScoreSelect>
    );
  };

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th width="5%">No.</Th>
              <Th width="15%">평가항목</Th>
              <Th width="50%">평가착안점</Th>
              <Th width="15%" align="center">
                1차 평가 (100점)
              </Th>
              <Th width="15%" align="center">
                2차 평가 (100점)
              </Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <Td align="center" className="row-num">
                  {index + 1}
                </Td>
                <Td className="fw-bold">{item.name}</Td>
                <Td>{renderDescription(item.desc)}</Td>
                <Td align="center" $isHighlight={myRole === "1ST"}>
                  {renderScoreInput("1ST", item.id, scores1st)}
                </Td>
                <Td align="center" $isHighlight={myRole === "2ND"}>
                  {renderScoreInput("2ND", item.id, scores2nd)}
                </Td>
              </tr>
            ))}
            <SubtotalRow>
              <td colSpan="3" className="subtotal-label">
                {title.split(" - ")[1]} 소계 (최대 {maxScore}점)
              </td>
              <td
                align="center"
                className={myRole === "1ST" ? "highlight" : ""}
              >
                {subtotal1st}점
              </td>
              <td
                align="center"
                className={myRole === "2ND" ? "highlight" : ""}
              >
                {subtotal2nd}점
              </td>
            </SubtotalRow>
          </tbody>
        </Table>
      </TableCard>
    </div>
  );
}

const ReadOnlyBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) => (props.$hasValue ? "#f8fafc" : "#f1f5f9")};
  color: ${(props) => (props.$hasValue ? "#475569" : "#cbd5e1")};
  border: 1px solid ${(props) => (props.$hasValue ? "#e2e8f0" : "transparent")};
`;

const ScoreSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => (props.$hasValue ? "#cbd5e1" : "#fca5a5")};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: ${(props) => (props.$hasValue ? "700" : "500")};
  color: ${(props) => (props.$hasValue ? "#0ea5e9" : "#94a3b8")};
  background-color: ${(props) => (props.$hasValue ? "#f0f9ff" : "#fff5f5")};
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
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
  padding: 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  text-align: ${(props) => props.align || "left"};
  vertical-align: middle;
  background-color: ${(props) =>
    props.$isHighlight ? "#f0f9ff" : "transparent"};

  &.row-num {
    color: #94a3b8;
    font-weight: 600;
  }
  &.fw-bold {
    font-weight: 700;
    color: #1e293b;
  }
`;

const SubtotalRow = styled.tr`
  background-color: #f1f5f9;
  border-top: 2px solid #cbd5e1;

  td {
    padding: 16px;
    font-weight: 700;
    color: #334155;
    font-size: 1rem;
  }

  .subtotal-label {
    text-align: right;
    padding-right: 24px;
    color: #475569;
  }

  .highlight {
    color: #0ea5e9;
    background-color: #f0f9ff;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;
