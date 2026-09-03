import React from "react";
import styled from "styled-components";
import SidebarPage from "../../nav/SidebarPage";

// 생성한 Hook과 자식 컴포넌트들 Import (경로는 프로젝트에 맞게 수정)
import { usePermissionGrant } from "../../../../public/adminHooks/usePermissionGrant";
import OrgTreePane from "./OrgTreePane";
import UserTablePane from "./UserTablePane";
import GrantActionPane from "./GrantActionPane";
import { YearList } from "../../../../public/global/variable";

export default function PermissionGrantPage() {
  const { state, actions } = usePermissionGrant();

  return (
    <LayoutContainer>
      <SidebarPage />
      <MainContent>
        <ContentWrapper>
          <PageHeader>
            <div>
              <PageTitle>평가 결과 조회 권한 관리</PageTitle>
              <PageDesc>
                특정 인원에게 타인의 평가 결과를 열람할 수 있는 권한을
                부여합니다.
              </PageDesc>
            </div>
            <YearSelect
              value={state.selectedYear}
              onChange={(e) => actions.setSelectedYear(e.target.value)}
            >
              {YearList.map((list) => {
                return (
                  <option key={list.value} value={list.value}>
                    {list.label}년도 조직도
                  </option>
                );
              })}
            </YearSelect>
          </PageHeader>

          <Workspace>
            {/* 1. 좌측 (조직도 네비게이션) */}
            <OrgTreePane
              grantee={state.grantee}
              currentOrg={state.currentOrg}
              expandedDepts={state.expandedDepts}
              selectedTeam={state.selectedTeam}
              onToggleDept={actions.toggleDept}
              onTeamClick={actions.handleTeamClick}
            />

            {/* 2. 중앙 (인원 테이블) */}
            <UserTablePane
              grantee={state.grantee}
              selectedTeam={state.selectedTeam}
              teamUsers={state.teamUsers}
              isLoadingUsers={state.isLoadingUsers}
              selectedTargets={state.selectedTargets}
              isAllChecked={state.isAllChecked}
              onToggleTarget={actions.handleToggleTarget}
              onToggleAll={actions.handleToggleAll}
            />

            {/* 3. 우측 (서머리 & 액션 사이드바) */}
            <GrantActionPane
              Grantee_Options={state.Grantee_Options}
              grantee={state.grantee}
              setGrantee={actions.setGrantee}
              selectedTargets={state.selectedTargets}
              onToggleTarget={actions.handleToggleTarget}
              onGrantSubmit={actions.handleGrantSubmit}
            />
          </Workspace>
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

// Layout Styled Components
const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f1f5f9;
  overflow: hidden;
`;
const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 12px 24px;
`;
const ContentWrapper = styled.div`
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-shrink: 0;
`;
const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;
const PageDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
`;
const YearSelect = styled.select`
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 600;
  color: #0f172a;
  outline: none;
  cursor: pointer;
  background: white;
  font-size: 0.95rem;
  &:focus {
    border-color: #0ea5e9;
  }
`;

/* 🌟 통합 워크스페이스 레이아웃 (Grid) */
const Workspace = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 340px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  height: calc(100vh - 160px);
  overflow: hidden;
`;
