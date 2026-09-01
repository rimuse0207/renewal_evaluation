import React from "react";
import styled from "styled-components";

export default function GradeGroupTable({
  evalYear,
  grade,
  title,
  dataList,
  colorHex,
}) {
  if (dataList.length === 0) return null;
  console.log(dataList);

  const handleRowClick = (userId) => {
    const url = `/Admin/Overall/${evalYear}/${userId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <SectionWrapper>
      <GroupHeader $color={colorHex}>
        <div className="title">
          <span className="badge">{grade}</span> {title}{" "}
        </div>
        <div className="count">
          {"  "}( 총 <strong>{dataList.length}</strong>명 )
        </div>
      </GroupHeader>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th width="22%">대상자 정보</Th>
              <Th width="25%" align="center">
                1차 평가 (성과 / 역량)
              </Th>
              <Th width="25%" align="center">
                2차 평가 (성과 / 역량)
              </Th>
              <Th width="18%" align="center">
                최종 환산 점수
              </Th>
              <Th width="10%" align="center">
                바로가기
              </Th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((user) => (
              <Tr
                key={user.master_id}
                onClick={() => handleRowClick(user.user_id)}
              >
                <Td>
                  <UserInfo>
                    <div className="name">
                      {user.name} <span className="pos">{user.title}</span>
                    </div>
                    <div className="dept">{user.dept}</div>
                  </UserInfo>
                </Td>
                <Td align="center">
                  {user.total1 > 0 ? (
                    <ScoreBlock>
                      <div className="detail-scores">
                        <span>실적 {Number(user.perf1)?.toFixed(1)}</span>
                        <span className="divider">|</span>
                        <span>역량 {Number(user.comp1)?.toFixed(1)}</span>
                      </div>
                      <div className="total-score">
                        {user.total1.toFixed(1)}점
                      </div>
                    </ScoreBlock>
                  ) : (
                    <span className="empty-text">미진행</span>
                  )}
                </Td>
                <Td align="center">
                  {user.total2 > 0 ? (
                    <ScoreBlock>
                      <div className="detail-scores">
                        <span>실적 {Number(user.perf2)?.toFixed(1)}</span>
                        <span className="divider">|</span>
                        <span>역량 {Number(user.comp2)?.toFixed(1)}</span>
                      </div>
                      <div className="total-score">
                        {user.total2.toFixed(1)}점
                      </div>
                    </ScoreBlock>
                  ) : (
                    <span className="empty-text">미진행</span>
                  )}
                </Td>
                <Td align="center">
                  <FinalScore $color={colorHex}>
                    {user.finalTotal > 0
                      ? `${user.finalTotal.toFixed(1)}점`
                      : "-"}
                  </FinalScore>
                </Td>
                <Td align="center">
                  <LinkIcon>↗</LinkIcon>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </SectionWrapper>
  );
}

// --- Styled Components ---
const SectionWrapper = styled.div`
  margin-bottom: 32px;
`;
const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${(props) => props.$color}33; /* 연한 테두리 */

  .title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #1e293b;
    align-items: center;
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background-color: ${(props) => props.$color};
      color: white;
      font-size: 1.1rem;
    }
  }
  .count {
    font-size: 0.95rem;
    color: #64748b;
    strong {
      color: ${(props) => props.$color};
      font-size: 1.1rem;
      font-weight: 800;
    }
  }
`;
const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 16px;
  text-align: ${(props) => props.align || "left"};
  border-bottom: 1px solid #e2e8f0;
`;
// 💡 마우스 호버 시 배경색 변경 및 포인터 커서 적용
const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f0f9ff; /* 부드러운 하늘색 하이라이트 */
  }
  &:last-child td {
    border-bottom: none;
  }
`;
const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  text-align: ${(props) => props.align || "left"};
  .empty-text {
    color: #cbd5e1;
    font-size: 0.9rem;
    font-weight: 600;
  }
`;
const UserInfo = styled.div`
  .name {
    font-size: 1.05rem;
    font-weight: 800;
    color: #1e293b;
    .pos {
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
      margin-left: 6px;
    }
  }
  .dept {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-top: 4px;
  }
`;
const ScoreBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  .detail-scores {
    font-size: 0.8rem;
    color: #64748b;
    display: flex;
    gap: 6px;
    align-items: center;
    .divider {
      color: #cbd5e1;
    }
  }
  .total-score {
    font-size: 1rem;
    font-weight: 700;
    color: #334155;
  }
`;
const FinalScore = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${(props) => props.$color || "#1e293b"}; /* 등급별 포인트 컬러 적용 */
`;
const LinkIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  font-weight: bold;
  transition: all 0.2s;
  ${Tr}:hover & {
    background-color: #0ea5e9;
    color: white;
  }
`;
