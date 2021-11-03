import ReactDOM from "react-dom";
import { QueryParamProvider } from "use-query-params";
import Widget from "./components/Widget";

ReactDOM.render(
  <QueryParamProvider>
    <Widget />
  </QueryParamProvider>,
  document.getElementById("widget")
);
