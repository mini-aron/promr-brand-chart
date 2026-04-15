'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  downloadContractRequestExcel,
  requestContract,
  requestContractExcel,
} from '@/api/services/contractService';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type {
  ContractRequestParams,
  ContractRequestResponse,
  SendType,
} from '@/types/services/contractService';
import { isValidEmail, isValidPhone } from '@/utils/validation';
import * as s from './ContractRequestModal.css';

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/[^\d]/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export type ContractRequestModalProps = {
  onClose: () => void;
  onSuccess?: (res: ContractRequestResponse) => void;
  onExcelSuccess?: () => void;
};

export function ContractRequestModal({
  onClose,
  onSuccess,
  onExcelSuccess,
}: ContractRequestModalProps) {
  const [entryMode, setEntryMode] = useState<'manual' | 'excel'>('manual');
  const [alias, setAlias] = useState('');
  const [sendType, setSendType] = useState<SendType>('EMAIL');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [templateDownloading, setTemplateDownloading] = useState(false);

  const validateManual = (): string | null => {
    if (!alias.trim()) return '별칭을 입력해 주세요.';
    if (sendType === 'EMAIL') {
      if (!email.trim()) return '이메일 주소를 입력해 주세요.';
      if (!isValidEmail(email)) return '이메일 형식을 확인해 주세요.';
      return null;
    }
    if (!phoneNumber.trim()) return '전화번호를 입력해 주세요.';
    if (!isValidPhone(phoneNumber)) return '전화번호 형식을 확인해 주세요.';
    return null;
  };

  const handleDownloadTemplate = async () => {
    setTemplateDownloading(true);
    setFieldError(null);
    try {
      await downloadContractRequestExcel();
      toast.success('엑셀 양식을 다운로드했습니다.');
    } catch {
      setFieldError('양식 다운로드에 실패했습니다.');
    } finally {
      setTemplateDownloading(false);
    }
  };

  const handleManualSubmit = async () => {
    const err = validateManual();
    if (err) {
      setFieldError(err);
      return;
    }
    setFieldError(null);

    const params: ContractRequestParams = {
      alias: alias.trim(),
      sendType,
      email: sendType === 'EMAIL' ? email.trim() : undefined,
      phoneNumber: sendType === 'PHONE' ? phoneNumber.replace(/[^\d]/g, '') : undefined,
    };

    setPending(true);
    try {
      const res = await requestContract(params);
      toast.success('계약 요청이 등록되었습니다.');
      onSuccess?.(res);
      onClose();
    } catch {
      alert('계약 요청에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };

  const handleExcelSubmit = async () => {
    if (!excelFile) {
      setFieldError('엑셀 파일을 선택해 주세요.');
      return;
    }
    setFieldError(null);
    setPending(true);
    try {
      await requestContractExcel(excelFile);
      toast.success('엑셀 요청이 등록되었습니다.');
      onExcelSuccess?.();
      onClose();
    } catch {
      alert('엑셀 업로드에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={s.requestModalOverlay}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={s.requestModalBox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-request-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="contract-request-modal-title" className={s.requestModalTitle}>
          계약서 요청
        </h3>
        <p className={s.requestModalDesc}>
          직접 입력하거나, 양식을 받아 엑셀로 일괄 등록할 수 있습니다.
        </p>

        <div className={s.requestModalField}>
          <span className={s.requestModalLabel}>등록 방식</span>
          <div className={s.requestModalSegment} role="group" aria-label="등록 방식">
            <Button
              type="button"
              variant={entryMode === 'manual' ? 'primary' : 'secondary'}
              size="small"
              className={s.requestModalSegmentBtn}
              disabled={pending}
              onClick={() => {
                setEntryMode('manual');
                setFieldError(null);
              }}
            >
              직접 입력
            </Button>
            <Button
              type="button"
              variant={entryMode === 'excel' ? 'primary' : 'secondary'}
              size="small"
              className={s.requestModalSegmentBtn}
              disabled={pending}
              onClick={() => {
                setEntryMode('excel');
                setFieldError(null);
              }}
            >
              엑셀 일괄
            </Button>
          </div>
        </div>

        {entryMode === 'manual' ? (
          <>
            <div className={s.requestModalField}>
              <label className={s.requestModalLabel} htmlFor="contract-request-alias">
                별칭
              </label>
              <Input
                id="contract-request-alias"
                type="text"
                autoComplete="off"
                placeholder="요청 구분용 이름"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                disabled={pending}
              />
            </div>

            <div className={s.requestModalField}>
              <span className={s.requestModalLabel}>전송 수단</span>
              <div className={s.requestModalSegment} role="group" aria-label="전송 수단">
                <Button
                  type="button"
                  variant={sendType === 'EMAIL' ? 'primary' : 'secondary'}
                  size="small"
                  className={s.requestModalSegmentBtn}
                  disabled={pending}
                  onClick={() => {
                    setSendType('EMAIL');
                    setFieldError(null);
                  }}
                >
                  이메일
                </Button>
                <Button
                  type="button"
                  variant={sendType === 'PHONE' ? 'primary' : 'secondary'}
                  size="small"
                  className={s.requestModalSegmentBtn}
                  disabled={pending}
                  onClick={() => {
                    setSendType('PHONE');
                    setFieldError(null);
                  }}
                >
                  전화
                </Button>
              </div>
            </div>

            {sendType === 'EMAIL' ? (
              <div className={s.requestModalField}>
                <label className={s.requestModalLabel} htmlFor="contract-request-email">
                  이메일
                </label>
                <Input
                  id="contract-request-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={pending}
                />
              </div>
            ) : (
              <div className={s.requestModalField}>
                <label className={s.requestModalLabel} htmlFor="contract-request-phone">
                  전화번호
                </label>
                <Input
                  id="contract-request-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  disabled={pending}
                />
              </div>
            )}
          </>
        ) : (
          <div className={s.requestModalField}>
            <span className={s.requestModalLabel}>엑셀</span>
            <div className={s.requestModalUploadDropzone}>
              <Button
                type="button"
                variant="secondary"
                size="small"
                disabled={pending || templateDownloading}
                onClick={() => void handleDownloadTemplate()}
              >
                {templateDownloading ? '다운로드 중…' : '엑셀 양식 다운로드'}
              </Button>
              <div className={s.requestModalUploadRow} style={{ position: 'relative' }}>
                <label className={s.requestModalFileSelectButton} htmlFor="contract-request-excel">
                  파일 선택
                </label>
                <input
                  id="contract-request-excel"
                  className={s.requestModalFileInput}
                  type="file"
                  accept=".xlsx,.xls"
                  disabled={pending}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setExcelFile(f);
                    setExcelFileName(f?.name ?? null);
                    setFieldError(null);
                  }}
                />
                <span className={s.requestModalFileName} title={excelFileName ?? undefined}>
                  {excelFileName ?? '선택된 파일 없음'}
                </span>
              </div>
            </div>
          </div>
        )}

        {fieldError && (
          <p className={s.requestModalHint} role="alert" style={{ color: 'var(--color-error)' }}>
            {fieldError}
          </p>
        )}

        <div className={s.requestModalActions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
            취소
          </Button>
          {entryMode === 'manual' ? (
            <Button
              type="button"
              variant="primary"
              disabled={pending}
              onClick={() => void handleManualSubmit()}
            >
              {pending ? '등록 중…' : '요청 등록'}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={pending}
              onClick={() => void handleExcelSubmit()}
            >
              {pending ? '등록 중…' : '엑셀로 등록'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
