/* eslint-disable import/no-mutable-exports */
/**
 * 区分环境配置
 */
import proxy from '../../config/proxy';

let cdnBaseUrl;
let downloadsBaseUrl;
let cdnBaseUrlCloud;
let downloadsBaseUrlCloud;
let mAppBaseUrl;
const { origin } = window.location;
const devTarget = proxy.dev['/api'].target;
const s3Test = 'https://foodbook-dev.s3-ap-southeast-1.amazonaws.com/';
const s3Prod = 'https://autom-cdn.s3.ap-southeast-1.amazonaws.com/';

switch (APP_ENV) {
  case 'dev_local':
    cdnBaseUrl = `${devTarget}/picture/`;
    downloadsBaseUrl = `${devTarget}/`;
    cdnBaseUrlCloud = s3Test;
    downloadsBaseUrlCloud = s3Test;
    mAppBaseUrl = 'https://uat.autom-tech.com/m-app';
    break;
  case 'dev_cloud':
    cdnBaseUrl = s3Test;
    downloadsBaseUrl = s3Test;
    mAppBaseUrl = 'https://uat.autom-tech.com/m-app';
    break;
  case 'uat_local':
    cdnBaseUrl = `${origin}/v1/picture/`;
    downloadsBaseUrl = `${origin}/v1/`;
    cdnBaseUrlCloud = s3Test;
    downloadsBaseUrlCloud = s3Test;
    mAppBaseUrl = 'https://uat.autom-tech.com/m-app';
    break;
  case 'uat_cloud':
    cdnBaseUrl = s3Test;
    downloadsBaseUrl = s3Test;
    mAppBaseUrl = 'https://uat.autom-tech.com/m-app';
    break;
  case 'stage_local':
    cdnBaseUrl = `${origin}/v1/picture/`;
    downloadsBaseUrl = `${origin}/v1/`;
    cdnBaseUrlCloud = s3Test;
    downloadsBaseUrlCloud = s3Test;
    mAppBaseUrl = 'https://stage.autom-tech.com/m-app';
    break;
  case 'stage_cloud':
    cdnBaseUrl = s3Test;
    downloadsBaseUrl = s3Test;
    mAppBaseUrl = 'https://stage.autom-tech.com/m-app';
    break;
  case 'prod_local':
    cdnBaseUrl = `${origin}/v1/picture/`;
    downloadsBaseUrl = `${origin}/v1/`;
    cdnBaseUrlCloud = s3Prod;
    downloadsBaseUrlCloud = s3Prod;
    mAppBaseUrl = 'https://prod.autom-tech.com/m-app';
    break;
  case 'prod_cloud':
    cdnBaseUrl = s3Prod;
    downloadsBaseUrl = s3Prod;
    mAppBaseUrl = 'https://prod.autom-tech.com/m-app';
    break;
  default:
}

const isLocal = APP_ENV.includes('local');
const isCloud = APP_ENV.includes('cloud');
const isDev = APP_ENV.includes('dev');

export {
  cdnBaseUrl,
  cdnBaseUrlCloud,
  isLocal,
  isCloud,
  downloadsBaseUrl,
  downloadsBaseUrlCloud,
  isDev,
  mAppBaseUrl,
};
