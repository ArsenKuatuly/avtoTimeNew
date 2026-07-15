import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const carSchema = yup.object({
  plate: yup.string().trim().required('Введите гос. номер'),
  brandId: yup.string().required('Выберите марку'),
  seriesId: yup.string().required('Выберите модель'),
});

export function useCarForm(defaultValues = {}) {
  return useForm({
    resolver: yupResolver(carSchema),
    defaultValues: { plate: '', brandId: '', seriesId: '', ...defaultValues },
    mode: 'onTouched',
  });
}
