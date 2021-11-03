import { StringParam, useQueryParam } from "use-query-params";
import rooms from "../rooms";

const Widget = () => {
  const [widgetId] = useQueryParam("widgetId", StringParam);
  const content = widgetId && rooms[widgetId];

  return (
    <>
      {content ?? (
        <>
          <p>This widget has not been configured.</p>
          <p>
            Widget ID: <code>{widgetId}</code>
          </p>
        </>
      )}
    </>
  );
};

export default Widget;
