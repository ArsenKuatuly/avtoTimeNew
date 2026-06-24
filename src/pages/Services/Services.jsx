import React, { useState, useEffect, useRef } from 'react';
import styles from './Services.module.css';
import { formatCurrency } from '../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import yellowStar  from '../../assets/icons/yellowStar.svg';
import mestoIco    from '../../assets/icons/mesto.png';
import searchIco   from '../../assets/icons/iconSearch.png';
import mapCarSmall    from '../../assets/icons/mapCarSmall.svg';
import mapCarBig      from '../../assets/icons/mapCarBig.svg';
import whiteGalochka  from '../../assets/icons/whiteGalochka.svg';
import mapIcon        from '../../assets/icons/mapIcon.svg';
import blueMapIcon    from '../../assets/icons/blueMapIcon.svg';

const BASE_URL      = 'https://api.services.avtotime.kz';
const SERVICE_TYPES = [
  { code: 'carwash',  label: 'Автомойки'   },
  { code: 'oilchange', label: 'Замена масла' },
];
const ASTANA_CENTER = [51.1801, 71.4460];
const BODY_TYPES = [
  { code: 'sedan',     label: 'Седан'     },
  { code: 'hatchback', label: 'Хэтчбек'  },
  { code: 'crossover', label: 'Кроссовер' },
];

export default function Services() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [serviceType, setServiceType]   = useState('carwash');
  const [companies, setCompanies]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterOpen, setFilterOpen]   = useState(false);
  const [minRating, setMinRating]     = useState(null);
  const [ratingDropOpen, setRatingDropOpen] = useState(false);
  const ratingRef = useRef(null);
  const [mobileView, setMobileView]   = useState('list');
  const [slidesMap, setSlidesMap]     = useState({});
  const [selected, setSelected]         = useState(null);
  const [tab, setTab]                   = useState('services');
  const [actions, setActions]           = useState([]);
  const [reviews, setReviews]           = useState([]);
  const [checkedActions, setCheckedActions] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [imgIndex, setImgIndex]           = useState(0);
  const [reviewsTotal, setReviewsTotal]   = useState(0);

  const [carSheet, setCarSheet]           = useState(false);
  const [carSheetView, setCarSheetView]   = useState('list');
  const [localCars, setLocalCars]         = useState([]);
  const [activeCar, setActiveCar]         = useState(null);
  const [newBody, setNewBody]             = useState('sedan');
  const [newBrand, setNewBrand]           = useState('');
  const [newModel, setNewModel]           = useState('');
  const [newPlate, setNewPlate]           = useState('');

  const mapRef   = useRef(null);
  const ymapRef  = useRef(null);
  const markersRef = useRef([]);


  useEffect(() => {
    document.body.style.overflow = mobileView === 'list' ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [mobileView]);

  useEffect(() => {
    const handler = (e) => {
      if (ratingRef.current && !ratingRef.current.contains(e.target)) {
        setRatingDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/v1/partners/list?with_profile=true&per_page=100&city_id=1&id_sort=true`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || []);
        const filtered = serviceType === 'carwash'
          ? list.filter(c => c.type?.code === 'carwash')
          : list.filter(c => c.type?.code !== 'carwash');
        setCompanies(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('companies error:', err);
        setLoading(false);
      });
  }, [serviceType]);


  useEffect(() => {
    if (!selected) return;
    setDetailLoading(true);
    setActions([]);
    setReviews([]);
    setReviewsTotal(0);
    setCheckedActions([]);
    setTab('services');
    setImgIndex(0);

    Promise.all([
      fetch(`${BASE_URL}/api/v1/partner-offerings/list?partner_id=${selected.id}`)
        .then(r => r.json()),
      fetch(`${BASE_URL}/api/v1/partners/${selected.id}/reviews?page=1&per_page=15`)
        .then(r => r.json()).catch(() => ({ data: { reviews: [] } })),
    ]).then(([actData, revData]) => {
      const acts = actData.data || [];
      const revs = revData.data?.reviews || [];
      setReviewsTotal(revData.data?.total || 0);
      setActions(acts);
      setReviews(revs);
      setDetailLoading(false);
    }).catch(() => setDetailLoading(false));
  }, [selected]);


  useEffect(() => {
    if (!mapRef.current) return;
    const tryInit = () => {
      if (!window.ymaps) return;
      window.ymaps.ready(() => {
        if (ymapRef.current) return;
        ymapRef.current = new window.ymaps.Map(mapRef.current, {
          center: ASTANA_CENTER,
          zoom: 13,
          controls: ['zoomControl'],
        });
      });
    };
    if (window.ymaps) tryInit();
    else {
      const interval = setInterval(() => {
        if (window.ymaps) { tryInit(); clearInterval(interval); }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);


  useEffect(() => {
    if (!ymapRef.current || !companies.length) return;
    markersRef.current.forEach(m => ymapRef.current.geoObjects.remove(m));
    markersRef.current = [];

    companies.forEach(company => {
      const lat = parseFloat(company.profile?.latitude  ?? company.lat ?? company.latitude);
      const lng = parseFloat(company.profile?.longitude ?? company.lng ?? company.longitude);
      if (!lat || !lng) return;

      const isSelected = selected?.id === company.id;
      const ico  = window.location.origin + (isSelected ? mapCarBig : mapCarSmall);
      const size = isSelected ? [56, 56] : [40, 40];
      const off  = isSelected ? [-28, -28] : [-20, -20];

      const mark = new window.ymaps.Placemark(
        [lat, lng],
        {},
        {
          iconLayout: 'default#image',
          iconImageHref: ico,
          iconImageSize: size,
          iconImageOffset: off,
        }
      );
      mark.events.add('click', () => setSelected(company));
      ymapRef.current.geoObjects.add(mark);
      markersRef.current.push(mark);
    });
  }, [companies, selected]);


  useEffect(() => {
    if (!ymapRef.current || !selected) return;
    const lat = parseFloat(selected.profile?.latitude  ?? selected.lat ?? selected.latitude);
    const lng = parseFloat(selected.profile?.longitude ?? selected.lng ?? selected.longitude);
    if (!lat || !lng) return;

    const zoom = 15;
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      ymapRef.current.setCenter([lat, lng], zoom, { duration: 400 });
    } else {
      const lngPerPixel = 360 / (256 * Math.pow(2, zoom));
      const lngOffset = 380 * lngPerPixel;
      ymapRef.current.setCenter([lat, lng - lngOffset], zoom, { duration: 400 });
    }
  }, [selected]);

  const handleAddCar = () => {
    if (!newBrand.trim() || !newModel.trim() || !newPlate.trim()) return;
    const car = { body: newBody, brand: newBrand.trim(), model: newModel.trim(), plate: newPlate.trim() };
    setLocalCars(prev => [...prev, car]);
    setActiveCar(car);
    setNewBrand(''); setNewModel(''); setNewPlate(''); setNewBody('sedan');
    setCarSheet(false);
  };

  const openCarSheet = () => {
    if (window.innerWidth > 1024) return;
    setCarSheetView('list');
    setCarSheet(true);
  };

  const toggleAction = (id) => {
    setCheckedActions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toAbsUrl   = s => !s ? null : s.startsWith('http') ? s : `${BASE_URL}${s}`;
  const getImages  = c => {
    const fromArr = (c.images || []).map(i => toAbsUrl(i?.url || i?.path)).filter(Boolean);
    if (fromArr.length) return fromArr;
    const fb = toAbsUrl(c.image_url || c.photo || c.cover_image);
    return fb ? [fb] : [];
  };
  const getImage   = c => getImages(c)[0] || null;
  const getSlide   = id => slidesMap[id] || 0;
  const setSlide   = (id, idx, e) => { e.stopPropagation(); setSlidesMap(m => ({ ...m, [id]: idx })); };
  const getRating  = c => c.rating || 0;
  const getCount   = c => c.reviews_count || 0;
  const getAddress = c => c.address || '';
  const getType    = c => c.type?.name || 'Автомойка';
  const getDesc    = c => c.profile?.description || c.description || '';
  const getActName = a => a.name || '';

  const getPrice = (a) => {
    const userBodyId = user?.body_id;
    const body = userBodyId ? a.car_bodies?.find(b => b.body_id === userBodyId) : a.car_bodies?.[0];
    if (body) return body.action_price ?? body.price ?? 0;
    return a.payable_value ?? 0;
  };

  const getOldPrice = (a) => {
    const userBodyId = user?.body_id;
    const body = userBodyId ? a.car_bodies?.find(b => b.body_id === userBodyId) : a.car_bodies?.[0];
    if (body?.action_price != null) return body.price;
    return null;
  };

  const RATING_OPTIONS = [3, 3.5, 4, 4.9];

  const filtered = companies.filter(c => {
    if (!(c.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (filterOpen && !getRating(c)) return false;
    if (minRating !== null && getRating(c) < minRating) return false;
    return true;
  });

  return (
    <div className={`${styles.page} ${mobileView === 'list' ? styles.pageList : ''}`}>
      <div ref={mapRef} className={`${styles.map} ${mobileView === 'list' ? styles.mapHidden : ''}`} />

      <div className={styles.mobileTop}>
        <div className={styles.mobileTypeRow}>
          {SERVICE_TYPES.map(t => (
            <button key={t.code}
              className={`${styles.mobileTypeBtn} ${serviceType === t.code ? styles.mobileTypeBtnActive : ''}`}
              onClick={() => setServiceType(t.code)}
            >{t.label}</button>
          ))}
          <button className={styles.mobileViewToggle} onClick={() => setMobileView(v => v === 'map' ? 'list' : 'map')}>
            <img src={mobileView === 'map' ? blueMapIcon : mapIcon} alt="" style={{width:32,height:32,objectFit:'contain'}} />
          </button>
        </div>
        <div className={styles.mobileFilterRow}>
          <button className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ''}`}
            onClick={() => setFilterOpen(v => !v)}>
            Открыто
            {filterOpen && <span className={styles.filterX} onClick={e => { e.stopPropagation(); setFilterOpen(false); }}>×</span>}
          </button>
          <div className={styles.ratingWrap} ref={ratingRef}>
            <button className={`${styles.filterBtn} ${minRating !== null ? styles.filterBtnActive : ''}`}
              onClick={() => setRatingDropOpen(v => !v)}>
              {minRating !== null ? `Рейтинг от ${minRating}` : 'Рейтинг'}
              {minRating !== null
                ? <span className={styles.filterX} onClick={e => { e.stopPropagation(); setMinRating(null); setRatingDropOpen(false); }}>×</span>
                : <span style={{marginLeft:2}}>›</span>}
            </button>
            {ratingDropOpen && (
              <div className={styles.ratingDrop}>
                {RATING_OPTIONS.map(r => (
                  <button key={r} className={`${styles.ratingOption} ${minRating === r ? styles.ratingOptionActive : ''}`}
                    onClick={() => { setMinRating(r); setRatingDropOpen(false); }}>
                    <span className={styles.ratingStar}>★</span> От {r}
                    {minRating === r && <span className={styles.ratingCheck}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileView === 'list' && (
        <div className={styles.mobileList}>
          {filtered.map(c => {
            const imgs  = getImages(c);
            const slide = getSlide(c.id);
            return (
              <div key={c.id} className={styles.mobileListCard} onClick={() => { setSelected(c); setMobileView('map'); }}>
                <div className={styles.mlImgWrap}>
                  {imgs.length > 0 ? (
                    <>
                      <img src={imgs[slide]} alt={c.name} className={styles.mlImg} />
                      {imgs.length > 1 && (
                        <div className={styles.mlDots}>
                          {imgs.map((_, i) => (
                            <span
                              key={i}
                              className={`${styles.mlDot} ${i === slide ? styles.mlDotActive : ''}`}
                              onClick={e => setSlide(c.id, i, e)}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.mlImgPlaceholder}>{c.name}</div>
                  )}
                </div>
                <div className={styles.mlInfo}>
                  <p className={styles.mlName}>{c.name}</p>
                  <p className={styles.mlType}>Автомойка</p>
                  <div className={styles.mlBottom}>
                    <div className={styles.mlAddr}>
                      <img src={mestoIco} alt="" className={styles.mlAddrIco} />
                      <span className={styles.mlAddrText}>{getAddress(c)}</span>
                    </div>
                    <div className={styles.mlRating}>
                      <img src={yellowStar} alt="" className={styles.mlStar} />
                      <span className={styles.mlRatingText}>{getRating(c)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && mobileView === 'map' && !window.matchMedia('(min-width:1025px)').matches && (
        <div className={styles.mobileBottomCard} onClick={() => setMobileView('detail')}>
          <img src={getImage(selected)} alt={selected.name} className={styles.mobileBottomImg} />
          <div className={styles.mobileBottomInfo}>
            <p className={styles.cardName}>{selected.name}</p>
            <p className={styles.cardType}>Автомойка</p>
            <div className={styles.cardAddrRow}>
              <img src={mestoIco} alt="" className={styles.cardAddrIco} />
              <span className={styles.cardAddr}>{getAddress(selected)}</span>
            </div>
          </div>
          <div className={styles.mobileBottomRight}>
            <img src={yellowStar} alt="" className={styles.cardStar} />
            <span className={styles.cardRating}>{getRating(selected)}</span>
            <button className={styles.mobileBottomClose} onClick={e => { e.stopPropagation(); setSelected(null); }}>✕</button>
          </div>
        </div>
      )}

      <aside className={styles.sidebar}>
        <div className={styles.searchRow}>
          <img src={searchIco} alt="" className={styles.searchIco} />
          <input
            className={styles.searchInput}
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.typeRow}>
          {SERVICE_TYPES.map(t => (
            <button
              key={t.code}
              className={`${styles.typeBtn} ${serviceType === t.code ? styles.typeBtnActive : ''}`}
              onClick={() => setServiceType(t.code)}
            >{t.label}</button>
          ))}
        </div>

        <div className={styles.filterRow}>
          <button
            className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ''}`}
            onClick={() => setFilterOpen(v => !v)}
          >
            Открыто
            {filterOpen && (
              <span className={styles.filterX}
                onClick={e => { e.stopPropagation(); setFilterOpen(false); }}>×</span>
            )}
          </button>

          <div className={styles.ratingWrap} ref={ratingRef}>
            <button
              className={`${styles.filterBtn} ${minRating !== null ? styles.filterBtnActive : ''}`}
              onClick={() => setRatingDropOpen(v => !v)}
            >
              {minRating !== null ? `Рейтинг от ${minRating}` : 'Рейтинг'}
              {minRating !== null
                ? <span className={styles.filterX}
                    onClick={e => { e.stopPropagation(); setMinRating(null); setRatingDropOpen(false); }}>×</span>
                : <span style={{marginLeft:2}}>›</span>
              }
            </button>
            {ratingDropOpen && (
              <div className={styles.ratingDrop}>
                {RATING_OPTIONS.map(r => (
                  <button key={r} className={`${styles.ratingOption} ${minRating === r ? styles.ratingOptionActive : ''}`}
                    onClick={() => { setMinRating(r); setRatingDropOpen(false); }}>
                    <span className={styles.ratingStar}>★</span>
                    От {r}
                    {minRating === r && <span className={styles.ratingCheck}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.list}>
          {loading ? (
            <p className={styles.listEmpty}>Загрузка...</p>
          ) : filtered.length === 0 ? (
            <p className={styles.listEmpty}>Ничего не найдено</p>
          ) : filtered.map(c => (
            <div
              key={c.id}
              className={`${styles.card} ${selected?.id === c.id ? styles.cardActive : ''}`}
              onClick={() => setSelected(c)}
            >
              <img
                src={getImage(c)}
                alt={c.name}
                className={styles.cardImg}
              />
              <div className={styles.cardInfo}>
                <p className={styles.cardName}>{c.name}</p>
                <p className={styles.cardType}>Автомойка</p>
                <div className={styles.cardRatingRow}>
                  <img src={yellowStar} alt="" className={styles.cardStar} />
                  <span className={styles.cardRating}>{getRating(c)}</span>
                  {getCount(c) > 0 && <span className={styles.cardCount}>{getCount(c)} оценок</span>}
                </div>
                <div className={styles.cardAddrRow}>
                  <img src={mestoIco} alt="" className={styles.cardAddrIco} />
                  <span className={styles.cardAddr}>{getAddress(c)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {selected && (
          <div className={`${styles.detail} ${mobileView === 'detail' ? styles.detailMobileOpen : ''}`}>
            <button className={styles.detailClose} onClick={() => { setSelected(null); setMobileView('map'); }}>✕</button>

            {(() => {
              const imgs = selected.images?.length
                ? selected.images.map(i => i.url || i.path || i)
                : [getImage(selected) || null];
              const total = imgs.length;
              const src = imgs[imgIndex] || null;
              return (
                <div className={styles.detailImgWrap}>
                  {src
                    ? <img src={src} alt={selected.name} className={styles.detailImg} />
                    : <div className={styles.detailImgPlaceholder}>{selected.name}</div>}
                  {total > 1 && (
                    <>
                      <button className={styles.sliderPrev} onClick={() => setImgIndex(i => (i - 1 + total) % total)}>‹</button>
                      <button className={styles.sliderNext} onClick={() => setImgIndex(i => (i + 1) % total)}>›</button>
                    </>
                  )}
                </div>
              );
            })()}

            <div className={styles.detailBody}>
              <h2 className={styles.detailName}>{selected.name}</h2>
              <p className={styles.detailType}>{getType(selected)}</p>

              <div className={styles.detailMeta}>
                <div className={styles.detailRatingRow}>
                  <img src={yellowStar} alt="" className={styles.detailStar} />
                  <span className={styles.detailRating}>{getRating(selected)}</span>
                  {(reviewsTotal > 0 || reviews.length > 0) && (
                    <span className={styles.detailCount}>{reviewsTotal || reviews.length} оценок</span>
                  )}
                </div>
                {selected.distance && (
                  <span className={styles.detailDist}>🚗 {selected.distance}</span>
                )}
              </div>

              <p className={styles.detailDescLabel}>Краткое описание</p>
              {getDesc(selected) && <p className={styles.detailDesc}>{getDesc(selected)}</p>}

              <div className={styles.tabs}>
                {['services', 'details', 'reviews'].map(t => (
                  <button
                    key={t}
                    className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                    onClick={() => setTab(t)}
                  >
                    {{ services: 'Услуги', details: 'Детали', reviews: 'Отзывы' }[t]}
                  </button>
                ))}
              </div>

              {tab === 'services' && (
                <div className={styles.servicesSection}>
                  <button className={styles.carSelector} onClick={openCarSheet}>
                    <div>
                      <p className={styles.carSelectorLabel}>Мое авто</p>
                      <p className={styles.carSelectorVal}>
                        {activeCar
                          ? `${activeCar.brand} ${activeCar.model} / ${activeCar.plate}`
                          : user?.car ? `${user.car.model}/${user.car.plate}/${user.car.body}` : 'Выберите авто'}
                      </p>
                    </div>
                    <span className={styles.carSelectorArrow}>›</span>
                  </button>

                  <p className={styles.actionsTitle}>Услуги</p>

                  {detailLoading ? (
                    <p className={styles.listEmpty}>Загрузка...</p>
                  ) : actions.length === 0 ? (
                    <p className={styles.listEmpty}>Нет доступных услуг</p>
                  ) : (
                    <div className={styles.actionsList}>
                      {actions.map(a => (
                        <div key={a.id} className={styles.actionCard}>
                          <div className={styles.actionInfo}>
                            <p className={styles.actionName}>{getActName(a)}</p>
                            <div className={styles.actionPriceRow}>
                              <span className={styles.actionPrice}>{formatCurrency(getPrice(a))}</span>
                              {getOldPrice(a) && (
                                <span className={styles.actionOldPrice}>{getOldPrice(a).toLocaleString('ru-RU')} тг</span>
                              )}
                            </div>
                          </div>
                          <div
                            className={`${styles.actionCheck} ${checkedActions.includes(a.id) ? styles.actionCheckOn : ''}`}
                            onClick={() => toggleAction(a.id)}
                          >
                            {checkedActions.includes(a.id) && <img src={whiteGalochka} alt="" className={styles.actionCheckMark} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'details' && (
                <div className={styles.detailsTab}>

                  <div className={styles.detailSection}>
                    <p className={styles.detailSectionTitle}>График работы</p>
                    {selected.open_time && selected.close_time ? (
                      <>
                        <div className={styles.scheduleRow}>
                          <span className={styles.scheduleDay}>Пн-Пт</span>
                          <span className={styles.scheduleTime}>
                            {selected.open_time.slice(0,5)} - {selected.close_time.slice(0,5)}
                          </span>
                        </div>
                        <div className={styles.scheduleRow}>
                          <span className={styles.scheduleDay}>Сб, Вс</span>
                          <span className={styles.scheduleTime}>
                            {selected.open_time.slice(0,5)} - {selected.close_time.slice(0,5)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className={styles.scheduleEmpty}>Не указано</p>
                    )}
                  </div>

                  {selected.conveniences?.length > 0 && (
                    <div className={styles.detailSection}>
                      <p className={styles.detailSectionTitle}>Удобства</p>
                      <div className={styles.conveniencesList}>
                        {selected.conveniences.map(c => (
                          <span key={c.id} className={styles.convenienceChip}>{c.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {tab === 'reviews' && (
                <div className={styles.reviewsTab}>
                  {(() => {
                    const avg  = getRating(selected);
                    const total = reviewsTotal || reviews.length;
                    const dist  = [5,4,3,2,1].map(star => ({
                      star,
                      count: reviews.filter(r => Math.round(r.rating || r.rate || 0) === star).length
                    }));
                    const maxCount = Math.max(...dist.map(d => d.count), 1);
                    return (
                      <div className={styles.ratingBlock}>
                        <div className={styles.ratingLeft}>
                          <p className={styles.ratingBig}>{avg ? Number(avg).toFixed(1) : '—'}</p>
                          <div className={styles.ratingStarsRow}>
                            {[1,2,3,4,5].map(s => (
                              <img key={s} src={yellowStar} alt="" className={styles.ratingStarIco}
                                style={{ opacity: s <= Math.round(avg) ? 1 : 0.25 }} />
                            ))}
                          </div>
                          <p className={styles.ratingTotal}>{total} оценок</p>
                        </div>
                        <div className={styles.ratingBars}>
                          {dist.map(d => (
                            <div key={d.star} className={styles.ratingBarRow}>
                              <img src={yellowStar} alt="" className={styles.ratingBarStar} />
                              <span className={styles.ratingBarNum}>{d.star}</span>
                              <div className={styles.ratingBarTrack}>
                                <div className={styles.ratingBarFill}
                                  style={{ width: `${(d.count / maxCount) * 100}%` }} />
                              </div>
                              <span className={styles.ratingBarCount}>{d.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {reviews.length === 0 ? (
                    <p className={styles.listEmpty}>Отзывов пока нет</p>
                  ) : reviews.map((r, i) => (
                    <div key={i} className={styles.reviewItem}>
                      <div className={styles.reviewTop}>
                        <span className={styles.reviewAuthor}>{r.author?.name || 'Аноним'}</span>
                        <div className={styles.reviewStarsRow}>
                          {[1,2,3,4,5].map(s => (
                            <img key={s} src={yellowStar} alt="" className={styles.reviewStarIco}
                              style={{ opacity: s <= Math.round(r.rating || r.rate || 0) ? 1 : 0.25 }} />
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewText}>{r.comment || ''}</p>
                      <p className={styles.reviewDate}>{r.created_at?.slice(0,10) || ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.detailFooter}>
              <button className={styles.queueBtn} onClick={() => navigate('/queue', { state: { company: selected } })}>Встать в очередь</button>
              <button
                className={styles.bookBtn}
                disabled={checkedActions.length === 0}
                onClick={() => {
                  const selectedActs = actions.filter(a => checkedActions.includes(a.id));
                  const total = selectedActs.reduce((sum, a) => sum + getPrice(a), 0);
                  navigate('/book', { state: { company: selected, selectedActions: selectedActs, total } });
                }}
              >
                Записаться онлайн
              </button>
            </div>
          </div>
        )}

      {carSheet && (
        <>
          <div className={styles.sheetOverlay} onClick={() => setCarSheet(false)} />
          <div className={styles.sheet}>
            {carSheetView === 'list' ? (
              <>
                <h2 className={styles.sheetTitle}>Мое авто</h2>
                {localCars.length === 0 ? (
                  <p className={styles.sheetEmpty}>Добавленных авто еще нет</p>
                ) : (
                  <div className={styles.sheetCarList}>
                    {localCars.map((car, i) => (
                      <button key={i}
                        className={`${styles.sheetCarItem} ${activeCar === car ? styles.sheetCarItemActive : ''}`}
                        onClick={() => { setActiveCar(car); setCarSheet(false); }}>
                        <div>
                          <p className={styles.sheetCarName}>{car.brand} {car.model}</p>
                          <p className={styles.sheetCarSub}>
                            {BODY_TYPES.find(b => b.code === car.body)?.label} · {car.plate}
                          </p>
                        </div>
                        {activeCar === car && <span className={styles.sheetCarCheck}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
                <button className={styles.sheetBtn} onClick={() => setCarSheetView('add')}>
                  Добавить
                </button>
              </>
            ) : (
              <>
                <div className={styles.sheetHead}>
                  <button className={styles.sheetBack} onClick={() => setCarSheetView('list')}>‹</button>
                  <h2 className={styles.sheetTitle}>Добавление авто</h2>
                </div>

                <p className={styles.sheetSectionLabel}>Тип кузова</p>
                <div className={styles.bodyChips}>
                  {BODY_TYPES.map(b => (
                    <button key={b.code}
                      className={`${styles.bodyChip} ${newBody === b.code ? styles.bodyChipActive : ''}`}
                      onClick={() => setNewBody(b.code)}>
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className={styles.sheetField}>
                  {newBrand && <span className={styles.sheetFieldLabel}>Марка</span>}
                  <input className={styles.sheetFieldInput} placeholder="Марка"
                    value={newBrand} onChange={e => setNewBrand(e.target.value)} />
                </div>
                <div className={styles.sheetField}>
                  {newModel && <span className={styles.sheetFieldLabel}>Модель</span>}
                  <input className={styles.sheetFieldInput} placeholder="Модель"
                    value={newModel} onChange={e => setNewModel(e.target.value)} />
                </div>
                <div className={styles.sheetField}>
                  {newPlate && <span className={styles.sheetFieldLabel}>Гос номер</span>}
                  <input className={styles.sheetFieldInput} placeholder="Гос номер"
                    value={newPlate} onChange={e => setNewPlate(e.target.value)} />
                </div>

                <button className={styles.sheetBtn}
                  disabled={!newBrand.trim() || !newModel.trim() || !newPlate.trim()}
                  onClick={handleAddCar}>
                  Добавить
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
