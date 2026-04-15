'use client';

import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { queryKeys } from '@/api/queryKey';
import {
  getAgreementList,
  recognizeBusinessRegistration,
  registerCorp,
  registerDealer,
} from '@/api/services';
import type { AgreementItem, AgreementType } from '@/types/services/agreementService';
import { Button } from '@/shared/components/ui/Button';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { FileInput, Input } from '@/shared/components/ui/Input';
import { SingleSelect, type Option } from '@/shared/components/ui/Select';
import { Toggle } from '@/shared/components/ui/Toggle';
import { PageDesc } from '@/shared/components/ui/Text';
import { AccordionItem } from '@/shared/components/ui/Accordion';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import { isValidEmail, isValidPhone } from '@/utils/validation';
import * as s from './index.css';
import { page } from '@/style/PageStyles.css';

type FormState = {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  businessSector: string | null;
  subcontracting: boolean;
};

type LicenseState = {
  file: File | null;
  parse: { fileName: string; businessName: string; businessNumber: string } | null;
  loading: boolean;
  error: string | null;
  nameManual: string;
  numberManual: string;
};

const initialForm: FormState = {
  displayName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  businessSector: 'PERSONAL_CSO',
  subcontracting: false,
};

const initialLicense: LicenseState = {
  file: null,
  parse: null,
  loading: false,
  error: null,
  nameManual: '',
  numberManual: '',
};

const AGREEMENT_TYPE_LABEL: Record<AgreementType, string> = {
  TERMS_OF_SERVICE: '서비스 이용약관',
  PRIVACY_POLICY: '개인정보 처리방침',
  MARKETING_CONSENT: '마케팅 정보 수신',
};

const AGREEMENT_TYPE_ORDER: AgreementType[] = [
  'TERMS_OF_SERVICE',
  'PRIVACY_POLICY',
  'MARKETING_CONSENT',
];

function sortAgreements(list: AgreementItem[]): AgreementItem[] {
  return [...list].sort(
    (a, b) =>
      AGREEMENT_TYPE_ORDER.indexOf(a.agreementType) - AGREEMENT_TYPE_ORDER.indexOf(b.agreementType),
  );
}

function allAgreementsChecked(items: AgreementItem[], agreed: Record<number, boolean>): boolean {
  return items.length > 0 && items.every((i) => agreed[i.id]);
}

function someAgreementsChecked(items: AgreementItem[], agreed: Record<number, boolean>): boolean {
  return items.some((i) => agreed[i.id]) && !allAgreementsChecked(items, agreed);
}

function allRequiredAgreementsChecked(
  items: AgreementItem[],
  agreed: Record<number, boolean>,
): boolean {
  return items.filter((i) => i.required).every((i) => agreed[i.id]);
}

const BUSINESS_SECTOR_OPTIONS: Option[] = [
  { value: 'PERSONAL_CSO', label: '개인 CSO' },
  { value: 'CORPORATE_CSO', label: '법인 CSO' },
];

const MIN_PASSWORD_LEN = 8;

function SignupShell({ children }: { children: ReactNode }) {
  return (
    <div className={page}>
      <div className={s.wrap}>{children}</div>
    </div>
  );
}

function SignupInner() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid')?.trim() ?? '';
  const redirectUrlParam = searchParams.get('redirectUrl')?.trim() ?? '';
  const redirectUrl = useMemo(() => {
    if (!redirectUrlParam) return '';
    if (redirectUrlParam.startsWith('/')) return redirectUrlParam;
    try {
      const url = new URL(redirectUrlParam);
      if (typeof window !== 'undefined' && url.origin === window.location.origin) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
      return '';
    } catch {
      return '';
    }
  }, [redirectUrlParam]);

  const [form, setForm] = useState<FormState>(initialForm);
  const [license, setLicense] = useState<LicenseState>(initialLicense);
  const [agreedById, setAgreedById] = useState<Record<number, boolean>>({});
  const [accordionOpenById, setAccordionOpenById] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  const {
    data: agreementList = [],
    isLoading: agreementLoading,
    isError: agreementError,
  } = useQuery({
    queryKey: queryKeys.agreement.list,
    queryFn: async () => {
      const { data } = await getAgreementList();
      return data.list;
    },
    enabled: Boolean(uuid),
  });

  const sortedAgreements = useMemo(() => sortAgreements(agreementList), [agreementList]);

  useEffect(() => {
    if (agreementList.length === 0) return;
    setAgreedById((prev) => {
      const next = { ...prev };
      for (const a of agreementList) {
        if (next[a.id] === undefined) next[a.id] = false;
      }
      return next;
    });
    setAccordionOpenById((prev) => {
      const next = { ...prev };
      for (const a of agreementList) {
        if (next[a.id] === undefined) next[a.id] = false;
      }
      return next;
    });
  }, [agreementList]);

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((f) => ({ ...f, [key]: value })),
    [],
  );

  const selectAllChecked = allAgreementsChecked(sortedAgreements, agreedById);
  const selectAllIndeterminate =
    someAgreementsChecked(sortedAgreements, agreedById) && !selectAllChecked;

  const hasBusinessLicenseInfo = useMemo(() => {
    if (license.parse) return true;
    if (license.error && license.file && !license.loading) {
      return license.nameManual.trim().length > 0 && license.numberManual.trim().length > 0;
    }
    return false;
  }, [license]);

  const passwordMismatch =
    form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;
  const passwordTooShort = form.password.length > 0 && form.password.length < MIN_PASSWORD_LEN;
  const emailInvalid = form.email.length > 0 && !isValidEmail(form.email);
  const phoneInvalid = form.phone.length > 0 && !isValidPhone(form.phone);

  const canSubmit =
    form.displayName.trim().length > 0 &&
    form.email.trim().length > 0 &&
    !emailInvalid &&
    form.phone.trim().length > 0 &&
    !phoneInvalid &&
    form.password.length >= MIN_PASSWORD_LEN &&
    form.password === form.passwordConfirm &&
    form.businessSector != null &&
    sortedAgreements.length > 0 &&
    !agreementLoading &&
    !agreementError &&
    allRequiredAgreementsChecked(sortedAgreements, agreedById) &&
    license.file != null &&
    !license.loading &&
    hasBusinessLicenseInfo;

  const setSelectAll = useCallback(
    (checked: boolean) => {
      setAgreedById((prev) => {
        const next = { ...prev };
        for (const a of sortedAgreements) {
          next[a.id] = checked;
        }
        return next;
      });
    },
    [sortedAgreements],
  );

  const handleBusinessLicenseChange = useCallback(async (file: File | null) => {
    setLicense({
      file,
      parse: null,
      loading: false,
      error: null,
      nameManual: '',
      numberManual: '',
    });
    if (!file) return;
    setLicense((l) => ({ ...l, loading: true }));
    try {
      const result = await recognizeBusinessRegistration(file);
      setLicense((l) => ({
        ...l,
        loading: false,
        parse: {
          fileName: result.fileName,
          businessName: result.bussinessName,
          businessNumber: result.businessNumber,
        },
      }));
    } catch {
      setLicense((l) => ({
        ...l,
        loading: false,
        error: '사업자등록증(OCR) 정보를 읽는 데 실패했습니다. 아래에 직접 입력해 주세요.',
      }));
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    try {
      if (form.businessSector === 'CORPORATE_CSO') {
        await registerCorp({
          name: form.displayName,
          accountId: form.email,
          organizationName: form.displayName,
          businessRegistrationFileName: license.parse?.fileName ?? '',
          businessName: license.parse?.businessName ?? '',
          businessNumber: license.parse?.businessNumber ?? '',
          password: form.password,
          email: form.email,
        });
      } else if (form.businessSector === 'PERSONAL_CSO') {
        await registerDealer({
          name: form.displayName,
          accountId: form.email,
          organizationName: form.displayName,
          businessRegistrationFileName: license.parse?.fileName ?? '',
          businessName: license.parse?.businessName ?? '',
          businessNumber: license.parse?.businessNumber ?? '',
          password: form.password,
          email: form.email,
          phoneNumber: form.phone,
        });
      }
      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }
    } catch (error) {}

    setDone(true);
  }, [redirectUrl]);

  if (!uuid) {
    return (
      <SignupShell>
        <PageHeader title="회원가입" description="유효하지 않은 가입 링크입니다." />
      </SignupShell>
    );
  }

  return (
    <SignupShell>
      <PageHeader title="회원가입" />
      {done ? (
        <PageDesc>가입 신청이 완료되었습니다. 창을 닫아도 됩니다.</PageDesc>
      ) : (
        <CardWrapper className={s.cardSharp}>
          <div className={clsx(s.formStack, s.formSharp)}>
            <div className={s.field}>
              <label className={s.label} htmlFor="su-name">
                담당자 이름 <span className={s.requiredMark}>(필수)</span>
              </label>
              <Input
                id="su-name"
                autoComplete="name"
                value={form.displayName}
                onChange={(e) => setField('displayName', e.target.value)}
                placeholder="담당자 이름을 입력하세요"
              />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="su-email">
                이메일 <span className={s.requiredMark}>(필수)</span>
              </label>
              <Input
                id="su-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="name@example.com"
              />
              {emailInvalid && <p className={s.errorText}>이메일 형식을 확인해 주세요.</p>}
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="su-phone">
                전화번호 <span className={s.requiredMark}>(필수)</span>
              </label>
              <Input
                id="su-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="010-1234-5678"
              />
              {phoneInvalid && <p className={s.errorText}>전화번호 형식을 확인해 주세요.</p>}
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="su-password">
                비밀번호 <span className={s.requiredMark}>(필수)</span>
              </label>
              <Input
                id="su-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder={`${MIN_PASSWORD_LEN}자 이상`}
              />
              {passwordTooShort && (
                <p className={s.errorText}>비밀번호는 {MIN_PASSWORD_LEN}자 이상 입력해 주세요.</p>
              )}
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="su-password-confirm">
                비밀번호 확인 <span className={s.requiredMark}>(필수)</span>
              </label>
              <Input
                id="su-password-confirm"
                type="password"
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(e) => setField('passwordConfirm', e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {passwordMismatch && <p className={s.errorText}>비밀번호가 일치하지 않습니다.</p>}
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="su-business">
                사업자등록증 <span className={s.requiredMark}>(필수)</span>
              </label>
              <p className={s.hint}>이미지를 올리면 OCR로 사업자명·사업자등록번호를 추출합니다.</p>
              <FileInput
                id="su-business"
                accept="image/*,.pdf"
                onChange={(v) => {
                  const f = v instanceof File ? v : null;
                  void handleBusinessLicenseChange(f);
                }}
              />
              {license.loading && <p className={s.parseLoading}>사업자 정보(OCR)를 읽는 중…</p>}
              {license.error && !license.loading && (
                <>
                  <p className={s.errorText}>{license.error}</p>
                  <p className={s.hint}>자동 인식에 실패한 경우 아래에 직접 입력해 주세요.</p>
                  <div className={s.parsedFields}>
                    <div className={s.field}>
                      <label className={s.label} htmlFor="su-business-name">
                        사업자명 <span className={s.requiredMark}>(필수)</span>
                      </label>
                      <Input
                        id="su-business-name"
                        autoComplete="organization"
                        value={license.nameManual}
                        onChange={(e) => setLicense((l) => ({ ...l, nameManual: e.target.value }))}
                        placeholder="예: (주)○○○"
                      />
                    </div>
                    <div className={s.field}>
                      <label className={s.label} htmlFor="su-business-number">
                        사업자등록번호 <span className={s.requiredMark}>(필수)</span>
                      </label>
                      <Input
                        id="su-business-number"
                        inputMode="numeric"
                        autoComplete="off"
                        value={license.numberManual}
                        onChange={(e) =>
                          setLicense((l) => ({ ...l, numberManual: e.target.value }))
                        }
                        placeholder="예: 123-45-67890"
                      />
                    </div>
                  </div>
                </>
              )}
              {license.parse && !license.loading && (
                <div className={s.parsedFields}>
                  <div className={s.field}>
                    <label className={s.hint} htmlFor="su-business-name-ro">
                      사업자명
                    </label>
                    <Input
                      id="su-business-name-ro"
                      readOnly
                      value={license.parse.businessName}
                      className={s.readonlyInput}
                    />
                  </div>
                  <div className={s.field}>
                    <label className={s.hint} htmlFor="su-business-number-ro">
                      사업자등록번호
                    </label>
                    <Input
                      id="su-business-number-ro"
                      readOnly
                      value={license.parse.businessNumber}
                      className={s.readonlyInput}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={s.field}>
              <span className={s.label} id="su-sector-label">
                CSO 종류 <span className={s.requiredMark}>(필수)</span>
              </span>
              <SingleSelect
                id="su-sector"
                aria-labelledby="su-sector-label"
                options={BUSINESS_SECTOR_OPTIONS}
                selected={form.businessSector}
                onChange={(v) => setField('businessSector', String(v))}
                placeholder="개인 CSO / 법인 CSO 선택"
                size="default"
              />
            </div>

            <div className={s.divider}>
              <div className={s.toggleRow}>
                <span className={s.toggleLabel}>재위탁 여부</span>
                <Toggle
                  id="su-subcontract"
                  checked={form.subcontracting}
                  onChange={(v) => setField('subcontracting', v)}
                  aria-label="재위탁 여부"
                />
              </div>
              <p className={s.hint}>재위탁에 해당하는 경우에만 켜 주세요.</p>
            </div>

            <section className={s.consentSection} aria-label="약관 및 동의">
              <div className={s.selectAllRow}>
                <Checkbox
                  id="su-consent-all"
                  checked={selectAllChecked}
                  indeterminate={selectAllIndeterminate}
                  onChange={setSelectAll}
                  label="전체 동의"
                  aria-label="전체 동의"
                />
              </div>

              {agreementLoading && <p className={s.parseLoading}>약관을 불러오는 중…</p>}
              {agreementError && !agreementLoading && (
                <p className={s.errorText}>
                  약관을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
                </p>
              )}
              {!agreementLoading &&
                !agreementError &&
                sortedAgreements.map((item) => (
                  <Fragment key={item.id}>
                    {item.agreementType === 'MARKETING_CONSENT' && (
                      <div className={s.consentDivider} />
                    )}
                    <AccordionItem
                      checkboxId={`su-consent-${item.id}`}
                      label={`${AGREEMENT_TYPE_LABEL[item.agreementType]} 동의`}
                      required={item.required}
                      checked={agreedById[item.id] ?? false}
                      onChange={(v) => setAgreedById((prev) => ({ ...prev, [item.id]: v }))}
                      panelId={`su-agreement-${item.id}`}
                      panelAriaLabel={AGREEMENT_TYPE_LABEL[item.agreementType]}
                      panelClassName={
                        item.agreementType === 'TERMS_OF_SERVICE'
                          ? s.termsAccordionPanel
                          : undefined
                      }
                      open={accordionOpenById[item.id] ?? false}
                      onToggle={() =>
                        setAccordionOpenById((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }))
                      }
                    >
                      <p className={s.detailIntro} style={{ whiteSpace: 'pre-wrap' }}>
                        {item.content}
                      </p>
                      <p className={s.hint} style={{ marginTop: 8 }}>
                        버전 {item.version} · 시행 {item.effectiveFrom}
                      </p>
                    </AccordionItem>
                  </Fragment>
                ))}
            </section>

            <div className={s.actions}>
              <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
                가입 신청
              </Button>
            </div>
          </div>
        </CardWrapper>
      )}
    </SignupShell>
  );
}

export function SignupPage() {
  return (
    <Suspense
      fallback={
        <SignupShell>
          <PageHeader title="회원가입" description="로딩 중…" />
        </SignupShell>
      }
    >
      <SignupInner />
    </Suspense>
  );
}
