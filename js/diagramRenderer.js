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
// DIAGRAM REGISTRY
// ============================================================

const DiagramRegistry = {
  renderers: {},

  register(type, renderFn) {
    this.renderers[type] = renderFn;
  },

  render(container, descriptor) {
    if (!descriptor || descriptor.type === 'none' || !descriptor.type) return null;

    const renderer = this.renderers[descriptor.type];
    if (!renderer) {
      console.warn('[DiagramRenderer] Unknown type:', descriptor.type);
      return null;
    }

    const svg = svgEl('svg', {
      viewBox: '0 0 800 300',
      class: 'hud-diagram',
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
      var hrGroup = svgEl('g', { class: 'diagram-highlight-range' });
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

  // --- Main axis line ---
  var axisGroup = svgEl('g', { class: 'diagram-axis' });

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
    var tickGroup = svgEl('g', { class: 'diagram-tick' });
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
        class: 'diagram-tick-label'
      });
      label.textContent = String(v);
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
      var eTick = svgEl('g', { class: 'diagram-tick' });
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
          class: 'diagram-tick-label'
        });
        eLabel.textContent = String(ev);
        svg.appendChild(eLabel);
      }
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
    var markerGroup = svgEl('g', { class: 'diagram-marker' });

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

    // Value label above dot
    var mLabel = svgEl('text', {
      x: mx,
      y: midY - 45
    });
    mLabel.textContent = String(mv);
    markerGroup.appendChild(mLabel);

    svg.appendChild(markerGroup);
  }
}

// Register the number line renderer
DiagramRegistry.register('numberLine', renderNumberLine);

// Global export
window.DiagramRegistry = DiagramRegistry;

console.log('[DiagramRenderer] Module loaded — test with: DiagramRegistry.render(document.body, {type: "numberLine", params: {min: 0, max: 20, markers: [14]}})');
