const useCloudApiPages = [
  '/communication',
  '/parking-fee/parking-card-billing',
  '/carpark-management/season-parking-card',
  '/parking-fee/transaction-details',
  '/pdf-export/transaction',
  '/pdf-export/eform',
  '/parking-fee/daily-report',
  '/parking-fee/monthly-report',
  '/carpark-setting/merchant-group',
  '/carpark-setting/parking-coupon',
  '/carpark-setting/merchant-account',
  '/parking-coupon-management',
];

const noUseCloudApiPages = [];

const noUseCloudApi = ['/my-company', '/me', '/admin/models', '/admin/config'];

export function isCloudPage() {
  const { pathname } = window.location;
  return (
    useCloudApiPages.some((path) => pathname.startsWith(path)) &&
    noUseCloudApiPages.every((path) => !pathname.startsWith(path))
  );
}

export function useCloudApi(url) {
  return !noUseCloudApi.includes(url);
}
