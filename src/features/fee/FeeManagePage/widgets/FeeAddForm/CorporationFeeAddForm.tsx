import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import type { Corporation } from '@/types';
import { Button } from '@/shared/components/ui/Button';
import { DataTable } from '@/shared/components/ui/DataTable';
import { Input } from '@/shared/components/ui/Input';
import { Column, Row } from '@/shared/components/ui/Flex';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import * as s from '../../index.css';

type TieredFeeRow = {
  id: string;
  minAmount: number;
  maxAmount: number;
  rate: number;
};

export interface CorporationFeeAddFormProps {
  corporation: Corporation | null;
  onSave: (
    corp: Pick<Corporation, 'id' | 'name'> & {
      additionalFeeRate?: number;
      tieredFeeTiers: { minAmount: number; maxAmount: number; rate: number }[];
    },
  ) => void;
}

export function CorporationFeeAddForm({ corporation, onSave }: CorporationFeeAddFormProps) {
  const [additionalFee, setAdditionalFee] = useState('');
  const [tiers, setTiers] = useState<TieredFeeRow[]>([]);

  useEffect(() => {
    if (!corporation) {
      setAdditionalFee('');
      setTiers([{ id: 'tier-1', minAmount: 10000, maxAmount: 1000000, rate: 2 }]);
      return;
    }
    setAdditionalFee(
      corporation.additionalFeeRate != null ? String(corporation.additionalFeeRate) : '',
    );
    setTiers(
      corporation.tieredFeeTiers?.length
        ? corporation.tieredFeeTiers.map((t, i) => ({
            id: `tier-${i}`,
            minAmount: t.minAmount * 10000,
            maxAmount: t.maxAmount * 10000,
            rate: t.rate,
          }))
        : [{ id: 'tier-1', minAmount: 10000, maxAmount: 1000000, rate: 2 }],
    );
  }, [corporation]);

  const updateTier = useCallback(
    (id: string, field: keyof Omit<TieredFeeRow, 'id'>, value: number) => {
      setTiers((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    },
    [],
  );

  const addTier = useCallback(() => {
    const last = tiers[tiers.length - 1];
    setTiers((prev) => [
      ...prev,
      {
        id: `tier-${Date.now()}`,
        minAmount: last ? last.maxAmount : 10000,
        maxAmount: last ? last.maxAmount + 1000000 : 1000000,
        rate: 2,
      },
    ]);
  }, [tiers]);

  const removeTier = useCallback((id: string) => {
    setTiers((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleSave = useCallback(() => {
    if (!corporation) return;
    const tieredFeeTiers = tiers.map((t) => ({
      minAmount: Math.round(t.minAmount / 10000),
      maxAmount: Math.round(t.maxAmount / 10000),
      rate: t.rate,
    }));
    const corpData = {
      id: corporation.id,
      name: corporation.name,
      additionalFeeRate: additionalFee !== '' ? Number(additionalFee) : undefined,
      tieredFeeTiers,
    };
    onSave(corpData);
  }, [corporation, tiers, additionalFee, onSave]);

  const tierColumnHelper = createColumnHelper<TieredFeeRow>();
  const tierColumns = useMemo(
    () => [
      tierColumnHelper.accessor('minAmount', {
        header: '금액 구간 (원)',
        size: 280,
        cell: ({ row }) => (
          <Row gap={4} alignItems="center" onClick={(e) => e.stopPropagation()}>
            <Input
              type="number"
              value={row.original.minAmount}
              onChange={(e) =>
                updateTier(row.original.id, 'minAmount', Number(e.target.value) || 0)
              }
              placeholder="최소"
              size="compact"
              min={0}
            />
            <span>~</span>
            <Input
              type="number"
              value={row.original.maxAmount}
              onChange={(e) =>
                updateTier(row.original.id, 'maxAmount', Number(e.target.value) || 0)
              }
              placeholder="최대"
              size="compact"
              min={0}
            />
          </Row>
        ),
      }),
      tierColumnHelper.accessor('rate', {
        header: '수수료 (%)',
        size: 85,
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Input
              type="number"
              value={row.original.rate}
              onChange={(e) => updateTier(row.original.id, 'rate', Number(e.target.value) || 0)}
              placeholder="%"
              size="compact"
              min={0}
              max={100}
              step={0.1}
            />
          </div>
        ),
      }),
      tierColumnHelper.display({
        id: 'remove',
        header: '',
        size: 36,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeTier(row.original.id);
            }}
            disabled={tiers.length <= 1}
            aria-label="행 삭제"
          >
            <X size={16} aria-hidden />
          </Button>
        ),
      }),
    ],
    [tiers.length, updateTier, removeTier],
  );

  if (!corporation) {
    return (
      <div className={s.formField}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          좌측 표에서 법인을 선택하세요
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={s.detailHeader}>
        <h3 className={s.sectionTitle}>법인 상세</h3>
      </div>
      <Column gap={8}>
        <div className={s.formField}>
          <label htmlFor="corp-name">법인명</label>
          <Input
            id="corp-name"
            type="text"
            placeholder="법인명"
            value={corporation.name}
            disabled
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="corp-add-fee">법인 추가수수료 (%)</label>
          <Input
            id="corp-add-fee"
            type="number"
            placeholder="0"
            value={additionalFee}
            onChange={(e) => setAdditionalFee(e.target.value)}
            min={-100}
            max={100}
            step={0.1}
          />
        </div>
        <div className={s.formField}>
          <Tooltip description="금액 구간별로 수수료율을 설정합니다. 예: 1만원~100만원 구간 2%">
            <label>구간 수수료</label>
          </Tooltip>
          <DataTable<TieredFeeRow>
            columns={tierColumns}
            data={tiers}
            getRowId={(r) => r.id}
            variant="compact"
            className={s.tieredFeeTableWrap}
            emptyMessage="구간이 없습니다."
          />
          <Button variant="ghost" size="small" onClick={addTier} className={s.tieredFeeAddBtn}>
            <Plus size={16} aria-hidden />
            구간 추가
          </Button>
        </div>
        <Button variant="primary" onClick={handleSave} className={s.addButtonFull}>
          저장
        </Button>
      </Column>
    </>
  );
}
