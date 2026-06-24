export const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
export const MONTHS_NOM = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
export const DAY_SHORT  = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export const formatDateLabel = (date, time) =>
  `${date.getDate()} ${MONTHS_GEN[date.getMonth()]}, ${time}`;
