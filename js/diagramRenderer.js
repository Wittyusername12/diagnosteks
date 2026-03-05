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

console.log('[DiagramRenderer] Module loaded. Available: numberLine, barGraph, fractionBar, fractionCircle');
console.log('  testDiagram("id", {type: "numberLine", params: {min: 0, max: 20, markers: [14]}})');
console.log('  testDiagram("id", {type: "barGraph", params: {categories: ["A","B","C"], values: [5,8,3]}})');
console.log('  testDiagram("id", {type: "fractionBar", params: {numerator: 3, denominator: 4}})');
console.log('  testDiagram("id", {type: "fractionCircle", params: {numerator: 3, denominator: 4}})');

