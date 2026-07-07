import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Queue.module.css';
import { Button } from '../../components/ui';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../config/routes.config';
import blueCar     from '../../assets/icons/blueCar.svg';
import yellowCar   from '../../assets/icons/yellowCar.svg';
import redCar      from '../../assets/icons/redCar.svg';
import greenAccess from '../../assets/icons/greenAccess.svg';
import galochka    from '../../assets/icons/galochka.svg';

const BASE_URL = 'https://api.services.avtotime.kz';
const MODELS   = ['Toyota Camry', 'Kia Optima', 'BMW 3-Series', 'Mercedes C200', 'Hyundai Sonata', 'Nissan Qashqai'];

const WASHING = [
  { plate: '123 sss 01' }, { plate: '456 abc 02' }, { plate: '789 xyz 03' },
  { plate: '012 def 04' }, { plate: '345 ghi 05' }, { plate: '678 jkl 06' },
];
const WAITING = [
  { plate: '123 sss 01' }, { plate: '456 abc 02' }, { plate: '789 xyz 03' },
  { plate: '012 def 04' }, { plate: '345 ghi 05' }, { plate: '678 jkl 06' },
];
const ONLINE = Array(6).fill({ time: '18:00' });

const getPrice = (a) => {
  const body = a.car_bodies?.[0];
  if (body) return body.action_price ?? body.price ?? 0;
  return a.payable_value ?? 0;
};
const getOldPrice = (a) => {
  const body = a.car_bodies?.[0];
  if (body?.action_price != null) return body.price;
  return null;
};

export default function Queue() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { company } = location.state || {};

  const [step, setStep]   = useState(1);
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');

  const [modelOpen, setModelOpen] = useState(false);
  const [done, setDone]           = useState(false);

  const [offerings,         setOfferings]         = useState([]);
  const [offeringsLoading,  setOfferingsLoading]  = useState(false);
  const [offeringsError,    setOfferingsError]    = useState(null);
  const [selectedOfferings, setSelectedOfferings] = useState([]);
  const [tempIds,           setTempIds]           = useState([]);
  const [servicesModal,     setServicesModal]     = useState(false);

  useEffect(() => {
    if (!company?.id) return;
    setOfferingsLoading(true);
    setOfferingsError(null);
    fetch(`${BASE_URL}/api/v1/partner-offerings/list?partner_id=${company.id}`)
      .then(r => r.json())
      .then(data => setOfferings(data.data || []))
      .catch(() => setOfferingsError('Не удалось загрузить услуги'))
      .finally(() => setOfferingsLoading(false));
  }, [company?.id]);

  const handlePhone = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (!digits) { setPhone(''); return; }
    let d = digits.startsWith('8') || digits.startsWith('7') ? digits.slice(1) : digits;
    let r = '+7';
    if (d.length > 0) r += ' ' + d.slice(0, 3);
    if (d.length >= 3) r += ' ' + d.slice(3, 6);
    if (d.length >= 6) r += ' ' + d.slice(6, 8);
    if (d.length >= 8) r += ' ' + d.slice(8, 10);
    setPhone(r);
  };

  const openServicesModal = () => {
    setTempIds(selectedOfferings.map(o => o.id));
    setServicesModal(true);
  };

  const toggleTemp = (id) =>
    setTempIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const confirmServices = () => {
    setSelectedOfferings(offerings.filter(o => tempIds.includes(o.id)));
    setServicesModal(false);
  };

  const canContinue = {
    1: phone.replace(/\D/g, '').length >= 11,
    2: !!model,
    3: plate.trim().length >= 3,
    4: selectedOfferings.length > 0,
  };

  const next = () => step < 4 ? setStep(s => s + 1) : setDone(true);

  const servicesLabel = selectedOfferings.length
    ? selectedOfferings.map(o => o.name).join(' • ')
    : 'Услуги';

  if (done) return (
    <div className={styles.successPage}>
      <img src={greenAccess} alt="" className={styles.successIco} />
      <h2 className={styles.successTitle}>Вы записались</h2>
      <div className={styles.queueNumCard}>
        <p className={styles.queueNumLabel}>Ваш номер в очереди</p>
        <p className={styles.queueNum}>№ 7</p>
      </div>
      <div className={styles.successBtns}>
        <Button fullWidth className={styles.successBtnGray} onClick={() => navigate(ROUTES.services)}>В автосервисы</Button>
        <Button fullWidth onClick={() => navigate(ROUTES.profile)}>В мои записи</Button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>‹ назад</button>
      <h1 className={styles.pageTitle}>Становление в очередь</h1>

      <div className={styles.layout}>

        <div className={styles.formCol}>

          <div className={styles.stepRow}>
            <div className={styles.stepLeft}>
              <div className={`${styles.stepCircle} ${step > 1 ? styles.stepCircleActive : step === 1 ? styles.stepCircleCurrent : ''}`}>1</div>
              <p className={styles.stepLabel}>Номер<br />телефона</p>
            </div>
            <div className={styles.stepRight}>
              <input
                className={`${styles.fieldInput} ${step < 1 ? styles.fieldDisabled : ''}`}
                value={phone}
                onChange={handlePhone}
                placeholder="Номер телефона"
                disabled={step !== 1}
              />
              {step === 1 && (
                <Button fullWidth disabled={!canContinue[1]} onClick={next}>Продолжить</Button>
              )}
            </div>
          </div>

          <div className={styles.stepRow}>
            <div className={styles.stepLeft}>
              <div className={`${styles.stepCircle} ${step > 2 ? styles.stepCircleActive : step === 2 ? styles.stepCircleCurrent : ''}`}>2</div>
              <p className={styles.stepLabel}>Марка,<br />модель</p>
            </div>
            <div className={styles.stepRight}>
              <div className={styles.fieldWrap}>
                <button
                  className={`${styles.selectorBtn} ${step < 2 ? styles.selectorDisabled : ''}`}
                  disabled={step < 2}
                  onClick={() => step >= 2 && setModelOpen(o => !o)}>
                  <span className={model ? '' : styles.placeholder}>{model || 'Марка, модель'}</span>
                  <span className={styles.arrow}>›</span>
                </button>
                {modelOpen && step >= 2 && (
                  <div className={styles.dropdown}>
                    {MODELS.map(m => (
                      <button key={m} className={`${styles.dropItem} ${model === m ? styles.dropItemActive : ''}`}
                        onClick={() => { setModel(m); setModelOpen(false); }}>
                        {m}
                        {model === m && <span className={styles.tick}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {step === 2 && (
                <Button fullWidth disabled={!canContinue[2]} onClick={next}>Продолжить</Button>
              )}
            </div>
          </div>

          <div className={styles.stepRow}>
            <div className={styles.stepLeft}>
              <div className={`${styles.stepCircle} ${step > 3 ? styles.stepCircleActive : step === 3 ? styles.stepCircleCurrent : ''}`}>3</div>
              <p className={styles.stepLabel}>Гос<br />номер</p>
            </div>
            <div className={styles.stepRight}>
              <input
                className={`${styles.fieldInput} ${step < 3 ? styles.fieldDisabled : ''}`}
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                placeholder="Гос номер"
                disabled={step < 3}
              />
              {step === 3 && (
                <Button fullWidth disabled={!canContinue[3]} onClick={next}>Продолжить</Button>
              )}
            </div>
          </div>

          <div className={styles.stepRow}>
            <div className={styles.stepLeft}>
              <div className={`${styles.stepCircle} ${step > 4 ? styles.stepCircleActive : step === 4 ? styles.stepCircleCurrent : ''}`}>4</div>
              <p className={styles.stepLabel}>Услуги</p>
            </div>
            <div className={styles.stepRight}>
              <button
                className={`${styles.selectorBtn} ${step < 4 ? styles.selectorDisabled : ''}`}
                disabled={step < 4}
                onClick={() => step >= 4 && openServicesModal()}>
                <span className={`${styles.servicesTxt} ${selectedOfferings.length ? '' : styles.placeholder}`}>
                  {servicesLabel}
                </span>
                <span className={styles.arrow}>›</span>
              </button>
              {step === 4 && (
                <Button fullWidth disabled={!canContinue[4]} onClick={next}>Продолжить</Button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.queueCol}>
          <div className={styles.queueTopRow}>
            <div className={styles.queueCard}>
              <p className={styles.queueCardTitle}>В процессе мойки: <span className={styles.queueCount}>6 машин</span></p>
              <div className={`${styles.carGrid} ${styles.carGrid4}`}>
                {WASHING.map((car, i) => (
                  <div key={i} className={styles.carItem}>
                    <p className={styles.carPlate}>{car.plate}</p>
                    <img src={blueCar} alt="" className={styles.carImg} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.queueCard}>
              <p className={styles.queueCardTitle}>В очереди ожидают: <span className={styles.queueCount}>6 машин</span></p>
              <div className={`${styles.carGrid} ${styles.carGrid3}`}>
                {WAITING.map((car, i) => (
                  <div key={i} className={styles.carItem}>
                    <p className={styles.carPlate}>{car.plate}</p>
                    <img src={yellowCar} alt="" className={styles.carImg} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.queueCardOnline}>
            <p className={styles.queueCardTitle}>Онлайн запись: <span className={styles.queueCount}>6 машин</span></p>
            <div className={`${styles.carGrid} ${styles.carGrid3}`}>
              {ONLINE.map((car, i) => (
                <div key={i} className={styles.carItem}>
                  <p className={styles.carTime}>{car.time}</p>
                  <img src={redCar} alt="" className={styles.carImg} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {servicesModal && (
        <div className={styles.modalOverlay} onClick={() => setServicesModal(false)}>
          <div className={styles.serviceModal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.serviceModalTitle}>Услуги</h2>

            <div className={styles.serviceModalList}>
              {offeringsLoading ? (
                <p className={styles.serviceModalEmpty}>Загрузка...</p>
              ) : offeringsError ? (
                <p className={styles.serviceModalEmpty}>{offeringsError}</p>
              ) : offerings.length === 0 ? (
                <p className={styles.serviceModalEmpty}>Нет доступных услуг</p>
              ) : offerings.map(a => {
                const price    = getPrice(a);
                const oldPrice = getOldPrice(a);
                const selected = tempIds.includes(a.id);
                return (
                  <div key={a.id} className={styles.serviceItem} onClick={() => toggleTemp(a.id)}>
                    <div className={styles.serviceItemInfo}>
                      <p className={styles.serviceItemName}>{a.name}</p>
                      <div className={styles.serviceItemPrices}>
                        <span className={styles.serviceItemPrice}>{formatCurrency(price)}</span>
                        {oldPrice && <span className={styles.serviceItemOld}>{oldPrice.toLocaleString('ru-RU')} тг</span>}
                      </div>
                    </div>
                    <div className={`${styles.serviceCheckbox} ${selected ? styles.serviceCheckboxActive : ''}`}>
                      {selected && <img src={galochka} alt="" className={styles.serviceCheckMark} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.serviceModalBtns}>
              <Button className={styles.serviceModalBack} onClick={() => setServicesModal(false)}>Назад</Button>
              <Button className={styles.serviceModalAdd} disabled={tempIds.length === 0} onClick={confirmServices}>
                Добавить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
