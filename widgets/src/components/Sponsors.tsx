import { Sponsor } from "../rooms";

const renderSponsor = (s: Sponsor) => (
  <a title={s.name} href={s.url} rel="noopener noreferrer" target="_blank">
    <img className="logo" alt={s.name} src={s.logo.horizontal || s.logo.square} />
  </a>
);

interface Props {
  sponsors: Sponsor[];
}

const Sponsors = ({ sponsors }: Props) => {
  return (
    <>
      <h1>SeaGL 2021 Sponsors</h1>

      <p>Our community sponsors are the lifeblood of SeaGL and we can't thank them enough.</p>

      <p>Their contributions will have a real and lasting effect in the FLOSS community. Thank you all.</p>

      <h2>Platinum</h2>

      <div className="logo-collection">
        {sponsors.filter((s) => s.level === "platinum").map(renderSponsor)}
      </div>

      <h2>Gold</h2>

      <div className="logo-collection">
        {sponsors.filter((s) => s.level === "gold").map(renderSponsor)}
      </div>

      <h2>Silver</h2>

      <div className="logo-collection">
        {sponsors.filter((s) => s.level === "silver").map(renderSponsor)}
      </div>

      <h2>Bronze</h2>

      <div className="logo-collection">
        {sponsors.filter((s) => s.level === "bronze").map(renderSponsor)}
      </div>

      <h2>Media Sponsors</h2>

      <div className="logo-collection">
        {sponsors.filter((s) => s.level === "media").map(renderSponsor)}
      </div>

      <h2>Special Thanks To</h2>

      <div className="logo-collection">
        {sponsors.filter((s) => s.level === "thanks").map(renderSponsor)}
      </div>
    </>
  );
};

export default Sponsors;
