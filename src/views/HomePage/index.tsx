'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import { clsx } from 'clsx';
import { theme } from '@/theme';
import * as s from './index.css';

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
    <div className={s.page}>
      <h1 className={s.pageTitle}>Promr Brand Chart</h1>
      <p className={s.pageDesc}>법인 실적·처방사진 업로드 및 제약사 법인 정산 확인</p>

      {userRole === 'corporation' && (
        <div className={s.statsSection}>
          <h2 className={s.sectionTitle}>나의 현황</h2>
          <div className={s.statsGrid}>
            <div className={s.primaryStatCard}>
              <div className={s.statLabel}>이번 달 총 매출</div>
              <div className={s.primaryStatValue}>
                {formatAmount(corporationStats.thisMonthAmount)}
                <span className={s.statUnit}>원</span>
              </div>
              <div className={s.statDetail}>
                {corporationStats.thisMonthSalesCount}건
                {corporationStats.lastMonthAmount > 0 && (
                  <span className={corporationStats.growthRate >= 0 ? s.growthUp : s.growthDown}>
                    {corporationStats.growthRate >= 0 ? <HiArrowUp size={14} style={{ verticalAlign: 'middle' }} /> : <HiArrowDown size={14} style={{ verticalAlign: 'middle' }} />} {Math.abs(corporationStats.growthRate).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>전체 실적</div>
              <div className={s.statValue}>{corporationStats.totalSalesCount}</div>
              <div className={s.statDetail}>
                총 {formatAmount(corporationStats.totalAmount)}원
              </div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>처방사진 업로드</div>
              <div className={s.statValue}>{corporationStats.prescriptionCount}</div>
              <div className={s.statDetail}>건</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>등록된 딜러</div>
              <div className={s.statValue}>{corporationStats.dealerCount}</div>
              <div className={s.statDetail}>명</div>
            </div>
            {corporationStats.pendingRequestCount > 0 && (
              <div className={s.statCard}>
                <div className={s.statLabel}>대기 중인 필터링 요청</div>
                <div className={s.statValue}>{corporationStats.pendingRequestCount}</div>
                <div className={s.statDetail}>건</div>
              </div>
            )}
          </div>
        </div>
      )}

      {userRole === 'pharma' && (
        <div className={s.statsSection}>
          <h2 className={s.sectionTitle}>전체 현황</h2>
          <div className={s.statsGrid}>
            <div className={s.primaryStatCard}>
              <div className={s.statLabel}>이번 달 총 매출</div>
              <div className={s.primaryStatValue}>
                {formatAmount(pharmaStats.thisMonthAmount)}
                <span className={s.statUnit}>원</span>
              </div>
              <div className={s.statDetail}>
                {pharmaStats.thisMonthSalesCount}건
                {pharmaStats.lastMonthAmount > 0 && (
                  <span className={pharmaStats.growthRate >= 0 ? s.growthUp : s.growthDown}>
                    {pharmaStats.growthRate >= 0 ? <HiArrowUp size={14} style={{ verticalAlign: 'middle' }} /> : <HiArrowDown size={14} style={{ verticalAlign: 'middle' }} />} {Math.abs(pharmaStats.growthRate).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>전체 실적</div>
              <div className={s.statValue}>{pharmaStats.totalSalesCount}</div>
              <div className={s.statDetail}>
                총 {formatAmount(pharmaStats.totalAmount)}원
              </div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>등록된 법인</div>
              <div className={s.statValue}>{pharmaStats.corpCount}</div>
              <div className={s.statDetail}>개</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>등록된 병의원</div>
              <div className={s.statValue}>{pharmaStats.hospitalCount}</div>
              <div className={s.statDetail}>개</div>
            </div>
            {pharmaStats.pendingRequestCount > 0 && (
              <div className={s.statCard}>
                <div className={s.statLabel}>처리 대기 중인 요청</div>
                <div className={s.statValue}>{pharmaStats.pendingRequestCount}</div>
                <div className={s.statDetail}>건</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className={s.sectionTitle}>바로가기</h2>
      <div className={s.cardGrid}>
        {userRole === 'corporation' && (
          <>
            <div className={s.card}>
              <h2 className={s.cardTitle}>실적 등록</h2>
              <p className={s.cardDesc}>실적 업로드(엑셀)와 처방사진 업로드를 진행합니다.</p>
              <Link href="/upload/sales" className={clsx(s.cardLink, s.cardLinkHover)}>실적 등록 페이지로 →</Link>
            </div>
            <div className={s.card}>
              <h2 className={s.cardTitle}>계약관리</h2>
              <p className={s.cardDesc}>딜러(영업사원) 정보를 관리합니다.</p>
              <Link href="/dealer-manage" className={clsx(s.cardLink, s.cardLinkHover)}>계약관리 페이지로 →</Link>
            </div>
          </>
        )}
        {userRole === 'pharma' && (
          <>
            <div className={s.card}>
              <h2 className={s.cardTitle}>기준정보 관리</h2>
              <p className={s.cardDesc}>병의원, 수수료를 관리합니다.</p>
              <Link href="/hospitals" className={clsx(s.cardLink, s.cardLinkHover)}>기준정보 관리 페이지로 →</Link>
            </div>
            <div className={s.card}>
              <h2 className={s.cardTitle}>정산확인</h2>
              <p className={s.cardDesc}>전체 법인·병의원 실적을 필터로 조회하고 정산합니다.</p>
              <Link href="/aggregate" className={clsx(s.cardLink, s.cardLinkHover)}>정산확인 페이지로 →</Link>
            </div>
            <div className={s.card}>
              <h2 className={s.cardTitle}>법인별 정산확인</h2>
              <p className={s.cardDesc}>법인을 선택하여 해당 법인의 실적 표를 확인합니다.</p>
              <Link href="/settlement" className={clsx(s.cardLink, s.cardLinkHover)}>법인별 정산확인 페이지로 →</Link>
            </div>
            <div className={s.card}>
              <h2 className={s.cardTitle}>법인별 계약 조회</h2>
              <p className={s.cardDesc}>법인별 딜러 계약 정보를 조회합니다.</p>
              <Link href="/dealer-view" className={clsx(s.cardLink, s.cardLinkHover)}>법인별 계약 조회 페이지로 →</Link>
            </div>
          </>
        )}
      </div>

      <div className={s.chartSection}>
        <h2 className={s.sectionTitle}>월별 매출 추이</h2>
        <div className={s.chartCard}>
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
                  formatter={(value: number | undefined) => [formatAmount(value ?? 0), '매출액']}
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
            <div className={s.chartEmpty}>
              매출 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
