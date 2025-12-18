/**
 * Dynamic Two-Line Sports Logo Generator
 * Supports multiple logo styles
 */

// ============================================
// LOGO 1 CONFIG (Arc Lower style - GIN font)
// ============================================
const CONFIG_LOGO1 = {
  fontSize1Percent: 65,
  fontSize2Percent: 70,
  strokeWidthRatio: 0.06,
  letterSpacing2: -0.09,
  horizontalScale2: 0.7,
  lineSpacing: 0.9,
  warpAmount: 50,
  endLetterDropPercent: 5,
  rightEndDropMultiplier: 1.6,
  fontFamily: "gin, sans-serif",
};

// ============================================
// LOGO 2 CONFIG (Magno Serif Arc + Script style)
// ============================================
const CONFIG_LOGO2 = {
  // Line 1 - Magno Serif with Arc Lower warp
  fontSize1Percent: 85,
  strokeWidthRatio1: 0.03,
  letterSpacing1: -0.02,
  horizontalScale1: 0.85,
  warpAmount1: 45,
  endLetterDropPercent1: 2,
  rightEndDropMultiplier1: 4,
  fontFamily1: "'magno-serif-variable', serif",
  
  // Line 2 - Sarah Script (no warp)
  fontSize2Percent: 40,
  strokeWidthRatio2: 0.04,
  letterSpacing2: 0.0,
  fontFamily2: "'sarah-script', cursive",
  
  lineSpacing: -0.18,
};

// ============================================
// KERNING MAPS FOR LOGO 1
// ============================================
const KERNING_PAIRS_LINE1 = {

};

const KERNING_PAIRS_LINE2 = {
  AV: -0.1, VA: -0.09, AW: -0.08, WA: -0.08, AT: -0.08, TA: -0.08,
  AY: -0.08, YA: -0.08, AO: -0.03, OA: -0.03, AC: -0.03, CA: -0.03,
  AE: -0.04, EA: 0.0, AR: 0.03, AS: -0.03, SA: -0.03, AL: -0.02,
  BE: -0.03, EB: -0.03, BA: -0.03, AB: -0.03, LT: -0.07, TL: -0.05,
  LV: -0.06, VL: -0.05, LY: -0.06, YL: -0.05, LW: -0.05, WL: -0.04,
  LL: 0.01, LA: 0.02, TO: -0.05, OT: -0.04, TC: -0.05, CT: -0.04,
  TE: -0.04, ET: -0.04, TR: -0.04, RT: -0.04, TY: -0.04, YT: -0.04,
  VE: -0.01, EV: -0.04, VO: -0.04, OV: -0.04, VR: -0.03, RV: -0.03,
  RD: 0.0, DR: -0.03, RS: -0.04, SR: -0.03, RY: -0.04, YR: -0.04,
  RW: -0.04, WR: -0.04, RA: -0.03, ER: 0.01, RE: -0.03, ES: -0.03,
  SE: -0.03, PA: -0.05, AP: -0.04, YO: -0.05, OY: -0.04, WE: -0.04,
  EW: -0.04, WO: -0.04, OW: -0.04, FA: -0.05, AF: -0.04, FO: -0.04,
  OF: -0.04, ME: -0.04, LM: -0.03,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
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

function getArcLowerTransform(index, total, warpAmount, endDropPercent, rightMultiplier) {
  if (total <= 1) return { scale: 1, skew: 0, drop: 0 };

  const t = index / (total - 1);
  const centeredness = 1 - 4 * Math.pow(t - 0.5, 2);
  const warpFactor = warpAmount / 100;

  const baseReduction = 0.15;
  const additionalReduction = (1 - baseReduction) * centeredness;
  const totalReduction = (baseReduction + additionalReduction) * warpFactor * 0.5;
  const scale = 1 - totalReduction;

  const posFromCenter = t - 0.5;
  const skew = posFromCenter * warpFactor * 30;

  const endProximity = Math.abs(posFromCenter);
  let dropFactor = Math.pow(endProximity * 2, 2);

  if (posFromCenter > 0) {
    dropFactor *= rightMultiplier;
  }

  const drop = dropFactor * endDropPercent;

  return { scale, skew, drop };
}

// ============================================
// LOGO 1 FUNCTIONS (Arc Lower style)
// ============================================
function createLine1Text_Logo1(text, options) {
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

function createArcLowerText_Logo1(text, options) {
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
    endLetterDropPercent,
    rightEndDropMultiplier,
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

function createSportsLogoHTML_Logo1({
  line1Text = "BALLARD",
  line2Text = "BEAVERS",
  primaryColor = "#c41e3a",
  secondaryColor = "#1a1a1a",
} = {}) {
  const config = CONFIG_LOGO1;
  
  const line1HTML = createLine1Text_Logo1(line1Text, {
    fontSizePercent: config.fontSize1Percent,
    strokeWidthRatio: config.strokeWidthRatio,
    fillColor: primaryColor,
    strokeColor: secondaryColor,
    fontFamily: config.fontFamily,
    kerningMap: KERNING_PAIRS_LINE1,
  });

  const line2HTML = createArcLowerText_Logo1(line2Text, {
    fontSizePercent: config.fontSize2Percent,
    strokeWidthRatio: config.strokeWidthRatio,
    fillColor: secondaryColor,
    strokeColor: primaryColor,
    warpAmount: config.warpAmount,
    fontFamily: config.fontFamily,
    letterSpacing: config.letterSpacing2,
    horizontalScale: config.horizontalScale2,
    kerningMap: KERNING_PAIRS_LINE2,
    endLetterDropPercent: config.endLetterDropPercent,
    rightEndDropMultiplier: config.rightEndDropMultiplier,
  });

  const line1FontSizeVW = config.fontSize1Percent / line1Text.length;
  const lineSpacingVW = line1FontSizeVW * (config.lineSpacing - 1);

  return `
    <div style="font-family: ${config.fontFamily}; display: inline-block; text-align: center; width: 100%;">
      <div style="display: flex; justify-content: center;">
        ${line1HTML}
      </div>
      <div style="margin-top: ${lineSpacingVW}vw; display: flex; justify-content: center;">
        ${line2HTML}
      </div>
    </div>
  `;
}

// ============================================
// LOGO 2 FUNCTIONS (Magno Serif Arc + Script style)
// ============================================
function createLine1Text_Logo2(text, options) {
  const {
    fontSizePercent,
    strokeWidthRatio,
    fillColor,
    strokeColor,
    fontFamily,
    letterSpacing,
    horizontalScale,
    warpAmount,
    endLetterDropPercent,
    rightEndDropMultiplier,
    kerningMap = KERNING_PAIRS_LINE1,
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
      font-weight: 800;
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

function createLine2Text_Logo2(text, options) {
  const {
    fontSizePercent,
    strokeWidthRatio,
    fillColor,
    strokeColor,
    fontFamily,
    letterSpacing = 0.0,
    textLength,
  } = options;

  // For script font, render as single text element to preserve ligatures and flow
  const fontSizeVW = fontSizePercent / (textLength * 0.45); // Adjust for script font width
  const strokeWidthVW = fontSizeVW * strokeWidthRatio;

  return `
    <div style="
      display: inline-block;
      font-family: ${fontFamily};
      font-size: ${fontSizeVW}vw;
      color: ${fillColor};
      -webkit-text-stroke: ${strokeWidthVW}vw ${strokeColor};
      paint-order: stroke fill;
      line-height: 1;
      letter-spacing: ${letterSpacing}em;
      white-space: nowrap;
    ">${escapeXml(text)}</div>
  `;
}

function createSportsLogoHTML_Logo2({
  line1Text = "PASSAIC",
  line2Text = "Cheer & Dance",
  primaryColor = "#086bb5",
  secondaryColor = "#ebba30",
} = {}) {
  const config = CONFIG_LOGO2;
  
  // Line 1: Magno Serif with Arc Lower warp
  const line1HTML = createLine1Text_Logo2(line1Text, {
    fontSizePercent: config.fontSize1Percent,
    strokeWidthRatio: config.strokeWidthRatio1,
    fillColor: primaryColor,
    strokeColor: secondaryColor,
    fontFamily: config.fontFamily1,
    letterSpacing: config.letterSpacing1,
    horizontalScale: config.horizontalScale1,
    warpAmount: config.warpAmount1,
    endLetterDropPercent: config.endLetterDropPercent1,
    rightEndDropMultiplier: config.rightEndDropMultiplier1,
  });

  // Line 2: Sarah Script (no warp, inverted colors)
  const line2HTML = createLine2Text_Logo2(line2Text, {
    fontSizePercent: config.fontSize2Percent,
    strokeWidthRatio: config.strokeWidthRatio2,
    fillColor: secondaryColor,
    strokeColor: primaryColor,
    fontFamily: config.fontFamily2,
    letterSpacing: config.letterSpacing2,
    textLength: line2Text.length,
  });

  const line1FontSizeVW = config.fontSize1Percent / line1Text.length;
  const lineSpacingVW = line1FontSizeVW * config.lineSpacing;

  return `
    <div style="display: inline-block; text-align: center; width: 100%;">
      <div style="display: flex; justify-content: center;">
        ${line1HTML}
      </div>
      <div style="margin-top: ${lineSpacingVW}vw; display: flex; justify-content: center;">
        ${line2HTML}
      </div>
    </div>
  `;
}

// ============================================
// MAIN FUNCTION - Logo Selector
// ============================================
function createSportsLogoHTML(options) {
  const logoType = options.logoType || 1;
  
  if (logoType === 2) {
    return createSportsLogoHTML_Logo2(options);
  }
  return createSportsLogoHTML_Logo1(options);
}
