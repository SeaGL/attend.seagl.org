import { ReactElement } from "react";
import Page from "./components/Page";
import Welcome from "./components/Welcome.mdx";
import YouTube from "./components/YouTube";

const rooms: Record<string, ReactElement> = {
  "🪶seagl2021-osem-event-865": <YouTube id="GlhiebhWXlQ" />,
  "🪶seagl2021-welcome": <Page Content={Welcome} />,
};

export default rooms;
