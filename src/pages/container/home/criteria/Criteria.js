import React from "react";
import { MOCK_CRITERIA } from "../../../../public/global/variable";
import styled from "styled-components";

const Criteria = () => {
  return (
    <CriteriaCard>
      <CriteriaTitle>평정 기준 안내</CriteriaTitle>
      <CriteriaList>
        {MOCK_CRITERIA?.map((criteria, index) => (
          <CriteriaItem key={index}>
            <CriteriaLevel>{criteria.level}</CriteriaLevel>
            <CriteriaDesc>{criteria.desc}</CriteriaDesc>
          </CriteriaItem>
        ))}
      </CriteriaList>
    </CriteriaCard>
  );
};

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  height: 100%;
  box-sizing: border-box;
`;
export const CriteriaCard = styled(CardBase)`
  height: auto;
  margin-bottom: 32px;
  background-color: #f0f9ff;
  border-color: #bae6fd;
`;

export const CriteriaTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0369a1;
  margin-bottom: 12px;
`;

export const CriteriaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

export const CriteriaItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
`;

export const CriteriaLevel = styled.span`
  display: inline-block;
  background-color: #0ea5e9;
  color: white;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  width: fit-content;
`;

export const CriteriaDesc = styled.span`
  color: #334155;
  line-height: 1.4;
  word-break: keep-all;
`;

export default Criteria;
