'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { formatBusinessNumber } from '@/utils';
import * as s from './index.css';

export function CorpMyPage() {
  const { currentCorporationId } = useApp();
  const corporations = useDemoPlayStore((st) => st.corporations);
  const setCorporations = useDemoPlayStore((st) => st.setCorporations);

  const corp = useMemo(
    () => corporations.find((c) => c.id === currentCorporationId) ?? null,
    [corporations, currentCorporationId],
  );

  const patchCorp = useCallback(
    (patch: Partial<NonNullable<typeof corp>>) => {
      if (!currentCorporationId) return;
      setCorporations((prev) =>
        prev.map((c) => (c.id === currentCorporationId ? { ...c, ...patch } : c)),
      );
    },
    [currentCorporationId, setCorporations],
  );

  const handleBusinessRegNoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      patchCorp({ businessRegNo: formatBusinessNumber(e.target.value) });
    },
    [patchCorp],
  );

  const [saveAck, setSaveAck] = useState(false);

  const handleSave = useCallback(() => {
    setSaveAck(true);
    window.setTimeout(() => setSaveAck(false), 2500);
  }, []);

  if (!corp) {
    return (
      <div className={s.page}>
        <div className={s.layout}>
          <PageHeader title="마이페이지" description="표시할 법인 정보를 찾지 못했습니다." />
          <CardWrapper title="계정 정보" fill padding={16}>
            {null}
          </CardWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.layout}>
        <PageHeader
          title="마이페이지"
          description="이메일·연락처·상호 등 법인 계정 정보를 확인하고 수정합니다."
        />
        <CardWrapper title="계정 정보" fill padding={16}>
          <div className={s.formStack}>
            <div className={s.field}>
              <label className={s.label} htmlFor="corp-my-email">
                이메일
              </label>
              <Input
                id="corp-my-email"
                type="email"
                autoComplete="email"
                value={corp.email ?? ''}
                onChange={(e) => patchCorp({ email: e.target.value })}
                placeholder="담당자 이메일"
              />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="corp-my-phone">
                전화번호
              </label>
              <Input
                id="corp-my-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={corp.phone ?? ''}
                onChange={(e) => patchCorp({ phone: e.target.value })}
                placeholder="02-0000-0000"
              />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="corp-my-rep-name">
                이름
              </label>
              <Input
                id="corp-my-rep-name"
                type="text"
                autoComplete="name"
                value={corp.representativeName ?? ''}
                onChange={(e) => patchCorp({ representativeName: e.target.value })}
                placeholder="담당자 이름"
              />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="corp-my-brn">
                사업자등록번호
              </label>
              <Input
                id="corp-my-brn"
                inputMode="numeric"
                autoComplete="off"
                value={corp.businessRegNo ?? ''}
                onChange={handleBusinessRegNoChange}
                placeholder="000-00-00000"
                maxLength={12}
              />
            </div>

            <div className={s.field}>
              <span className={s.label}>상호명</span>
              <div className={s.readOnlyBox}>{corp.name}</div>
              <p className={s.hint}>상호 변경은 담당자에게 문의해 주세요.</p>
            </div>
          </div>

          <div className={s.saveRow}>
            {saveAck ? <p className={s.hint}>저장했습니다</p> : null}
            <Button type="button" variant="primary" onClick={handleSave}>
              저장
            </Button>
          </div>
        </CardWrapper>
      </div>
    </div>
  );
}
