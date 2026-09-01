import React from "react";
import styled from "styled-components";

export default function TaskTableRow({
  index,
  item,
  currentScore,
  myRole,
  isBoth,
  onScoreChange,
  isDone,
}) {
  const calculatedScore = currentScore
    ? ((currentScore / 10) * item.weight).toFixed(1)
    : "0.0";

  const isMyTurn1st = myRole === "1ST" || isBoth;
  const isMyTurn2nd = myRole === "2ND" || isBoth;

  return (
    <tr>
      <Td align="center">
        <CategoryTag>{item.category}</CategoryTag>
      </Td>
      <Td>
        <TaskContent>
          <div className="title">
            <span className="num">{index + 1}.</span> {item.task_name}
          </div>
          <div className="result">
            {(item.task_result || "").split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {item.file_url && (
            <FileLink href={`/download/${item.file_url}`} target="_blank">
              첨부파일 확인
            </FileLink>
          )}
        </TaskContent>
      </Td>
      <Td align="center">
        <strong style={{ color: "#0ea5e9" }}>{item.weight}%</strong>
      </Td>
      <Td align="center">{item.self_score}점</Td>

      {/* 🌟 1차 평가 */}
      <Td align="center" $isMyTurn={isMyTurn1st && !isDone}>
        {isMyTurn1st && !isDone ? (
          <Select
            value={currentScore || ""}
            onChange={(e) => onScoreChange(item.task_id, e.target.value)}
          >
            <option value="" disabled>
              선택
            </option>
            {[...Array(10)].map((_, i) => (
              <option key={10 - i} value={10 - i}>
                {10 - i}점
              </option>
            ))}
          </Select>
        ) : (
          <ReadOnlyBadge
            $hasValue={isMyTurn1st ? !!currentScore : !!item.eval1_score}
          >
            {isMyTurn1st
              ? currentScore
                ? `${currentScore}점`
                : "-"
              : item.eval1_score
                ? `${item.eval1_score}점`
                : "-"}
          </ReadOnlyBadge>
        )}
      </Td>

      {/* 🌟 2차 평가 */}
      <Td align="center" $isMyTurn={isMyTurn2nd && !isDone}>
        {isBoth ? (
          <ReadOnlyBadge className="mirroring" $hasValue={!!currentScore}>
            {currentScore ? `${currentScore}점` : "-"}
          </ReadOnlyBadge>
        ) : myRole === "2ND" && !isDone ? (
          <Select
            value={currentScore || ""}
            onChange={(e) => onScoreChange(item.task_id, e.target.value)}
          >
            <option value="" disabled>
              선택
            </option>
            {[...Array(10)].map((_, i) => (
              <option key={10 - i} value={10 - i}>
                {10 - i}점
              </option>
            ))}
          </Select>
        ) : (
          <ReadOnlyBadge
            $hasValue={myRole === "2ND" ? !!currentScore : !!item.eval2_score}
          >
            {myRole === "2ND"
              ? currentScore
                ? `${currentScore}점`
                : "-"
              : item.eval2_score
                ? `${item.eval2_score}점`
                : "-"}
          </ReadOnlyBadge>
        )}
      </Td>

      <Td align="center">
        <CalculatedScore $hasScore={!!currentScore}>
          {calculatedScore}
        </CalculatedScore>
      </Td>
    </tr>
  );
}

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  border-left: 1px solid #f1f5f9;
  vertical-align: top;

  background-color: ${(props) => (props.$isMyTurn ? "#f0f9ff" : "transparent")};
  &:first-child {
    border-left: none;
  }
`;

// 🌟 추가된 읽기 전용 뱃지 컴포넌트
const ReadOnlyBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  width: 100%;
  max-width: 90px;
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) => (props.$hasValue ? "#f8fafc" : "#f1f5f9")};
  color: ${(props) => (props.$hasValue ? "#475569" : "#cbd5e1")};
  border: 1px solid ${(props) => (props.$hasValue ? "#e2e8f0" : "transparent")};

  &.mirroring {
    color: #94a3b8;
    background-color: transparent;
    border: 1px dashed #cbd5e1;
    font-style: italic;
  }
`;

const CategoryTag = styled.span`
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
`;

const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  .title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #1e293b;
    .num {
      color: #0ea5e9;
    }
  }
  .result {
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.5;
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    p {
      margin: 0 0 4px 0;
    }
    p:last-child {
      margin: 0;
    }
  }
`;

const FileLink = styled.a`
  display: inline-block;
  font-size: 0.9rem;
  color: #0284c7;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const Select = styled.select`
  width: 100%;
  max-width: 90px;
  padding: 8px 12px;
  border: 1px solid #7dd3fc;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  outline: none;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
`;

const CalculatedScore = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${(props) => (props.$hasScore ? "#0284c7" : "#cbd5e1")};
`;
