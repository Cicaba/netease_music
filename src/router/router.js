/**
 * @date 2018/11/14
 * @author Cicaba
 * @Description: 路由管理
*/

import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import store from '../store/state';
/**
 * 定义应用路
 */
import routerConfig from './routerConfig';
let persistor = persistStore(store);

/**
 * 将路由信息扁平化，继承上一级路由的 path
 * @param {Array} config 路由配置
 */
function recursiveRouterConfigV4(config = []) {
  const routeMap = [];
  config.forEach((item) => {
    const route = {
      path: item.path,
      layout: item.layout,
      component: item.component
    };
    //判断是否有有子路由, 有子路由进行递归
    if (Array.isArray(item.children)) {
      route.childRoutes = recursiveRouterConfigV4(item.children);
    }
    routeMap.push(route);
  });
  return routeMap;
}

/**
 * 将扁平化后的路由信息生成 Route 节点
 *
 * @param {Element} container 路由容器
 * @param {object} router 路由对象
 * @param {string} contextPath 上层路由地址
 * @return {Route}
 * @example
 */
function renderRouterConfigV4(container, router, contextPath) {
  const routeChildren = [];
  const renderRoute = (routeContainer, routeItem, routeContextPath) => {
    let routePath;
    if (!routeItem.path) {
      // eslint-disable-next-line
      console.error('route must has `path`');
    } else if (routeItem.path === '/' || routeItem.path === '*') {
      routePath = routeItem.path;
    } else {
      routePath = `/${routeContextPath}/${routeItem.path}`.replace(/\/+/g, '/');
    }

    // 优先使用当前定义的 layout
    if (routeItem.layout && routeItem.component) {
      routeChildren.push(
        <Route key={routePath} exact path={routePath} render={
          (props) => {
            return React.createElement(
              routeItem.layout,
              props,
              React.createElement(routeItem.component, props)
            );
          }
        }
        />
      );
    } else if (routeContainer && routeItem.component) {
      // 使用上层节点作为 container
      routeChildren.push(
        <Route key={routePath} exact path={routePath} render={
          (props) => {
            return React.createElement(
              routeContainer,
              props,
              React.createElement(routeItem.component, props)
            );
          }
        } />
      );
    } else {
      routeChildren.push(
        <Route key={routePath} exact path={routePath} component={routeItem.component} />
      );
    }

    // 存在子路由，递归当前路径，并添加到路由中
    if (Array.isArray(routeItem.childRoutes)) {
      routeItem.childRoutes.forEach((r) => {
        // 递归传递当前 route.component 作为子节点的 container
        renderRoute(routeItem.component, r, routePath);
      });
    }
  };

  router.forEach((r) => {
    renderRoute(container, r, contextPath);
  });
  return <Switch> {routeChildren} </Switch>;
}

const routerWithReactRouter4 = recursiveRouterConfigV4(routerConfig);
const routeChildren = renderRouterConfigV4(null, routerWithReactRouter4, '/');
export default (
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <Router>
        <div>
          {routeChildren}
        </div>
      </Router>
    </Provider>
  </PersistGate>
);