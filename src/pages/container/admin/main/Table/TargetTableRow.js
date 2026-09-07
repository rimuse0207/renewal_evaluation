import React from "react";
import styled from "styled-components";
import { gradeCalcule } from "../../../../../public/global/gradeCalcule";

export default function TargetTableRow({ target, calculators, onNavigate }) {
  const perfState = calculators.getEvalState(target, "perf");
  const compState = calculators.getEvalState(target, "comp");
  const finalState = calculators.getComprehensiveState(target);

  const isBoth = target.evaluator_1st === target.evaluator_2nd;
  const isCompleted = isBoth
    ? !!target.comment_1st || target.master_status === "DONE"
    : (!!target.comment_1st && !!target.comment_2nd) ||
      target.master_status === "DONE";

  const finalCombined = target.final_grade_2nd || target.final_grade_1st;

  return (
    <tr>
      {/* 1. 대상자 정보 */}
      <Td>
        <UserInfo>
          <Avatar>
            {target.UrlPath && (
              <img
                src={`http://192.168.2.245/download/image/${target.UrlPath}`}
                alt="User_Image"
                width={"100%"}
              ></img>
            )}
          </Avatar>
          <div className="info">
            <div className="name">
              {target.name} <span className="pos">{target.position}</span>
            </div>
            <div className="dept">{target.dept}</div>
          </div>
        </UserInfo>
      </Td>

      {/* 2. 성과평가 */}
      <Td align="center">
        <EvalCell>
          <Badge $color={perfState.color}>{perfState.text}</Badge>
          {target.performance_status !== "USER_WAITING" && (
            <ScoreGrid>
              <div className="score-row">
                <span className="role">
                  1차 <span>({target.evaluator_1st_name || "미지정"})</span>
                </span>
                {target.perf_score_1st != null ? (
                  <span className="score">{target.perf_score_1st}점</span>
                ) : (
                  <span className="empty">미평가</span>
                )}
              </div>
              <div className="score-row">
                <span className="role">
                  2차 <span>({target.evaluator_2nd_name || "미지정"})</span>
                </span>
                {target.perf_score_2nd != null ? (
                  <span className="score">{target.perf_score_2nd}점</span>
                ) : (
                  <span className="empty">미평가</span>
                )}
              </div>
            </ScoreGrid>
          )}
          <EvalButton
            $disabled={perfState.disabled}
            $done={perfState.done}
            onClick={() =>
              onNavigate("Performance", target.id, perfState.disabled)
            }
          >
            {perfState.btnText}
          </EvalButton>
        </EvalCell>
      </Td>

      {/* 3. 역량평가 */}
      <Td align="center">
        <EvalCell>
          <Badge $color={compState.color}>{compState.text}</Badge>
          <ScoreGrid>
            <div className="score-row">
              <span className="role">
                1차 <span>({target.evaluator_1st_name || "미지정"})</span>
              </span>
              {target.comp_score_1st != null ? (
                <span className="score">{target.comp_score_1st}점</span>
              ) : (
                <span className="empty">미평가</span>
              )}
            </div>
            <div className="score-row">
              <span className="role">
                2차 <span>({target.evaluator_2nd_name || "미지정"})</span>
              </span>
              {target.comp_score_2nd != null ? (
                <span className="score">{target.comp_score_2nd}점</span>
              ) : (
                <span className="empty">미평가</span>
              )}
            </div>
          </ScoreGrid>
          <EvalButton
            $disabled={compState.disabled}
            $done={compState.done}
            onClick={() => onNavigate("Ability", target.id, compState.disabled)}
          >
            {compState.btnText}
          </EvalButton>
        </EvalCell>
      </Td>

      {/* 4. 종합평가 */}
      <Td align="center">
        <EvalCell $isComprehensive>
          <Badge $color={finalState.color}>{finalState.text}</Badge>
          {target.performance_status !== "USER_WAITING" && (
            <ScoreGrid>
              <div className="score-row">
                <span className="role">
                  1차 <span>({target.evaluator_1st_name || "미지정"})</span>
                </span>
                {target.comment_1st ? (
                  <span className="score text-blue">작성 완료</span>
                ) : (
                  <span className="empty">미작성</span>
                )}
              </div>
              <div className="score-row">
                <span className="role">
                  2차 <span>({target.evaluator_2nd_name || "미지정"})</span>
                </span>
                {target.comment_2nd ? (
                  <span className="score text-blue">작성 완료</span>
                ) : (
                  <span className="empty">미작성</span>
                )}
              </div>
            </ScoreGrid>
          )}
          <EvalButton
            $disabled={finalState.disabled}
            $done={finalState.done}
            onClick={() =>
              onNavigate("Overall", target.id, finalState.disabled)
            }
          >
            {finalState.btnText}
          </EvalButton>
        </EvalCell>
      </Td>

      {/* 5. 최종 등급 */}
      <Td align="center">
        <EvalCell $isComprehensive>
          <ScoreGrid style={{ maxWidth: "120px", marginBottom: "8px" }}>
            <div className="score-row" style={{ padding: "2px 6px" }}>
              <span className="role">1차 최종</span>
              {target.final_grade_1st ? (
                <span className="score text-blue">
                  {gradeCalcule(target?.perf_score_1st, target?.comp_score_1st)}
                </span>
              ) : (
                <span className="empty">-</span>
              )}
            </div>
            {!isBoth && (
              <div className="score-row" style={{ padding: "2px 6px" }}>
                <span className="role">2차 최종</span>

                <span className="score text-blue">
                  {gradeCalcule(target?.perf_score_2nd, target?.comp_score_2nd)}
                </span>
              </div>
            )}
          </ScoreGrid>
          <FinalGradeBadge
            className={
              isCompleted && finalCombined
                ? gradeCalcule(
                    (target?.perf_score_1st + target?.perf_score_2nd) / 2,
                    (target?.comp_score_1st + target?.comp_score_2nd) / 2,
                  )
                : "nothing"
            }
          >
            {isCompleted && finalCombined
              ? gradeCalcule(
                  (target?.perf_score_1st + target?.perf_score_2nd) / 2,
                  (target?.comp_score_1st + target?.comp_score_2nd) / 2,
                )
              : "-"}
          </FinalGradeBadge>
        </EvalCell>
      </Td>
    </tr>
  );
}

const Td = styled.td`
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  &.empty-message {
    text-align: center;
    padding: 60px;
    color: #94a3b8;
    font-size: 1.05rem;
  }
  tr:last-child & {
    border-bottom: none;
  }
  tr:hover & {
    background-color: #fcfcfc;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .info {
    .name {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e293b;
      .pos {
        font-size: 0.95rem;
        font-weight: 600;
        color: #64748b;
        margin-left: 4px;
      }
    }
    .dept {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-top: 4px;
    }
  }
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 800;
  img {
    border-radius: 10px 10px 10px 10px;
  }
`;

const EvalCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  height: 100%;
  justify-content: ${(props) =>
    props.$isComprehensive ? "center" : "flex-start"};
`;

const Badge = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  ${(props) =>
    props.$color === "gray" && `background-color: #f1f5f9; color: #64748b;`}
  ${(props) =>
    props.$color === "orange" &&
    `background-color: #fffbeb; color: #d97706; border: 1px solid #fde68a;`}
  ${(props) =>
    props.$color === "blue" &&
    `background-color: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;`}
  ${(props) =>
    props.$color === "green" &&
    `background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;`}
`;

const ScoreGrid = styled.div`
  width: 100%;
  max-width: 170px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  .score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    padding: 4px 8px;
    border-radius: 6px;
    background-color: #f8fafc;
    .role {
      font-weight: 600;
      color: #64748b;
      span {
        font-size: 0.8rem;
        color: #94a3b8;
        font-weight: 500;
      }
    }
    .score {
      font-weight: 800;
      color: #0ea5e9;
    }
    .score.text-blue {
      color: #0ea5e9;
      font-size: 0.85rem;
    }
    .empty {
      color: #cbd5e1;
      font-size: 0.85rem;
      font-weight: 600;
    }
  }
`;

const FinalGradeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 800;

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
  &.nothing {
    background-color: #f1f5f9;
    color: #cbd5e1;
    border: 1px solid #e2e8f0;
  }
`;

const EvalButton = styled.button`
  width: 140px;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.2s;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  margin-top: 4px;

  ${(props) => {
    if (props.$disabled)
      return `background-color: #f1f5f9; color: #94a3b8; border: 1px solid transparent;`;
    if (props.$done)
      return `background-color: white; color: #0ea5e9; border: 1px solid #bae6fd; &:hover { background-color: #f0f9ff; border-color: #0ea5e9; }`;
    return `background-color: #0ea5e9; color: white; border: 1px solid #0ea5e9; box-shadow: 0 2px 4px rgba(14,165,233,0.2); &:hover { background-color: #0284c7; }`;
  }}
`;
