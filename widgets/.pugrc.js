const { readFileSync } = require("fs");
const { join } = require("path");
const { load } = require("js-yaml");

const fromSite = (path) => load(readFileSync(join("../seagl.org", path), { encoding: "utf-8" }));

const { custom: { year }, origin } = fromSite("_config.yml");

const absolute = (url) => new URL(url, origin).toString();

const sponsorship = fromSite("_data/sponsorship.yml");

const sponsors = sponsorship.sponsors
  .filter((s) => year in s.sponsorships)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(({ logo: { horizontal, square }, sponsorships, ...sponsor }) => ({
    ...sponsor,
    level: sponsorships[year],
    logo: {
      horizontal: horizontal && absolute(horizontal),
      square: square && absolute(square),
    },
  }));

const sponsorLevels = Object.entries(sponsorship.levels).map(
  ([slug, title]) => ({
    slug,
    title,
    sponsors: sponsors.filter((s) => s.level === slug),
  })
);

module.exports = { locals: { sponsorLevels } };
