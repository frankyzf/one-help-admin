import React from 'react';
import { getAuthority } from '@/utils/authority';

function Auth(props) {
  const { group = [], children } = props;
  const auths = getAuthority();
  if (auths.some((auth) => group.includes(auth))) {
    return <>{children}</>;
  }
  return null;
}

Auth.get = (children, group = [], noAuth = null) => {
  const auths = getAuthority();
  if (auths.some((auth) => group.includes(auth))) {
    return children;
  }
  return noAuth;
};

export default Auth;
