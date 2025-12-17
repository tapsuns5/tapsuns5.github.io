/**
 * Dynamic Two-Line Sports Logo Generator
 * Fixed values for fine-tuning kerning and centering
 */

// FIXED VALUES
const CONFIG = {
  // Font sizes as percentage of viewport width
  fontSize1Percent: 60,  // Line 1 is 70% of container/viewport
  fontSize2Percent: 70,  // Line 2 is 70% of container/viewport
  strokeWidthRatio: 0.06, // Stroke as ratio of font size (10/120 = 0.083)
  letterSpacing2: -0.03,
  horizontalScale2: 0.85,
  lineSpacing: 0.9,
  warpAmount: 50,
  fontFamily: "gin, sans-serif"
};

/**
 * Kerning pairs - negative values bring letters closer
 * Values are in em units - ADJUST THESE TO FINE-TUNE
 */
const KERNING_PAIRS = {
  // A combinations
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

  // B combinations
  BE: -0.04,
  EB: -0.01,
  BA: -0.01,
  AB: -0.01,

  // L combinations
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

  // T combinations
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

  // V combinations
  VE: -0.02,
  EV: -0.02,
  VO: -0.02,
  OV: -0.02,
  VR: -0.01,
  RV: -0.01,

  // R combinations
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

  // E combinations
  ER: -0.01,
  RE: -0.01,
  ES: -0.01,
  SE: -0.01,

  // Other
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

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getKerning(char1, char2) {
  const pair = (char1 + char2).toUpperCase();
  return KERNING_PAIRS[pair] || 0;
}

function getArcLowerTransform(index, total, warpAmount) {
  if (total <= 1) return { scale: 1, skew: 0 };
  
  const t = index / (total - 1);
  const centeredness = 1 - 4 * Math.pow(t - 0.5, 2);
  const warpFactor = warpAmount / 100;
  
  const baseReduction = 0.15;
  const additionalReduction = (1 - baseReduction) * centeredness;
  const totalReduction = (baseReduction + additionalReduction) * warpFactor * 0.5;
  const scale = 1 - totalReduction;
  
  const posFromCenter = t - 0.5;
  const skew = posFromCenter * warpFactor * 30;
  
  return { scale, skew };
}

function createLine1Text(text, options) {
  const { fontSizePercent, strokeWidthRatio, fillColor, strokeColor, fontFamily } = options;
  const chars = text.toUpperCase().split('');
  const total = chars.length;
  const baseLetterSpacing = 0.04;
  
  // Calculate font size as vw based on text length to fit within percentage
  const fontSizeVW = fontSizePercent / total;
  const strokeWidthVW = fontSizeVW * strokeWidthRatio;
  
  let html = '<div style="display: inline-flex; align-items: flex-start;">';
  
  chars.forEach((char, index) => {
    let spacingEm = baseLetterSpacing;
    if (index < total - 1) {
      spacingEm += getKerning(char, chars[index + 1]);
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
  
  html += '</div>';
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
    horizontalScale
  } = options;
  
  const chars = text.toUpperCase().split('');
  const total = chars.length;
  
  // Calculate font size as vw based on text length to fit within percentage
  const fontSizeVW = fontSizePercent / total / horizontalScale;
  const strokeWidthVW = fontSizeVW * strokeWidthRatio;
  
  let html = '<div style="display: inline-flex; align-items: flex-start;">';
  
  chars.forEach((char, index) => {
    const { scale, skew } = getArcLowerTransform(index, total, warpAmount);
    
    let spacingEm = letterSpacing;
    if (index < total - 1) {
      spacingEm += getKerning(char, chars[index + 1]);
    }
    
    html += `<span style="
      display: inline-block;
      font-family: ${fontFamily};
      font-size: ${fontSizeVW}vw;
      color: ${fillColor};
      -webkit-text-stroke: ${strokeWidthVW}vw ${strokeColor};
      paint-order: stroke fill;
      line-height: 1;
      transform: scaleX(${horizontalScale}) scaleY(${scale}) skewY(${skew}deg);
      transform-origin: top center;
      margin-right: ${index < total - 1 ? spacingEm : 0}em;
    ">${escapeXml(char)}</span>`;
  });
  
  html += '</div>';
  return html;
}

function createSportsLogoHTML({
  line1Text = "BALLARD",
  line2Text = "BEAVERS",
  primaryColor = "#c41e3a",
  secondaryColor = "#1a1a1a"
} = {}) {
  
  const line1HTML = createLine1Text(line1Text, {
    fontSizePercent: CONFIG.fontSize1Percent,
    strokeWidthRatio: CONFIG.strokeWidthRatio,
    fillColor: primaryColor,
    strokeColor: secondaryColor,
    fontFamily: CONFIG.fontFamily
  });
  
  const line2HTML = createArcLowerText(line2Text, {
    fontSizePercent: CONFIG.fontSize2Percent,
    strokeWidthRatio: CONFIG.strokeWidthRatio,
    fillColor: secondaryColor,
    strokeColor: primaryColor,
    warpAmount: CONFIG.warpAmount,
    fontFamily: CONFIG.fontFamily,
    letterSpacing: CONFIG.letterSpacing2,
    horizontalScale: CONFIG.horizontalScale2
  });
  
  // Calculate line spacing based on line 1 font size
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
