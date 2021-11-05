import { MDXProvider } from "@mdx-js/react";
import { HTMLAttributes } from "react";
import ReactDOM from "react-dom";
import { QueryParamProvider } from "use-query-params";
import Widget from "./components/Widget";

const mdxComponents = {
  a: (props: HTMLAttributes<HTMLAnchorElement>) => (
    <a rel="noopener noreferrer" target="_blank" {...props} />
  ),
  muted: (props: HTMLAttributes<HTMLSpanElement>) => (
    <span className="text-muted" {...props} />
  ),
};

ReactDOM.render(
  <QueryParamProvider>
    <MDXProvider components={mdxComponents}>
      <Widget />
    </MDXProvider>
  </QueryParamProvider>,
  document.getElementById("widget")
);
