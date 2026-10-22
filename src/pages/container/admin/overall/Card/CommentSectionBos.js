import React from "react";
import styled from "styled-components";

export default function OverallCommentSection({
  comments,
  myRole,
  isBoth,
  onCommentChange,
  isDone,
}) {
  const handle1stChange = (e) => {
    const val = e.target.value;
    onCommentChange("comment1ST", val);
    if (isBoth) {
      onCommentChange("comment2ND", val);
    }
  };

  const handle2ndChange = (e) => {
    onCommentChange("comment2ND", e.target.value);
  };

  const is1stActive = (myRole === "1ST" || isBoth) && !isDone;
  const is2ndActive = myRole === "2ND" && !isBoth && !isDone;

  return (
    <CommentSection>
      {/* --- 1차 의견 박스 --- */}
      <CommentBox>
        <div className="comment-header">
          <span className="role-badge">
            {isBoth ? "1·2차 종합 의견" : "1차 평가자 의견"}
          </span>
          {!is1stActive && (
            <span className="status-readonly">
              {isDone ? "제출 완료 (수정 불가)" : "조회 전용"}
            </span>
          )}
        </div>
        {is1stActive ? (
          <TextArea
            placeholder={
              isBoth
                ? "대상자의 성과 및 역량에 대한 1·2차 종합 의견을 작성해주세요."
                : "대상자의 성과 및 역량에 대한 1차 종합 의견을 작성해주세요."
            }
            value={comments.comment1ST || ""}
            onChange={handle1stChange}
          />
        ) : (
          <ReadOnlyText>
            {comments.comment1ST || "작성된 의견이 없습니다."}
          </ReadOnlyText>
        )}
      </CommentBox>

      {/* --- 2차 의견 박스 --- */}
      <CommentBox>
        <div className="comment-header">
          <span className="role-badge second">2차 평가자 의견</span>
          {!is2ndActive && (
            <span className="status-readonly">
              {isDone
                ? "제출 완료 (수정 불가)"
                : isBoth
                  ? "1차 의견과 동일하게 자동 반영됩니다"
                  : "조회 전용"}
            </span>
          )}
        </div>
        {is2ndActive ? (
          <TextArea
            placeholder="대상자의 성과 및 역량에 대한 2차 종합 의견을 작성해주세요."
            value={comments.comment2ND || ""}
            onChange={handle2ndChange}
          />
        ) : (
          <ReadOnlyText className={isBoth && !isDone ? "mirroring" : ""}>
            {isBoth && !isDone
              ? comments.comment1ST ||
                "1차 의견을 작성하면 자동으로 반영됩니다."
              : comments.comment2ND || "작성된 의견이 없습니다."}
          </ReadOnlyText>
        )}
      </CommentBox>
    </CommentSection>
  );
}

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .role-badge {
    display: inline-block;
    background-color: #e0f2fe;
    color: #0284c7;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 700;
    &.second {
      background-color: #f3e8ff;
      color: #7e22ce;
    }
  }
  .status-readonly {
    font-size: 0.85rem;
    color: #ef4444;
    font-weight: 700;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 250px;
  padding: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  resize: none;
  line-height: 1.5;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

const ReadOnlyText = styled.div`
  width: 100%;
  min-height: 250px;
  padding: 16px;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #334155;
  font-weight: 500;
  line-height: 1.6;
  white-space: pre-wrap;
  box-sizing: border-box;

  &.mirroring {
    color: #94a3b8;
    font-style: italic;
    background-color: transparent;
    border: 1px dashed #cbd5e1;
  }
`;
