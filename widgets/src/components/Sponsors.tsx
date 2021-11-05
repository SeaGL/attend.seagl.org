import { Sponsor } from "../rooms";

interface Props {
  sponsors: Sponsor[];
}

const Sponsors = ({ sponsors }: Props) => {
  const renderLevel = (level: string) => (
    <div className={`logo-wall level-${level}`}>
      {sponsors.filter((s) => s.level === level).map((s) =>
        <a className={`logo-wall-item ${s.logo.horizontal ? "horizontal" : ""}`} title={s.name} href={s.url} rel="noopener noreferrer" target="_blank">
          <img alt={s.name} src={s.logo.horizontal || s.logo.square} />
        </a>
      )}
    </div>
  );

  return (
    <>
      <h1>SeaGL 2021 Sponsors</h1>

      <p>Our community sponsors are the lifeblood of SeaGL and we can't thank them enough.</p>

      <p>Their contributions will have a real and lasting effect in the FLOSS community. Thank you all.</p>

      <h2>Platinum</h2>

      {renderLevel("platinum")}

      <h2>Gold</h2>

      {renderLevel("gold")}

      <h2>Silver</h2>

      {renderLevel("silver")}

      <h2>Bronze</h2>

      {renderLevel("bronze")}

      <h2>Media Sponsors</h2>

      {renderLevel("media")}

      <h2>Special Thanks To</h2>

      {renderLevel("thanks")}
    </>
  );
};

export default Sponsors;
