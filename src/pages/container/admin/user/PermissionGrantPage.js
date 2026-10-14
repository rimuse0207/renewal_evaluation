import React, { useState } from "react";
import styled from "styled-components";
import SidebarPage from "../../nav/SidebarPage";

// 생성한 Hook과 자식 컴포넌트들 Import
import { usePermissionGrant } from "../../../../public/adminHooks/usePermissionGrant";
import { YearList } from "../../../../public/global/variable";
import OrgTreePane from "./OrgTreePane";
import UserTablePane from "./UserTablePane";
import GrantActionPane from "./GrantActionPane";

// 메뉴 권한용 가상 컴포넌트 (추후 분리 가능)
import Select from "react-select";

export default function PermissionGrantPage() {
  const { state, actions } = usePermissionGrant();

  const [selectedRole, setSelectedRole] = useState(null);

  const [selectUser, setSelectUser] = useState(null);

  return (
    <LayoutContainer>
      <SidebarPage />
      <MainContent>
        <ContentWrapper>
          <PageHeader>
            <div className="title-area">
              <PageTitle>시스템 권한 관리</PageTitle>
            </div>

            {/* '타인 평가 조회' 메뉴일 때만 연도 선택기 표시 */}
            {state.activeMenu === "DATA" && (
              <YearSelect
                value={state.selectedYear}
                onChange={(e) => actions.setSelectedYear(e.target.value)}
              >
                {YearList.map((list) => (
                  <option key={list.value} value={list.value}>
                    {list.label}년도 조직도
                  </option>
                ))}
              </YearSelect>
            )}
          </PageHeader>

          <WorkspaceBox>
            {/* ==========================================
                [1단] 글로벌 설정 메뉴 (가장 좌측 고정)
                ========================================== */}
            <GlobalNavPane>
              <NavTitle>설정 카테고리</NavTitle>
              <NavMenu>
                <NavItem
                  $active={state.activeMenu === "MENU"}
                  onClick={() => actions.setActiveMenu("MENU")}
                >
                  시스템 메뉴 접근 권한
                </NavItem>
                <NavItem
                  $active={state.activeMenu === "DATA"}
                  onClick={() => actions.setActiveMenu("DATA")}
                >
                  타인 평가 조회 권한
                </NavItem>
              </NavMenu>
            </GlobalNavPane>

            {/* ==========================================
                우측 동적 콘텐츠 영역 (선택된 메뉴에 따라 그리드 변경)
                ========================================== */}
            <DynamicContentArea>
              {state.activeMenu === "DATA" && (
                <DataPermissionGrid>
                  {/* [2단] 조직도 */}
                  <OrgTreePane
                    grantee={state.grantee}
                    currentOrg={state.currentOrg}
                    expandedDepts={state.expandedDepts}
                    selectedTeam={state.selectedTeam}
                    onToggleDept={actions.toggleDept}
                    onTeamClick={actions.handleTeamClick}
                  />
                  {/* [3단] 유저 테이블 */}
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
                  {/* [4단] 권한 수여자 지정 및 액션 */}
                  <GrantActionPane
                    Grantee_Options={state.Grantee_Options}
                    grantee={state.grantee}
                    setGrantee={actions.setGrantee}
                    selectedTargets={state.selectedTargets}
                    isLoadingTargets={state.isLoadingTargets}
                    onToggleTarget={actions.handleToggleTarget}
                    onGrantSubmit={actions.handleGrantSubmit}
                  />
                </DataPermissionGrid>
              )}

              {state.activeMenu === "MENU" && (
                <MenuPermissionGrid>
                  {/* [2단] 권한 메뉴 리스트 */}
                  <RoleListPane>
                    <PaneTitle>권한 메뉴 리스트</PaneTitle>
                    <RoleMenuContainer>
                      <RoleItem
                        $active={selectedRole === "EVAL_ADMIN"}
                        onClick={() => {
                          actions.handleChangeMenuUserList("EVAL_ADMIN");
                          setSelectedRole("EVAL_ADMIN");
                        }}
                      >
                        <div className="role-name">부서원 평가 메뉴</div>
                        <div className="role-desc">1차, 2차 평가 작성 권한</div>
                      </RoleItem>
                      <RoleItem
                        $active={selectedRole === "EVAL_RESULT_ADMIN"}
                        onClick={() => {
                          actions.handleChangeMenuUserList("EVAL_RESULT_ADMIN");
                          setSelectedRole("EVAL_RESULT_ADMIN");
                        }}
                      >
                        <div className="role-name">평가 결과 통계 메뉴</div>
                        <div className="role-desc">평가 결과 통계 전용</div>
                      </RoleItem>
                      <RoleItem
                        $active={selectedRole === "HR_ADMIN"}
                        onClick={() => {
                          actions.handleChangeMenuUserList("HR_ADMIN");
                          setSelectedRole("HR_ADMIN");
                        }}
                      >
                        <div className="role-name">권한 관리 메뉴</div>
                        <div className="role-desc">시스템 권한 관리</div>
                      </RoleItem>
                    </RoleMenuContainer>
                  </RoleListPane>

                  {/* [3단] 해당 권한을 가진 인원 리스트 */}
                  <RoleUserPane>
                    <RolePaneHeader>
                      <PaneTitle>
                        {selectedRole === "EVAL_ADMIN"
                          ? "부서원 평가 접근 권한"
                          : selectedRole === "EVAL_RESULT_ADMIN"
                            ? "평가 결과 통계 메뉴 접근 권한"
                            : "권한 관리 메뉴 접근 권한"}
                        <span className="badge">
                          {state?.nowIncludeMenuAccessUser?.length || 0}명
                        </span>
                      </PaneTitle>
                      <SearchAddWrapper>
                        <Select
                          options={state.Grantee_Options.filter(
                            (item) =>
                              !state.nowIncludeMenuAccessUser.some(
                                (list) => list.user_id === item.value,
                              ),
                          )}
                          placeholder="인원 검색 후 추가 (이름/이메일)..."
                          menuPortalTarget={document.body}
                          onChange={(e) => setSelectUser(e)}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "280px",
                              borderRadius: "8px",
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <AddButton
                          onClick={() =>
                            actions.handleAddAccessMenuUserList(
                              selectedRole,
                              selectUser,
                            )
                          }
                        >
                          + 추가
                        </AddButton>
                      </SearchAddWrapper>
                    </RolePaneHeader>

                    <RoleTableWrapper>
                      <Table>
                        <thead>
                          <tr>
                            <Th>이름 / 직급</Th>
                            <Th>부서</Th>
                            <Th align="center">관리</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.nowIncludeMenuAccessUser.map((list) => {
                            return (
                              <tr key={list.user_id}>
                                <Td className="fw-bold">
                                  {list.fullName} {list.titleName}
                                </Td>
                                <Td>{list.departmentName}</Td>
                                <Td align="center">
                                  <RevokeButton
                                    onClick={() =>
                                      actions.handleDeleteAccessMenuUserList(
                                        selectedRole,
                                        list.user_id,
                                      )
                                    }
                                  >
                                    권한 회수
                                  </RevokeButton>
                                </Td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </RoleTableWrapper>
                  </RoleUserPane>
                </MenuPermissionGrid>
              )}
            </DynamicContentArea>
          </WorkspaceBox>
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

// ==========================================
// 💅 Styled Components
// ==========================================
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
  margin-bottom: 20px;
  flex-shrink: 0;
  .title-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  margin: 0;
`;
const PageDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
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

/* 🌟 통합 워크스페이스 레이아웃 */
const WorkspaceBox = styled.div`
  display: flex;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  height: calc(100vh - 120px);
  overflow: hidden;
`;

/* ==========================================
   [1단] 글로벌 네비게이션
   ========================================== */
const GlobalNavPane = styled.div`
  width: 230px; /* 고정 너비 */
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;
const NavTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 16px;
  padding-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: ${(props) => (props.$active ? "700" : "600")};
  color: ${(props) => (props.$active ? "#0ea5e9" : "#475569")};
  background: ${(props) => (props.$active ? "#e0f2fe" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(props) => (props.$active ? "#e0f2fe" : "#f1f5f9")};
  }
  .icon {
    font-size: 1.1rem;
  }
`;

/* ==========================================
   동적 콘텐츠 영역 (우측 전체)
   ========================================== */
const DynamicContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* 🔹 타인 평가 조회 권한용 그리드 (기존 컴포넌트 3개 배치용) */
const DataPermissionGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 340px;
  height: 100%;
  width: 100%;
`;

/* 🔹 시스템 메뉴 접근 권한용 그리드 (롤 2개 배치용) */
const MenuPermissionGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100%;
  width: 100%;
`;

/* ==========================================
   메뉴 권한 전용 Styled Components
   ========================================== */
const PaneTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  .badge {
    background: #e0f2fe;
    color: #0284c7;
    font-size: 0.85rem;
    padding: 2px 8px;
    border-radius: 12px;
  }
`;

/* 롤(Role) 리스트 */
const RoleListPane = styled.div`
  border-right: 1px solid #e2e8f0;
  padding: 24px;
  background: #ffffff;
`;
const RoleMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const RoleItem = styled.div`
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.$active ? "#bae6fd" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#f0f9ff" : "white")};
  box-shadow: ${(props) =>
    props.$active
      ? "0 4px 12px rgba(14, 165, 233, 0.1)"
      : "0 1px 2px rgba(0,0,0,0.02)"};
  .role-name {
    font-weight: 700;
    color: ${(props) => (props.$active ? "#0284c7" : "#1e293b")};
    font-size: 1rem;
    margin-bottom: 6px;
  }
  .role-desc {
    color: ${(props) => (props.$active ? "#0ea5e9" : "#64748b")};
    font-size: 0.85rem;
    line-height: 1.4;
  }
  &:hover {
    border-color: #bae6fd;
  }
`;

/* 롤 해당 대상자 리스트 */
const RoleUserPane = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
`;
const RolePaneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const SearchAddWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const AddButton = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 38px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #0284c7;
  }
`;

/* 테이블 공통 */
const RoleTableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: white;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 14px 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
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
`;
const RevokeButton = styled.button`
  background: white;
  border: 1px solid #fca5a5;
  color: #ef4444;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #fef2f2;
  }
`;
