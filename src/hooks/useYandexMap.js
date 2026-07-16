import { useRef, useEffect } from 'react';
import { ASTANA_CENTER } from '../config/constants';
import mapCarSmall from '../assets/icons/mapCarSmall.svg';
import mapCarBig   from '../assets/icons/mapCarBig.svg';

export function useYandexMap({ companies, selected, onSelect }) {
  const mapRef     = useRef(null);
  const ymapRef    = useRef(null);
  const markersRef = useRef([]);

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
      mark.events.add('click', () => onSelect(company));
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

  return { mapRef };
}
