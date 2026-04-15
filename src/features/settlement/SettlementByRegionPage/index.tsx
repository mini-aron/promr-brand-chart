'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import { Toggle } from '@/shared/components/ui/Toggle';
import { DataTable } from '@/shared/components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import {
  REGION_NAMES,
  useSettlementByRegion,
  type RegionCorpRatio,
} from '@/hooks/useSettlementByRegion';
import type { SalesRow } from '@/types';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { theme } from '@/theme';
import { KoreaMap, type GradientMode } from './widgets/KoreaMap';
import * as s from './index.css';

const PIE_COLORS = ['var(--color-primary)', '#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

function formatAmount(n: number): string {
  return n.toLocaleString('ko-KR');
}

export function SettlementByRegionPage() {
  const { mapGradientEnabled, setMapGradientEnabled } = useApp();
  const mockHospitals = useDemoPlayStore((s) => s.hospitals);
  const mockSalesRows = useDemoPlayStore((s) => s.salesRows);
  const mockCorporations = useDemoPlayStore((s) => s.corporations);
  const persistedRegionStats = useDemoPlayStore((s) => s.regionStats);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);
  const [hoveredRegionCode, setHoveredRegionCode] = useState<string | null>(null);
  const [gradientMode, setGradientMode] = useState<GradientMode>('amount');

  const { regionStats, regionCorpRatios, getRegionSalesRows } = useSettlementByRegion(
    mockHospitals,
    mockSalesRows,
    mockCorporations,
  );

  const selectedRegionName = selectedRegionCode
    ? (REGION_NAMES[selectedRegionCode] ?? selectedRegionCode)
    : null;

  const displayRegionStats = useMemo(
    () =>
      regionStats.length > 0
        ? regionStats
        : persistedRegionStats.map((r) => ({
            regionCode: r.regionCode,
            regionName: r.regionName,
            amount: r.amount,
            quantity: r.quantity,
          })),
    [regionStats, persistedRegionStats],
  );

  const barChartData = useMemo(
    () =>
      displayRegionStats.map((r) => ({
        name: r.regionName,
        code: r.regionCode,
        처방건수: r.quantity,
        amount: r.amount,
      })),
    [displayRegionStats],
  );

  const corpRatioData = useMemo((): RegionCorpRatio[] => {
    if (!selectedRegionCode) return [];
    return regionCorpRatios(selectedRegionCode);
  }, [selectedRegionCode, regionCorpRatios]);

  const regionSalesRows = useMemo((): SalesRow[] => {
    if (!selectedRegionCode) return [];
    return getRegionSalesRows(selectedRegionCode);
  }, [selectedRegionCode, getRegionSalesRows]);

  const corpPieData = useMemo(
    () =>
      corpRatioData.map((r) => ({
        name: r.corporationName,
        value: r.amount,
        ratio: r.ratio,
        label: r.ratio >= 12 ? `${r.corporationName} ${r.ratio}%` : '',
      })),
    [corpRatioData],
  );

  const regionSalesColumns = useMemo(() => {
    const helper = createColumnHelper<SalesRow>();
    return [
      helper.display({
        id: 'no',
        header: 'No.',
        size: 40,
        cell: (info) => info.row.index + 1,
      }),
      helper.accessor(
        (r) => mockHospitals.find((h) => h.id === r.hospitalId)?.name ?? r.hospitalId,
        { id: 'hospitalName', header: '병의원', size: 120 },
      ),
      helper.accessor('productName', { id: 'productName', header: '품목', size: 100 }),
      helper.accessor('quantity', {
        id: 'quantity',
        header: '수량',
        size: 70,
        cell: (info) => `${info.getValue()}건`,
      }),
      helper.accessor('amount', {
        id: 'amount',
        header: '금액',
        size: 100,
        cell: (info) => `${formatAmount(info.getValue())}원`,
      }),
    ];
  }, [mockHospitals]);

  return (
    <div className={s.page}>
      <PageHeader title="지역별 정산확인" description="지역별 정산 현황을 조회합니다." />
      <div className={s.content}>
        <CardWrapper className={s.regionPanel} title="선택 지역" padding={16}>
          <div className={s.regionPanelContent}>
            <p className={s.regionName}>{selectedRegionName ?? '—'}</p>

            <div className={s.corpChartSection}>
              <h4 className={s.sectionTitle}>해당 지역 내 법인 처방 비율</h4>
              {selectedRegionCode ? (
                corpPieData.length > 0 ? (
                  <div className={s.corpChartRow}>
                    <div className={s.pieChartWrap}>
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <Pie
                            data={corpPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={75}
                            paddingAngle={2}
                            label={false}
                          >
                            <LabelList
                              dataKey="label"
                              position="inside"
                              style={{
                                fill: 'white',
                                fontSize: 12,
                                fontWeight: 600,
                                stroke: 'rgba(0,0,0,1)',
                                strokeWidth: 1.5,
                                paintOrder: 'stroke fill',
                              }}
                            />
                            {corpPieData.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.colors.surface,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: theme.radius.md,
                              fontSize: 12,
                            }}
                            formatter={(value, _name, props) => [
                              `${formatAmount(Number(value) || 0)}원 (${(props?.payload as { ratio: number })?.ratio ?? 0}%)`,
                              (props?.payload as { name: string })?.name ?? '',
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={s.corpBarChartWrap}>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart
                          data={corpPieData}
                          layout="vertical"
                          margin={{ top: 4, right: 8, left: 48, bottom: 4 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.colors.border}
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            stroke={theme.colors.textMuted}
                            style={{ fontSize: 10 }}
                            tick={{ fill: theme.colors.textMuted }}
                            tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke={theme.colors.textMuted}
                            style={{ fontSize: 10 }}
                            tick={{ fill: theme.colors.textMuted }}
                            width={48}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.colors.surface,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: theme.radius.md,
                              fontSize: 12,
                            }}
                            formatter={(value, _name, props) => [
                              `${formatAmount(Number(value) || 0)}원`,
                              (props?.payload as { name: string })?.name ?? '',
                            ]}
                          />
                          <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={12}>
                            {corpPieData.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <p className={s.emptyMessage}>해당 지역 실적이 없습니다.</p>
                )
              ) : (
                <p className={s.emptyMessage}>지역을 선택하면 법인별 비율을 확인할 수 있습니다.</p>
              )}
            </div>

            <div className={s.regionSalesSection}>
              <h4 className={s.sectionTitle}>지역별 실적검색</h4>
              <p className={s.sectionDesc}>해당 병의원의 주소를 기반으로 지역 실적을 필터합니다.</p>
              {selectedRegionCode ? (
                regionSalesRows.length > 0 ? (
                  <div className={s.tableWrap}>
                    <DataTable<SalesRow>
                      columns={regionSalesColumns}
                      data={regionSalesRows}
                      getRowId={(row) => row.id}
                      variant="compact"
                      emptyMessage="해당 지역 실적이 없습니다."
                    />
                  </div>
                ) : (
                  <p className={s.emptyMessage}>해당 지역 실적이 없습니다.</p>
                )
              ) : (
                <p className={s.emptyMessage}>지역을 선택하면 실적을 조회할 수 있습니다.</p>
              )}
            </div>
          </div>
        </CardWrapper>
        <div className={s.mapSection}>
          <CardWrapper className={s.mapWrapper} padding={0} fill>
            <KoreaMap
              regionStats={displayRegionStats}
              selectedRegionCode={selectedRegionCode}
              onRegionSelect={setSelectedRegionCode}
              hoveredRegionCode={hoveredRegionCode}
              onRegionHover={setHoveredRegionCode}
              gradientMode={gradientMode}
              gradientEnabled={mapGradientEnabled}
            />
          </CardWrapper>
          <div className={s.gradientControls}>
            <Toggle
              checked={mapGradientEnabled}
              onChange={setMapGradientEnabled}
              label="처방 히트맵"
              aria-label="처방 히트맵 표시"
            />
            {mapGradientEnabled && (
              <div className={s.gradientModeGroup}>
                <button
                  type="button"
                  className={gradientMode === 'amount' ? s.gradientModeActive : s.gradientModeBtn}
                  onClick={() => setGradientMode('amount')}
                >
                  정산금액
                </button>
                <button
                  type="button"
                  className={gradientMode === 'quantity' ? s.gradientModeActive : s.gradientModeBtn}
                  onClick={() => setGradientMode('quantity')}
                >
                  처방건수
                </button>
              </div>
            )}
          </div>
          <CardWrapper className={s.barChartSection} title="전체 지역 처방 현황" padding={16}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 36, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.colors.border}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke={theme.colors.textMuted}
                  style={{ fontSize: 10 }}
                  tick={{ fill: theme.colors.textMuted }}
                  tickFormatter={(v) => `${v}건`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={theme.colors.textMuted}
                  style={{ fontSize: 10 }}
                  tick={{ fill: theme.colors.textMuted }}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.md,
                    fontSize: 12,
                  }}
                  formatter={(value: number | undefined) => [`${value ?? 0}건`, '처방건수']}
                />
                <Bar
                  dataKey="처방건수"
                  fill={theme.colors.primary}
                  radius={[0, 2, 2, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
