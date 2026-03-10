/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { HiOutlineX } from 'react-icons/hi';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { Flex, Row, Column } from '@/components/Common/Flex';
import { SingleSelect } from '@/components/Common/Select';
import type { FeeEvent, FeeEventType, ProductFee } from '@/types';
import type { Corporation, Hospital } from '@/types';

const modalOverlay = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: theme.colors.overlay,
  zIndex: 1000,
});

const modalBox = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.md,
  width: '100%',
  maxWidth: 680,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
});

const modalHeaderWrap = css({
  marginBottom: theme.spacing(4),
  '& h2': { margin: 0, fontSize: 18, fontWeight: 600 },
});

const modalActionsWrap = css({
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
});

const formField = css({
  '& label': { display: 'block', marginBottom: theme.spacing(1), fontWeight: 600, fontSize: 14 },
  '& input, & select, & textarea': {
    width: '100%',
    minHeight: 40,
    padding: `0 ${theme.spacing(2)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
  '& textarea': { minHeight: 80, padding: theme.spacing(2), resize: 'vertical' },
});

const eventListRow = css({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.colors.border}`,
  fontSize: 14,
  '&:last-child': { borderBottom: 'none' },
});

const EVENT_TYPE_LABELS: Record<FeeEventType, string> = {
  item: '품목 이벤트',
  corporation: '법인별 이벤트',
  corporation_hospital: '법인·병원 이벤트',
};

export interface FeeEventModalProps {
  product: ProductFee;
  events: FeeEvent[];
  corporations: Corporation[];
  hospitals: Hospital[];
  onClose: () => void;
  onAddEvent: (event: Omit<FeeEvent, 'id'>) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function FeeEventModal({
  product,
  events,
  corporations,
  hospitals,
  onClose,
  onAddEvent,
  onDeleteEvent,
}: FeeEventModalProps) {
  const [eventType, setEventType] = useState<FeeEventType>('item');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFixedFee, setIsFixedFee] = useState(true);
  const [fixedFeeRate, setFixedFeeRate] = useState<number>(1);
  const [additionalFeeRate, setAdditionalFeeRate] = useState<number>(1);
  const [note, setNote] = useState('');
  const [corporationId, setCorporationId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  const productEvents = useMemo(() => events.filter((e) => e.productCode === product.productCode), [events, product.productCode]);

  const corpOptions = useMemo(
    () => corporations.map((c) => ({ label: c.name, value: c.id })),
    [corporations]
  );

  const hospitalOptions = useMemo(() => {
    if (!corporationId) return [];
    return hospitals
      .filter((h) => h.corporationId === corporationId)
      .map((h) => ({ label: `${h.name}${h.accountCode ? ` (${h.accountCode})` : ''}`, value: h.id }));
  }, [hospitals, corporationId]);

  const resetForm = useCallback(() => {
    setName('');
    setStartDate('');
    setEndDate('');
    setIsFixedFee(true);
    setFixedFeeRate(1);
    setAdditionalFeeRate(1);
    setNote('');
    setCorporationId('');
    setHospitalId('');
    setAddError(null);
  }, []);

  const handleAdd = useCallback(() => {
    const n = name.trim();
    if (!n) {
      setAddError('이벤트 이름을 입력하세요.');
      return;
    }
    if (!startDate || !endDate) {
      setAddError('시작일·종료일을 입력하세요.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setAddError('종료일은 시작일 이후여야 합니다.');
      return;
    }
    if (eventType !== 'item' && !corporationId) {
      setAddError('법인을 선택하세요.');
      return;
    }
    if (eventType === 'corporation_hospital' && !hospitalId) {
      setAddError('병의원을 선택하세요.');
      return;
    }

    const rate = isFixedFee ? fixedFeeRate : additionalFeeRate;
    if (rate < 1 || rate > 100) {
      setAddError('수수료율은 1~100 사이로 입력하세요.');
      return;
    }

    onAddEvent({
      productCode: product.productCode,
      type: eventType,
      name: n,
      startDate,
      endDate,
      isFixedFee,
      ...(isFixedFee ? { fixedFeeRate: rate } : { additionalFeeRate: rate }),
      note: note.trim(),
      ...(eventType !== 'item' && { corporationId }),
      ...(eventType === 'corporation_hospital' && { hospitalId }),
    });
    resetForm();
  }, [name, startDate, endDate, eventType, corporationId, hospitalId, isFixedFee, fixedFeeRate, additionalFeeRate, note, product.productCode, onAddEvent, resetForm]);

  const getEventDesc = (e: FeeEvent) => {
    if (e.type === 'item') return null;
    if (e.type === 'corporation') return corporations.find((c) => c.id === e.corporationId)?.name ?? '';
    const corp = corporations.find((c) => c.id === e.corporationId)?.name ?? '';
    const hosp = hospitals.find((h) => h.id === e.hospitalId)?.name ?? '';
    return `${corp} / ${hosp}`;
  };

  return (
    <Flex direction="row" alignItems="center" justifyContent="center" css={modalOverlay} onClick={onClose}>
      <div css={modalBox} onClick={(e) => e.stopPropagation()}>
        <Row alignItems="center" justifyContent="space-between" css={modalHeaderWrap}>
          <h2 id="event-modal-title">{product.productName} ({product.productCode}) 이벤트 관리</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
            <HiOutlineX size={18} />
          </Button>
        </Row>

        <Column gap={theme.spacing(4)}>
          <section>
            <h3 css={css({ fontSize: 16, marginBottom: theme.spacing(2) })}>등록된 이벤트 ({productEvents.length})</h3>
            {productEvents.length === 0 ? (
              <p css={css({ color: theme.colors.textMuted, fontSize: 14 })}>등록된 이벤트가 없습니다.</p>
            ) : (
              <div css={css({ border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, overflow: 'hidden' })}>
                {productEvents.map((e) => (
                  <div key={e.id} css={eventListRow}>
                    <Row alignItems="center" justifyContent="space-between" gap={theme.spacing(2)}>
                      <div>
                        <strong>{e.name}</strong>
                        <span css={css({ marginLeft: 8, fontSize: 12, color: theme.colors.textMuted })}>
                          {EVENT_TYPE_LABELS[e.type]}
                          {getEventDesc(e) && ` · ${getEventDesc(e)}`}
                        </span>
                        <div css={css({ marginTop: 4, fontSize: 13, color: theme.colors.textMuted })}>
                          {e.startDate} ~ {e.endDate} · {e.isFixedFee ? `고정 ${e.fixedFeeRate}%` : `추가 ${e.additionalFeeRate}%`}
                        </div>
                      </div>
                      <Button variant="ghost" size="small" onClick={() => onDeleteEvent(e.id)}>
                        삭제
                      </Button>
                    </Row>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 css={css({ fontSize: 16, marginBottom: theme.spacing(2) })}>이벤트 추가</h3>
            <Column gap={theme.spacing(3)}>
              <div css={formField}>
                <label htmlFor="event-type">이벤트 종류</label>
                <SingleSelect
                  id="event-type"
                  options={[
                    { label: '품목 이벤트', value: 'item' },
                    { label: '법인별 이벤트', value: 'corporation' },
                    { label: '법인·병원 이벤트', value: 'corporation_hospital' },
                  ]}
                  selected={eventType}
                  onChange={(v) => setEventType(v as FeeEventType)}
                />
              </div>
              {eventType !== 'item' && (
                <div css={formField}>
                  <label htmlFor="event-corp">법인</label>
                  <SingleSelect
                    id="event-corp"
                    options={[{ label: '선택', value: '' }, ...corpOptions]}
                    selected={corporationId}
                    onChange={(v) => {
                      setCorporationId(String(v));
                      setHospitalId('');
                    }}
                  />
                </div>
              )}
              {eventType === 'corporation_hospital' && (
                <div css={formField}>
                  <label htmlFor="event-hospital">병의원</label>
                  <SingleSelect
                    id="event-hospital"
                    options={[{ label: '선택', value: '' }, ...hospitalOptions]}
                    selected={hospitalId}
                    onChange={(v) => setHospitalId(String(v))}
                  />
                </div>
              )}
              <div css={formField}>
                <label htmlFor="event-name">이벤트 이름 *</label>
                <input id="event-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이벤트 이름" />
              </div>
              <Row gap={theme.spacing(3)}>
                <div css={formField}>
                  <label htmlFor="event-start">시작일 *</label>
                  <input id="event-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div css={formField}>
                  <label htmlFor="event-end">종료일 *</label>
                  <input id="event-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </Row>
              <div css={formField}>
                <label>
                  <input
                    type="checkbox"
                    checked={isFixedFee}
                    onChange={(e) => setIsFixedFee(e.target.checked)}
                    css={css({ marginRight: 8 })}
                  />
                  고정수수료
                </label>
              </div>
              {isFixedFee ? (
                <div css={formField}>
                  <label htmlFor="event-fixed-rate">고정수수료율 (1~100)% *</label>
                  <input
                    id="event-fixed-rate"
                    type="number"
                    min={1}
                    max={100}
                    value={fixedFeeRate}
                    onChange={(e) => setFixedFeeRate(Number(e.target.value) || 1)}
                  />
                </div>
              ) : (
                <div css={formField}>
                  <label htmlFor="event-add-rate">추가수수료율 (1~100)% *</label>
                  <input
                    id="event-add-rate"
                    type="number"
                    min={1}
                    max={100}
                    value={additionalFeeRate}
                    onChange={(e) => setAdditionalFeeRate(Number(e.target.value) || 1)}
                  />
                </div>
              )}
              <div css={formField}>
                <label htmlFor="event-note">비고</label>
                <textarea id="event-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="설명" />
              </div>
            </Column>
          </section>
        </Column>

        <Row gap={theme.spacing(2)} justifyContent="flex-end" css={modalActionsWrap}>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            이벤트 추가
          </Button>
        </Row>
        {addError && <p css={css({ marginTop: theme.spacing(2), fontSize: 14, color: theme.colors.error })}>{addError}</p>}
      </div>
    </Flex>
  );
}
