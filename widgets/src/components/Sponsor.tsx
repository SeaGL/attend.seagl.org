import { Sponsor } from "../rooms";

interface Props {
  sponsor: Sponsor;
}

const Sponsor = ({ sponsor }: Props) => {
  return (
    <div className="featured-logo">
      <a href={sponsor.url} rel="noopener noreferrer" target="_blank">
        <img src={sponsor.logo.horizontal || sponsor.logo.square} />
      </a>
    </div>
  );
};

export default Sponsor;
