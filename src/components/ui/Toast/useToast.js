import { useState } from 'react';

export function useToast(duration = 3000) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  };

  return { visible, message, showToast };
}
