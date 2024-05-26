import {
  cdnBaseUrl,
  downloadsBaseUrl,
  cdnBaseUrlCloud,
  downloadsBaseUrlCloud,
  mAppBaseUrl,
} from '@/config/env';
import { isCloudPage } from '@/utils/cloud';

function getStaticUrl(str) {
  if (/^https?/.test(str)) return str;
  const baseURL = isCloudPage() && cdnBaseUrlCloud ? cdnBaseUrlCloud : cdnBaseUrl;
  return new URL(str, baseURL).toString();
}
window.getStaticUrl = getStaticUrl;

function getDownloadsUrl(str) {
  if (/^https?/.test(str)) return str;
  const baseURL = isCloudPage() && downloadsBaseUrlCloud ? downloadsBaseUrlCloud : downloadsBaseUrl;
  return new URL(str, baseURL).toString();
}

function getMAppUrl(str) {
  if (/^https?/.test(str)) return str;
  return `${mAppBaseUrl}${str}`;
}

export default getStaticUrl;
export { getDownloadsUrl, getMAppUrl };
