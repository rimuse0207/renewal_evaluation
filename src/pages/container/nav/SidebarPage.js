import React from "react";
import { COMPANY_NAME } from "../../../public/global/variable";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = styled.aside`
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0; // 사이드바 너비 축소 방지
  z-index: 10;
`;

const SidebarHeader = styled.div`
  height: 80px;
  text-align: center;
  margin-top: 20px;
  border-bottom: 1px solid lightgray;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #0ea5e9;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  color: ${(props) => (props.$active ? "#0ea5e9" : "#64748b")};
  background-color: ${(props) => (props.$active ? "#e0f2fe" : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? "#e0f2fe" : "#f8fafc")};
    color: ${(props) => (props.$active ? "#0ea5e9" : "#1e293b")};
  }
`;

const SidebarFooter = styled.div`
  padding: 24px;
  border-top: 1px solid #e2e8f0;
`;

const UserBrief = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeText = styled.span`
  font-size: 0.95rem;
  color: #475569;
  strong {
    color: #1e293b;
  }
`;

const LogoutText = styled.span`
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all 0.2s ease;

  &:hover {
    color: #ef4444; // 로그아웃은 보통 빨간색 계열로 강조
    text-decoration-color: #ef4444;
  }
`;

const SidebarPage = () => {
  const location = useLocation();
  const Navigation = useNavigate();
  const Login_Info = useSelector(
    (state) => state.Login_Info_Reducer_State?.Login_Info,
  );
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo>{COMPANY_NAME}</Logo>
        <Logo>인사평가 시스템</Logo>
      </SidebarHeader>

      <NavMenu>
        <NavItem
          onClick={() => Navigation("/Home")}
          $active={location.pathname === "/Home"}
        >
          성과평가 종합
        </NavItem>

        {Login_Info?.adminMenuIsOpen ? (
          <>
            <NavItem
              onClick={() => Navigation("/Admin/Home")}
              $active={location.pathname.startsWith("/Admin")}
            >
              평가 대상자 현황
            </NavItem>
            <NavItem
              onClick={() => Navigation("/DashboardAdmin/Dashboard")}
              $active={location.pathname.startsWith("/DashboardAdmin")}
            >
              평가 결과 조회
            </NavItem>
          </>
        ) : (
          <></>
        )}
      </NavMenu>

      {/* 사이드바 하단 사용자 정보 및 로그아웃 */}
      <SidebarFooter>
        <UserBrief>
          <WelcomeText>
            <strong>
              {Login_Info?.fullName} {Login_Info?.titleName}
            </strong>{" "}
            님
          </WelcomeText>
          <LogoutText
            onClick={() => {
              localStorage.clear();
              Navigation("/");
            }}
          >
            로그아웃
          </LogoutText>
        </UserBrief>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarPage;
