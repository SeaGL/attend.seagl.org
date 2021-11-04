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
  .map((s) => ({ ...s,
    level: s.sponsorships["2021"],
    logo: {
      horizontal: s.logo.horizontal && new URL(s.logo.horizontal, seaglBase).toString(),
      square: s.logo.square && new URL(s.logo.square, seaglBase).toString(),
    },
  }));

const rooms: Record<string, ReactElement> = {
  // General
  "🪶seagl2021-announcements": <Page Content={Announcements} />,
  "🪶seagl2021-bot-help": <Page Content={BotHelp} />,
  "🪶seagl2021-career-expo": <Page Content={CareerExpo} />,
  "🪶seagl2021-info-booth": <Page Content={InfoBooth} />,
  "🪶seagl2021-orchestration": <Page Content={Orchestration} />,
  "🪶seagl2021-speaker-help": <Page Content={SpeakerHelp} />,
  "🪶seagl2021-triage": <Page Content={Triage} />,
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

  // Sessions
  "🪶seagl2021-osem-event-816": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-818": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-819": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-821": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-822": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-824": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-826": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-827": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-828": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-829": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-832": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-834": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-835": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-836": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-838": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-839": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-841": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-843": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-844": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-845": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-846": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-848": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-849": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-850": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-851": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-854": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-856": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-857": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-858": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-859": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-861": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-864": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-865": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-866": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-867": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-868": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-869": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-870": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-871": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-872": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-873": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-874": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-875": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-877": <Page Content={PendingStream} />,
  "🪶seagl2021-osem-event-878": <Page Content={PendingStream} />,
};

export default rooms;
