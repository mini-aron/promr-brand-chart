'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { KakaoMap } from '@/components/Map/KakaoMap.tsx';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import * as s from './index.css';

export function PharmacySettingsPage() {
  const mockHospitals = useDemoPlayStore((s) => s.hospitals);
  const mockPharmacies = useDemoPlayStore((s) => s.pharmacies);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [focusedPharmacyId, setFocusedPharmacyId] = useState<string | null>(null);

  const pharmacyCountByHospital = useMemo(() => {
    const map = new Map<string, number>();
    mockPharmacies.forEach((p) => {
      map.set(p.hospitalId, (map.get(p.hospitalId) ?? 0) + 1);
    });
    return map;
  }, [mockPharmacies]);

  const selectedPharmacies = useMemo(() => {
    if (!selectedHospitalId) return [];
    return mockPharmacies.filter((p) => p.hospitalId === selectedHospitalId);
  }, [selectedHospitalId, mockPharmacies]);

  const filteredHospitals = useMemo(() => {
    if (!hospitalSearch.trim()) return mockHospitals;
    const q = hospitalSearch.toLowerCase().trim();
    return mockHospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.address ?? '').toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q),
    );
  }, [hospitalSearch, mockHospitals]);

  const mapMarkers = useMemo(() => {
    return selectedPharmacies
      .filter((p): p is typeof p & { lat: number; lng: number } => p.lat != null && p.lng != null)
      .map((p) => ({ id: p.id, lat: p.lat, lng: p.lng }));
  }, [selectedPharmacies]);

  return (
    <div className={s.page}>
      <PageHeader title="문전약국 설정" description="병원별 문전약국 매핑을 확인하고 관리합니다." />
      <div className={s.content}>
        <CardWrapper title="병원 리스트" className={s.hospitalPanelLayout} padding={0} fill>
          <div className={s.hospitalPanel}>
            <div className={s.searchWrap}>
              <label htmlFor="hospital-search">병원 검색</label>
              <Input
                id="hospital-search"
                size="large"
                type="search"
                placeholder="병원명, 주소, 거래처코드"
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
              />
            </div>
            <div className={s.hospitalList}>
              {filteredHospitals.map((h) => (
                <Button
                  key={h.id}
                  variant="menu"
                  size="menu"
                  active={selectedHospitalId === h.id}
                  onClick={() => setSelectedHospitalId(selectedHospitalId === h.id ? null : h.id)}
                >
                  <span className={s.hospitalInfo}>
                    <span className={s.hospitalName}>{h.name}</span>
                    <span className={s.hospitalAddress}>{h.address ?? '주소 정보 없음'}</span>
                  </span>
                  {(() => {
                    const count = pharmacyCountByHospital.get(h.id) ?? 0;
                    return count === 0 ? (
                      <span className={s.pharmacyCountEmpty}>없음</span>
                    ) : (
                      <span className={s.pharmacyCount}>{count}곳</span>
                    );
                  })()}
                </Button>
              ))}
            </div>
          </div>
        </CardWrapper>

        <CardWrapper
          fill
          title="문전약국"
          padding={0}
          footer={
            selectedHospitalId ? (
              <Button
                variant="secondary"
                size="small"
                onClick={() => {}}
                aria-label="문전약국 추가"
              >
                <Plus size={18} aria-hidden />
              </Button>
            ) : undefined
          }
        >
          <div className={s.pharmacyContent}>
            {!selectedHospitalId ? (
              <div className={s.pharmacyEmpty}>
                <p style={{ margin: 0 }}>좌측에서 병원을 선택해주세요.</p>
              </div>
            ) : selectedPharmacies.length === 0 ? (
              <div className={s.pharmacyEmpty}>
                <p style={{ margin: 0 }}>매핑된 문전약국이 없습니다.</p>
              </div>
            ) : (
              <ul className={s.pharmacyList}>
                {selectedPharmacies.map((p) => (
                  <li
                    key={p.id}
                    className={s.pharmacyItem}
                    role="button"
                    tabIndex={0}
                    onClick={() => p.lat != null && p.lng != null && setFocusedPharmacyId(p.id)}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      p.lat != null &&
                      p.lng != null &&
                      setFocusedPharmacyId(p.id)
                    }
                  >
                    <span className={s.pharmacyItemName}>{p.name}</span>
                    {p.address && <span className={s.pharmacyItemAddr}>{p.address}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardWrapper>

        <CardWrapper className={s.mapPanelLayout} padding={0} fill>
          <div className={s.mapPanel}>
            <KakaoMap
              markers={mapMarkers}
              focusedMarkerId={focusedPharmacyId}
              focusedMarkerZoomLevel={3}
              onMarkerClick={(id) => setFocusedPharmacyId(id)}
              height="100%"
            />
          </div>
        </CardWrapper>
      </div>
    </div>
  );
}
