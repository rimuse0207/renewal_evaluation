import React from "react";
import styled from "styled-components";

export default function UserTablePane({
  grantee,
  selectedTeam,
  teamUsers,
  isLoadingUsers,
  selectedTargets,
  isAllChecked,
  onToggleTarget,
  onToggleAll,
}) {
  return (
    <CenterPane>
      {!grantee && (
        <BlockOverlay>
          <span>
            대상자를 조회하려면 우측 1번 항목(권한 받을 사람)을 먼저
            지정해주세요.
          </span>
        </BlockOverlay>
      )}
      <PaneTitle>
        {selectedTeam ? `${selectedTeam} 소속 인원` : "부서를 선택해주세요"}
      </PaneTitle>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th width="8%" align="center">
                <Checkbox
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={onToggleAll}
                  disabled={teamUsers.length === 0 || isLoadingUsers}
                />
              </Th>
              <Th>이름</Th>
              <Th>직급</Th>
              <Th>1차 평가자</Th>
              <Th>2차 평가자</Th>
            </tr>
          </thead>
          <tbody>
            {!selectedTeam ? (
              <tr>
                <Td colSpan="4" className="empty-message">
                  좌측에서 열람할 팀을 선택해주세요.
                </Td>
              </tr>
            ) : isLoadingUsers ? (
              <tr>
                <Td colSpan="4" className="empty-message loading">
                  데이터를 불러오는 중입니다...
                </Td>
              </tr>
            ) : teamUsers.length === 0 ? (
              <tr>
                <Td colSpan="4" className="empty-message">
                  인원이 없습니다.
                </Td>
              </tr>
            ) : (
              teamUsers.map((user) => {
                const isChecked = selectedTargets.some(
                  (t) => t.user_id === user.user_id,
                );
                return (
                  <Tr
                    key={user.user_id}
                    $isChecked={isChecked}
                    onClick={() => onToggleTarget(user)}
                  >
                    <Td align="center">
                      <Checkbox
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleTarget(user)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Td>
                    <Td className="fw-bold">{user.fullName}</Td>
                    <Td>{user.titleName}</Td>
                    <Td className="emp-no">{user.fistEvalName}</Td>
                    <Td className="emp-no">{user.secondEvalName}</Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </CenterPane>
  );
}

// Styled Components
const CenterPane = styled.div`
  position: relative; /* 🌟 오버레이 기준점 */
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BlockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  span {
    background: white;
    border: 1px solid #cbd5e1;
    color: #475569;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;
const PaneTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
`;
const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 14px 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
`;
const Tr = styled.tr`
  cursor: pointer;
  background: ${(props) => (props.$isChecked ? "#f0f9ff" : "white")};
  transition: background 0.15s;
  &:hover {
    background: ${(props) => (props.$isChecked ? "#f0f9ff" : "#f8fafc")};
  }
`;
const Td = styled.td`
  padding: 16px;
  font-size: 0.95rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  text-align: ${(props) => props.align || "left"};
  &.fw-bold {
    font-weight: 700;
    color: #0f172a;
  }
  &.emp-no {
    color: #94a3b8;
    font-family: monospace;
    font-size: 0.95rem;
  }
  &.empty-message {
    text-align: center;
    padding: 120px 0;
    color: #94a3b8;
    font-size: 1rem;
  }
  &.loading {
    color: #0ea5e9;
  }
`;
const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0ea5e9;
`;
