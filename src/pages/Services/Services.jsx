import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Services.module.css';
import { useAuth } from '../../providers/AuthContext';
import { useYandexMap } from '../../hooks/useYandexMap';
import { useCompanyList } from '../../features/services/useCompanyList';
import { useCompanyDetail } from '../../features/services/useCompanyDetail';
import { useCarSelector, CarSelectorSheets } from '../../features/services/CarSelector/CarSelector';
import MobileTopBar from './components/MobileTopBar';
import CompanyMobileList from './components/CompanyMobileList';
import MobileBottomCard from './components/MobileBottomCard';
import CompanySidebar from './components/CompanySidebar';
import DetailPanel from './components/DetailPanel/DetailPanel';

export default function Services() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [serviceType, setServiceType] = useState('carwash');
  const [mobileView, setMobileView]   = useState('list');

  const list   = useCompanyList(serviceType);
  const detail = useCompanyDetail(user);
  const carSelector = useCarSelector(user);
  const map = useYandexMap({ companies: list.companies, selected: detail.selected, onSelect: detail.setSelected });

  useEffect(() => {
    document.body.style.overflow = mobileView === 'list' ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [mobileView]);

  return (
    <div className={`${styles.page} ${mobileView === 'list' ? styles.pageList : ''}`}>
      <div ref={map.mapRef} className={`${styles.map} ${mobileView === 'list' ? styles.mapHidden : ''}`} />

      <MobileTopBar
        serviceType={serviceType}
        setServiceType={setServiceType}
        mobileView={mobileView}
        setMobileView={setMobileView}
        list={list}
      />

      {mobileView === 'list' && (
        <CompanyMobileList
          list={list}
          onSelect={c => { detail.setSelected(c); setMobileView('map'); }}
        />
      )}

      {detail.selected && mobileView === 'map' && !window.matchMedia('(min-width:1025px)').matches && (
        <MobileBottomCard
          selected={detail.selected}
          onOpenDetail={() => setMobileView('detail')}
          onClose={() => detail.setSelected(null)}
        />
      )}

      <CompanySidebar
        serviceType={serviceType}
        setServiceType={setServiceType}
        list={list}
        selectedId={detail.selected?.id}
        onSelect={detail.setSelected}
      />

      {detail.selected && (
        <DetailPanel
          detail={detail}
          carSelector={carSelector}
          user={user}
          navigate={navigate}
          mobileView={mobileView}
          setMobileView={setMobileView}
        />
      )}

      <CarSelectorSheets selector={carSelector} />
    </div>
  );
}
