/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const statsSection = css({
  marginBottom: theme.spacing(6),
});

const statsGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
});

const statCard = css({
  padding: theme.spacing(3),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.sm,
  '& .stat-label': {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing(1),
    fontWeight: 500,
  },
  '& .stat-value': {
    fontSize: 28,
    fontWeight: 700,
    color: theme.colors.text,
    marginBottom: theme.spacing(0.5),
  },
  '& .stat-unit': {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing(1),
  },
  '& .stat-detail': {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing(1),
  },
});

const primaryStatCard = css(statCard, {
  backgroundColor: `${theme.colors.primary}08`,
  borderColor: `${theme.colors.primary}30`,
  '& .stat-value': {
    color: theme.colors.primary,
  },
});

const cardGridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: theme.spacing(4),
});

const cardStyles = css({
  padding: theme.spacing(4),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.sm,
  '& a': {
    color: theme.colors.primary,
    fontWeight: 600,
    textDecoration: 'none',
  },
  '& a:hover': { textDecoration: 'underline' },
  '& h2': { fontSize: 18, marginBottom: theme.spacing(2) },
  '& p': { fontSize: 14, margin: 0, color: theme.colors.textMuted },
});

const sectionTitle = css({
  fontSize: 16,
  fontWeight: 600,
  color: theme.colors.text,
  marginBottom: theme.spacing(3),
});

const chartSection = css({
  marginBottom: theme.spacing(6),
});

const chartCard = css({
  padding: theme.spacing(4),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.sm,
});

/** 금액을 천 단위 구분 포맷(예: 1,234,567)으로 반환 */
function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export function HomePage() {
  const { userRole, salesRows, prescriptionUploads, currentCorporationId, dealers, hospitals, corporations, filterRequests } = useApp();

  const corporationStats = useMemo(() => {
    const mySalesRows = salesRows.filter((s) => s.corporationId === currentCorporationId);
    const myPrescriptionUploads = prescriptionUploads.filter((p) => p.corporationId === currentCorporationId);
    const myDealers = dealers.filter((d) => d.corporationId === currentCorporationId);
    const myFilterRequests = filterRequests.filter((f) => f.corporationId === currentCorporationId);
    
    const totalAmount = mySalesRows.reduce((sum, row) => sum + row.amount, 0);
    const pendingRequests = myFilterRequests.filter((f) => f.status === 'pending').length;

    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    
    const thisMonthSales = mySalesRows.filter((s) => s.settlementMonth === thisMonth);
    const lastMonthSales = mySalesRows.filter((s) => s.settlementMonth === lastMonth);
    
    const thisMonthAmount = thisMonthSales.reduce((sum, row) => sum + row.amount, 0);
    const lastMonthAmount = lastMonthSales.reduce((sum, row) => sum + row.amount, 0);
    
    const growthRate = lastMonthAmount > 0 
      ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
      : 0;

    return {
      totalSalesCount: mySalesRows.length,
      totalAmount,
      prescriptionCount: myPrescriptionUploads.length,
      dealerCount: myDealers.length,
      pendingRequestCount: pendingRequests,
      thisMonthAmount,
      thisMonthSalesCount: thisMonthSales.length,
      lastMonthAmount,
      growthRate,
    };
  }, [salesRows, prescriptionUploads, currentCorporationId, dealers, filterRequests]);

  const pharmaStats = useMemo(() => {
    const totalAmount = salesRows.reduce((sum, row) => sum + row.amount, 0);
    const pendingRequests = filterRequests.filter((f) => f.status === 'pending').length;
    const totalDealers = dealers.length;

    const corpCount = corporations.length;
    const hospitalCount = hospitals.length;

    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    
    const thisMonthSales = salesRows.filter((s) => s.settlementMonth === thisMonth);
    const lastMonthSales = salesRows.filter((s) => s.settlementMonth === lastMonth);
    
    const thisMonthAmount = thisMonthSales.reduce((sum, row) => sum + row.amount, 0);
    const lastMonthAmount = lastMonthSales.reduce((sum, row) => sum + row.amount, 0);
    
    const growthRate = lastMonthAmount > 0 
      ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
      : 0;

    return {
      totalSalesCount: salesRows.length,
      totalAmount,
      corpCount,
      hospitalCount,
      dealerCount: totalDealers,
      pendingRequestCount: pendingRequests,
      thisMonthAmount,
      thisMonthSalesCount: thisMonthSales.length,
      lastMonthAmount,
      growthRate,
    };
  }, [salesRows, corporations, hospitals, dealers, filterRequests]);

  const monthlySalesData = useMemo(() => {
    const filteredSales = userRole === 'corporation' 
      ? salesRows.filter((s) => s.corporationId === currentCorporationId)
      : salesRows;

    const monthlyMap = new Map<string, { month: string; amount: number; count: number }>();
    
    filteredSales.forEach((sale) => {
      const month = sale.settlementMonth || sale.uploadedAt.slice(0, 7);
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, amount: 0, count: 0 });
      }
      const entry = monthlyMap.get(month)!;
      entry.amount += sale.amount;
      entry.count += 1;
    });

    const data = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((item) => ({
        month: item.month.slice(5) + '월',
        매출액: item.amount,
        건수: item.count,
      }));

    return data;
  }, [salesRows, userRole, currentCorporationId]);

  return (
    <div css={pageStyles}>
      <h1>Promr Brand Chart</h1>
      <p>법인 실적·처방사진 업로드 및 제약사 법인 정산 확인</p>

      {userRole === 'corporation' && (
        <div css={statsSection}>
          <h2 css={sectionTitle}>나의 현황</h2>
          <div css={statsGrid}>
            <div css={primaryStatCard}>
              <div className="stat-label">이번 달 총 매출</div>
              <div className="stat-value">
                {formatAmount(corporationStats.thisMonthAmount)}
                <span className="stat-unit">원</span>
              </div>
              <div className="stat-detail">
                {corporationStats.thisMonthSalesCount}건
                {corporationStats.lastMonthAmount > 0 && (
                  <span style={{ 
                    marginLeft: theme.spacing(1),
                    color: corporationStats.growthRate >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                  }}>
                    {corporationStats.growthRate >= 0 ? <HiArrowUp size={14} style={{ verticalAlign: 'middle' }} /> : <HiArrowDown size={14} style={{ verticalAlign: 'middle' }} />} {Math.abs(corporationStats.growthRate).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div css={statCard}>
              <div className="stat-label">전체 실적</div>
              <div className="stat-value">{corporationStats.totalSalesCount}</div>
              <div className="stat-detail">
                총 {formatAmount(corporationStats.totalAmount)}원
              </div>
            </div>
            <div css={statCard}>
              <div className="stat-label">처방사진 업로드</div>
              <div className="stat-value">{corporationStats.prescriptionCount}</div>
              <div className="stat-detail">건</div>
            </div>
            <div css={statCard}>
              <div className="stat-label">등록된 딜러</div>
              <div className="stat-value">{corporationStats.dealerCount}</div>
              <div className="stat-detail">명</div>
            </div>
            {corporationStats.pendingRequestCount > 0 && (
              <div css={statCard}>
                <div className="stat-label">대기 중인 필터링 요청</div>
                <div className="stat-value">{corporationStats.pendingRequestCount}</div>
                <div className="stat-detail">건</div>
              </div>
            )}
          </div>
        </div>
      )}

      {userRole === 'pharma' && (
        <div css={statsSection}>
          <h2 css={sectionTitle}>전체 현황</h2>
          <div css={statsGrid}>
            <div css={primaryStatCard}>
              <div className="stat-label">이번 달 총 매출</div>
              <div className="stat-value">
                {formatAmount(pharmaStats.thisMonthAmount)}
                <span className="stat-unit">원</span>
              </div>
              <div className="stat-detail">
                {pharmaStats.thisMonthSalesCount}건
                {pharmaStats.lastMonthAmount > 0 && (
                  <span style={{ 
                    marginLeft: theme.spacing(1),
                    color: pharmaStats.growthRate >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                  }}>
                    {pharmaStats.growthRate >= 0 ? <HiArrowUp size={14} style={{ verticalAlign: 'middle' }} /> : <HiArrowDown size={14} style={{ verticalAlign: 'middle' }} />} {Math.abs(pharmaStats.growthRate).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div css={statCard}>
              <div className="stat-label">전체 실적</div>
              <div className="stat-value">{pharmaStats.totalSalesCount}</div>
              <div className="stat-detail">
                총 {formatAmount(pharmaStats.totalAmount)}원
              </div>
            </div>
            <div css={statCard}>
              <div className="stat-label">등록된 법인</div>
              <div className="stat-value">{pharmaStats.corpCount}</div>
              <div className="stat-detail">개</div>
            </div>
            <div css={statCard}>
              <div className="stat-label">등록된 병의원</div>
              <div className="stat-value">{pharmaStats.hospitalCount}</div>
              <div className="stat-detail">개</div>
            </div>
            {pharmaStats.pendingRequestCount > 0 && (
              <div css={statCard}>
                <div className="stat-label">처리 대기 중인 요청</div>
                <div className="stat-value">{pharmaStats.pendingRequestCount}</div>
                <div className="stat-detail">건</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h2 css={sectionTitle}>바로가기</h2>
      <div css={cardGridStyles}>
        {userRole === 'corporation' && (
          <>
            <div css={cardStyles}>
              <h2>실적 등록</h2>
              <p>실적 업로드(엑셀)와 처방사진 업로드를 진행합니다.</p>
              <Link to="/upload/sales">실적 등록 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>계약관리</h2>
              <p>딜러(영업사원) 정보를 관리합니다.</p>
              <Link to="/dealer-manage">계약관리 페이지로 →</Link>
            </div>
          </>
        )}
        {userRole === 'pharma' && (
          <>
            <div css={cardStyles}>
              <h2>기준정보 관리</h2>
              <p>병의원, 수수료를 관리합니다.</p>
              <Link to="/hospitals">기준정보 관리 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>정산확인</h2>
              <p>전체 법인·병의원 실적을 필터로 조회하고 정산합니다.</p>
              <Link to="/aggregate">정산확인 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>법인별 정산확인</h2>
              <p>법인을 선택하여 해당 법인의 실적 표를 확인합니다.</p>
              <Link to="/settlement">법인별 정산확인 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>법인별 계약 조회</h2>
              <p>법인별 딜러 계약 정보를 조회합니다.</p>
              <Link to="/dealer-view">법인별 계약 조회 페이지로 →</Link>
            </div>
          </>
        )}
      </div>

      <div css={chartSection}>
        <h2 css={sectionTitle}>월별 매출 추이</h2>
        <div css={chartCard}>
          {monthlySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis 
                  dataKey="month" 
                  stroke={theme.colors.textMuted}
                  style={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={theme.colors.textMuted}
                  style={{ fontSize: 12 }}
                  tickFormatter={formatAmount}
                  label={{ value: '매출액 (원)', angle: -90, position: 'insideLeft', style: { fill: theme.colors.textMuted } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.colors.surface, 
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.md,
                  }}
                  labelStyle={{ color: theme.colors.text }}
                  formatter={(value: number) => [formatAmount(value), '매출액']}
                />
                <Line 
                  type="monotone" 
                  dataKey="매출액" 
                  stroke={theme.colors.primary} 
                  strokeWidth={2}
                  dot={{ fill: theme.colors.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: theme.spacing(4), textAlign: 'center', color: theme.colors.textMuted }}>
              매출 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
