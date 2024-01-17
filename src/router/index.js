import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    // routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
    extendRoutes: routes => {
      return setupLayouts(
        routes.map(route => {
          if (route.path.includes('*')) {
            route = {
              ...route,
              meta: {
                ...route.meta,
                layout: 'default',
              },
            };
          }
          return route;
        }),
      );
    },
  });

  return Router;
});
