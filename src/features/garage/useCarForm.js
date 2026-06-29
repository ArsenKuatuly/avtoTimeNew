import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const carSchema = yup.object({
  make:  yup.string().trim().required('Введите марку'),
  model: yup.string().trim().required('Введите модель'),
  plate: yup.string().trim().required('Введите гос. номер'),
});

export function useCarForm(defaultValues = {}) {
  return useForm({
    resolver: yupResolver(carSchema),
    defaultValues: { make: '', model: '', plate: '', ...defaultValues },
    mode: 'onTouched',
  });
}
