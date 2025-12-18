/**
 * Dynamic Two-Line Sports Logo Generator
 * Asymmetric drop: Right end letter pulled down MORE than left
 */

// FIXED VALUES
const CONFIG = {
  fontSize1Percent: 65,
  fontSize2Percent: 70,
  strokeWidthRatio: 0.06,
  letterSpacing2: -0.09,
  horizontalScale2: 0.7,
  lineSpacing: 0.9,
  warpAmount: 40,
  endLetterDropPercent: 5, // Base drop strength for ends
  rightEndDropMultiplier: 1.6, // NEW: Right side drops 2.2x more than left
  fontFamily: "gin, sans-serif",
};

/* Kerning maps - unchanged */
const KERNING_PAIRS_LINE1 = {
  AV: -0.08,
  VA: -0.08,
  AW: -0.05,
  WA: -0.05,
  AT: -0.06,
  TA: -0.06,
  AY: -0.06,
  YA: -0.06,
  AO: -0.01,
  OA: -0.01,
  AC: -0.01,
  CA: -0.01,
  AE: -0.02,
  EA: 0.01,
  AR: 0.05,
  AS: -0.01,
  SA: -0.01,
  AL: 0.06,
  BE: -0.04,
  EB: -0.01,
  BA: -0.01,
  AB: -0.01,
  LT: -0.05,
  TL: -0.03,
  LV: -0.04,
  VL: -0.03,
  LY: -0.04,
  YL: -0.03,
  LW: -0.03,
  WL: -0.02,
  LL: 0.02,
  LA: 0.03,
  TO: -0.03,
  OT: -0.02,
  TC: -0.03,
  CT: -0.02,
  TE: -0.02,
  ET: -0.02,
  TR: -0.02,
  RT: -0.02,
  TY: -0.02,
  YT: -0.02,
  VE: -0.02,
  EV: -0.02,
  VO: -0.02,
  OV: -0.02,
  VR: -0.01,
  RV: -0.01,
  RD: 0.01,
  DR: -0.01,
  RS: -0.02,
  SR: -0.01,
  RY: -0.02,
  YR: -0.02,
  RW: -0.02,
  WR: -0.02,
  RA: -0.01,
  AR: 0.03,
  ER: -0.01,
  RE: -0.01,
  ES: -0.01,
  SE: -0.01,
  PA: -0.03,
  AP: -0.02,
  YO: -0.03,
  OY: -0.02,
  WE: -0.02,
  EW: -0.02,
  WO: -0.02,
  OW: -0.02,
  FA: -0.03,
  AF: -0.02,
  FO: -0.02,
  OF: -0.02,
};

const KERNING_PAIRS_LINE2 = {
  AV: -0.1,
  VA: -0.09,
  AW: -0.08,
  WA: -0.08,
  AT: -0.08,
  TA: -0.08,
  AY: -0.08,
  YA: -0.08,
  AO: -0.03,
  OA: -0.03,
  AC: -0.03,
  CA: -0.03,
  AE: -0.04,
  EA: 0.0,
  AR: 0.03,
  AS: -0.03,
  SA: -0.03,
  AL: -0.02,
  BE: -0.03,
  EB: -0.03,
  BA: -0.03,
  AB: -0.03,
  LT: -0.07,
  TL: -0.05,
  LV: -0.06,
  VL: -0.05,
  LY: -0.06,
  YL: -0.05,
  LW: -0.05,
  WL: -0.04,
  LL: 0.01,
  LA: 0.02,
  TO: -0.05,
  OT: -0.04,
  TC: -0.05,
  CT: -0.04,
  TE: -0.04,
  ET: -0.04,
  TR: -0.04,
  RT: -0.04,
  TY: -0.04,
  YT: -0.04,
  VE: -0.01,
  EV: -0.04,
  VO: -0.04,
  OV: -0.04,
  VR: -0.03,
  RV: -0.03,
  RD: 0.0,
  DR: -0.03,
  RS: -0.04,
  SR: -0.03,
  RY: -0.04,
  YR: -0.04,
  RW: -0.04,
  WR: -0.04,
  RA: -0.03,
  AR: 0.02,
  ER: -0.03,
  RE: -0.03,
  ES: -0.03,
  SE: -0.03,
  PA: -0.05,
  AP: -0.04,
  YO: -0.05,
  OY: -0.04,
  WE: -0.04,
  EW: -0.04,
  WO: -0.04,
  OW: -0.04,
  FA: -0.05,
  AF: -0.04,
  FO: -0.04,
  OF: -0.04,
};

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getKerning(char1, char2, kerningMap) {
  const pair = (char1 + char2).toUpperCase();
  return kerningMap[pair] || 0;
}

function getArcLowerTransform(
  index,
  total,
  warpAmount,
  endDropPercent,
  rightMultiplier
) {
  if (total <= 1) return { scale: 1, skew: 0, drop: 0 };

  const t = index / (total - 1);
  const centeredness = 1 - 4 * Math.pow(t - 0.5, 2);
  const warpFactor = warpAmount / 100;

  const baseReduction = 0.15;
  const additionalReduction = (1 - baseReduction) * centeredness;
  const totalReduction =
    (baseReduction + additionalReduction) * warpFactor * 0.5;
  const scale = 1 - totalReduction;

  const posFromCenter = t - 0.5; // Negative = left, Positive = right
  const skew = posFromCenter * warpFactor * 30;

  // Asymmetric drop: stronger on right side
  const endProximity = Math.abs(posFromCenter);
  let dropFactor = Math.pow(endProximity * 2, 2);

  // Boost only the right side
  if (posFromCenter > 0) {
    dropFactor *= rightMultiplier;
  }

  const drop = dropFactor * endDropPercent;

  return { scale, skew, drop };
}

function createLine1Text(text, options) {
  const {
    fontSizePercent,
    strokeWidthRatio,
    fillColor,
    strokeColor,
    fontFamily,
    kerningMap = KERNING_PAIRS_LINE1,
  } = options;

  const chars = text.toUpperCase().split("");
  const total = chars.length;
  const baseLetterSpacing = 0.04;

  const fontSizeVW = fontSizePercent / total;
  const strokeWidthVW = fontSizeVW * strokeWidthRatio;

  let html = '<div style="display: inline-flex; align-items: flex-start;">';

  chars.forEach((char, index) => {
    let spacingEm = baseLetterSpacing;
    if (index < total - 1) {
      spacingEm += getKerning(char, chars[index + 1], kerningMap);
    }

    html += `<span style="
      display: inline-block;
      font-family: ${fontFamily};
      font-size: ${fontSizeVW}vw;
      color: ${fillColor};
      -webkit-text-stroke: ${strokeWidthVW}vw ${strokeColor};
      paint-order: stroke fill;
      line-height: 1;
      margin-right: ${index < total - 1 ? spacingEm : 0}em;
    ">${escapeXml(char)}</span>`;
  });

  html += "</div>";
  return html;
}

function createArcLowerText(text, options) {
  const {
    fontSizePercent,
    strokeWidthRatio,
    fillColor,
    strokeColor,
    warpAmount,
    fontFamily,
    letterSpacing,
    horizontalScale,
    kerningMap = KERNING_PAIRS_LINE2,
    endLetterDropPercent = CONFIG.endLetterDropPercent,
    rightEndDropMultiplier = CONFIG.rightEndDropMultiplier,
  } = options;

  const chars = text.toUpperCase().split("");
  const total = chars.length;

  const fontSizeVW = fontSizePercent / total / horizontalScale;
  const strokeWidthVW = fontSizeVW * strokeWidthRatio;

  let html = '<div style="display: inline-flex; align-items: flex-start;">';

  chars.forEach((char, index) => {
    const { scale, skew, drop } = getArcLowerTransform(
      index,
      total,
      warpAmount,
      endLetterDropPercent,
      rightEndDropMultiplier
    );

    let spacingEm = letterSpacing;
    if (index < total - 1) {
      spacingEm += getKerning(char, chars[index + 1], kerningMap);
    }

    const dropVW = (drop / 100) * fontSizeVW;

    html += `<span style="
      display: inline-block;
      font-family: ${fontFamily};
      font-size: ${fontSizeVW}vw;
      color: ${fillColor};
      -webkit-text-stroke: ${strokeWidthVW}vw ${strokeColor};
      paint-order: stroke fill;
      line-height: 1;
      transform: scaleX(${horizontalScale}) scaleY(${scale}) skewY(${skew}deg) translateY(${dropVW}vw);
      transform-origin: top center;
      margin-right: ${index < total - 1 ? spacingEm : 0}em;
    ">${escapeXml(char)}</span>`;
  });

  html += "</div>";
  return html;
}

function createSportsLogoHTML({
  line1Text = "BALLARD",
  line2Text = "BEAVERS",
  primaryColor = "#c41e3a",
  secondaryColor = "#1a1a1a",
} = {}) {
  const line1HTML = createLine1Text(line1Text, {
    fontSizePercent: CONFIG.fontSize1Percent,
    strokeWidthRatio: CONFIG.strokeWidthRatio,
    fillColor: primaryColor,
    strokeColor: secondaryColor,
    fontFamily: CONFIG.fontFamily,
    kerningMap: KERNING_PAIRS_LINE1,
  });

  const line2HTML = createArcLowerText(line2Text, {
    fontSizePercent: CONFIG.fontSize2Percent,
    strokeWidthRatio: CONFIG.strokeWidthRatio,
    fillColor: secondaryColor,
    strokeColor: primaryColor,
    warpAmount: CONFIG.warpAmount,
    fontFamily: CONFIG.fontFamily,
    letterSpacing: CONFIG.letterSpacing2,
    horizontalScale: CONFIG.horizontalScale2,
    kerningMap: KERNING_PAIRS_LINE2,
    endLetterDropPercent: CONFIG.endLetterDropPercent,
    rightEndDropMultiplier: CONFIG.rightEndDropMultiplier,
  });

  const line1FontSizeVW = CONFIG.fontSize1Percent / line1Text.length;
  const lineSpacingVW = line1FontSizeVW * (CONFIG.lineSpacing - 1);

  return `
    <div style="font-family: ${CONFIG.fontFamily}; display: inline-block; text-align: center; width: 100%;">
      <div style="display: flex; justify-content: center;">
        ${line1HTML}
      </div>
      <div style="margin-top: ${lineSpacingVW}vw; display: flex; justify-content: center;">
        ${line2HTML}
      </div>
    </div>
  `;
}
