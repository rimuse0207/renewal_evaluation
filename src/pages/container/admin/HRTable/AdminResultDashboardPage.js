import React from "react";
import styled from "styled-components";
import SidebarPage from "../../nav/SidebarPage";
import {
  DEPT_GROUPS,
  useAdminResult,
} from "../../../../public/adminHooks/useAdminResults";
import GradeGroupTable from "./GradeGroupTable";

import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { YearSelect } from "../main/AdminMainPage";

const CustomTooltip = ({ color, grade, count, total }) => {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
  return (
    <TooltipWrapper>
      <TooltipColor $color={color} />
      <TooltipContent>
        <div className="tooltip-grade">{grade} 등급</div>
        <div className="tooltip-value">
          <strong>{count}</strong>명 <span>({percentage}%)</span>
        </div>
      </TooltipContent>
    </TooltipWrapper>
  );
};

export default function AdminResultDashboardPage() {
  const {
    selectedYear,
    setSelectedYear,
    selectedGroup,
    setSelectedGroup,
    loading,
    groupedData,
    chartData,
  } = useAdminResult();

  const groupOptions = Object.keys(DEPT_GROUPS);

  const totalEvaluated =
    chartData?.barData?.reduce((acc, cur) => acc + cur.count, 0) || 0;

  return (
    <LayoutContainer>
      <SidebarPage />
      <MainContent>
        <ContentWrapper>
          <PageHeader>
            <div>
              <PageTitle>평가 결과 조회</PageTitle>
              <PageDesc>
                조회하려는 인원의 <strong>리스트를 클릭</strong>하시면 상세
                페이지가 새 창에서 열립니다.
              </PageDesc>
            </div>

            <div>
              <YearSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2026">2026년도 인사평가</option>
                <option value="2025">2025년도 인사평가</option>
                <option value="2024">2024년도 인사평가</option>
                <option value="2023">2023년도 인사평가</option>
                <option value="2022">2022년도 인사평가</option>
                <option value="2021">2021년도 인사평가</option>
              </YearSelect>
            </div>
          </PageHeader>

          <FilterSection>
            <span className="filter-label">부서 필터 :</span>
            <ChipGroup>
              {groupOptions.map((group) => (
                <FilterChip
                  key={group}
                  $active={selectedGroup === group}
                  onClick={() => setSelectedGroup(group)}
                >
                  {group}
                </FilterChip>
              ))}
            </ChipGroup>
          </FilterSection>

          {loading ? (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#64748b" }}
            >
              데이터를 불러오는 중입니다...
            </div>
          ) : (
            <>
              <ChartSection>
                <ChartCard>
                  <h3 className="chart-title">
                    등급별 인원 수 ({" "}
                    {chartData.barData.reduce((a, b) => a + b.count, 0) +
                      groupedData.None.length}{" "}
                    명)
                  </h3>
                  <div className="chart-wrapper">
                    <ResponsiveBar
                      data={chartData.barData}
                      keys={["count"]}
                      indexBy="grade"
                      margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                      padding={0.4}
                      colors={({ data }) => data.color}
                      borderRadius={4}
                      axisBottom={{ tickSize: 0, tickPadding: 10 }}
                      axisLeft={{ tickSize: 0, tickPadding: 10, tickValues: 5 }}
                      enableLabel={true}
                      labelSkipHeight={12}
                      labelTextColor="#ffffff"
                      theme={{
                        fontSize: 13,
                        axis: {
                          ticks: { text: { fontWeight: 600, fill: "#64748b" } },
                        },
                      }}
                      // 🌟 Bar 차트 커스텀 툴팁 적용
                      tooltip={({ id, value, color, data }) => (
                        <CustomTooltip
                          color={color}
                          grade={data.grade}
                          count={value}
                          total={totalEvaluated}
                        />
                      )}
                    />
                  </div>
                </ChartCard>

                <ChartCard>
                  <h3 className="chart-title">평가 등급 비율 (%)</h3>
                  <div className="chart-wrapper">
                    <ResponsivePie
                      data={chartData.pieData}
                      margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                      innerRadius={0.55}
                      padAngle={2}
                      cornerRadius={4}
                      colors={({ data }) => data.color}
                      activeOuterRadiusOffset={8}
                      arcLinkLabel={(d) => `${d.id}등급 (${d.value}명)`}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#333333"
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: "color" }}
                      arcLabel={(d) => `${d.data.percentage}%`}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor="#ffffff"
                      theme={{
                        fontSize: 13,
                        labels: { text: { fontWeight: 700 } },
                      }}
                      // 🌟 Pie 차트 커스텀 툴팁 적용
                      tooltip={({ datum: { id, value, color } }) => (
                        <CustomTooltip
                          color={color}
                          grade={id}
                          count={value}
                          total={totalEvaluated}
                        />
                      )}
                    />
                  </div>
                </ChartCard>
              </ChartSection>

              <ResultArea>
                <GradeGroupTable
                  evalYear={selectedYear}
                  grade="A"
                  title="A 등급 리스트"
                  dataList={groupedData.A}
                  colorHex="#3b82f6"
                />
                <GradeGroupTable
                  evalYear={selectedYear}
                  grade="B"
                  title="B 등급 리스트"
                  dataList={groupedData.B}
                  colorHex="#22c55e"
                />
                <GradeGroupTable
                  evalYear={selectedYear}
                  grade="C"
                  title="C 등급 리스트"
                  dataList={groupedData.C}
                  colorHex="#f59e0b"
                />
                <GradeGroupTable
                  evalYear={selectedYear}
                  grade="D"
                  title="D 등급 리스트 "
                  dataList={groupedData.D}
                  colorHex="#64748b"
                />

                <GradeGroupTable
                  evalYear={selectedYear}
                  grade="-"
                  title="평가 미완료 리스트 (대기 중)"
                  dataList={groupedData.None}
                  colorHex="#94a3b8"
                />
              </ResultArea>
            </>
          )}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
}

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
`;
const TooltipColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${(props) => props.$color};
`;
const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  .tooltip-grade {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
  }
  .tooltip-value {
    font-size: 1rem;
    color: #1e293b;
    strong {
      font-size: 1.15rem;
      font-weight: 800;
    }
    span {
      font-size: 0.9rem;
      color: #0ea5e9;
      font-weight: 700;
      margin-left: 4px;
    }
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
  overflow: hidden;
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
  color: #1e293b;
  margin-bottom: 8px;
`;
const PageDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  strong {
    color: #0284c7;
  }
`;
const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  .filter-label {
    font-weight: 700;
    color: #475569;
    font-size: 0.95rem;
  }
`;
const ChipGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const FilterChip = styled.button`
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$active ? "#0ea5e9" : "#f1f5f9")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  border: 1px solid ${(props) => (props.$active ? "#0ea5e9" : "#cbd5e1")};
  &:hover {
    background-color: ${(props) => (props.$active ? "#0284c7" : "#e2e8f0")};
  }
`;
const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
`;
const ChartCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  .chart-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
  }
  .chart-wrapper {
    height: 300px;
  }
`;
const ResultArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
