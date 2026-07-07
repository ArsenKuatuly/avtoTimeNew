export const ROUTES = {
  home: '/',
  services: '/services',
  partners: '/partners',
  profile: '/profile',
  bookingDetail: '/booking/:id',
  book: '/book',
  queue: '/queue',
};

export const bookingDetailPath = (id) => `/booking/${id}`;
