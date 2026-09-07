import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MOCK_CRITERIA, YearList } from "../../../public/global/variable";
import SidebarPage from "../nav/SidebarPage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePersonalSelect } from "../../../public/personalHooks/usePersonalSelect";
import { Change_User_Selected_Year } from "../../../Models/LoginInfoReducer/LoginInfoReduce";
import Criteria from "./criteria/Criteria";
import { Avatar } from "../admin/main/Table/TargetTableRow";

export default function MainPage() {
  const dispatch = useDispatch();
  const Navigation = useNavigate();
  const Login_Info = useSelector(
    (state) => state.Login_Info_Reducer_State?.Login_Info,
  );

  const { personalStatus, commonTasks, personalTasks, hasData } =
    usePersonalSelect(Login_Info?.selectedMyYear);

  const handleYearChange = (e) => {
    dispatch(Change_User_Selected_Year(e.target.value));
  };
  return (
    <LayoutContainer>
      {/* 1. 좌측 고정 사이드바 */}
      <SidebarPage />

      {/* 2. 우측 메인 콘텐츠 영역 (스크롤 가능) */}
      <MainContent>
        <ContentWrapper>
          <PageHeader>
            <PageTitle>성과평가 종합</PageTitle>
          </PageHeader>

          <TopSection>
            {/* 세련된 평가 대상자 정보 카드 */}
            <UserInfoCard>
              <ProfileContainer>
                <Avatar>
                  {Login_Info.UrlPath && (
                    <img
                      src={`http://192.168.2.245/download/image/${Login_Info.UrlPath}`}
                      alt="User_Image"
                      width={"100%"}
                    ></img>
                  )}
                </Avatar>
                <ProfileDetails>
                  <ProfileName>
                    {personalStatus?.fullName || Login_Info?.fullName}{" "}
                    <RankBadge>
                      {personalStatus?.titleName || Login_Info?.titleName}
                    </RankBadge>
                  </ProfileName>
                  <ProfileDept>
                    {personalStatus?.departmentName ||
                      Login_Info?.departmentName}
                  </ProfileDept>
                </ProfileDetails>
              </ProfileContainer>
            </UserInfoCard>

            {/* 평가 연도 선택 */}
            <YearSelectCard>
              <InfoLabel>평가 연도 선택</InfoLabel>
              <Select
                value={Login_Info?.selectedMyYear}
                onChange={handleYearChange}
              >
                {Login_Info?.availableYears?.myEvalYears?.map((list) => {
                  return (
                    <option key={list} value={list}>
                      {list}년도 인사평가
                    </option>
                  );
                })}
              </Select>
            </YearSelectCard>
          </TopSection>

          <Criteria></Criteria>

          {/* 업무실적 테이블 */}
          <PerformanceSection>
            <SectionHeader>
              <SectionTitle>
                {Login_Info?.selectedMyYear}년도 업무실적 및 본인평가
              </SectionTitle>
              {personalStatus?.status === "TEMP" && (
                <EditButton onClick={() => Navigation("/Write")}>
                  업무실적 작성 / 수정
                </EditButton>
              )}
            </SectionHeader>

            <TableCard>
              {hasData ? (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th width="6%">No.</Th>
                        <Th width="14%">추진업무</Th>
                        <Th width="70%">추진실적</Th>
                        <Th width="5%" align="center">
                          업무 비중
                        </Th>
                        <Th width="5%" align="center">
                          본인 평가
                        </Th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 공통 업무 그룹 */}
                      {commonTasks.length > 0 && (
                        <>
                          <GroupHeaderRow>
                            <td colSpan="5" style={{ color: "red" }}>
                              공통 업무
                            </td>
                          </GroupHeaderRow>
                          {commonTasks.map((item, index) => (
                            <tr key={item.task_id}>
                              <Td align="center" className="row-num">
                                {index + 1}
                              </Td>
                              <Td className="fw-bold">{item.task_name}</Td>
                              <Td className="long-text">{item.task_result}</Td>
                              <Td align="center">
                                <WeightBadge>{item.weight}%</WeightBadge>
                              </Td>
                              <Td align="center">
                                <GradeBadge $grade={item.self_score}>
                                  {item.self_score}
                                </GradeBadge>
                              </Td>
                            </tr>
                          ))}
                        </>
                      )}

                      {/* 개인 업무 그룹 */}
                      {personalTasks.length > 0 && (
                        <>
                          <GroupHeaderRow>
                            <td colSpan="5" style={{ color: "blue" }}>
                              개인 업무
                            </td>
                          </GroupHeaderRow>
                          {personalTasks.map((item, index) => (
                            <tr key={item.task_id}>
                              <Td align="center" className="row-num">
                                {index + 1}
                              </Td>
                              <Td className="fw-bold">{item.task_name}</Td>
                              <Td className="long-text">{item.task_result}</Td>
                              <Td align="center">
                                <WeightBadge>{item.weight}%</WeightBadge>
                              </Td>
                              <Td align="center">
                                <GradeBadge $grade={item.self_score}>
                                  {item.self_score}
                                </GradeBadge>
                              </Td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </Table>
                </TableWrapper>
              ) : (
                <EmptyState>
                  <EmptyTitle>조회된 데이터가 없습니다.</EmptyTitle>
                  {personalStatus?.user_id &&
                  personalStatus?.status === "TEMP" ? (
                    <EditButton onClick={() => Navigation("/Write")}>
                      업무실적 작성
                    </EditButton>
                  ) : (
                    <EmptyDesc>
                      {Login_Info?.selectedMyYear}년도에는 등록된 업무실적이
                      없거나,
                      <br />
                      인사평가 대상자가 아니었습니다.
                    </EmptyDesc>
                  )}
                </EmptyState>
              )}
            </TableCard>
          </PerformanceSection>
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

// --- Styled Components ---

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f4f6f8;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
  padding: 20px 24px 100px 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  height: 100px;
`;

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  height: 100%;
  box-sizing: border-box;
`;

const UserInfoCard = styled(CardBase)`
  flex: 1;
  display: flex;
  align-items: center;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProfileName = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RankBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #0ea5e9;
  background-color: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
`;

const ProfileDept = styled.div`
  font-size: 0.95rem;
  color: #64748b;
`;

const YearSelectCard = styled(CardBase)`
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoLabel = styled.h2`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  background-color: #f8fafc;
  transition: border-color 0.2s;

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

const PerformanceSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  background-color: #0ea5e9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);

  &:hover {
    background-color: #0284c7;
  }
`;

const TableCard = styled(CardBase)`
  height: auto;
  padding: 0;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #e2e8f0;
  width: ${(props) => props.width || "auto"};
`;

// 공통업무 / 개인업무 구분을 위한 그룹 헤더
const GroupHeaderRow = styled.tr`
  background-color: #f1f5f9;
  td {
    padding: 12px 16px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
    border-bottom: 1px solid #e2e8f0;
  }
`;

const Td = styled.td`
  padding: 20px 16px;
  font-size: 0.85rem;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  text-align: ${(props) => props.align || "left"};
  vertical-align: middle;

  &.row-num {
    color: #94a3b8;
    font-weight: 500;
  }

  &.fw-bold {
    font-weight: 600;
    color: #1e293b;
  }

  &.long-text {
    white-space: pre-wrap;
    word-break: keep-all;
    line-height: 1.6;
    word-wrap: break-word;
  }

  tr:last-child & {
    border-bottom: none;
  }
`;

const WeightBadge = styled.span`
  background-color: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const GradeBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;

  background-color: ${(props) => {
    // switch문은 단일 값으로 비교해야 하므로 아래와 같이 작성해야 합니다.
    switch (props.$grade) {
      case "10":
      case "9":
        return "#dcfce7";
      case "8":
      case "7":
        return "#e0f2fe";
      case "6":
      case "5":
        return "#fef9c3";
      case "4":
      case "3":
        return "#fee2e2";
      default:
        return "#f1f5f9";
    }
  }};

  color: ${(props) => {
    switch (props.$grade) {
      case "10":
      case "9":
        return "#166534";
      case "8":
      case "7":
        return "#0369a1";
      case "6":
      case "5":
        return "#854d0e";
      case "4":
      case "3":
        return "#991b1b";
      default:
        return "#475569";
    }
  }};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 24px;
  text-align: center;
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const EmptyDesc = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
`;
