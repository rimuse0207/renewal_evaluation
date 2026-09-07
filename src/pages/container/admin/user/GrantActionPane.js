import React from "react";
import styled from "styled-components";
import Select from "react-select";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    padding: "4px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "#0ea5e9" : "#cbd5e1",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(14, 165, 233, 0.15)" : "none",
    "&:hover": { borderColor: "#0ea5e9" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0ea5e9"
      : state.isFocused
        ? "#f0f9ff"
        : "white",
    color: state.isSelected ? "white" : "#1e293b",
    cursor: "pointer",
  }),
};

export default function GrantActionPane({
  grantee,
  setGrantee,
  selectedTargets,
  isLoadingTargets,
  onToggleTarget,
  onGrantSubmit,
  Grantee_Options,
}) {
  return (
    <RightPane>
      <div className="right-top-section">
        <RightSectionTitle>1. 권한 받을 사람</RightSectionTitle>
        {grantee ? (
          <GranteeProfile>
            <div className="avatar">{grantee.fullName.charAt(0)}</div>
            <div className="info">
              <div className="name">
                {grantee.fullName} {grantee.titleName}
              </div>
              <div className="dept">{grantee.departmentName}</div>
            </div>
            <button className="reset-btn" onClick={() => setGrantee(null)}>
              ✕
            </button>
          </GranteeProfile>
        ) : (
          <Select
            options={Grantee_Options}
            placeholder="이름 또는 이메일 검색..."
            onChange={setGrantee}
            isClearable
            styles={selectStyles}
            noOptionsMessage={() => "검색 결과가 없습니다."}
          />
        )}
      </div>

      <div className="right-middle-section">
        <RightSectionTitle>
          2. 조회 대상자 리스트
          <span className="count-badge">{selectedTargets.length}</span>
        </RightSectionTitle>

        <TargetList>
          {/* 🌟 기존 권한을 불러올 때 보여주는 로딩 UI */}
          {isLoadingTargets ? (
            <div className="empty-target loading">
              기존 권한 정보를 불러오는 중...
            </div>
          ) : !grantee ? (
            <div className="empty-target">권한 수여자를 먼저 검색해주세요.</div>
          ) : selectedTargets.length === 0 ? (
            <div className="empty-target">
              현재 부여된 권한이 없습니다.
              <br />
              좌측에서 대상을 추가해주세요.
            </div>
          ) : (
            selectedTargets.map((t) => (
              <TargetItem key={t.user_id} $isNew={!t.isExisting}>
                <div className="t-info">
                  <div className="t-header">
                    <StatusBadge $isNew={!t.isExisting}>
                      {t.isExisting ? "기존" : "신규"}
                    </StatusBadge>
                    <span className="t-name">
                      {t.fullName} {t.titleName}
                    </span>
                  </div>
                  <span className="t-dept">{t.departmentName}</span>
                </div>
                {/* 🌟 X 버튼을 누르면 권한 삭제(회수) 처리됨 */}
                <button onClick={() => onToggleTarget(t)} title="목록에서 제거">
                  ✕
                </button>
              </TargetItem>
            ))
          )}
        </TargetList>
      </div>

      <div className="right-bottom-section">
        <PrimaryButton onClick={onGrantSubmit} disabled={!grantee}>
          권한 설정 저장
        </PrimaryButton>
      </div>
    </RightPane>
  );
}

// Styled Components
const RightPane = styled.div`
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 75vh;
  overflow: auto;
  .right-top-section {
    margin-bottom: 32px;
  }
  .right-middle-section {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .right-bottom-section {
    padding-top: 16px;
  }
`;
const RightSectionTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .count-badge {
    background: #0ea5e9;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
`;
const GranteeProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #0ea5e9;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
  }
  .info {
    flex: 1;
  }
  .name {
    font-weight: 700;
    font-size: 0.95rem;
    color: #1e293b;
  }
  .dept {
    font-size: 0.8rem;
    color: #64748b;
  }
  .reset-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.1rem;
    cursor: pointer;
    &:hover {
      color: #ef4444;
    }
  }
`;

const TargetList = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
  .empty-target {
    font-size: 0.9rem;
    color: #94a3b8;
    text-align: center;
    padding-top: 40px;
    line-height: 1.6;
  }
  .loading {
    color: #0ea5e9;
    font-weight: 600;
  }
`;

/* 🌟 기존 vs 신규 카드 스타일 분리 */
const TargetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${(props) => (props.$isNew ? "#bae6fd" : "#e2e8f0")};
  box-shadow: ${(props) =>
    props.$isNew ? "0 2px 8px rgba(14, 165, 233, 0.08)" : "none"};

  .t-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .t-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .t-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1e293b;
  }
  .t-dept {
    font-size: 0.8rem;
    color: #64748b;
  }
  button {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
    &:hover {
      color: #ef4444;
    }
  }
`;

/* 🌟 뱃지 스타일 */
const StatusBadge = styled.span`
  background-color: ${(props) => (props.$isNew ? "#e0f2fe" : "#f1f5f9")};
  color: ${(props) => (props.$isNew ? "#0284c7" : "#64748b")};
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${(props) => (props.disabled ? "#cbd5e1" : "#0ea5e9")};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0 4px 12px rgba(14, 165, 233, 0.3)"};
  &:hover {
    background: ${(props) => (props.disabled ? "#cbd5e1" : "#0284c7")};
  }
`;
const HelpText = styled.div`
  font-size: 0.8rem;
  color: #ef4444;
  text-align: center;
  margin-top: 12px;
  font-weight: 600;
`;
