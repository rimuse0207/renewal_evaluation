import React from "react";
import styled from "styled-components";

export default function PerformanceResultTable({
  tasks,
  totalPerf1,
  totalPerf2,
}) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th width="60%">추진 업무 및 실적</Th>
            <Th width="10%" align="center">
              비중
            </Th>
            <Th width="10%" align="center">
              본인평가
            </Th>
            <Th width="10%" align="center">
              1차 환산 점수
            </Th>
            <Th width="10%" align="center">
              2차 환산 점수
            </Th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => {
            const calc1 = task.eval1_score
              ? ((task.eval1_score / 10) * task.weight).toFixed(1)
              : "-";
            const calc2 = task.eval2_score
              ? ((task.eval2_score / 10) * task.weight).toFixed(1)
              : "-";
            return (
              <tr key={task.task_id}>
                <Td>
                  <div style={{ fontWeight: 800, color: "#1e293b" }}>
                    {idx + 1}. {task.task_name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      marginTop: "4px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {task.task_result}
                  </div>
                </Td>
                <Td
                  align="center"
                  style={{ fontWeight: 700, color: "#0ea5e9" }}
                >
                  {task.weight}%
                </Td>
                <Td align="center">{task.self_score}점</Td>
                <Td align="center" className="readonly-score">
                  {calc1}
                  {calc1 !== "-" && "점"}
                </Td>
                <Td align="center" className="readonly-score">
                  {calc2}
                  {calc2 !== "-" && "점"}
                </Td>
              </tr>
            );
          })}
          <SubtotalRow>
            <td colSpan="3" className="subtotal-label">
              성과평가 총점 (100점 만점 환산)
            </td>
            <td align="center" className="highlight">
              {totalPerf1}점
            </td>
            <td align="center" className="highlight">
              {totalPerf2}점
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
