import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";

import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary() {
    return React.createElement("div");
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
