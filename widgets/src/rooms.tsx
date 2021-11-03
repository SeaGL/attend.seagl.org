import { ReactElement } from "react";
import Page from "./components/Page";
import Announcements from "./components/Announcements.mdx";
import BotHelp from "./components/BotHelp.mdx";
import CareerExpo from "./components/CareerExpo.mdx";
import InfoBooth from "./components/InfoBooth.mdx";
import Orchestration from "./components/Orchestration.mdx";
import Social from "./components/Social.mdx";
import SpeakerHelp from "./components/SpeakerHelp.mdx";
import Sponsors from "./components/Sponsors.mdx";
import Volunteering from "./components/Volunteering.mdx";
import Volunteers from "./components/Volunteers.mdx";
import Welcome from "./components/Welcome.mdx";
import YouTube from "./components/YouTube";

const rooms: Record<string, ReactElement> = {
  // General
  "🪶seagl2021-announcements": <Page Content={Announcements} />,
  "🪶seagl2021-bot-help": <Page Content={BotHelp} />,
  "🪶seagl2021-career-expo": <Page Content={CareerExpo} />,
  "🪶seagl2021-info-booth": <Page Content={InfoBooth} />,
  "🪶seagl2021-orchestration": <Page Content={Orchestration} />,
  "🪶seagl2021-social": <Page Content={Social} />,
  "🪶seagl2021-speaker-help": <Page Content={SpeakerHelp} />,
  "🪶seagl2021-volunteering": <Page Content={Volunteering} />,
  "🪶seagl2021-volunteers": <Page Content={Volunteers} />,
  "🪶seagl2021-welcome": <Page Content={Welcome} />,
  
  // Sponsors
  "🪶seagl2021-sponsors": <Page Content={Sponsors} />,
  "🪶seagl2021-sponsor-aws": <Page Content={Welcome} />,
  "🪶seagl2021-sponsor-extrahop": <Page Content={Welcome} />,
  "🪶seagl2021-sponsor-google": <Page Content={Welcome} />,
  "🪶seagl2021-sponsor-jmp": <Page Content={Welcome} />,
  "🪶seagl2021-sponsor-red-hat": <Page Content={Welcome} />,
  "🪶seagl2021-sponsor-tidelift": <Page Content={Welcome} />,
  "🪶seagl2021-sponsor-ubuntu": <Page Content={Welcome} />,

  // Sessions
  "🪶seagl2021-osem-event-816": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-818": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-819": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-821": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-822": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-824": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-826": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-827": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-828": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-829": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-832": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-834": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-835": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-836": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-838": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-839": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-841": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-843": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-844": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-845": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-846": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-848": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-849": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-850": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-851": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-854": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-856": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-857": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-858": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-859": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-861": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-864": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-865": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-866": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-867": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-868": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-869": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-870": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-871": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-872": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-873": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-874": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-875": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-877": <Page Content={Welcome} />,
  "🪶seagl2021-osem-event-878": <Page Content={Welcome} />,
};

export default rooms;
