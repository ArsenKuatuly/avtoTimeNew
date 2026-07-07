import { useState, useEffect } from 'react';
import { VehicleService } from '../../services/VehicleService';

export function useCarSelects() {
  const [brands,        setBrands]        = useState([]);
  const [series,        setSeries]        = useState([]);
  const [brandId,       setBrandId]       = useState('');
  const [seriesId,      setSeriesId]      = useState('');
  const [loadingSeries, setLoadingSeries] = useState(false);

  useEffect(() => {
    VehicleService.getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  const onBrandChange = (id) => {
    setBrandId(id);
    setSeriesId('');
    setSeries([]);
    if (!id) return;
    setLoadingSeries(true);
    VehicleService.seriesByBrand(id)
      .then(setSeries)
      .catch(() => setSeries([]))
      .finally(() => setLoadingSeries(false));
  };

  const init = (brandName, seriesName, brandsList = brands) => {
    const brand = brandsList.find(b => b.name === brandName);
    if (!brand) return;
    setBrandId(String(brand.id));
    setLoadingSeries(true);
    VehicleService.seriesByBrand(brand.id)
      .then(list => {
        setSeries(list);
        const found = list.find(s => s.name === seriesName);
        if (found) setSeriesId(String(found.id));
      })
      .catch(() => setSeries([]))
      .finally(() => setLoadingSeries(false));
  };

  const reset = () => {
    setBrandId('');
    setSeriesId('');
    setSeries([]);
  };

  const brandName  = brands.find(b => String(b.id) === brandId)?.name  || '';
  const seriesName = series.find(s => String(s.id) === seriesId)?.name || '';

  return {
    brands, series, brandId, seriesId, loadingSeries,
    brandName, seriesName,
    onBrandChange, onSeriesChange: setSeriesId,
    reset, init,
  };
}
