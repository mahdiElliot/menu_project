import React from "react";
import { Switch, Route } from "react-router-dom";

import { routes } from "../routes";

const Router = () => (
  <Switch>
    {routes.map((r) => (
      <Route key={r.key} path={r.path}>
        {<r.component />}
      </Route>
    ))}
    <Route path="/*">404</Route>
  </Switch>
);

const Page = () => <Router />;

export default Page;
