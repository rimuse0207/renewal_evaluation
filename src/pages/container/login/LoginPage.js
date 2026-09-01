import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import {
  COMPANY_NAME,
  DOMAIN,
  LOGIN_LABELING,
  MAIN_TITLE_NAME,
} from "../../../public/global/variable";
import { Request_Post_Axios } from "../../../API";
import { useDispatch } from "react-redux";
import { Login_Info_Apply_State_Func } from "../../../Models/LoginInfoReducer/LoginInfoReduce";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const Navgation = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [uuId, setUUid] = useState(null);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [tooltip, setTooltip] = useState({ show: false, message: "" });
  const tooltipTimeoutRef = useRef(null);

  const idInputRef = useRef(null);
  const authCodeInputRef = useRef(null);

  // 타이머 상태 (5분 = 300초)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (step === 1 && idInputRef.current) {
      idInputRef.current.focus();
    }
  }, [step]);

  // 타이머 카운트다운 로직
  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && timeLeft === 0) {
      setApiError("인증 시간이 만료되었습니다. 재전송을 눌러주세요.");
    }

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // 초(초)를 MM:SS 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const showTooltipMessage = (message) => {
    setTooltip({ show: true, message });
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltip({ show: false, message: "" });
    }, 2500);
  };

  const handleIdChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.includes("@")) {
      setUserId(inputValue.replace(/@/g, ""));
      showTooltipMessage("@는 사용할 수 없습니다.");
    } else {
      setUserId(inputValue);
      if (apiError) setApiError("");
    }
  };

  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    if (!userId) {
      showTooltipMessage("아이디를 입력해주세요.");
      if (idInputRef.current) idInputRef.current.focus();
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const fullEmail = `${userId}${DOMAIN}`;
      const request = await Request_Post_Axios("/Login/sendAuthMail", {
        email: fullEmail,
      });
      if (request.status) {
        setUUid(request.data);
        setStep(2);
        setAuthCode("");
        setTimeLeft(300); // 전송 성공 시 타이머 5분으로 초기화
        showTooltipMessage("인증번호가 발송되었습니다.");
      }

      setTimeout(() => {
        if (authCodeInputRef.current) {
          authCodeInputRef.current.focus();
        }
      }, 0);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "인증번호 발송에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStep(1);
    setAuthCode("");
    setApiError("");
    setTimeLeft(300); // 취소 시 타이머 초기화
    setTimeout(() => {
      if (idInputRef.current) {
        idInputRef.current.focus();
      }
    }, 0);
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();

    // 시간 만료 체크
    if (timeLeft === 0) {
      setApiError("인증 시간이 만료되었습니다. 재전송을 눌러주세요.");
      return;
    }

    if (!authCode) {
      setApiError("인증번호를 입력해주세요.");
      if (authCodeInputRef.current) authCodeInputRef.current.focus();
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const request = await Request_Post_Axios("/Login/verifyAuthCode", {
        code: authCode,
        uuid: uuId,
      });
      console.log(request);
      if (request.status) {
        // TODO: 메인 대시보드로 이동
        if (request.data.Not_eligible) {
          setApiError("인사평가 대상자가 아닙니다. 인사팀에게 문의바랍니다.");
          setStep(1);
          return alert("인사평가 대상자가 아닙니다. 인사팀에게 문의바랍니다.");
        }
        console.log(request);
        const token = request.data.token;

        const LoginInfo = request.data.sending_user_Info;

        dispatch(Login_Info_Apply_State_Func(LoginInfo));

        localStorage.setItem("Token", token);

        console.log("로그인 성공:", request);
        Navgation("/Home");
      } else {
        // 로그인 실패
        setApiError("잘못된 인증번호이거나 만료되었습니다.");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || "잘못된 인증번호이거나 만료되었습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  return (
    <Container>
      <LoginCard>
        <Logo>{COMPANY_NAME}</Logo>
        <Title>{MAIN_TITLE_NAME}</Title>
        <Subtitle>
          {step === 1
            ? LOGIN_LABELING.initial_Login_Message
            : LOGIN_LABELING.sended_Mail_Message}
        </Subtitle>

        {step === 1 ? (
          <Form onSubmit={handleRequestCode}>
            <InputGroup>
              <Label htmlFor="userId">사내 계정</Label>
              <InputContainer>
                {tooltip.show && (
                  <TooltipBubble>{tooltip.message}</TooltipBubble>
                )}
                <EmailInputWrapper $disabled={loading}>
                  <IdInput
                    type="text"
                    id="userId"
                    placeholder="아이디 입력"
                    value={userId}
                    onChange={handleIdChange}
                    disabled={loading}
                    ref={idInputRef}
                  />
                  <DomainText>{DOMAIN}</DomainText>
                </EmailInputWrapper>
              </InputContainer>
            </InputGroup>
            {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "발송 중..." : LOGIN_LABELING.button_Label_Message}
            </SubmitButton>
          </Form>
        ) : (
          <Form onSubmit={handleVerifyLogin}>
            <InputGroup>
              <Label>{LOGIN_LABELING.input_Label_Message}</Label>
              <EmailInputWrapper $disabled={true}>
                <IdInput type="text" value={userId} disabled />
                <DomainText>{DOMAIN}</DomainText>
              </EmailInputWrapper>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="authCode">인증번호</Label>
              <InputContainer>
                {tooltip.show && (
                  <TooltipBubble>{tooltip.message}</TooltipBubble>
                )}
                <AuthCodeRow>
                  <AuthInputWrapper>
                    <Input
                      type="text"
                      id="authCode"
                      placeholder="인증번호 6자리"
                      maxLength={6}
                      value={authCode}
                      onChange={(e) => {
                        setAuthCode(e.target.value.replace(/[^0-9]/g, ""));
                        if (apiError) setApiError("");
                      }}
                      disabled={loading || timeLeft === 0} // 시간 만료 시 입력 비활성화
                      ref={authCodeInputRef}
                    />
                    <TimerText $isDanger={timeLeft <= 60}>
                      {formatTime(timeLeft)}
                    </TimerText>
                  </AuthInputWrapper>

                  <SideButtonGroup>
                    <ActionButton
                      type="button"
                      onClick={handleRequestCode}
                      disabled={loading}
                    >
                      재전송
                    </ActionButton>
                    <ActionButton
                      type="button"
                      $secondary
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      취소
                    </ActionButton>
                  </SideButtonGroup>
                </AuthCodeRow>
              </InputContainer>
            </InputGroup>

            {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
            <SubmitButton type="submit" disabled={loading || timeLeft === 0}>
              {loading ? "확인 중..." : "로그인"}
            </SubmitButton>
          </Form>
        )}
      </LoginCard>
    </Container>
  );
}

// --- Styled Components ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginCard = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15);
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0ea5e9;
  margin-bottom: 8px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1f36;
  margin: 0 0 12px 0;
  text-align: center;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #697386;
  text-align: center;
  margin-bottom: 32px;
  word-break: keep-all;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #3c4257;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const TooltipBubble = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 16px;
  background-color: #1e293b;
  color: #ffffff;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.2s ease-out forwards;
  z-index: 10;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 16px;
    border-width: 5px;
    border-style: solid;
    border-color: #1e293b transparent transparent transparent;
  }
`;

const EmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: ${(props) => (props.$disabled ? "#f5f5f5" : "#ffffff")};
  transition: all 0.2s ease;
  overflow: hidden;

  &:focus-within {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

const IdInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: transparent;

  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const DomainText = styled.span`
  padding-right: 16px;
  font-size: 1rem;
  color: #64748b;
  user-select: none;
`;

const AuthCodeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// 타이머를 인풋 안에 겹치게 배치하기 위한 Wrapper
const AuthInputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 60px 12px 16px; /* 우측에 타이머가 들어갈 공간 확보 (60px) */
  font-size: 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

// 인풋창 우측에 고정되는 타이머 텍스트
const TimerText = styled.span`
  position: absolute;
  right: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  user-select: none;
  color: ${(props) =>
    props.$isDanger
      ? "#ef4444"
      : "#0ea5e9"}; /* 1분 이하일 때 빨간색으로 경고 */
  transition: color 0.3s ease;
`;

const SideButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  padding: 12px 14px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  background-color: ${(props) => (props.$secondary ? "#f1f5f9" : "#e0f2fe")};
  color: ${(props) => (props.$secondary ? "#64748b" : "#0284c7")};
  border: 1px solid ${(props) => (props.$secondary ? "#cbd5e1" : "#bae6fd")};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$secondary ? "#e2e8f0" : "#bae6fd")};
    color: ${(props) => (props.$secondary ? "#334155" : "#0369a1")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d93025;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #0ea5e9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0284c7;
  }

  &:disabled {
    background-color: #bae6fd;
    cursor: not-allowed;
  }
`;
