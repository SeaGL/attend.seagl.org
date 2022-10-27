import { Sponsor } from "../rooms";

interface Props {
  sponsors: Sponsor[];
}

const Sponsors = ({ sponsors }: Props) => {
  const renderLevel = (level: string, title: string) => {
    const atLevel = sponsors.filter((s) => s.level === level);
    return atLevel.length > 0 && <>
      <h2>{title}</h2>
      <div className={`logo-wall level-${level}`}>
        {atLevel.map((s) => (
          <a className={`logo-wall-item ${s.logo.horizontal ? "horizontal" : ""}`} title={s.name} href={s.url} rel="noopener noreferrer" target="_blank">
            <img alt={s.name} src={s.logo.horizontal || s.logo.square} />
          </a>
        ))}
      </div>
    </>;
  };

  return (
    <>
      <h1>SeaGL 2022 Sponsors</h1>

      <p>Our community sponsors are the lifeblood of SeaGL and we can't thank them enough.</p>

      <p>Their contributions will have a real and lasting effect in the FLOSS community. Thank you all.</p>

      {renderLevel("platinum", "Platinum")}
      {renderLevel("gold", "Gold")}
      {renderLevel("silver", "Silver")}
      {renderLevel("bronze", "Bronze")}
      {renderLevel("media", "Media Sponsors")}
      {renderLevel("thanks", "Special Thanks To")}
    </>
  );
};

export default Sponsors;
