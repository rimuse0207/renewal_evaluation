import React from "react";
import styled from "styled-components";

export default function OrgTreePane({
  grantee,
  currentOrg,
  expandedDepts,
  selectedTeam,
  onToggleDept,
  onTeamClick,
}) {
  return (
    <LeftPane style={grantee ? {} : { overflow: "hidden" }}>
      {!grantee && (
        <BlockOverlay>
          <span>
            우측에서
            <br />
            권한 받을 사람을
            <br />
            먼저 선택해주세요.
          </span>
        </BlockOverlay>
      )}
      <PaneTitle> 조직도</PaneTitle>
      <TreeContainer>
        {Object.entries(currentOrg).map(([dept, teams]) => (
          <DeptGroup key={dept}>
            <DeptHeader onClick={() => onToggleDept(dept)}>
              <span className="toggle-icon">
                {expandedDepts.includes(dept) ? "▾" : "▸"}
              </span>
              <span className="dept-name">{dept}</span>
            </DeptHeader>
            {expandedDepts.includes(dept) && (
              <TeamList>
                {teams.map((team) => (
                  <TeamItem
                    key={team}
                    $active={selectedTeam === team}
                    onClick={() => onTeamClick(team)}
                  >
                    {team}
                  </TeamItem>
                ))}
              </TeamList>
            )}
          </DeptGroup>
        ))}
      </TreeContainer>
    </LeftPane>
  );
}

// Styled Components
const LeftPane = styled.div`
  position: relative; /* 🌟 오버레이 기준점 */
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 24px 20px;
  overflow-y: auto;
`;

/* 🌟 블러 오버레이 스타일 */
const BlockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  text-align: center;
  span {
    background: #1e293b;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    line-height: 1.5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;
const PaneTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
`;
const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const DeptGroup = styled.div``;
const DeptHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover {
    background: #f1f5f9;
  }
  .toggle-icon {
    width: 20px;
    font-size: 1rem;
    color: #94a3b8;
  }
  .dept-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: #334155;
  }
`;
const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  margin-bottom: 12px;
`;
const TeamItem = styled.div`
  padding: 8px 12px 8px 16px;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  color: ${(props) => (props.$active ? "#0ea5e9" : "#475569")};
  background: ${(props) => (props.$active ? "#e0f2fe" : "transparent")};
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 2px;
  &:hover {
    background: ${(props) => (props.$active ? "#e0f2fe" : "#f1f5f9")};
  }
`;
