import React from 'react';
import { Download, Upload } from 'lucide-react';
import type { ProductFee, FeeEventType } from '@/types';
import { SingleSelect } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import * as s from '../../index.css';

export type EventFormState = {
  productCode: string;
  type: FeeEventType;
  name: string;
  startDate: string;
  endDate: string;
  isFixedFee: boolean;
  fixedFeeRate: number;
  additionalFeeRate: number;
  note: string;
  corporationId: string;
  hospitalId: string;
  priority: number;
  error: string | null;
};

export type AddProductFormState = {
  search: string;
  selectedProduct: ProductFee | null;
  feeRate: number;
  error: string | null;
  excelFileName: string | null;
};

export interface ProductFeeAddFormProps {
  rightPanelMode: 'event' | 'product';
  onSetRightPanelMode: (mode: 'event' | 'product') => void;
  addProductForm: AddProductFormState;
  onAddProductFormChange: (patch: Partial<AddProductFormState>) => void;
  eventForm: EventFormState;
  onEventFormChange: (patch: Partial<EventFormState>) => void;
  addableProducts: ProductFee[];
  currentFees: ProductFee[];
  corpOptions: { label: string; value: string }[];
  hospitalOptions: { label: string; value: string }[];
  onAddProduct: () => void;
  onAddEvent: () => void;
  onResetEventForm: () => void;
  /** 설정 시 이벤트 수정 모드(제목·버튼 문구) */
  editingEventId?: string | null;
}

export function ProductFeeAddForm({
  rightPanelMode,
  onSetRightPanelMode,
  addProductForm,
  onAddProductFormChange,
  eventForm,
  onEventFormChange,
  addableProducts,
  currentFees,
  corpOptions,
  hospitalOptions,
  onAddProduct,
  onAddEvent,
  onResetEventForm,
  editingEventId,
}: ProductFeeAddFormProps) {
  return (
    <>
      <div className={s.filterRowInner} style={{ marginBottom: 12 }}>
        <Button
          variant={rightPanelMode === 'product' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onSetRightPanelMode('product')}
        >
          수수료 추가
        </Button>
        <Button
          variant={rightPanelMode === 'event' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onSetRightPanelMode('event')}
        >
          이벤트 추가
        </Button>
      </div>

      {rightPanelMode === 'product' ? (
        <>
          <h3 className={s.sectionTitle}>수수료 추가</h3>

          <div className={s.formField}>
            <label htmlFor="product-search">품목명 검색</label>
            <input
              id="product-search"
              type="search"
              placeholder="품목명·품목코드로 검색"
              value={addProductForm.search}
              onChange={(e) => onAddProductFormChange({ search: e.target.value })}
              aria-label="품목명 검색"
            />
          </div>
          <div className={s.formField}>
            <label htmlFor="product-select">품목 선택 *</label>
            <SingleSelect
              id="product-select"
              options={[
                { label: '선택하세요 (품목코드 · 품목명)', value: '' },
                ...addableProducts.map((p) => ({
                  label: `${p.productCode} · ${p.productName}`,
                  value: p.productCode,
                })),
              ]}
              selected={
                addProductForm.selectedProduct ? addProductForm.selectedProduct.productCode : ''
              }
              onChange={(v) => {
                const p = addableProducts.find((x) => x.productCode === v) ?? null;
                onAddProductFormChange({ selectedProduct: p });
              }}
              placeholder="선택하세요 (품목코드 · 품목명)"
              aria-label="추가할 품목 선택"
            />
          </div>
          <div className={s.formField}>
            <label htmlFor="new-fee-rate">기본 수수료 (%)</label>
            <div className={s.filterRowInner}>
              <input
                className={s.feeInputStyles}
                id="new-fee-rate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={addProductForm.feeRate === 0 ? '' : addProductForm.feeRate}
                onChange={(e) =>
                  onAddProductFormChange({
                    feeRate: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
                aria-label="수수료율 입력"
              />
              <span className={s.feePercent}>%</span>
            </div>
          </div>
          <Button variant="primary" onClick={onAddProduct} className={s.addButtonFull}>
            수수료 추가
          </Button>
          <div className={s.formField}>
            <label>수수료 엑셀 업로드</label>
            <label
              className={s.excelUploadZone}
              data-has-file={!!addProductForm.excelFileName}
              htmlFor="fee-excel-upload"
            >
              <input
                id="fee-excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onAddProductFormChange({ excelFileName: file?.name ?? null });
                }}
                aria-label="수수료 엑셀 파일 선택"
              />
              <Upload size={24} className="upload-icon" aria-hidden />
              <span className="upload-text">
                {addProductForm.excelFileName ?? '클릭하여 엑셀 파일 선택'}
              </span>
              <span className="upload-hint">.xlsx, .xls 지원</span>
            </label>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {}}
            className={s.excelDownloadBtn}
          >
            <Download size={16} />
            엑셀 양식 다운로드
          </Button>
          {addProductForm.error && <p className={s.addError}>{addProductForm.error}</p>}
        </>
      ) : (
        <>
          <h3 className={s.sectionTitle}> {editingEventId ? '이벤트 수정' : '이벤트 추가'}</h3>
          <div className={s.formField}>
            <label>품목</label>
            <div className={s.eventProductBox}>
              {eventForm.productCode ? (
                <span>
                  {currentFees.find((x) => x.productCode === eventForm.productCode)?.productName ??
                    eventForm.productCode}{' '}
                  <span className={s.eventProductMuted}>({eventForm.productCode})</span>
                </span>
              ) : (
                <span className={s.eventProductHint}>좌측 표에서 품목을 선택하세요</span>
              )}
            </div>
          </div>
          <div className={s.formField}>
            <label htmlFor="event-type">이벤트 종류</label>
            <SingleSelect
              id="event-type"
              options={[
                { label: '품목 이벤트', value: 'item' },
                { label: '법인별 이벤트', value: 'corporation' },
                { label: '법인·병원 이벤트', value: 'corporation_hospital' },
              ]}
              selected={eventForm.type}
              onChange={(v) =>
                onEventFormChange({ type: v as FeeEventType, corporationId: '', hospitalId: '' })
              }
            />
          </div>
          {eventForm.type !== 'item' && (
            <>
              <div className={s.formField}>
                <label htmlFor="event-corp">법인 *</label>
                <SingleSelect
                  id="event-corp"
                  options={[{ label: '선택', value: '' }, ...corpOptions]}
                  selected={eventForm.corporationId}
                  onChange={(v) => onEventFormChange({ corporationId: String(v), hospitalId: '' })}
                />
              </div>
              {eventForm.type === 'corporation_hospital' && (
                <div className={s.formField}>
                  <label htmlFor="event-hospital">병의원 *</label>
                  <SingleSelect
                    id="event-hospital"
                    options={[{ label: '선택', value: '' }, ...hospitalOptions]}
                    selected={eventForm.hospitalId}
                    onChange={(v) => onEventFormChange({ hospitalId: String(v) })}
                  />
                </div>
              )}
            </>
          )}
          <div className={s.formField}>
            <label htmlFor="event-name">이벤트 이름 *</label>
            <input
              id="event-name"
              type="text"
              value={eventForm.name}
              onChange={(e) => onEventFormChange({ name: e.target.value })}
              placeholder="이벤트 이름"
            />
          </div>
          <div className={s.formField}>
            <label htmlFor="event-priority">우선순위 (숫자 높을수록 최우선 적용)</label>
            <input
              id="event-priority"
              type="number"
              min={1}
              value={eventForm.priority}
              onChange={(e) =>
                onEventFormChange({ priority: Math.max(1, Number(e.target.value) || 1) })
              }
            />
          </div>
          <div className={s.dateRow}>
            <div className={`${s.formField} ${s.formFieldFlex}`}>
              <label htmlFor="event-start">시작일 *</label>
              <input
                id="event-start"
                type="date"
                value={eventForm.startDate}
                onChange={(e) => onEventFormChange({ startDate: e.target.value })}
              />
            </div>
            <div className={`${s.formField} ${s.formFieldFlex}`}>
              <label htmlFor="event-end">종료일 *</label>
              <input
                id="event-end"
                type="date"
                value={eventForm.endDate}
                onChange={(e) => onEventFormChange({ endDate: e.target.value })}
              />
            </div>
          </div>
          <div className={s.formField}>
            <Checkbox
              id="event-fixed-fee"
              checked={eventForm.isFixedFee}
              onChange={(v) => onEventFormChange({ isFixedFee: v })}
              layout="vertical"
              label={eventForm.isFixedFee ? '고정수수료' : '추가수수료'}
              description={
                eventForm.isFixedFee
                  ? '다른 수수료에 영향받지 않고 해당 고정율만 사용'
                  : '기본수수료에 추가하여 적용'
              }
              aria-label="고정수수료 여부"
            />
          </div>
          {eventForm.isFixedFee ? (
            <div className={s.formField}>
              <label htmlFor="event-fixed-rate">고정수수료율 (1~100)% *</label>
              <input
                id="event-fixed-rate"
                type="number"
                min={1}
                max={100}
                value={eventForm.fixedFeeRate}
                onChange={(e) => onEventFormChange({ fixedFeeRate: Number(e.target.value) || 1 })}
              />
            </div>
          ) : (
            <div className={s.formField}>
              <label htmlFor="event-add-rate">추가수수료율 (-100~100)% *</label>
              <input
                id="event-add-rate"
                type="number"
                min={-100}
                max={100}
                step={0.1}
                value={eventForm.additionalFeeRate}
                onChange={(e) =>
                  onEventFormChange({ additionalFeeRate: Number(e.target.value) || 0 })
                }
              />
            </div>
          )}
          <div className={s.formField}>
            <label htmlFor="event-note">비고 (설명)</label>
            <textarea
              id="event-note"
              value={eventForm.note}
              onChange={(e) => onEventFormChange({ note: e.target.value })}
              placeholder="설명"
            />
          </div>
          <div className={s.eventActionsRow}>
            <Button variant="primary" onClick={onAddEvent} className={s.addEventBtnFlex}>
              {editingEventId ? '변경 저장' : '이벤트 추가'}
            </Button>
            <Button variant="secondary" onClick={onResetEventForm}>
              {editingEventId ? '수정 취소' : '초기화'}
            </Button>
          </div>
          {eventForm.error && <p className={s.addError}>{eventForm.error}</p>}
        </>
      )}
    </>
  );
}
