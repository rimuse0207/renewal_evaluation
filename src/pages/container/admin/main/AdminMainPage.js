import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import SidebarPage from "../../nav/SidebarPage";
import { useAdminMain } from "../../../../public/adminHooks/useAdminMain";
import TargetTableRow from "./Table/TargetTableRow";
import { useDispatch, useSelector } from "react-redux";
import { Change_Admin_Selected_Year } from "../../../../Models/LoginInfoReducer/LoginInfoReduce";

export default function ManagerDashboardPage() {
  const dispatch = useDispatch();
  const Login_Info = useSelector(
    (state) => state.Login_Info_Reducer_State?.Login_Info,
  );
  const { state, actions, calculators } = useAdminMain();

  const mainContentRef = useRef(null);

  useEffect(() => {
    const savedFilters = sessionStorage.getItem("managerFilters");
    if (savedFilters) {
      const { search, dept, status } = JSON.parse(savedFilters);
      if (search !== undefined) actions.setSearchName(search);
      if (dept !== undefined) actions.setFilterDept(dept);
      if (status !== undefined) actions.setFilterStatus(status);
    }
  }, []);

  useEffect(() => {
    const currentFilters = {
      search: state.searchName,
      dept: state.filterDept,
      status: state.filterStatus,
    };
    sessionStorage.setItem("managerFilters", JSON.stringify(currentFilters));
  }, [state.searchName, state.filterDept, state.filterStatus]);

  const handleScroll = (e) => {
    sessionStorage.setItem("managerScroll", e.target.scrollTop);
  };

  useEffect(() => {
    if (mainContentRef.current && state.filteredTargets.length > 0) {
      const savedScroll = sessionStorage.getItem("managerScroll");
      if (savedScroll) {
        mainContentRef.current.scrollTop = Number(savedScroll);
      }
    }
  }, [state.filteredTargets]);

  return (
    <LayoutContainer>
      <SidebarPage />

      <MainContent ref={mainContentRef} onScroll={handleScroll}>
        <ContentWrapper>
          {/* 헤더 영역 */}
          <PageHeader>
            <div>
              <PageTitle>{state.selectedYear}년도 평가 대상자</PageTitle>
              <PageDesc>
                <strong>'평가 필요'</strong>는 아직 평가를 하지 않은
                대상자입니다.{"  "}
                <strong>평가하기</strong> 버튼을 클릭하여 평가를 진행 해주세요.
              </PageDesc>
            </div>
            <YearSelect
              value={state.selectedYear}
              onChange={(e) =>
                dispatch(Change_Admin_Selected_Year(e.target.value))
              }
            >
              {Login_Info.availableYears?.adminEvalYears?.map((list) => {
                return (
                  <option key={list} value={list}>
                    {list}년도 인사평가
                  </option>
                );
              })}
            </YearSelect>
          </PageHeader>

          <DashCards>
            <Card>
              <CardTitle>총 평가 대상자</CardTitle>
              <CardValue>
                {state.totalCount}
                <span>명</span>
              </CardValue>
            </Card>
            <Card $highlight>
              <CardTitle>평가 진행 중 (대기 포함)</CardTitle>
              <CardValue className="text-orange">
                {state.waitingCount}
                <span>명</span>
              </CardValue>
            </Card>
            <Card>
              <CardTitle>평가 완료</CardTitle>
              <CardValue className="text-green">
                {state.completedCount}
                <span>명</span>
              </CardValue>
            </Card>
          </DashCards>

          <FilterBar>
            <FilterGroup>
              <FilterLabel>이름 검색</FilterLabel>
              <SearchInput
                type="text"
                placeholder="이름 입력"
                value={state.searchName}
                onChange={(e) => actions.setSearchName(e.target.value)}
              />
            </FilterGroup>
            <VerticalDivider />
            <FilterGroup>
              <FilterLabel>부서 필터</FilterLabel>
              <FilterSelect
                value={state.filterDept}
                onChange={(e) => actions.setFilterDept(e.target.value)}
              >
                {state.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "ALL" ? "전체 부서" : dept}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>상태 필터</FilterLabel>
              <FilterSelect
                value={state.filterStatus}
                onChange={(e) => actions.setFilterStatus(e.target.value)}
              >
                <option value="ALL">전체 보기</option>
                <option value="WAITING">진행 중</option>
                <option value="COMPLETED">평가 완료</option>
              </FilterSelect>
            </FilterGroup>
            <FilterResultCount>
              검색 결과{" "}
              <strong className="count">{state.filteredTargets.length}</strong>{" "}
              명
            </FilterResultCount>
          </FilterBar>

          {/* 테이블 영역 */}
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th width="20%">대상자 정보</Th>
                  <Th width="21%" align="center">
                    1. 성과평가
                  </Th>
                  <Th width="21%" align="center">
                    2. 역량평가
                  </Th>
                  <Th width="26%" align="center">
                    3. 종합평가 (작성)
                  </Th>
                  <Th width="12%" align="center">
                    최종 등급
                  </Th>
                </tr>
              </thead>
              <tbody>
                {state.filteredTargets.length === 0 ? (
                  <tr>
                    <Td colSpan="5" className="empty-message">
                      조건에 맞는 대상자가 없습니다.
                    </Td>
                  </tr>
                ) : (
                  state.filteredTargets.map((target) => (
                    <TargetTableRow
                      key={target.id}
                      target={target}
                      calculators={calculators}
                      onNavigate={actions.handleNavigate}
                    />
                  ))
                )}
              </tbody>
            </Table>
          </TableContainer>
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f1f5f9;
`;
const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;
const ContentWrapper = styled.div`
  margin: 0 auto;
`;
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;
const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
`;
const PageDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  strong {
    color: #d97706;
  }
`;
export const YearSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  outline: none;
  background-color: white;
  cursor: pointer;
`;

const DashCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
`;
const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  border: 1px solid ${(props) => (props.$highlight ? "#fde68a" : "transparent")};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
`;
const CardValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  span {
    font-size: 1.1rem;
    font-weight: 600;
    margin-left: 4px;
    color: #94a3b8;
  }
  &.text-orange {
    color: #d97706;
  }
  &.text-green {
    color: #059669;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;
const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const FilterLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
`;
const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 160px;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
  }
`;
const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  min-width: 140px;
  outline: none;
`;
const VerticalDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #e2e8f0;
  margin: 0 8px;
`;
const FilterResultCount = styled.div`
  margin-left: auto;
  font-size: 0.95rem;
  color: #64748b;
  .count {
    color: #0ea5e9;
    font-size: 1.1rem;
    font-weight: 800;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
  padding: 18px 24px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 2px solid #e2e8f0;
`;

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
