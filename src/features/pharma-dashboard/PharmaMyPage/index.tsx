'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import { FileInput, Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import * as s from './index.css';

const DEFAULT_LOGO = '/logo.svg';

export function PharmaMyPage() {
  const { userRole, currentPharmaId } = useApp();
  const pharmas = useDemoPlayStore((st) => st.pharmas);
  const setPharmas = useDemoPlayStore((st) => st.setPharmas);

  const pharma = useMemo(
    () => pharmas.find((p) => p.id === currentPharmaId) ?? null,
    [pharmas, currentPharmaId],
  );

  const patchPharma = useCallback(
    (patch: Partial<NonNullable<typeof pharma>>) => {
      if (!currentPharmaId) return;
      setPharmas((prev) => prev.map((p) => (p.id === currentPharmaId ? { ...p, ...patch } : p)));
    },
    [currentPharmaId, setPharmas],
  );

  const handleLogoFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 등록할 수 있습니다.');
        return;
      }
      if (file.size > 800 * 1024) {
        alert('파일 크기는 800KB 이하로 선택해 주세요.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        patchPharma({ logoUrl: String(reader.result) });
      };
      reader.readAsDataURL(file);
    },
    [patchPharma],
  );

  const handleLicenseFile = useCallback(
    (file: File | null) => {
      if (!file) {
        patchPharma({ businessLicenseFileName: null });
        return;
      }
      patchPharma({ businessLicenseFileName: file.name });
    },
    [patchPharma],
  );

  const clearLogo = useCallback(() => {
    patchPharma({ logoUrl: null });
  }, [patchPharma]);

  const [saveAck, setSaveAck] = useState(false);

  const handleSave = useCallback(() => {
    setSaveAck(true);
    window.setTimeout(() => setSaveAck(false), 2500);
  }, []);

  if (!pharma) {
    return (
      <div className={s.page}>
        <div className={s.layout}>
          <PageHeader title="마이페이지" description="표시할 제약사를 찾지 못했어요." />
          <CardWrapper title="계정 정보" fill padding={16}>
            {null}
          </CardWrapper>
        </div>
      </div>
    );
  }

  const showPharmaOnlyBlocks = userRole === 'pharma';

  const accountFields = (
    <div className={s.formStack}>
      <div className={s.field}>
        <span className={s.label}>등록된 상호</span>
        <div className={s.readOnlyBox}>{pharma.name}</div>
        <p className={s.hint}>바꾸려면 담당자에게 문의해 주세요.</p>
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="pharma-my-email">
          이메일
        </label>
        <Input
          id="pharma-my-email"
          type="email"
          autoComplete="email"
          value={pharma.email ?? ''}
          onChange={(e) => patchPharma({ email: e.target.value })}
          placeholder="담당자 이메일"
        />
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="pharma-my-brn">
          사업자등록번호
        </label>
        <Input
          id="pharma-my-brn"
          inputMode="numeric"
          autoComplete="off"
          value={pharma.businessRegNo ?? ''}
          onChange={(e) => patchPharma({ businessRegNo: e.target.value })}
          placeholder="000-00-00000"
        />
      </div>

      <div className={s.field}>
        <span className={s.label} id="pharma-my-license-label">
          사업자등록증 사본
        </span>
        <FileInput
          aria-labelledby="pharma-my-license-label"
          accept="image/*,.pdf"
          onChange={(v) => handleLicenseFile(v instanceof File ? v : null)}
        />
        {pharma.businessLicenseFileName ? (
          <p className={s.hint}>지금은 「{pharma.businessLicenseFileName}」이 첨부되어 있어요.</p>
        ) : (
          <p className={s.hint}>사진이나 PDF로 올려 주세요.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <div className={s.layout}>
        <PageHeader
          title="마이페이지"
          description="로고와 연락처처럼, 화면에 보이는 정보를 여기서 정리해 보세요."
        />
        <CardWrapper title="계정 정보" fill padding={16}>
          {showPharmaOnlyBlocks ? (
            <>
              <p className={s.innerSectionLabel}>사이드바 로고</p>
              <div className={s.logoSection}>
                <div className={s.logoPreviewRow}>
                  <img src={pharma.logoUrl || DEFAULT_LOGO} alt="" className={s.logoPreview} />
                  <div className={s.logoActions}>
                    <FileInput
                      accept="image/*"
                      onChange={(v) => handleLogoFile(v instanceof File ? v : null)}
                    />
                    {pharma.logoUrl ? (
                      <Button type="button" variant="secondary" size="small" onClick={clearLogo}>
                        처음 로고로 바꾸기
                      </Button>
                    ) : null}
                  </div>
                </div>
                <p className={s.hint}>PNG나 JPG가 잘 맞아요. 파일은 800KB 이하로 올려 주세요.</p>
              </div>
              <hr className={s.sectionDivider} />
              <p className={s.innerSectionLabel}>연락처·서류</p>
            </>
          ) : null}
          {accountFields}
          <div className={s.saveRow}>
            {saveAck ? <p className={s.hint}>저장했어요</p> : null}
            <Button type="button" variant="primary" onClick={handleSave}>
              저장
            </Button>
          </div>
        </CardWrapper>
      </div>
    </div>
  );
}
