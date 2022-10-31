const { readFileSync } = require("fs");
const { join } = require("path");
const { load } = require("js-yaml");

const fromSite = (path) => load(readFileSync(join("../seagl.org", path), { encoding: "utf-8" }));

const { custom: { year }, origin } = fromSite("_config.yml");

const absolute = (url) => new URL(url, origin).toString();

const level = (slug, title) => ({
  slug,
  title,
  sponsors: sponsors.filter((s) => s.level === slug),
});

const sponsors = fromSite("_data/sponsors.yml")
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

const sponsorLevels = [
  level("platinum", "Platinum"),
  level("gold", "Gold"),
  level("silver", "Silver"),
  level("bronze", "Bronze"),
  level("media", "Media Sponsors"),
  level("thanks", "Special Thanks To"),
];

module.exports = { locals: { sponsorLevels } };
