import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import SidebarPage from "../nav/SidebarPage";

import { usePersonalApply } from "../../../public/personalHooks/usePersonalApply";
import Criteria from "../home/criteria/Criteria";

const AutoResizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      if (document.activeElement === textareaRef.current) {
        textareaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
    />
  );
};

export default function PerformanceEditPage() {
  const {
    Navigation,
    tasks,
    personalStatus,
    totalWeight,
    isWeightValid,
    handleAddTask,
    handleRemoveTask,
    handleChange,
    handleTempSave,
    handleFinalSubmit,
  } = usePersonalApply();

  const mainContentRef = useRef(null);
  const prevTaskCount = useRef(tasks.length);

  useEffect(() => {
    if (tasks.length > prevTaskCount.current) {
      const lastTask = tasks[tasks.length - 1];
      if (lastTask) {
        setTimeout(() => {
          const newCardElement = document.getElementById(
            `task-card-${lastTask.task_id}`,
          );
          if (newCardElement) {
            newCardElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    }
    prevTaskCount.current = tasks.length;
  }, [tasks]);

  return (
    <LayoutContainer>
      <SidebarPage />

      <MainContent ref={mainContentRef}>
        <ContentWrapper>
          <PageHeader>
            <HeaderTop>
              <BackButton onClick={() => Navigation("/Home")}>
                <span className="icon">←</span> 성과평가 종합으로 돌아가기
              </BackButton>
            </HeaderTop>
            <PageTitle>업무실적 작성 / 수정</PageTitle>
            <PageDesc>
              본인의 업무실적을 항목별로 추가하여 기입해주세요. 최종 제출을
              위해서는 <strong>업무 비중의 합이 100%</strong>가 되어야 합니다.
            </PageDesc>
          </PageHeader>

          <SummaryStickyBar>
            <SummaryCard $isValid={isWeightValid}>
              <SummaryInfo>
                <div className="label">현재 업무 비중 총합</div>
                <div className="value">
                  <span className="current">{totalWeight}</span>
                  <span className="total"> / 100%</span>
                </div>
              </SummaryInfo>
              <SummaryStatus $isValid={isWeightValid}>
                {isWeightValid
                  ? "최종 제출 가능 상태입니다."
                  : "비중 100%를 맞춰주세요."}
              </SummaryStatus>
            </SummaryCard>
          </SummaryStickyBar>

          <Criteria></Criteria>

          <FormSection>
            {tasks.map((item, index) => (
              <TaskCard key={item.task_id} id={`task-card-${item.task_id}`}>
                <CardHeader>
                  <CardTitle>
                    <Badge>{index + 1}</Badge> 실적 항목
                  </CardTitle>
                  {personalStatus?.status === "TEMP" && (
                    <DeleteButton
                      onClick={() => handleRemoveTask(item.task_id)}
                    >
                      항목 삭제
                    </DeleteButton>
                  )}
                </CardHeader>

                <CardBody>
                  <GridRow>
                    <FormGroup>
                      <Label>업무 분류</Label>
                      <Select
                        value={item.category}
                        onChange={(e) =>
                          handleChange(item.task_id, "category", e.target.value)
                        }
                      >
                        <option value="공통">공통 업무</option>
                        <option value="개인">개인 업무</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>업무 비중 (%)</Label>
                      <InputWrapper>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="예: 30"
                          value={item.weight}
                          onChange={(e) =>
                            handleChange(item.task_id, "weight", e.target.value)
                          }
                        />
                        <span className="suffix">%</span>
                      </InputWrapper>
                    </FormGroup>

                    <FormGroup>
                      <Label>본인 평가</Label>
                      <Select
                        value={item.self_score}
                        onChange={(e) =>
                          handleChange(
                            item.task_id,
                            "self_score",
                            e.target.value,
                          )
                        }
                      >
                        {[...Array(10)].map((_, i) => {
                          const score = 10 - i;
                          return (
                            <option key={score} value={score}>
                              {score}점 / 10점
                            </option>
                          );
                        })}
                      </Select>
                    </FormGroup>
                  </GridRow>

                  <FullRow>
                    <FormGroup>
                      <Label>추진 업무</Label>
                      <Input
                        type="text"
                        placeholder="추진 업무를 작성해주세요."
                        value={item.task_name}
                        onChange={(e) =>
                          handleChange(
                            item.task_id,
                            "task_name",
                            e.target.value,
                          )
                        }
                      />
                    </FormGroup>
                  </FullRow>

                  <FullRow>
                    <FormGroup>
                      <Label>추진 실적 및 성과</Label>
                      <AutoResizeTextarea
                        placeholder="추진 실적 및 성과를 자세하게 작성해주세요."
                        value={item.task_result}
                        onChange={(e) =>
                          handleChange(
                            item.task_id,
                            "task_result",
                            e.target.value,
                          )
                        }
                      />
                    </FormGroup>
                  </FullRow>
                </CardBody>
              </TaskCard>
            ))}

            {personalStatus?.status === "TEMP" && (
              <AddTaskButton onClick={handleAddTask}>
                <span className="icon">+</span> 새로운 업무실적 항목 추가하기
              </AddTaskButton>
            )}
          </FormSection>

          {personalStatus?.status === "TEMP" && (
            <ActionArea>
              <TempSaveButton onClick={handleTempSave}>
                임시 저장 (비중 무관)
              </TempSaveButton>
              <FinalSubmitButton
                onClick={handleFinalSubmit}
                $isValid={isWeightValid}
              >
                최종 제출 (비중 100% 확인)
              </FinalSubmitButton>
            </ActionArea>
          )}
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
  overflow: hidden;
  background-color: #f4f6f8;
`;
const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;
`;
const ContentWrapper = styled.div`
  margin: 0 auto;
  padding: 20px 24px 300px 24px;
`;
const PageHeader = styled.div`
  margin-bottom: 32px;
`;
const HeaderTop = styled.div`
  margin-bottom: 16px;
`;
const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  .icon {
    font-size: 1.1rem;
  }
  &:hover {
    color: #0ea5e9;
  }
`;
const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
`;
const PageDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  strong {
    color: #ef4444;
  }
`;
const SummaryStickyBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  padding-bottom: 24px;
  background-color: #f4f6f8;
`;
const SummaryCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  border-left: 6px solid ${(props) => (props.$isValid ? "#10b981" : "#ef4444")};
  transition: border-left-color 0.3s ease;
`;
const SummaryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  .label {
    font-size: 1rem;
    font-weight: 600;
    color: #475569;
  }
  .value {
    .current {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1e293b;
    }
    .total {
      font-size: 1.1rem;
      font-weight: 600;
      color: #94a3b8;
    }
  }
`;
const SummaryStatus = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${(props) => (props.$isValid ? "#10b981" : "#ef4444")};
  background-color: ${(props) => (props.$isValid ? "#ecfdf5" : "#fef2f2")};
  padding: 8px 16px;
  border-radius: 8px;
`;
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const TaskCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;
const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`;
const Badge = styled.span`
  background-color: #0ea5e9;
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.9rem;
`;
const DeleteButton = styled.button`
  background: transparent;
  color: #ef4444;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #fef2f2;
    border-color: #ef4444;
  }
`;
const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;
const FullRow = styled.div`
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
`;
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  .suffix {
    position: absolute;
    right: 16px;
    color: #94a3b8;
    font-weight: 600;
    pointer-events: none;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;
  transition: all 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
  &[type="number"] {
    padding-right: 40px;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  min-height: 120px;
  max-height: 350px;
  resize: none;
  line-height: 1.6;
  box-sizing: border-box;
  overflow-y: auto;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;
const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background-color: #f0f9ff;
  color: #0ea5e9;
  border: 1px dashed #7dd3fc;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  .icon {
    font-size: 1.4rem;
    line-height: 1;
  }
  &:hover {
    background-color: #e0f2fe;
    border-color: #0ea5e9;
  }
`;
const ActionArea = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;
const TempSaveButton = styled.button`
  padding: 14px 28px;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #f8fafc;
    color: #1e293b;
    border-color: #94a3b8;
  }
`;
const FinalSubmitButton = styled.button`
  padding: 14px 36px;
  background-color: ${(props) => (props.$isValid ? "#0ea5e9" : "#cbd5e1")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.$isValid ? "pointer" : "not-allowed")};
  transition: all 0.2s;
  box-shadow: ${(props) =>
    props.$isValid ? "0 4px 12px rgba(14, 165, 233, 0.3)" : "none"};
  &:hover {
    background-color: ${(props) => (props.$isValid ? "#0284c7" : "#cbd5e1")};
  }
`;
