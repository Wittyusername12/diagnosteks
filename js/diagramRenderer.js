/* ============================================================
   DIAGRAM RENDERER — DiagramRegistry + SVG renderers
   Architecture: registry pattern where type strings map to
   render functions. Each future diagram type plugs in by
   calling DiagramRegistry.register().
   ============================================================ */

// SVG namespace — every SVG element MUST use createElementNS
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }
  }
  return el;
}

// ============================================================
// ARC MATH HELPERS (used by fractionCircle and any future pie/arc renderers)
// ============================================================

function polarToCartesian(cx, cy, radius, angleDegrees) {
  var angleRadians = (angleDegrees - 90) * Math.PI / 180; // -90 to start at 12 o'clock
  return {
    x: cx + radius * Math.cos(angleRadians),
    y: cy + radius * Math.sin(angleRadians)
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  var start = polarToCartesian(cx, cy, radius, endAngle);
  var end = polarToCartesian(cx, cy, radius, startAngle);
  var arcSweep = (endAngle - startAngle <= 180) ? '0' : '1';
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    'Z'
  ].join(' ');
}

// ============================================================
// DIAGRAM REGISTRY
// ============================================================

const DiagramRegistry = {
  renderers: {},

  register(type, renderFn) {
    this.renderers[type] = renderFn;
  },

  render(container, descriptor) {
    if (!container) {
      console.warn('[DiagramRenderer] Container is null — cannot render');
      return null;
    }
    if (!descriptor || descriptor.type === 'none' || !descriptor.type) return null;

    const renderer = this.renderers[descriptor.type];
    if (!renderer) {
      console.warn('[DiagramRenderer] Unknown type:', descriptor.type);
      return null;
    }

    const svg = svgEl('svg', {
      viewBox: '0 0 800 300',
      class: 'im-diagram-svg',
      'aria-label': 'Math diagram'
    });
    container.appendChild(svg);

    try {
      renderer(svg, descriptor.params || {});
    } catch (err) {
      console.error('[DiagramRenderer] Render error:', err);
      container.removeChild(svg);
      return null;
    }

    console.log('[DiagramRenderer] Rendered:', descriptor.type);
    return svg;
  }
};

// ============================================================
// NUMBER LINE RENDERER
// ============================================================

function renderNumberLine(svg, params) {
  var min = params.min;
  var max = params.max;
  var markers = params.markers || [];
  var showLabels = params.labels !== false;
  var step = params.step;
  var highlightRange = params.highlightRange || null;

  // --- Parameter validation ---
  min = Math.max(-10000, Math.min(10000, min));
  max = Math.max(-10000, Math.min(10000, max));

  if (max <= min) {
    console.warn('[DiagramRenderer] numberLine: max must be greater than min (got min=' + min + ', max=' + max + ')');
    return;
  }

  // Auto-calculate step if not provided or invalid
  if (!step || step <= 0) {
    var range = max - min;
    if (range <= 20) step = 1;
    else if (range <= 100) step = 5;
    else if (range <= 200) step = 10;
    else if (range <= 500) step = 25;
    else if (range <= 1000) step = 50;
    else step = 100;
  }

  // Floating-point fix: determine decimal places from step
  var decimals = 0;
  var stepStr = String(step);
  if (stepStr.indexOf('.') !== -1) {
    decimals = stepStr.split('.')[1].length;
  }

  // --- Layout constants ---
  var leftPad = 60;
  var rightPad = 60;
  var usableWidth = 800 - leftPad - rightPad; // 680
  var midY = 180;
  var tickHalf = 10;

  // Convert a value to x-coordinate
  function valToX(v) {
    return leftPad + ((v - min) / (max - min)) * usableWidth;
  }

  // --- Highlight range (draw behind everything) ---
  if (highlightRange && highlightRange.from != null && highlightRange.to != null) {
    var hrFrom = Math.max(min, Math.min(max, highlightRange.from));
    var hrTo = Math.max(min, Math.min(max, highlightRange.to));
    if (hrTo > hrFrom) {
      var hrGroup = svgEl('g', { class: 'im-diagram-highlight-range' });
      hrGroup.appendChild(svgEl('rect', {
        x: valToX(hrFrom),
        y: midY - 40,
        width: valToX(hrTo) - valToX(hrFrom),
        height: 80,
        rx: 4
      }));
      svg.appendChild(hrGroup);
    }
  }

  // --- Title text (centered above number line) ---
  if (params.title && typeof params.title === 'string') {
    var titleEl = svgEl('text', {
      x: 400,
      y: 30,
      class: 'im-diagram-title'
    });
    titleEl.textContent = params.title;
    svg.appendChild(titleEl);
  }

  // --- Main axis line ---
  var axisGroup = svgEl('g', { class: 'im-diagram-axis' });

  axisGroup.appendChild(svgEl('line', {
    x1: leftPad,
    y1: midY,
    x2: 800 - rightPad,
    y2: midY
  }));

  // Arrow tip at left end
  var arrowSize = 8;
  axisGroup.appendChild(svgEl('polygon', {
    points: (leftPad) + ',' + midY + ' ' +
            (leftPad + arrowSize) + ',' + (midY - arrowSize / 2) + ' ' +
            (leftPad + arrowSize) + ',' + (midY + arrowSize / 2)
  }));

  // Arrow tip at right end
  var rx = 800 - rightPad;
  axisGroup.appendChild(svgEl('polygon', {
    points: rx + ',' + midY + ' ' +
            (rx - arrowSize) + ',' + (midY - arrowSize / 2) + ' ' +
            (rx - arrowSize) + ',' + (midY + arrowSize / 2)
  }));

  svg.appendChild(axisGroup);

  // --- Tick marks and labels ---
  // Find first tick value at or after min that's aligned to step
  var firstTick = Math.ceil(min / step) * step;

  for (var v = firstTick; v <= max; v += step) {
    var x = valToX(v);
    var tickGroup = svgEl('g', { class: 'im-diagram-tick' });
    tickGroup.appendChild(svgEl('line', {
      x1: x,
      y1: midY - tickHalf,
      x2: x,
      y2: midY + tickHalf
    }));
    svg.appendChild(tickGroup);

    if (showLabels) {
      var label = svgEl('text', {
        x: x,
        y: midY + tickHalf + 20,
        class: 'im-diagram-tick-label'
      });
      label.textContent = String(parseFloat(v.toFixed(decimals)));
      svg.appendChild(label);
    }
  }

  // Also ensure min and max endpoints have ticks if they don't fall on a step
  var endpoints = [min, max];
  for (var e = 0; e < endpoints.length; e++) {
    var ev = endpoints[e];
    // Check if this endpoint already has a tick (is aligned to step)
    if ((ev - firstTick) % step !== 0) {
      var ex = valToX(ev);
      var eTick = svgEl('g', { class: 'im-diagram-tick' });
      eTick.appendChild(svgEl('line', {
        x1: ex,
        y1: midY - tickHalf,
        x2: ex,
        y2: midY + tickHalf
      }));
      svg.appendChild(eTick);

      if (showLabels) {
        var eLabel = svgEl('text', {
          x: ex,
          y: midY + tickHalf + 20,
          class: 'im-diagram-tick-label'
        });
        eLabel.textContent = String(parseFloat(ev.toFixed(decimals)));
        svg.appendChild(eLabel);
      }
    }
  }

  // --- Fraction ticks and labels ---
  var showFractions = params.showFractions === true;
  var fracDenom = params.fractionDenominator;
  if (showFractions && fracDenom && fracDenom > 0 && Number.isInteger(fracDenom)) {
    for (var fi = 1; fi < fracDenom; fi++) {
      var fracVal = min + (fi / fracDenom) * (max - min);
      var fracX = valToX(fracVal);
      var fracTickGroup = svgEl('g', { class: 'im-diagram-fraction-tick' });
      fracTickGroup.appendChild(svgEl('line', {
        x1: fracX,
        y1: midY - 5,
        x2: fracX,
        y2: midY + 5
      }));
      svg.appendChild(fracTickGroup);

      var fracLabel = svgEl('text', {
        x: fracX,
        y: midY + tickHalf + 35,
        class: 'im-diagram-fraction-label'
      });
      fracLabel.textContent = fi + '/' + fracDenom;
      svg.appendChild(fracLabel);
    }
  }

  // --- Markers (gold, above axis) ---
  for (var m = 0; m < markers.length; m++) {
    var mv = markers[m];
    if (mv < min || mv > max) {
      console.warn('[DiagramRenderer] numberLine: marker ' + mv + ' is outside range [' + min + ', ' + max + '], skipping');
      continue;
    }

    var mx = valToX(mv);
    var markerGroup = svgEl('g', { class: 'im-diagram-marker' });

    // Dot above axis
    markerGroup.appendChild(svgEl('circle', {
      cx: mx,
      cy: midY - 30,
      r: 6
    }));

    // Downward-pointing arrow from dot to axis
    markerGroup.appendChild(svgEl('polygon', {
      points: mx + ',' + (midY - 4) + ' ' +
              (mx - 5) + ',' + (midY - 14) + ' ' +
              (mx + 5) + ',' + (midY - 14)
    }));

    // Line connecting dot to arrow
    markerGroup.appendChild(svgEl('line', {
      x1: mx,
      y1: midY - 24,
      x2: mx,
      y2: midY - 14,
      stroke: '#ff9500',
      'stroke-width': 2
    }));

    // Value label above dot (convert to fraction if applicable)
    var mLabel = svgEl('text', {
      x: mx,
      y: midY - 45
    });
    var mLabelText = String(mv);
    if (showFractions && fracDenom && fracDenom > 0) {
      var numerator = Math.round(mv * fracDenom);
      if (Math.abs(numerator / fracDenom - mv) < 0.001) {
        mLabelText = numerator + '/' + fracDenom;
      }
    }
    mLabel.textContent = mLabelText;
    markerGroup.appendChild(mLabel);

    svg.appendChild(markerGroup);
  }
}

// Register the number line renderer
DiagramRegistry.register('numberLine', renderNumberLine);

// ============================================================
// BAR GRAPH RENDERER
// ============================================================

function renderBarGraph(svg, params) {
  var categories = params.categories || [];
  var values = params.values || [];
  var title = params.title || null;
  var yAxisLabel = params.yAxisLabel || null;
  var xAxisLabel = params.xAxisLabel || null;
  var yMax = params.yMax || null;
  var yStep = params.yStep || null;
  var orientation = params.orientation || 'vertical';
  var highlightIndex = params.highlightIndex != null ? params.highlightIndex : null;
  var showValues = params.showValues === true;

  // --- Validation ---
  if (!categories.length || !values.length) {
    console.warn('[DiagramRenderer] barGraph: categories and values are required');
    return;
  }
  if (categories.length !== values.length) {
    console.warn('[DiagramRenderer] barGraph: categories.length (' + categories.length + ') !== values.length (' + values.length + ')');
    return;
  }

  // Override viewBox for bar graph (needs more vertical space)
  svg.setAttribute('viewBox', '0 0 800 400');

  // Clamp values to non-negative
  for (var i = 0; i < values.length; i++) {
    values[i] = Math.max(0, values[i]);
  }

  // Auto-calculate yStep if not provided
  var maxVal = Math.max.apply(null, values);
  if (!yStep || yStep <= 0) {
    var raw = maxVal * 1.15;
    if (raw <= 10) yStep = 1;
    else if (raw <= 20) yStep = 2;
    else if (raw <= 50) yStep = 5;
    else if (raw <= 100) yStep = 10;
    else if (raw <= 200) yStep = 20;
    else if (raw <= 500) yStep = 50;
    else yStep = 100;
  }

  // Auto-calculate yMax if not provided
  if (!yMax || yMax <= 0) {
    yMax = Math.ceil(maxVal * 1.15 / yStep) * yStep;
    if (yMax < yStep) yMax = yStep;
  }

  // Floating-point fix for y-axis labels
  var yDecimals = 0;
  var yStepStr = String(yStep);
  if (yStepStr.indexOf('.') !== -1) {
    yDecimals = yStepStr.split('.')[1].length;
  }

  // --- Layout constants ---
  var CHART_LEFT, CHART_RIGHT, CHART_TOP, CHART_BOTTOM;
  var CHART_WIDTH, CHART_HEIGHT;

  if (orientation === 'horizontal') {
    CHART_LEFT = 120;
    CHART_RIGHT = 740;
    CHART_TOP = 50;
    CHART_BOTTOM = 340;
  } else {
    CHART_LEFT = 80;
    CHART_RIGHT = 740;
    CHART_TOP = 50;
    CHART_BOTTOM = 340;
  }
  CHART_WIDTH = CHART_RIGHT - CHART_LEFT;
  CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;
  var BAR_GAP_RATIO = 0.3;

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleEl = svgEl('text', { x: 400, y: 30, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  if (orientation === 'horizontal') {
    // === HORIZONTAL ORIENTATION ===
    var hSlotHeight = CHART_HEIGHT / categories.length;
    var hBarHeight = hSlotHeight * (1 - BAR_GAP_RATIO);
    var hGapHeight = hSlotHeight * BAR_GAP_RATIO;

    // 2. Vertical gridlines
    for (var gv = 0; gv <= yMax; gv += yStep) {
      var gx = CHART_LEFT + (gv / yMax) * CHART_WIDTH;
      var gridGroup = svgEl('g', { class: 'im-diagram-gridline' });
      gridGroup.appendChild(svgEl('line', {
        x1: gx, y1: CHART_TOP, x2: gx, y2: CHART_BOTTOM
      }));
      svg.appendChild(gridGroup);

      // X-axis labels (values along bottom)
      var xLabel = svgEl('text', {
        x: gx, y: CHART_BOTTOM + 20,
        class: 'im-diagram-axis-label',
        'text-anchor': 'middle'
      });
      xLabel.textContent = String(parseFloat(gv.toFixed(yDecimals)));
      svg.appendChild(xLabel);
    }

    // 3. Y-axis line (left)
    var yAxisGroup = svgEl('g', { class: 'im-diagram-axis' });
    yAxisGroup.appendChild(svgEl('line', {
      x1: CHART_LEFT, y1: CHART_TOP, x2: CHART_LEFT, y2: CHART_BOTTOM
    }));
    svg.appendChild(yAxisGroup);

    // 4. X-axis line (bottom)
    var xAxisGroup = svgEl('g', { class: 'im-diagram-axis' });
    xAxisGroup.appendChild(svgEl('line', {
      x1: CHART_LEFT, y1: CHART_BOTTOM, x2: CHART_RIGHT, y2: CHART_BOTTOM
    }));
    svg.appendChild(xAxisGroup);

    // 5. Bars (horizontal)
    for (var hi = 0; hi < categories.length; hi++) {
      var hBarY = CHART_TOP + (hi * hSlotHeight) + (hGapHeight / 2);
      var hBarWidth = (values[hi] / yMax) * CHART_WIDTH;
      var hBarClass = 'im-diagram-bar';
      if (highlightIndex === hi) hBarClass += ' im-diagram-bar-highlight';

      var hBarGroup = svgEl('g', { class: hBarClass });
      hBarGroup.appendChild(svgEl('rect', {
        x: CHART_LEFT,
        y: hBarY,
        width: hBarWidth,
        height: hBarHeight,
        rx: 2
      }));
      svg.appendChild(hBarGroup);

      // Value labels
      if (showValues) {
        var hValLabel = svgEl('text', {
          x: CHART_LEFT + hBarWidth + 16,
          y: hBarY + hBarHeight / 2 + 4,
          class: 'im-diagram-bar-value',
          'text-anchor': 'start'
        });
        hValLabel.textContent = String(values[hi]);
        svg.appendChild(hValLabel);
      }

      // Category labels (left of bars)
      var hCatLabel = svgEl('text', {
        x: CHART_LEFT - 10,
        y: hBarY + hBarHeight / 2 + 4,
        class: 'im-diagram-category-label',
        'text-anchor': 'end'
      });
      hCatLabel.textContent = categories[hi];
      svg.appendChild(hCatLabel);
    }

    // 6. Axis titles
    if (xAxisLabel) {
      var xTitleEl = svgEl('text', {
        x: CHART_LEFT + CHART_WIDTH / 2, y: CHART_BOTTOM + 50,
        class: 'im-diagram-axis-title'
      });
      xTitleEl.textContent = xAxisLabel;
      svg.appendChild(xTitleEl);
    }
    if (yAxisLabel) {
      var midY = CHART_TOP + CHART_HEIGHT / 2;
      var yTitleEl = svgEl('text', {
        x: 20, y: midY,
        class: 'im-diagram-axis-title',
        transform: 'rotate(-90, 20, ' + midY + ')'
      });
      yTitleEl.textContent = yAxisLabel;
      svg.appendChild(yTitleEl);
    }

  } else {
    // === VERTICAL ORIENTATION (default) ===
    var slotWidth = CHART_WIDTH / categories.length;
    var barWidth = slotWidth * (1 - BAR_GAP_RATIO);
    var gapWidth = slotWidth * BAR_GAP_RATIO;

    // 2. Y-axis gridlines (horizontal, behind bars)
    for (var gy = 0; gy <= yMax; gy += yStep) {
      var gyPos = CHART_BOTTOM - (gy / yMax) * CHART_HEIGHT;
      var gridGrp = svgEl('g', { class: 'im-diagram-gridline' });
      gridGrp.appendChild(svgEl('line', {
        x1: CHART_LEFT, y1: gyPos, x2: CHART_RIGHT, y2: gyPos
      }));
      svg.appendChild(gridGrp);

      // 3. Y-axis labels
      var yLabel = svgEl('text', {
        x: CHART_LEFT - 10, y: gyPos + 4,
        class: 'im-diagram-axis-label',
        'text-anchor': 'end'
      });
      yLabel.textContent = String(parseFloat(gy.toFixed(yDecimals)));
      svg.appendChild(yLabel);
    }

    // 4. Y-axis line (left edge)
    var vYAxisGroup = svgEl('g', { class: 'im-diagram-axis' });
    vYAxisGroup.appendChild(svgEl('line', {
      x1: CHART_LEFT, y1: CHART_TOP, x2: CHART_LEFT, y2: CHART_BOTTOM
    }));
    svg.appendChild(vYAxisGroup);

    // 5. X-axis line (bottom edge)
    var vXAxisGroup = svgEl('g', { class: 'im-diagram-axis' });
    vXAxisGroup.appendChild(svgEl('line', {
      x1: CHART_LEFT, y1: CHART_BOTTOM, x2: CHART_RIGHT, y2: CHART_BOTTOM
    }));
    svg.appendChild(vXAxisGroup);

    // 6. Bars
    for (var vi = 0; vi < categories.length; vi++) {
      var barX = CHART_LEFT + (vi * slotWidth) + (gapWidth / 2);
      var barHeight = (values[vi] / yMax) * CHART_HEIGHT;
      var barY = CHART_BOTTOM - barHeight;
      var barClass = 'im-diagram-bar';
      if (highlightIndex === vi) barClass += ' im-diagram-bar-highlight';

      var barGroup = svgEl('g', { class: barClass });
      barGroup.appendChild(svgEl('rect', {
        x: barX,
        y: barY,
        width: barWidth,
        height: barHeight,
        rx: 2
      }));
      svg.appendChild(barGroup);

      // 7. Value labels above bars
      if (showValues) {
        var valLabel = svgEl('text', {
          x: barX + barWidth / 2,
          y: barY - 8,
          class: 'im-diagram-bar-value'
        });
        valLabel.textContent = String(values[vi]);
        svg.appendChild(valLabel);
      }

      // 8. Category labels below x-axis
      var catLabel = svgEl('text', {
        x: barX + barWidth / 2,
        y: CHART_BOTTOM + 25,
        class: 'im-diagram-category-label'
      });
      catLabel.textContent = categories[vi];
      svg.appendChild(catLabel);
    }

    // 9. Y-axis title
    if (yAxisLabel) {
      var vMidY = CHART_TOP + CHART_HEIGHT / 2;
      var vYTitle = svgEl('text', {
        x: 20, y: vMidY,
        class: 'im-diagram-axis-title',
        transform: 'rotate(-90, 20, ' + vMidY + ')'
      });
      vYTitle.textContent = yAxisLabel;
      svg.appendChild(vYTitle);
    }

    // 10. X-axis title
    if (xAxisLabel) {
      var vXTitle = svgEl('text', {
        x: CHART_LEFT + CHART_WIDTH / 2, y: CHART_BOTTOM + 50,
        class: 'im-diagram-axis-title'
      });
      vXTitle.textContent = xAxisLabel;
      svg.appendChild(vXTitle);
    }
  }
}

// Register renderers
DiagramRegistry.register('barGraph', renderBarGraph);

// ============================================================
// FRACTION BAR RENDERER
// ============================================================

function renderFractionBar(svg, params) {
  var numerator = params.numerator != null ? params.numerator : 1;
  var denominator = params.denominator != null ? params.denominator : 4;
  var title = params.title || null;
  var showLabel = params.showLabel !== false;
  var highlightParts = params.highlightParts || [];
  var showPartLabels = params.showPartLabels === true;
  var comparison = params.comparison || null;

  // --- Validation ---
  if (denominator < 1) { console.warn('[DiagramRenderer] fractionBar: denominator clamped to 1'); denominator = 1; }
  if (denominator > 12) { console.warn('[DiagramRenderer] fractionBar: denominator clamped to 12'); denominator = 12; }
  if (numerator < 0) { numerator = 0; }
  if (numerator > denominator) { numerator = denominator; }

  var hasComparison = comparison && comparison.denominator != null;
  if (hasComparison) {
    if (comparison.denominator < 1) { comparison.denominator = 1; }
    if (comparison.denominator > 12) { comparison.denominator = 12; }
    if (comparison.numerator == null) { comparison.numerator = 0; }
    if (comparison.numerator < 0) { comparison.numerator = 0; }
    if (comparison.numerator > comparison.denominator) { comparison.numerator = comparison.denominator; }
  }

  // Override viewBox
  if (hasComparison) {
    svg.setAttribute('viewBox', '0 0 800 320');
  } else {
    svg.setAttribute('viewBox', '0 0 800 200');
  }

  // --- Layout constants ---
  var BAR_LEFT = 60;
  var BAR_RIGHT = 740;
  var BAR_TOP = 50;
  var BAR_HEIGHT = 60;
  var BAR_WIDTH = BAR_RIGHT - BAR_LEFT;
  var PART_WIDTH = BAR_WIDTH / denominator;
  var LABEL_Y = BAR_TOP + BAR_HEIGHT + 30;

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleEl = svgEl('text', { x: 400, y: 30, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  // --- Helper to render a single fraction bar ---
  function drawBar(barTop, num, den, labelY, hParts) {
    var partW = BAR_WIDTH / den;

    // 2. Outer border
    svg.appendChild(svgEl('rect', {
      x: BAR_LEFT, y: barTop, width: BAR_WIDTH, height: BAR_HEIGHT,
      class: 'im-diagram-fraction-border'
    }));

    // 3. Shaded parts
    for (var i = 0; i < num; i++) {
      var cls = 'im-diagram-fraction-filled';
      if (hParts && hParts.indexOf(i) !== -1) {
        cls = 'im-diagram-fraction-highlight';
      }
      svg.appendChild(svgEl('rect', {
        x: BAR_LEFT + i * partW, y: barTop, width: partW, height: BAR_HEIGHT,
        class: cls
      }));
    }

    // 4. Divider lines
    for (var j = 1; j < den; j++) {
      var divGroup = svgEl('g', { class: 'im-diagram-fraction-divider' });
      divGroup.appendChild(svgEl('line', {
        x1: BAR_LEFT + j * partW, y1: barTop,
        x2: BAR_LEFT + j * partW, y2: barTop + BAR_HEIGHT
      }));
      svg.appendChild(divGroup);
    }

    // 5. Part labels
    if (showPartLabels) {
      for (var k = 0; k < den; k++) {
        var pLabel = svgEl('text', {
          x: BAR_LEFT + (k + 0.5) * partW, y: barTop + BAR_HEIGHT / 2 + 5,
          class: 'im-diagram-fraction-part-label'
        });
        pLabel.textContent = '1/' + den;
        svg.appendChild(pLabel);
      }
    }

    // 6. Fraction label
    if (showLabel) {
      var fLabel = svgEl('text', {
        x: 400, y: labelY,
        class: 'im-diagram-fraction-label'
      });
      fLabel.textContent = num + '/' + den;
      svg.appendChild(fLabel);
    }
  }

  // Draw primary bar
  drawBar(BAR_TOP, numerator, denominator, LABEL_Y, highlightParts);

  // 7. Comparison bar
  if (hasComparison) {
    var BAR2_TOP = BAR_TOP + BAR_HEIGHT + 50;
    var LABEL2_Y = BAR2_TOP + BAR_HEIGHT + 30;
    drawBar(BAR2_TOP, comparison.numerator, comparison.denominator, LABEL2_Y, []);
  }
}

DiagramRegistry.register('fractionBar', renderFractionBar);

// ============================================================
// FRACTION CIRCLE RENDERER
// ============================================================

function renderFractionCircle(svg, params) {
  var numerator = params.numerator != null ? params.numerator : 1;
  var denominator = params.denominator != null ? params.denominator : 4;
  var title = params.title || null;
  var showLabel = params.showLabel !== false;
  var highlightSectors = params.highlightSectors || [];
  var radius = params.radius || 100;
  var comparison = params.comparison || null;

  // --- Validation ---
  if (denominator < 1) { console.warn('[DiagramRenderer] fractionCircle: denominator clamped to 1'); denominator = 1; }
  if (denominator > 12) { console.warn('[DiagramRenderer] fractionCircle: denominator clamped to 12'); denominator = 12; }
  if (numerator < 0) { numerator = 0; }
  if (numerator > denominator) { numerator = denominator; }
  if (radius <= 0) { radius = 100; }
  if (radius > 150) { radius = 150; }

  var hasComparison = comparison && comparison.denominator != null;
  if (hasComparison) {
    if (comparison.denominator < 1) { comparison.denominator = 1; }
    if (comparison.denominator > 12) { comparison.denominator = 12; }
    if (comparison.numerator == null) { comparison.numerator = 0; }
    if (comparison.numerator < 0) { comparison.numerator = 0; }
    if (comparison.numerator > comparison.denominator) { comparison.numerator = comparison.denominator; }
  }

  // Override viewBox
  svg.setAttribute('viewBox', '0 0 800 300');

  // --- Center positions ---
  var cx, cy;
  if (hasComparison) {
    cx = 250;
    cy = 150;
  } else {
    cx = 400;
    cy = 150;
  }

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleEl = svgEl('text', { x: 400, y: 20, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  // --- Helper to render a single fraction circle ---
  function drawCircle(centerX, centerY, r, num, den, hSectors) {
    // 2. Circle outline
    svg.appendChild(svgEl('circle', {
      cx: centerX, cy: centerY, r: r,
      class: 'im-diagram-fraction-circle-outline'
    }));

    // 3. Filled sectors
    if (num > 0) {
      if (num === den) {
        // FULL CIRCLE edge case — arc path collapses, use <circle> fill
        var cls = 'im-diagram-fraction-filled';
        // Check if all sectors are highlighted
        var allHighlighted = true;
        for (var h = 0; h < den; h++) {
          if (hSectors.indexOf(h) === -1) { allHighlighted = false; break; }
        }
        if (allHighlighted && hSectors.length > 0) { cls = 'im-diagram-fraction-highlight'; }
        svg.appendChild(svgEl('circle', {
          cx: centerX, cy: centerY, r: r,
          class: cls
        }));
      } else {
        for (var i = 0; i < num; i++) {
          var startAngle = i * (360 / den);
          var endAngle = (i + 1) * (360 / den);
          var sectorCls = 'im-diagram-fraction-filled';
          if (hSectors.indexOf(i) !== -1) {
            sectorCls = 'im-diagram-fraction-highlight';
          }
          svg.appendChild(svgEl('path', {
            d: describeArc(centerX, centerY, r, startAngle, endAngle),
            class: sectorCls
          }));
        }
      }
    }

    // 4. Divider lines (radial lines from center to edge)
    for (var j = 0; j < den; j++) {
      var angle = j * (360 / den);
      var pt = polarToCartesian(centerX, centerY, r, angle);
      var divGroup = svgEl('g', { class: 'im-diagram-fraction-divider' });
      divGroup.appendChild(svgEl('line', {
        x1: centerX, y1: centerY, x2: pt.x, y2: pt.y
      }));
      svg.appendChild(divGroup);
    }

    // 5. Fraction label
    if (showLabel) {
      var fLabel = svgEl('text', {
        x: centerX, y: centerY + r + 30,
        class: 'im-diagram-fraction-label'
      });
      fLabel.textContent = num + '/' + den;
      svg.appendChild(fLabel);
    }
  }

  // Draw primary circle
  drawCircle(cx, cy, radius, numerator, denominator, highlightSectors);

  // 6. Comparison circle
  if (hasComparison) {
    drawCircle(550, cy, radius, comparison.numerator, comparison.denominator, []);
  }
}

DiagramRegistry.register('fractionCircle', renderFractionCircle);

// ============================================================
// ARRAY RENDERER
// ============================================================

function renderArray(svg, params) {
  var rows = params.rows != null ? params.rows : 3;
  var columns = params.columns != null ? params.columns : 4;
  var title = params.title || null;
  var showTotal = params.showTotal === true;
  var highlightRow = params.highlightRow != null ? params.highlightRow : null;
  var highlightCol = params.highlightCol != null ? params.highlightCol : null;
  var highlightCount = params.highlightCount != null ? params.highlightCount : null;
  var showRowLabels = params.showRowLabels === true;
  var showColLabels = params.showColLabels === true;

  // --- Validation ---
  if (rows < 1) { console.warn('[DiagramRenderer] array: rows clamped to 1'); rows = 1; }
  if (rows > 10) { console.warn('[DiagramRenderer] array: rows clamped to 10'); rows = 10; }
  if (columns < 1) { console.warn('[DiagramRenderer] array: columns clamped to 1'); columns = 1; }
  if (columns > 10) { console.warn('[DiagramRenderer] array: columns clamped to 10'); columns = 10; }
  if (highlightRow !== null && (highlightRow < 0 || highlightRow >= rows)) { highlightRow = null; }
  if (highlightCol !== null && (highlightCol < 0 || highlightCol >= columns)) { highlightCol = null; }
  if (highlightCount !== null) {
    if (highlightCount < 0) { highlightCount = 0; }
    if (highlightCount > rows * columns) { highlightCount = rows * columns; }
  }

  // --- Layout ---
  var DOT_RADIUS = 14;
  var DOT_SPACING = 38;
  var padLeft = 60;
  var padTop = 50;
  var padRight = 40;
  var padBottom = 60;

  var gridWidth = (columns - 1) * DOT_SPACING;
  var gridHeight = (rows - 1) * DOT_SPACING;
  var svgWidth = padLeft + gridWidth + padRight;
  var svgHeight = padTop + gridHeight + padBottom;
  svgWidth = Math.max(svgWidth, 300);
  svgHeight = Math.max(svgHeight, 200);

  // Center grid horizontally in viewBox (original padLeft=60, padRight=40 was asymmetric;
  // the 300px minimum clamp made narrow grids visibly left-shifted)
  padLeft = (svgWidth - gridWidth) / 2;

  svg.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleEl = svgEl('text', { x: svgWidth / 2, y: 25, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  // --- 2. Column labels ---
  if (showColLabels) {
    for (var cl = 0; cl < columns; cl++) {
      var colLabel = svgEl('text', {
        x: padLeft + cl * DOT_SPACING, y: padTop - 25,
        class: 'im-diagram-array-label'
      });
      colLabel.textContent = String(cl + 1);
      svg.appendChild(colLabel);
    }
  }

  // --- 3. Row labels ---
  if (showRowLabels) {
    for (var rl = 0; rl < rows; rl++) {
      var rowLabel = svgEl('text', {
        x: padLeft - 30, y: padTop + rl * DOT_SPACING + 5,
        class: 'im-diagram-array-label'
      });
      rowLabel.textContent = String(rl + 1);
      svg.appendChild(rowLabel);
    }
  }

  // --- 4. Circles ---
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < columns; c++) {
      var dotCx = padLeft + c * DOT_SPACING;
      var dotCy = padTop + r * DOT_SPACING;

      var isHighlight = false;
      if (highlightRow !== null && r === highlightRow) { isHighlight = true; }
      if (highlightCol !== null && c === highlightCol) { isHighlight = true; }
      if (highlightCount !== null && (r * columns + c) < highlightCount) { isHighlight = true; }

      var dotClass = isHighlight ? 'im-diagram-array-dot-highlight' : 'im-diagram-array-dot';

      svg.appendChild(svgEl('circle', {
        cx: dotCx, cy: dotCy, r: DOT_RADIUS,
        class: dotClass
      }));
    }
  }

  // --- 5. Total label ---
  if (showTotal) {
    var totalEl = svgEl('text', {
      x: padLeft + gridWidth / 2, y: padTop + gridHeight + 35,
      class: 'im-diagram-array-total'
    });
    totalEl.textContent = '= ' + (rows * columns);
    svg.appendChild(totalEl);
  }
}

DiagramRegistry.register('array', renderArray);

// ============================================================
// STRIP DIAGRAM RENDERER
// ============================================================

function renderStripDiagram(svg, params) {
  var sections = params.sections || [];
  var total = params.total || null;
  var title = params.title || null;
  var equalSections = params.equalSections === true;
  var showBracket = params.showBracket !== false;
  var bracketPosition = params.bracketPosition || 'below';
  var highlightIndex = params.highlightIndex != null ? params.highlightIndex : null;

  // --- Validation ---
  if (!sections.length) {
    console.warn('[DiagramRenderer] stripDiagram: sections array is required');
    return;
  }
  var hasKnownValue = false;
  for (var sv = 0; sv < sections.length; sv++) {
    if (sections[sv].value !== null && sections[sv].value > 0) { hasKnownValue = true; break; }
  }
  if (!hasKnownValue) {
    console.warn('[DiagramRenderer] stripDiagram: at least one section must have a non-null value');
    return;
  }

  // --- ViewBox ---
  var viewHeight = showBracket ? 250 : 200;
  svg.setAttribute('viewBox', '0 0 800 ' + viewHeight);

  // --- Layout constants ---
  var BAR_LEFT = 60;
  var BAR_RIGHT = 740;
  var BAR_HEIGHT = 60;
  var BAR_WIDTH = BAR_RIGHT - BAR_LEFT;
  var BAR_TOP = 50;

  // Adjust BAR_TOP if bracket is above
  if (showBracket && bracketPosition === 'above') {
    BAR_TOP = 90;
  }

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleY = (showBracket && bracketPosition === 'above') ? 25 : 25;
    var titleEl = svgEl('text', { x: 400, y: titleY, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  // --- Section width calculation ---
  var sectionWidths = [];
  if (equalSections) {
    var eqWidth = BAR_WIDTH / sections.length;
    for (var ew = 0; ew < sections.length; ew++) {
      sectionWidths.push(eqWidth);
    }
  } else {
    // Proportional sizing
    var knownTotal = 0;
    var unknownCount = 0;
    for (var si = 0; si < sections.length; si++) {
      if (sections[si].value !== null && sections[si].value > 0) {
        knownTotal += sections[si].value;
      } else {
        unknownCount++;
      }
    }
    var unknownValue = (total && total.value) ? total.value - knownTotal : knownTotal * 0.3;
    if (unknownValue <= 0) { unknownValue = knownTotal * 0.3; }
    var totalValue = knownTotal + (unknownValue * unknownCount);

    var usedWidth = 0;
    for (var sw = 0; sw < sections.length; sw++) {
      if (sw === sections.length - 1) {
        // Last section absorbs rounding drift
        sectionWidths.push(BAR_WIDTH - usedWidth);
      } else {
        var val = (sections[sw].value !== null && sections[sw].value > 0) ? sections[sw].value : unknownValue;
        var w = (val / totalValue) * BAR_WIDTH;
        sectionWidths.push(w);
        usedWidth += w;
      }
    }
  }

  // --- 2. Top bracket ---
  if (showBracket && bracketPosition === 'above') {
    var bY = BAR_TOP - 15;
    var bracketGrp = svgEl('g', { class: 'im-diagram-strip-bracket' });
    bracketGrp.appendChild(svgEl('line', { x1: BAR_LEFT, y1: bY, x2: BAR_RIGHT, y2: bY }));
    bracketGrp.appendChild(svgEl('line', { x1: BAR_LEFT, y1: bY, x2: BAR_LEFT, y2: bY + 5 }));
    bracketGrp.appendChild(svgEl('line', { x1: BAR_RIGHT, y1: bY, x2: BAR_RIGHT, y2: bY + 5 }));
    svg.appendChild(bracketGrp);

    var topTotalLabel = svgEl('text', {
      x: 400, y: bY - 8,
      class: 'im-diagram-strip-total'
    });
    topTotalLabel.textContent = (total && total.label) ? total.label : '';
    svg.appendChild(topTotalLabel);
  }

  // --- 3. Section rectangles ---
  var curX = BAR_LEFT;
  for (var si2 = 0; si2 < sections.length; si2++) {
    var sec = sections[si2];
    var secW = sectionWidths[si2];
    var isUnknown = (sec.value === null || sec.value === undefined);
    var rectClass = isUnknown ? 'im-diagram-strip-unknown' : 'im-diagram-strip-section';
    if (highlightIndex === si2) {
      rectClass = 'im-diagram-fraction-highlight';
    }

    svg.appendChild(svgEl('rect', {
      x: curX, y: BAR_TOP, width: secW, height: BAR_HEIGHT,
      class: rectClass
    }));

    curX += secW;
  }

  // --- 4. Section divider lines ---
  var divX = BAR_LEFT;
  for (var di = 0; di < sections.length - 1; di++) {
    divX += sectionWidths[di];
    svg.appendChild(svgEl('line', {
      x1: divX, y1: BAR_TOP, x2: divX, y2: BAR_TOP + BAR_HEIGHT,
      class: 'im-diagram-strip-divider'
    }));
  }

  // --- 5. Section labels ---
  var labelX = BAR_LEFT;
  for (var li = 0; li < sections.length; li++) {
    var lSec = sections[li];
    var lW = sectionWidths[li];
    var sLabel = svgEl('text', {
      x: labelX + lW / 2, y: BAR_TOP + BAR_HEIGHT / 2,
      class: 'im-diagram-strip-label'
    });
    // Unknown labels get gold color
    if (lSec.value === null || lSec.value === undefined) {
      sLabel.setAttribute('fill', '#ff9500');
      sLabel.setAttribute('font-size', '20');
    }
    sLabel.textContent = lSec.label || '';
    svg.appendChild(sLabel);
    labelX += lW;
  }

  // --- 6. Outer border ---
  svg.appendChild(svgEl('rect', {
    x: BAR_LEFT, y: BAR_TOP, width: BAR_WIDTH, height: BAR_HEIGHT,
    class: 'im-diagram-fraction-border'
  }));

  // --- 7. Bottom bracket ---
  if (showBracket && bracketPosition === 'below') {
    var bbY = BAR_TOP + BAR_HEIGHT + 15;
    var bbGrp = svgEl('g', { class: 'im-diagram-strip-bracket' });
    bbGrp.appendChild(svgEl('line', { x1: BAR_LEFT, y1: bbY, x2: BAR_RIGHT, y2: bbY }));
    bbGrp.appendChild(svgEl('line', { x1: BAR_LEFT, y1: bbY, x2: BAR_LEFT, y2: bbY - 5 }));
    bbGrp.appendChild(svgEl('line', { x1: BAR_RIGHT, y1: bbY, x2: BAR_RIGHT, y2: bbY - 5 }));
    svg.appendChild(bbGrp);

    var btmTotalLabel = svgEl('text', {
      x: 400, y: bbY + 20,
      class: 'im-diagram-strip-total'
    });
    btmTotalLabel.textContent = (total && total.label) ? total.label : '';
    svg.appendChild(btmTotalLabel);
  }
}

DiagramRegistry.register('stripDiagram', renderStripDiagram);

// ============================================================
// AREA MODEL RENDERER
// ============================================================

function decompose(n) {
  if (n <= 0) return [n];
  var parts = [];
  var str = String(Math.floor(Math.abs(n)));
  for (var i = 0; i < str.length; i++) {
    var digit = parseInt(str[i]);
    if (digit > 0) {
      parts.push(digit * Math.pow(10, str.length - 1 - i));
    }
  }
  return parts.length > 0 ? parts : [0];
}

function renderAreaModel(svg, params) {
  var factors = params.factors || [];
  var dec = params.decomposition || null;
  var title = params.title || null;
  var showPartialProducts = params.showPartialProducts !== false;
  var showTotal = params.showTotal === true;
  var highlightCell = params.highlightCell || null;

  // --- Validation ---
  if (!factors || factors.length !== 2) {
    console.warn('[DiagramRenderer] areaModel: factors must be an array of exactly 2 numbers');
    return;
  }
  for (var fi = 0; fi < 2; fi++) {
    if (factors[fi] < 1) { factors[fi] = 1; }
    if (factors[fi] > 999) { console.warn('[DiagramRenderer] areaModel: factor clamped to 999'); factors[fi] = 999; }
  }

  // Auto-decompose if not provided
  var topParts, leftParts;
  if (dec && dec.length === 2) {
    topParts = dec[0];
    leftParts = dec[1];
  } else {
    topParts = decompose(factors[0]);
    leftParts = decompose(factors[1]);
  }

  svg.setAttribute('viewBox', '0 0 800 400');

  // --- Layout constants ---
  var MODEL_LEFT = 120;
  var MODEL_TOP = 80;
  var MODEL_RIGHT = 740;
  var MODEL_BOTTOM = 340;
  var MODEL_WIDTH = MODEL_RIGHT - MODEL_LEFT;
  var MODEL_HEIGHT = MODEL_BOTTOM - MODEL_TOP;

  var topTotal = 0;
  for (var ti = 0; ti < topParts.length; ti++) topTotal += topParts[ti];
  var leftTotal = 0;
  for (var li = 0; li < leftParts.length; li++) leftTotal += leftParts[li];

  // Pre-calculate column widths (last absorbs rounding)
  var colWidths = [];
  var usedW = 0;
  for (var ci = 0; ci < topParts.length; ci++) {
    if (ci === topParts.length - 1) {
      colWidths.push(MODEL_WIDTH - usedW);
    } else {
      var cw = (topParts[ci] / topTotal) * MODEL_WIDTH;
      colWidths.push(cw);
      usedW += cw;
    }
  }

  // Pre-calculate row heights (last absorbs rounding)
  var rowHeights = [];
  var usedH = 0;
  for (var ri = 0; ri < leftParts.length; ri++) {
    if (ri === leftParts.length - 1) {
      rowHeights.push(MODEL_HEIGHT - usedH);
    } else {
      var rh = (leftParts[ri] / leftTotal) * MODEL_HEIGHT;
      rowHeights.push(rh);
      usedH += rh;
    }
  }

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleEl = svgEl('text', { x: 400, y: 30, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  // --- 2. Cell rectangles + 3. Partial products ---
  var cellY = MODEL_TOP;
  for (var r = 0; r < leftParts.length; r++) {
    var cellX = MODEL_LEFT;
    for (var c = 0; c < topParts.length; c++) {
      var cW = colWidths[c];
      var cH = rowHeights[r];
      var cellCls = 'im-diagram-area-cell';
      if (highlightCell && highlightCell[0] === r && highlightCell[1] === c) {
        cellCls = 'im-diagram-area-cell-highlight';
      }

      svg.appendChild(svgEl('rect', {
        x: cellX, y: cellY, width: cW, height: cH,
        class: cellCls
      }));

      // Partial product label
      if (showPartialProducts) {
        var prodLabel = svgEl('text', {
          x: cellX + cW / 2, y: cellY + cH / 2,
          class: 'im-diagram-area-product'
        });
        prodLabel.textContent = String(topParts[c] * leftParts[r]);
        svg.appendChild(prodLabel);
      }

      cellX += cW;
    }
    cellY += cH;
  }

  // --- 4. Top-edge factor labels ---
  var topLabelX = MODEL_LEFT;
  for (var tc = 0; tc < topParts.length; tc++) {
    var factLabel = svgEl('text', {
      x: topLabelX + colWidths[tc] / 2, y: MODEL_TOP - 15,
      class: 'im-diagram-area-factor'
    });
    factLabel.textContent = String(topParts[tc]);
    svg.appendChild(factLabel);
    topLabelX += colWidths[tc];
  }

  // --- 5. Left-edge factor labels ---
  var leftLabelY = MODEL_TOP;
  for (var lr = 0; lr < leftParts.length; lr++) {
    var leftLabel = svgEl('text', {
      x: MODEL_LEFT - 15, y: leftLabelY + rowHeights[lr] / 2,
      class: 'im-diagram-area-factor',
      'text-anchor': 'end'
    });
    leftLabel.textContent = String(leftParts[lr]);
    svg.appendChild(leftLabel);
    leftLabelY += rowHeights[lr];
  }

  // --- 6. Outer border ---
  svg.appendChild(svgEl('rect', {
    x: MODEL_LEFT, y: MODEL_TOP, width: MODEL_WIDTH, height: MODEL_HEIGHT,
    class: 'im-diagram-fraction-border'
  }));

  // --- 7. Internal grid lines ---
  var gridX = MODEL_LEFT;
  for (var gc = 0; gc < topParts.length - 1; gc++) {
    gridX += colWidths[gc];
    svg.appendChild(svgEl('line', {
      x1: gridX, y1: MODEL_TOP, x2: gridX, y2: MODEL_BOTTOM,
      class: 'im-diagram-area-grid'
    }));
  }
  var gridY = MODEL_TOP;
  for (var gr = 0; gr < leftParts.length - 1; gr++) {
    gridY += rowHeights[gr];
    svg.appendChild(svgEl('line', {
      x1: MODEL_LEFT, y1: gridY, x2: MODEL_RIGHT, y2: gridY,
      class: 'im-diagram-area-grid'
    }));
  }

  // --- 8. Total label ---
  if (showTotal) {
    var totalEl = svgEl('text', {
      x: 400, y: MODEL_BOTTOM + 30,
      class: 'im-diagram-array-total'
    });
    totalEl.textContent = '= ' + (factors[0] * factors[1]);
    svg.appendChild(totalEl);
  }
}

DiagramRegistry.register('areaModel', renderAreaModel);

// ============================================================
// DOT PLOT RENDERER
// ============================================================

function renderDotPlot(svg, params) {
  var data = params.data || [];
  var min = params.min;
  var max = params.max;
  var step = params.step || 1;
  var title = params.title || null;
  var xAxisLabel = params.xAxisLabel || null;
  var highlightValue = params.highlightValue != null ? params.highlightValue : null;
  var dotRadius = params.dotRadius || 8;

  // --- Validation ---
  if (!data.length) {
    console.warn('[DiagramRenderer] dotPlot: data array is required');
    return;
  }
  if (step <= 0) { step = 1; }
  if (dotRadius < 3) { dotRadius = 3; }
  if (dotRadius > 15) { dotRadius = 15; }

  // Auto-calculate min/max
  var dataMin = Math.min.apply(null, data);
  var dataMax = Math.max.apply(null, data);
  if (min == null) { min = Math.min(0, dataMin); }
  if (max == null) { max = dataMax + step; }

  // Floating-point fix
  var decimals = 0;
  var stepStr = String(step);
  if (stepStr.indexOf('.') !== -1) {
    decimals = stepStr.split('.')[1].length;
  }

  svg.setAttribute('viewBox', '0 0 800 300');

  // --- Layout constants ---
  var AXIS_LEFT = 60;
  var AXIS_RIGHT = 740;
  var AXIS_Y = 220;
  var AXIS_WIDTH = AXIS_RIGHT - AXIS_LEFT;
  var DOT_SPACING_Y = 22;

  function valueToX(value) {
    return AXIS_LEFT + ((value - min) / (max - min)) * AXIS_WIDTH;
  }

  // Count occurrences
  var counts = {};
  for (var di = 0; di < data.length; di++) {
    var dv = data[di];
    counts[dv] = (counts[dv] || 0) + 1;
  }

  // --- 1. Title ---
  if (title && typeof title === 'string') {
    var titleEl = svgEl('text', { x: 400, y: 25, class: 'im-diagram-title' });
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }

  // --- 2. Axis line ---
  var axisGroup = svgEl('g', { class: 'im-diagram-axis' });
  axisGroup.appendChild(svgEl('line', {
    x1: AXIS_LEFT, y1: AXIS_Y, x2: AXIS_RIGHT, y2: AXIS_Y
  }));
  svg.appendChild(axisGroup);

  // --- 3. Tick marks and labels ---
  var firstTick = Math.ceil(min / step) * step;
  for (var tv = firstTick; tv <= max; tv += step) {
    var tx = valueToX(tv);
    var tickGroup = svgEl('g', { class: 'im-diagram-tick' });
    tickGroup.appendChild(svgEl('line', {
      x1: tx, y1: AXIS_Y, x2: tx, y2: AXIS_Y + 8
    }));
    svg.appendChild(tickGroup);

    var tickLabel = svgEl('text', {
      x: tx, y: AXIS_Y + 22,
      class: 'im-diagram-tick-label'
    });
    tickLabel.textContent = String(parseFloat(tv.toFixed(decimals)));
    svg.appendChild(tickLabel);
  }

  // --- 4. Stacked dots ---
  var values = Object.keys(counts);
  for (var vi = 0; vi < values.length; vi++) {
    var val = parseFloat(values[vi]);
    var count = counts[val];
    var dx = valueToX(val);
    var isHighlight = (highlightValue !== null && val === highlightValue);

    for (var dotIdx = 0; dotIdx < count; dotIdx++) {
      var dy = AXIS_Y - 15 - (dotIdx * DOT_SPACING_Y);
      var dotCls = isHighlight ? 'im-diagram-dot-highlight' : 'im-diagram-dot';

      svg.appendChild(svgEl('circle', {
        cx: dx, cy: dy, r: dotRadius,
        class: dotCls
      }));
    }
  }

  // --- 5. X-axis label ---
  if (xAxisLabel) {
    var xLabel = svgEl('text', {
      x: 400, y: 270,
      class: 'im-diagram-axis-title'
    });
    xLabel.textContent = xAxisLabel;
    svg.appendChild(xLabel);
  }
}

DiagramRegistry.register('dotPlot', renderDotPlot);

// Global export
window.DiagramRegistry = DiagramRegistry;

window.testDiagram = function(containerId, descriptor) {
  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[DiagramRenderer] Container "' + containerId + '" not found, using document.body');
    container = document.body;
  }
  return DiagramRegistry.render(container, descriptor);
};

console.log('[DiagramRenderer] Module loaded. Available: numberLine, barGraph, fractionBar, fractionCircle, array, stripDiagram, areaModel, dotPlot');
console.log('  testDiagram("id", {type: "numberLine", params: {min: 0, max: 20, markers: [14]}})');
console.log('  testDiagram("id", {type: "barGraph", params: {categories: ["A","B","C"], values: [5,8,3]}})');
console.log('  testDiagram("id", {type: "fractionBar", params: {numerator: 3, denominator: 4}})');
console.log('  testDiagram("id", {type: "fractionCircle", params: {numerator: 3, denominator: 4}})');
console.log('  testDiagram("id", {type: "array", params: {rows: 3, columns: 4, showTotal: true}})');
console.log('  testDiagram("id", {type: "stripDiagram", params: {sections: [{value:45,label:"45"},{value:null,label:"?"}], total:{value:78,label:"78"}}})');
console.log('  testDiagram("id", {type: "areaModel", params: {factors: [23, 15], showTotal: true}})');
console.log('  testDiagram("id", {type: "dotPlot", params: {data: [0,2,2,5,8], title: "Miles Ran"}})');

