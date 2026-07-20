type ContentColors = {
  text: string;
  textSecondary: string;
  accent: string;
  sunrise: string;
};

const baseStyle = (colors: ContentColors) => `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: -apple-system, Roboto, sans-serif;
      color: ${colors.text};
      padding: 4px 0;
    }
    .title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .hint { font-size: 14px; color: ${colors.textSecondary}; margin-bottom: 8px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
    .row + .row { border-top: 1px solid rgba(128,128,128,0.2); }
    .time { font-weight: 700; color: ${colors.accent}; width: 52px; }
    .item-title { font-size: 14px; font-weight: 600; }
    .item-meta { font-size: 12px; color: ${colors.textSecondary}; }
    .points { font-size: 13px; font-weight: 700; color: ${colors.sunrise}; }
    a, [data-action] { cursor: pointer; }
  </style>
`;

export function missionContentHtml(
  mission: { title: string; hint: string; points: number; progressLabel: string },
  colors: ContentColors
) {
  return `<!doctype html><html><head>${baseStyle(colors)}</head><body data-action="mission-tap">
    <div class="title">${mission.title}</div>
    <div class="hint">${mission.hint}</div>
    <div class="row">
      <span class="item-meta">${mission.progressLabel}</span>
      <span class="points">+${mission.points} punten</span>
    </div>
  </body></html>`;
}

export function sponsorContentHtml(sponsor: { name: string; missionLabel: string }, colors: ContentColors) {
  return `<!doctype html><html><head>${baseStyle(colors)}</head><body data-action="sponsor-tap">
    <div class="hint">${sponsor.missionLabel}</div>
  </body></html>`;
}
