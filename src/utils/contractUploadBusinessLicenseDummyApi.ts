export type BusinessLicenseParseResult = {
  fileName: string;
  businessName: string;
  businessNumber: string;
};

/** 사업자등록증 OCR/인식 API 대체 더미 — 실제 연동 시 교체 */
export async function parseBusinessLicenseFile(file: File): Promise<BusinessLicenseParseResult> {
  await new Promise((r) => setTimeout(r, 700));
  const base = file.name.replace(/\.[^.]+$/, '');
  return {
    fileName: file.name,
    businessName: `(인식 더미) ${base || '사업자명'}`,
    businessNumber: '123-45-67890',
  };
}
