const authRoutes = [];

authRoutes.forEach((item) => {
  if (item.routes) {
    const routeAuthority = [...new Set(item.routes.map((child) => child.name))];
    if (item.authority) {
      item.authority = [...item.authority, ...routeAuthority];
    } else {
      item.authority = routeAuthority;
    }
    item.routes.forEach((route) => {
      if (route.authority) {
        route.authority = [...route.authority, route.name];
      } else {
        route.authority = [route.name];
      }
    });
  } else {
    if (item.authority) {
      item.authority = [...item.authority, item.name];
    } else {
      item.authority = [item.name];
    }
  }
});

export default authRoutes;
