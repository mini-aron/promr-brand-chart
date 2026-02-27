/**
 * 실적 업로드: 업로드된 엑셀 파일에서 SalesRow[] 추출.
 * TODO: 서버에서 엑셀 데이터를 JSON으로 내려주는 API 연동 시 이 모듈 제거하고, API 응답을 그대로 사용.
 */
import * as XLSX from 'xlsx';
import type { SalesRow, Hospital } from '@/types';

/** 엑셀 시트 컬럼명 매핑 (실제 시트 컬럼명에 맞게 수정 가능) */
const COLUMNS = {
  hospital: ['병원', '병의원', '병원명', 'hospital'],
  businessNumber: ['사업자번호', '사업자등록번호', 'business_number', 'businessNumber'],
  product: ['제품', '품목', '제품명', 'product'],
  productCode: ['제품코드', '품목코드', 'product_code', 'productCode'],
  quantity: ['수량', 'quantity', 'qty'],
  amount: ['금액', '매출', 'amount', 'sales'],
} as const;

function findColumnKey(row: Record<string, unknown>, keys: readonly string[]): string | null {
  const header = Object.keys(row).find((k) =>
    keys.some((key) => String(k).trim() === key || String(k).toLowerCase() === key.toLowerCase())
  );
  return header ?? null;
}

export type ParseExcelResult = { rows: SalesRow[]; error?: string };

/**
 * 업로드된 엑셀 파일을 파싱해 SalesRow[] 반환.
 * API 연동 시 이 함수 호출을 API 호출로 교체하고, 응답 JSON을 동일한 형태({ rows, error? })로 사용하면 됨.
 */
export function parseExcelToSalesRows(
  file: File,
  corporationId: string,
  hospitals: Hospital[]
): Promise<ParseExcelResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data || typeof data !== 'object') {
          resolve({ rows: [], error: '파일을 읽을 수 없습니다.' });
          return;
        }
        const wb = XLSX.read(data, { type: 'array' });
        const firstSheet = wb.SheetNames[0];
        const sheet = wb.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        if (json.length === 0) {
          resolve({ rows: [], error: '시트에 데이터가 없습니다.' });
          return;
        }
        const first = json[0];
        const hospitalKey = findColumnKey(first, COLUMNS.hospital);
        const businessNumberKey = findColumnKey(first, COLUMNS.businessNumber);
        const productKey = findColumnKey(first, COLUMNS.product);
        const productCodeKey = findColumnKey(first, COLUMNS.productCode);
        const quantityKey = findColumnKey(first, COLUMNS.quantity);
        const amountKey = findColumnKey(first, COLUMNS.amount);
        if (!hospitalKey || !productKey) {
          resolve({
            rows: [],
            error: '필수 컬럼을 찾을 수 없습니다. (병원명, 제품명 등)',
          });
          return;
        }
        const hospitalByName = new Map(hospitals.map((h) => [h.name, h]));
        const now = new Date().toISOString();
        const rows: SalesRow[] = [];
        for (let i = 0; i < json.length; i++) {
          const r = json[i];
          const hospitalName = String(r[hospitalKey] ?? '').trim();
          const businessNumber = businessNumberKey ? String(r[businessNumberKey] ?? '').trim() : undefined;
          const productName = String(r[productKey] ?? '').trim();
          const productCode = productCodeKey ? String(r[productCodeKey] ?? '').trim() : undefined;
          const q = quantityKey ? r[quantityKey] : undefined;
          const a = amountKey ? r[amountKey] : undefined;
          const quantity = typeof q === 'number' ? q : Number(q) || 0;
          const amount = typeof a === 'number' ? a : Number(String(a).replace(/,/g, '')) || 0;
          const hospital = hospitalByName.get(hospitalName);
          const hospitalId = hospital?.id ?? `unknown-${hospitalName}`;
          rows.push({
            id: `s-${Date.now()}-${i}`,
            corporationId,
            hospitalId,
            productName,
            quantity,
            amount,
            uploadedAt: now,
            businessNumber: businessNumber || hospital?.businessNumber,
            productCode,
          });
        }
        resolve({ rows });
      } catch (err) {
        resolve({ rows: [], error: err instanceof Error ? err.message : '파싱 오류' });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
