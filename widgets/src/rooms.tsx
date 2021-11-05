import { ReactElement } from "react";
import Page from "./components/Page";
import Announcements from "./components/Announcements.mdx";
import BotHelp from "./components/BotHelp.mdx";
import CareerExpo from "./components/CareerExpo.mdx";
import InfoBooth from "./components/InfoBooth.mdx";
import Orchestration from "./components/Orchestration.mdx";
import PendingStream from "./components/PendingStream.mdx";
import SpeakerHelp from "./components/SpeakerHelp.mdx";
import Sponsor from "./components/Sponsor";
import Sponsors from "./components/Sponsors";
import Triage from "./components/Triage.mdx";
import Volunteering from "./components/Volunteering.mdx";
import Volunteers from "./components/Volunteers.mdx";
import Welcome from "./components/Welcome.mdx";
import YouTube from "./components/YouTube";
import sponsorData from "../../seagl.org/_data/sponsors.yml";

export interface Sponsor {
  level: string,
  logo: {
    horizontal?: string,
    square?: string
  },
  name: string,
  url: string,
}

const seaglBase = new URL("https://seagl.org");
const sponsors: Sponsor[] = (sponsorData as any[])
  .filter((s) => "2021" in s.sponsorships)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((s) => ({ ...s,
    level: s.sponsorships["2021"],
    logo: {
      horizontal: s.logo.horizontal && new URL(s.logo.horizontal, seaglBase).toString(),
      square: s.logo.square && new URL(s.logo.square, seaglBase).toString(),
    },
  }));

const youtubeIds = [
  ["T_N0I1vYUrc", "J5Susi6f1eE", "-3iLYLhPIqo"],
  ["w7wj9HrRFPk", "PRMwUjXSa3A", "1GiwoMkuSHg"],
];

const rooms: Record<string, ReactElement> = {
  // General
  "🪶seagl-triage": <Page Content={Triage} />,
  "🪶seagl2021-announcements": <Page Content={Announcements} />,
  "🪶seagl2021-bot-help": <Page Content={BotHelp} />,
  "🪶seagl2021-career-expo": <Page Content={CareerExpo} />,
  "🪶seagl2021-info-booth": <Page Content={InfoBooth} />,
  "🪶seagl2021-orchestration": <Page Content={Orchestration} />,
  "🪶seagl2021-speaker-help": <Page Content={SpeakerHelp} />,
  "🪶seagl2021-volunteering": <Page Content={Volunteering} />,
  "🪶seagl2021-volunteers": <Page Content={Volunteers} />,
  "🪶seagl2021-welcome": <Page Content={Welcome} />,

  // Sponsors
  "🪶seagl2021-sponsors": <Page className="light"><Sponsors sponsors={sponsors} /></Page>,
  "🪶seagl2021-sponsor-aws": <Sponsor sponsor={sponsors.find((s) => s.name === "Amazon AWS")!} />,
  "🪶seagl2021-sponsor-extrahop": <Sponsor sponsor={sponsors.find((s) => s.name === "ExtraHop")!} />,
  "🪶seagl2021-sponsor-google": <Sponsor sponsor={sponsors.find((s) => s.name === "Google")!} />,
  "🪶seagl2021-sponsor-jmp": <Sponsor sponsor={sponsors.find((s) => s.name === "JMP.chat")!} />,
  "🪶seagl2021-sponsor-red-hat": <Sponsor sponsor={sponsors.find((s) => s.name === "Red Hat")!} />,
  "🪶seagl2021-sponsor-tidelift": <Sponsor sponsor={sponsors.find((s) => s.name === "Tidelift")!} />,
  "🪶seagl2021-sponsor-ubuntu": <Sponsor sponsor={sponsors.find((s) => s.name === "Ubuntu Community Fund")!} />,

  // Social events
  "🪶seagl2021-osem-event-868": <Page Content={Welcome} />, // Lightning Talks
  "🪶seagl2021-osem-event-870": <Page Content={Welcome} />, // Saturday TeaGL
  "🪶seagl2021-osem-event-872": <Page Content={Welcome} />, // DevOps Party Games
  "🪶seagl2021-osem-event-873": <Page Content={Welcome} />, // Cocktails and Mocktails with Mako
  "🪶seagl2021-osem-event-875": <Page Content={Welcome} />, // Winners announced!
  "🪶seagl2021-osem-event-877": <Page Content={Welcome} />, // Make Tea Sandwiches with Molly and Sri!
  "🪶seagl2021-osem-event-878": <Page Content={Welcome} />, // Trivia Contest for fun and prizes!

  // Sessions
  "🪶seagl2021-osem-event-816": <YouTube id={youtubeIds[1][2]} />,
  "🪶seagl2021-osem-event-818": <YouTube id={youtubeIds[1][1]} />,
  "🪶seagl2021-osem-event-819": <YouTube id={youtubeIds[1][1]} />,
  "🪶seagl2021-osem-event-821": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-822": <YouTube id={youtubeIds[1][1]} />,
  "🪶seagl2021-osem-event-824": <YouTube id={youtubeIds[0][1]} />,
  "🪶seagl2021-osem-event-826": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-827": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-828": <YouTube id={youtubeIds[1][2]} />,
  "🪶seagl2021-osem-event-829": <YouTube id={youtubeIds[1][2]} />,
  "🪶seagl2021-osem-event-832": <YouTube id={youtubeIds[0][1]} />,
  "🪶seagl2021-osem-event-834": <YouTube id={youtubeIds[0][1]} />,
  "🪶seagl2021-osem-event-835": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-836": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-838": <YouTube id={youtubeIds[1][1]} />,
  "🪶seagl2021-osem-event-839": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-841": <YouTube id={youtubeIds[0][2]} />,
  "🪶seagl2021-osem-event-843": <YouTube id={youtubeIds[0][2]} />,
  "🪶seagl2021-osem-event-844": <YouTube id={youtubeIds[1][2]} />,
  "🪶seagl2021-osem-event-845": <YouTube id={youtubeIds[0][1]} />,
  "🪶seagl2021-osem-event-846": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-848": <YouTube id={youtubeIds[0][2]} />,
  "🪶seagl2021-osem-event-849": <YouTube id={youtubeIds[1][2]} />,
  "🪶seagl2021-osem-event-850": <YouTube id={youtubeIds[1][2]} />,
  "🪶seagl2021-osem-event-851": <YouTube id={youtubeIds[0][1]} />,
  "🪶seagl2021-osem-event-854": <YouTube id={youtubeIds[0][2]} />,
  "🪶seagl2021-osem-event-856": <YouTube id={youtubeIds[1][1]} />,
  "🪶seagl2021-osem-event-857": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-858": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-859": <YouTube id={youtubeIds[1][1]} />,
  "🪶seagl2021-osem-event-861": <YouTube id={youtubeIds[0][2]} />,
  "🪶seagl2021-osem-event-864": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-865": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-866": <YouTube id={youtubeIds[1][0]} />,
  "🪶seagl2021-osem-event-867": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-869": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-871": <YouTube id={youtubeIds[0][0]} />,
  "🪶seagl2021-osem-event-874": <YouTube id={youtubeIds[1][0]} />,
};

export default rooms;
