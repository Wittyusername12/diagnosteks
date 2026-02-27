/* =========================================
   TEACHER REVIEW SCREEN — Split Panel
   Iron Man STEM Mission — Phase 4 Prompt 3

   Self-contained module.
   Exports: TeacherReview.init(container), .show(problems, opts), .hide()
   Does NOT reach into app.js internals — communicates via callbacks.
   ========================================= */

const TeacherReview = (() => {
  // ── Internal State ────────────────────────────────────────────
  let _container = null;
  let _problems = [];
  let _validation = {};
  let _selectedIdx = 0;
  let _showIssues = false;
  let _showCustomForm = false;
  let _options = {};  // { onLaunch, grade, mathTeks, scienceTeks, format, crossCurricular }

  // Custom form state
  let _customQ = '', _customA = '', _customTeks = '', _customDiff = 'medium', _customOp = 'ADD', _customSci = '', _customFav = false;

  const SORT_PRIORITY = { red: 0, yellow: 1, green: 2 };

  const MATH_QUICK_ACTIONS = [
    { label: 'Easier Numbers', icon: '↓', feedback: 'Use smaller, simpler numbers appropriate for this grade level' },
    { label: 'Harder Numbers', icon: '↑', feedback: 'Increase the difficulty with larger or more complex numbers' },
    { label: 'Word Problem', icon: '📖', feedback: 'Rewrite as a real-world word problem with context' },
    { label: 'Bare Math', icon: '🔢', feedback: 'Simplify to just the arithmetic expression, no word problem' },
  ];

  const SCIENCE_QUICK_ACTIONS = [
    { label: 'Simpler Concept', icon: '↓', feedback: 'Simplify to a basic recall or identification question' },
    { label: 'Deeper Thinking', icon: '↑', feedback: 'Rewrite to require prediction, cause-and-effect reasoning, or analysis' },
    { label: 'Better Distractors', icon: '🎯', feedback: 'Make the wrong answer choices more plausible and STAAR-quality' },
    { label: 'Different Scenario', icon: '🔄', feedback: 'Same TEKS standard, but use a completely different example or phenomenon' },
  ];

  // ── Public Interface ──────────────────────────────────────────

  function init(containerEl) {
    _container = containerEl;
  }

  /**
   * Show the review screen with mapped problems.
   * @param {object} apiResult — { math: [...], science: [...] } from cerebrasAPI.generateMission()
   * @param {object} opts — { onLaunch, grade, mathTeks, scienceTeks, format, crossCurricular }
   */
  function show(apiResult, opts) {
    _options = opts || {};
    _selectedIdx = 0;
    _showIssues = false;
    _showCustomForm = false;

    // Map API schema to review schema
    _problems = _mapApiToReview(apiResult.math, apiResult.science, _options.grade);

    // Run validation
    const teksRules = window.TEKS_RULES || {};
    _validation = window.ValidationEngine
      ? window.ValidationEngine.validateAllProblems(_problems, teksRules)
      : {};

    // Sort by confidence ascending (red first, then yellow, then green)
    // Science problems sort after all math problems
    _problems.sort((a, b) => {
      const va = _validation[a.id] || { category: 'yellow' };
      const vb = _validation[b.id] || { category: 'yellow' };
      if (a.type === 'science' && b.type !== 'science') return 1;
      if (a.type !== 'science' && b.type === 'science') return -1;
      return (SORT_PRIORITY[va.category] || 1) - (SORT_PRIORITY[vb.category] || 1);
    });

    // Select first problem (which should be the worst one after sort)
    _selectedIdx = 0;

    _render();
    _container.style.display = 'block';

    // Auto-regenerate hard gate failures (async, runs in background after initial render)
    _autoRegenerateFailures();
  }

  function hide() {
    if (_container) _container.style.display = 'none';
  }

  // ── Schema Mapping ────────────────────────────────────────────

  function _detectFormat(text) {
    if (!text) return 'word';
    const trimmed = text.trim();
    if (/^solve\s*:/i.test(trimmed)) return 'bare';
    if (/^calculate\s*:/i.test(trimmed)) return 'bare';
    if (trimmed.split(/\s+/).length <= 8 && /[+\-×÷*/=]/.test(trimmed)) return 'bare';
    return 'word';
  }

  function _mapApiToReview(mathProblems, scienceProblems, gradeLevel) {
    const problems = [];

    (mathProblems || []).forEach((p) => {
      const displayText = p.narrative || p.wordProblem || '';
      problems.push({
        id: p.id,
        type: 'math',
        teks: p.teks || p.teksCode || '',
        operation: p.operation || '',
        expression: p.expression || '',
        displayText: displayText,
        answer: p.correctAnswer !== undefined ? p.correctAnswer : p.expectedAnswer,
        numbers: p.operands || p.numbers || [],
        difficulty: p.difficulty || 'medium',
        answerType: p.answerType || 'integer',
        format: _detectFormat(displayText),
        crossCurricular: p.scienceTeksConnection
          ? { scienceTeks: p.scienceTeksConnection, label: p.scienceLabel || '' }
          : null,
        source: 'ai',
        gradeLevel: gradeLevel,
        flagged: p.flagged || false,
        flagReason: p.flagReason || null,
        // Review state
        status: 'pending',
        feedback: '',
        favorited: false,
        // Keep original for regeneration
        _original: p
      });
    });

    (scienceProblems || []).forEach((q) => {
      const optTexts = Array.isArray(q.options)
        ? q.options.map(o => typeof o === 'string' ? o : o.text)
        : [];
      let correctIdx = 0;
      if (typeof q.correctAnswer === 'string') {
        correctIdx = q.correctAnswer.charCodeAt(0) - 65; // 'A' → 0
        if (correctIdx < 0 || correctIdx > 3) correctIdx = 0;
      } else if (typeof q.correctIndex === 'number') {
        correctIdx = q.correctIndex;
      }

      problems.push({
        id: q.id,
        type: 'science',
        teks: q.teks || '',
        question: q.question || '',
        options: optTexts,
        correctIndex: correctIdx,
        difficulty: null,
        crossCurricular: null,
        source: 'ai',
        gradeLevel: gradeLevel,
        flagged: q.flagged || false,
        flagReason: q.flagReason || null,
        // Review state
        status: 'pending',
        feedback: '',
        favorited: false,
        _original: q
      });
    });

    return problems;
  }

  // ── Render ────────────────────────────────────────────────────

  function _render() {
    if (!_container) return;
    const approvedCount = _problems.filter(p => p.status === 'approved').length;
    const allDone = approvedCount >= _problems.length;
    const p = _problems[_selectedIdx];
    const v = _validation[p ? p.id : ''] || { category: 'yellow', chips: {}, flags: [] };
    const isScience = p && p.type === 'science';

    // Build subtitle
    const mathTeks = (_options.mathTeks || []).join(', ');
    const sciTeks = (_options.scienceTeks || []).join(', ');
    const subtitle = `Grade ${_options.grade || '?'} · TEKS: ${mathTeks}${sciTeks ? ' · Science: ' + sciTeks : ''}`;

    _container.innerHTML = `
      <div class="im-review-wrapper">
        <!-- HEADER -->
        <div class="im-review-header">
          <div class="im-review-header-left">
            <h1 class="im-review-title">MISSION REVIEW</h1>
            <p class="im-review-subtitle">${_esc(subtitle)}</p>
          </div>
          <div class="im-review-header-right">
            <div class="im-review-progress-group">
              <div class="im-review-progress-bar">
                <div class="im-review-progress-fill" style="width:${(approvedCount / _problems.length) * 100}%;${allDone ? 'background:#00ff64;' : ''}"></div>
              </div>
              <span class="im-review-progress-count">${approvedCount}/${_problems.length}</span>
            </div>
            <button class="im-review-launch-btn${allDone ? ' im-review-launch-ready' : ''}" id="im-review-launch-btn"
              ${allDone ? '' : 'disabled'}>${allDone ? '▶ Launch Mission' : 'Approve All to Launch'}</button>
          </div>
        </div>

        <!-- SPLIT LAYOUT -->
        <div class="im-review-split">
          <!-- LEFT PANEL -->
          <div class="im-review-left" id="im-review-left">
            ${_problems.map((prob, idx) => _renderLeftRow(prob, idx)).join('')}
          </div>

          <!-- RIGHT PANEL -->
          <div class="im-review-right" id="im-review-right">
            ${p ? _renderRightPanel(p, v, isScience) : '<p style="color:rgba(255,255,255,0.3)">No problem selected</p>'}
          </div>
        </div>

        <!-- FOOTER -->
        <div class="im-review-footer">
          <span class="im-review-footer-left">TEACHER REVIEW SCREEN · IRON MAN STEM MISSION</span>
          <span class="im-review-footer-right">● High Confidence &nbsp;&nbsp; ▲ Needs Review &nbsp;&nbsp; ◆ TEKS/Math Violation &nbsp;&nbsp; 🛡️ Safety Flag (Llama Guard)</span>
        </div>
      </div>
    `;

    _bindEvents();
  }

  function _renderLeftRow(prob, idx) {
    const isSel = idx === _selectedIdx;
    const isSci = prob.type === 'science';
    const isOk = prob.status === 'approved';
    const isUp = prob.source === 'uploaded';
    const pv = _validation[prob.id] || { category: 'yellow' };
    const isRegen = prob.status === 'regenerating';
    const preview = (prob.displayText || prob.question || '').substring(0, 50);

    return `
      <div class="im-review-row${isSel ? ' im-review-row-selected' : ''}${isOk ? ' im-review-row-approved' : ''}"
           data-idx="${idx}">
        <div class="im-review-row-inner">
          <div class="im-review-row-badge ${isOk ? 'approved' : isSci ? 'science' : 'math'}">
            ${isRegen ? '<span class="im-review-spinner"></span>' : isOk ? '✓' : (idx + 1)}
          </div>
          <div class="im-review-row-content">
            <p class="im-review-row-preview${isOk ? ' approved' : ''}">${_esc(preview)}${preview.length >= 50 ? '…' : ''}</p>
            <div class="im-review-row-meta">
              <span class="im-review-row-teks" title="${_esc(prob.teks + ': ' + _getTeksDescription(prob.teks, prob.gradeLevel))}">${_esc(prob.teks)}${prob.difficulty ? ' · ' + prob.difficulty : ''}</span>
              ${prob.crossCurricular ? '<span class="im-review-row-cross">✦ cross</span>' : ''}
              ${isUp ? '<span class="im-review-row-uploaded">UPLOADED</span>' : ''}
            </div>
          </div>
          ${_renderConfidenceBadge(pv.category, true)}
          ${prob.favorited ? '<span class="im-review-row-star" title="★ Favorited">★</span>' : ''}
          ${prob.flagged && !isOk ? '<span class="im-review-row-flag" title="Llama Guard flag">🛡️</span>' : ''}
        </div>
      </div>
    `;
  }

  function _renderConfidenceBadge(category, small) {
    const s = small ? 14 : 18;
    if (category === 'green') {
      return `<div class="im-review-badge-green" style="width:${s}px;height:${s}px;" title="High Confidence"></div>`;
    }
    if (category === 'yellow') {
      return `<div class="im-review-badge-yellow" style="border-width:0 ${s / 2}px ${s}px ${s / 2}px;" title="Needs Review"></div>`;
    }
    return `<div class="im-review-badge-red" style="width:${s * 0.75}px;height:${s * 0.75}px;" title="TEKS/Math Violation"></div>`;
  }

  function _renderValidationChip(label, status) {
    const iconMap = { pass: '✅', warn: '⚠️', fail: '❌', pending: '⏳', skip: '—', override: '⚠️' };
    const icon = iconMap[status] || '⏳';
    const displayLabel = status === 'override' ? `${label}: OVERRIDE` : label;
    const cls = `im-review-chip im-review-chip-${status || 'pending'}`;
    return `<span class="${cls}">${icon} ${_esc(displayLabel)}${status === 'pending' ? ': Pending' : ''}</span>`;
  }

  function _renderRightPanel(p, v, isScience) {
    const chips = v.chips || {};
    const quickActions = isScience ? SCIENCE_QUICK_ACTIONS : MATH_QUICK_ACTIONS;

    // Available TEKS for custom form dropdowns
    const teksData = typeof TEKS_DATA !== 'undefined' && TEKS_DATA[_options.grade] ? TEKS_DATA[_options.grade] : { math: [], science: [] };
    const mathTeksOptions = teksData.math.map(t => t.code);
    const sciTeksOptions = teksData.science.map(t => t.code);

    let html = '';

    // Llama Guard banner
    if (p.flagged && p.status !== 'approved') {
      html += `
        <div class="im-review-guard-banner">
          <span class="im-review-guard-icon">🛡️</span>
          <div>
            <p class="im-review-guard-title">LLAMA GUARD FLAG</p>
            <p class="im-review-guard-reason">${_esc(p.flagReason || '')}</p>
          </div>
        </div>`;
    }

    // Badges row (TEKS, difficulty, operation, cross-curricular, uploaded, approved, ★ favorite)
    html += `<div class="im-review-badges">`;
    const teksDesc = _getTeksDescription(p.teks, p.gradeLevel);
    html += `<span class="im-review-badge-teks ${isScience ? 'science' : 'math'}" title="${_esc(p.teks + (teksDesc ? ': ' + teksDesc : ''))}">${_esc(p.teks)}</span>`;
    if (p.difficulty) html += `<span class="im-review-badge-difficulty">${_esc(p.difficulty)}</span>`;
    if (p.operation) html += `<span class="im-review-badge-operation">${_esc(p.operation)}</span>`;
    if (p.format) html += `<span class="im-review-badge-format">${p.format === 'bare' ? 'PURE MATH' : 'WORD'}</span>`;
    if (isScience) html += `<span class="im-review-badge-science-type">SCIENCE · FURY INTERRUPTION</span>`;
    if (p.crossCurricular) {
      const sciCode = p.crossCurricular.scienceTeks || '';
      const sciLabel = p.crossCurricular.label && p.crossCurricular.label !== sciCode
        ? p.crossCurricular.label
        : _getTeksDescription(sciCode, p.gradeLevel);
      html += `<span class="im-review-badge-cross" title="${_esc(sciCode + (sciLabel ? ': ' + sciLabel : ''))}">✦ ${_esc(sciCode)}${sciLabel ? ': ' + _esc(sciLabel) : ''}</span>`;
    }
    if (p.source === 'uploaded') html += `<span class="im-review-badge-uploaded">UPLOADED</span>`;
    if (p.status === 'approved') html += `<span class="im-review-badge-approved">✓ APPROVED</span>`;
    html += `<button class="im-review-fav-btn${p.favorited ? ' active' : ''}" id="im-review-fav-btn">${p.favorited ? '★ Favorited' : '☆ Favorite'}</button>`;
    html += `</div>`;

    // Favorite annotation (expandable when favorited)
    if (p.favorited) {
      html += `<div class="im-review-fav-annotation">
        <textarea class="im-review-fav-textarea" id="im-review-fav-annotation" rows="2" maxlength="500"
          placeholder="What makes this problem great? (optional)">${_esc(p.whyThisIsGood || '')}</textarea>
        <span class="im-review-fav-hint">This note helps the AI learn your preferences for future missions</span>
      </div>`;
    }

    // Validation chips row
    html += `<div class="im-review-chips-row">`;
    html += _renderValidationChip('Structure', chips.structure);
    html += isScience
      ? _renderValidationChip('Science', chips.science || 'pass')
      : _renderValidationChip('Math', chips.math);
    html += _renderValidationChip('Content', chips.content);
    html += _renderValidationChip('TEKS', chips.teks);
    html += _renderValidationChip('LLM Review', chips.llm);
    // Inline confidence badge + label
    const catLabel = v.category === 'green' ? 'High Confidence' : v.category === 'yellow' ? 'Needs Review' : 'TEKS/Math Violation';
    html += `<div class="im-review-chips-confidence">${_renderConfidenceBadge(v.category, false)}<span class="im-review-chips-label im-review-chips-label-${v.category}">${catLabel}</span></div>`;
    html += `</div>`;

    // Retry-exhausted message (shown when TEKS retries failed)
    if (v.retryExhausted && v.retryMessage) {
      html += `<p class="im-review-retry-message">${_esc(v.retryMessage)}</p>`;
    }

    // View issues
    if (v.flags && v.flags.length > 0) {
      html += `<div class="im-review-issues-section">
        <button class="im-review-issues-toggle" id="im-review-issues-toggle">${_showIssues ? '▾ Hide issues' : '▸ View issues'}</button>
        ${_showIssues ? `<div class="im-review-issues-list im-review-issues-${v.category}">
          ${v.flags.map(f => `<p class="im-review-issue${f.includes('VIOLATION') ? ' violation' : ''}">&bull; ${_esc(f)}</p>`).join('')}
        </div>` : ''}
      </div>`;
    } else {
      html += `<div style="margin-bottom:16px"></div>`;
    }

    // Problem content card
    html += `<div class="im-review-content-card${isScience ? ' science' : ''}">`;
    html += `<p class="im-review-content-text">${_esc(p.displayText || p.question || '')}</p>`;
    if (p.expression) {
      html += `<p class="im-review-content-expr">Expression: <span class="im-review-content-mono">${_esc(p.expression)}</span></p>`;
    }
    if (p.answer !== undefined && !p.options) {
      html += `<p class="im-review-content-answer">Answer: <strong class="im-review-content-mono">${typeof p.answer === 'number' ? p.answer.toLocaleString() : p.answer}</strong></p>`;
    }
    if (p.options && Array.isArray(p.options)) {
      html += `<div class="im-review-options-list">`;
      p.options.forEach((opt, oi) => {
        const isCorrect = oi === p.correctIndex;
        html += `<div class="im-review-option${isCorrect ? ' correct' : ''}"><strong>${String.fromCharCode(65 + oi)})</strong> ${_esc(opt)}${isCorrect ? ' ✓ Correct' : ''}</div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;

    // ── APPROVED STATE ──
    if (p.status === 'approved') {
      html += `<div class="im-review-approved-box">
        <p class="im-review-approved-text">✓ This ${isScience ? 'question' : 'problem'} has been approved.${p.favorited ? `<span class="im-review-approved-fav">★ Will inform future generations for ${_esc(p.teks)}${p.whyThisIsGood ? ' — "' + _esc(p.whyThisIsGood) + '"' : ''}</span>` : ''}</p>
        <button class="im-review-undo-btn" id="im-review-undo-btn">↩ Undo Approval</button>
      </div>`;
      return html;
    }

    // ── PENDING/REGENERATING STATE ──

    // Feedback box
    html += `<div class="im-review-feedback-box">
      <p class="im-review-feedback-title">Refine This ${isScience ? 'Question' : 'Problem'}</p>
      <p class="im-review-feedback-subtitle">Quick adjustments:</p>
      <div class="im-review-quick-actions">
        ${quickActions.map(qa => `<button class="im-review-quick-btn" data-feedback="${_esc(qa.feedback)}">${qa.icon} ${_esc(qa.label)}</button>`).join('')}
      </div>
      ${!isScience ? `<div class="im-review-teks-override">
        <label class="im-review-override-label">
          <input type="checkbox" class="im-review-override-checkbox" id="im-review-override-cb" ${p.teksOverride ? 'checked' : ''}>
          <span class="im-review-override-text">${p.teksOverride ? '🔓' : '🔒'} TEKS Override</span>
        </label>
        <span class="im-review-override-hint">Allow numbers beyond TEKS limits for this problem</span>
      </div>` : ''}
      <p class="im-review-feedback-subtitle">Or describe what you want changed:</p>
      <textarea class="im-review-feedback-textarea" id="im-review-feedback" rows="3"
        placeholder="${isScience
          ? "e.g. 'Ask about a different type of force'..."
          : "e.g. 'Keep the multiplication concept but use numbers under 50'..."}">${_esc(p.feedback || '')}</textarea>
      ${p.feedback && p.feedback.trim() ? `<button class="im-review-regen-inline-btn" id="im-review-regen-inline"
        ${p.status === 'regenerating' ? 'disabled' : ''}>${p.status === 'regenerating' ? 'Regenerating...' : '↻ Regenerate with Changes'}</button>` : ''}
    </div>`;

    // Action buttons
    html += `<div class="im-review-actions">
      <button class="im-review-regen-btn${p.feedback && p.feedback.trim() ? ' with-feedback' : ''}" id="im-review-regen-btn"
        ${p.status === 'regenerating' ? 'disabled' : ''}>
        ${p.status === 'regenerating' ? 'Regenerating...' : (p.feedback && p.feedback.trim() ? 'Regenerate with Feedback' : 'Regenerate (Random)')}
      </button>
      <button class="im-review-approve-btn" id="im-review-approve-btn">APPROVE & NEXT →</button>
    </div>`;

    // Replace with Custom (math only)
    if (!isScience) {
      html += `<div class="im-review-custom-section">
        <button class="im-review-custom-toggle" id="im-review-custom-toggle">
          ${_showCustomForm ? '▾ Cancel Custom Problem' : '▸ Replace with Custom Problem'}
        </button>
        ${_showCustomForm ? _renderCustomForm(mathTeksOptions, sciTeksOptions) : ''}
      </div>`;
    }

    return html;
  }

  function _renderCustomForm(mathTeksOptions, sciTeksOptions) {
    return `
      <div class="im-review-custom-form">
        <label class="im-review-custom-label">Question Text *</label>
        <textarea class="im-review-custom-input im-review-custom-textarea" id="im-custom-q" rows="2"
          placeholder="e.g. Mrs. Johnson's class has 24 students...">${_esc(_customQ)}</textarea>

        <div class="im-review-custom-row">
          <div class="im-review-custom-col">
            <label class="im-review-custom-label">Answer *</label>
            <input class="im-review-custom-input" id="im-custom-a" placeholder="e.g. 632" value="${_esc(_customA)}">
          </div>
          <div class="im-review-custom-col">
            <label class="im-review-custom-label">TEKS Code *</label>
            <select class="im-review-custom-input" id="im-custom-teks">
              ${mathTeksOptions.map(t => `<option value="${t}"${t === _customTeks ? ' selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="im-review-custom-row">
          <div class="im-review-custom-col">
            <label class="im-review-custom-label">Difficulty</label>
            <select class="im-review-custom-input" id="im-custom-diff">
              <option value="easy"${_customDiff === 'easy' ? ' selected' : ''}>Easy</option>
              <option value="medium"${_customDiff === 'medium' ? ' selected' : ''}>Medium</option>
              <option value="hard"${_customDiff === 'hard' ? ' selected' : ''}>Hard</option>
            </select>
          </div>
          <div class="im-review-custom-col">
            <label class="im-review-custom-label">Operation</label>
            <select class="im-review-custom-input" id="im-custom-op">
              <option value="ADD"${_customOp === 'ADD' ? ' selected' : ''}>ADD</option>
              <option value="SUBTRACT"${_customOp === 'SUBTRACT' ? ' selected' : ''}>SUBTRACT</option>
              <option value="MULTIPLY"${_customOp === 'MULTIPLY' ? ' selected' : ''}>MULTIPLY</option>
              <option value="DIVIDE"${_customOp === 'DIVIDE' ? ' selected' : ''}>DIVIDE</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <label class="im-review-custom-label">Science TEKS Connection (optional)</label>
          <select class="im-review-custom-input im-review-custom-sci-select" id="im-custom-sci">
            <option value="">None</option>
            ${sciTeksOptions.map(t => `<option value="${t}"${t === _customSci ? ' selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>

        <div class="im-review-custom-fav-row">
          <button class="im-review-fav-btn${_customFav ? ' active' : ''}" id="im-custom-fav-btn">${_customFav ? '★ Favorited' : '☆ Favorite'}</button>
          <span class="im-review-custom-fav-hint">${_customFav ? 'This problem will feed the flywheel for future generation' : 'Favorite to use as a template for future AI-generated problems'}</span>
        </div>

        <button class="im-review-custom-save-btn" id="im-custom-save"
          ${_customQ.trim() && _customA.trim() ? '' : 'disabled'}>Save Custom Problem</button>
      </div>`;
  }

  // ── Event Binding ─────────────────────────────────────────────

  function _bindEvents() {
    if (!_container) return;

    // Left panel row clicks (event delegation)
    const leftPanel = _container.querySelector('#im-review-left');
    if (leftPanel) {
      leftPanel.addEventListener('click', (e) => {
        const row = e.target.closest('.im-review-row');
        if (row) {
          const idx = parseInt(row.dataset.idx);
          if (!isNaN(idx)) {
            _selectedIdx = idx;
            _showIssues = false;
            _showCustomForm = false;
            _render();
          }
        }
      });
    }

    // Launch button
    const launchBtn = _container.querySelector('#im-review-launch-btn');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        const allApproved = _problems.every(p => p.status === 'approved');
        if (allApproved && _options.onLaunch) {
          // Convert review problems back to API format for gameplay
          const result = _convertBackToApi();
          _options.onLaunch(result);
        }
      });
    }

    // Right panel events
    _bindRightPanelEvents();
  }

  function _bindRightPanelEvents() {
    const p = _problems[_selectedIdx];
    if (!p) return;

    // TEKS Override checkbox
    const overrideCb = _container.querySelector('#im-review-override-cb');
    if (overrideCb) {
      overrideCb.addEventListener('change', () => {
        p.teksOverride = overrideCb.checked;
        // Re-validate with override state
        const teksRules = window.TEKS_RULES || {};
        if (window.ValidationEngine) {
          _validation[p.id] = window.ValidationEngine.validateProblem(p, teksRules);
        }
        _render();
      });
    }

    // Favorite button
    const favBtn = _container.querySelector('#im-review-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        p.favorited = !p.favorited;
        if (!p.favorited) {
          p.whyThisIsGood = null; // Clear annotation on un-favorite
        }
        _render();
      });
    }

    // Favorite annotation textarea
    const favAnnotation = _container.querySelector('#im-review-fav-annotation');
    if (favAnnotation) {
      favAnnotation.addEventListener('input', (e) => {
        p.whyThisIsGood = e.target.value.trim() || null;
      });
    }

    // Issues toggle
    const issuesToggle = _container.querySelector('#im-review-issues-toggle');
    if (issuesToggle) {
      issuesToggle.addEventListener('click', () => {
        _showIssues = !_showIssues;
        _render();
      });
    }

    // Undo approval
    const undoBtn = _container.querySelector('#im-review-undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        p.status = 'pending';
        p.favorited = false;
        p.whyThisIsGood = null;
        _render();
      });
    }

    // Quick action chips
    _container.querySelectorAll('.im-review-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        p.feedback = btn.dataset.feedback;
        _render();
      });
    });

    // Feedback textarea
    const textarea = _container.querySelector('#im-review-feedback');
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        p.feedback = e.target.value;
        // Re-render action buttons to show/hide regen-with-feedback
        // But don't full re-render to avoid losing focus
        const inlineBtn = _container.querySelector('#im-review-regen-inline');
        const regenBtn = _container.querySelector('#im-review-regen-btn');
        if (p.feedback.trim()) {
          if (!inlineBtn) _render(); // Need to show inline button
          if (regenBtn) {
            regenBtn.textContent = 'Regenerate with Feedback';
            regenBtn.classList.add('with-feedback');
          }
        } else {
          if (inlineBtn) _render(); // Need to hide inline button
          if (regenBtn) {
            regenBtn.textContent = 'Regenerate (Random)';
            regenBtn.classList.remove('with-feedback');
          }
        }
      });
    }

    // Regenerate buttons (both inline and action bar)
    const regenInline = _container.querySelector('#im-review-regen-inline');
    const regenBtn = _container.querySelector('#im-review-regen-btn');
    const doRegen = () => _regenerateProblem(_selectedIdx);
    if (regenInline) regenInline.addEventListener('click', doRegen);
    if (regenBtn) regenBtn.addEventListener('click', doRegen);

    // Approve button
    const approveBtn = _container.querySelector('#im-review-approve-btn');
    if (approveBtn) {
      approveBtn.addEventListener('click', () => _approveCurrent());
    }

    // Custom form toggle
    const customToggle = _container.querySelector('#im-review-custom-toggle');
    if (customToggle) {
      customToggle.addEventListener('click', () => {
        _showCustomForm = !_showCustomForm;
        _render();
      });
    }

    // Custom form fields
    _bindCustomFormEvents();
  }

  function _bindCustomFormEvents() {
    const qEl = _container.querySelector('#im-custom-q');
    const aEl = _container.querySelector('#im-custom-a');
    const teksEl = _container.querySelector('#im-custom-teks');
    const diffEl = _container.querySelector('#im-custom-diff');
    const opEl = _container.querySelector('#im-custom-op');
    const sciEl = _container.querySelector('#im-custom-sci');
    const favBtn = _container.querySelector('#im-custom-fav-btn');
    const saveBtn = _container.querySelector('#im-custom-save');

    if (qEl) qEl.addEventListener('input', (e) => { _customQ = e.target.value; _updateCustomSaveBtn(); });
    if (aEl) aEl.addEventListener('input', (e) => { _customA = e.target.value; _updateCustomSaveBtn(); });
    if (teksEl) teksEl.addEventListener('change', (e) => { _customTeks = e.target.value; });
    if (diffEl) diffEl.addEventListener('change', (e) => { _customDiff = e.target.value; });
    if (opEl) opEl.addEventListener('change', (e) => { _customOp = e.target.value; });
    if (sciEl) sciEl.addEventListener('change', (e) => { _customSci = e.target.value; });
    if (favBtn) favBtn.addEventListener('click', () => { _customFav = !_customFav; _render(); });
    if (saveBtn) saveBtn.addEventListener('click', () => _saveCustomProblem());
  }

  function _updateCustomSaveBtn() {
    const saveBtn = _container.querySelector('#im-custom-save');
    if (saveBtn) {
      saveBtn.disabled = !(_customQ.trim() && _customA.trim());
    }
  }

  // ── Actions ───────────────────────────────────────────────────

  function _approveCurrent() {
    const p = _problems[_selectedIdx];
    if (!p || p.status === 'approved') return;

    p.status = 'approved';

    // Flywheel: save to ExemplarBank ONLY if favorited
    if (p.favorited && window.exemplarBank) {
      window.exemplarBank.save(p.teks, _buildExemplarSchema(p));
    }

    // Auto-advance to next unapproved
    const nextIdx = _problems.findIndex((x, i) => i > _selectedIdx && x.status !== 'approved');
    if (nextIdx !== -1) {
      _selectedIdx = nextIdx;
    } else {
      // Try from beginning
      const fromStart = _problems.findIndex(x => x.status !== 'approved');
      if (fromStart !== -1) _selectedIdx = fromStart;
    }

    _showIssues = false;
    _showCustomForm = false;
    _render();
  }

  function _buildExemplarSchema(p) {
    return {
      displayText: p.displayText || p.question,
      expression: p.expression || '',
      answer: p.answer,
      operation: p.operation || '',
      difficulty: p.difficulty || '',
      teks: p.teks,
      type: p.type,
      source: p.source,
      whyThisIsGood: p.whyThisIsGood || null
    };
  }

  async function _regenerateProblem(idx) {
    const p = _problems[idx];
    if (!p || p.status === 'regenerating') return;

    const savedOverride = p.teksOverride || false;
    p.status = 'regenerating';
    _render();

    try {
      if (window.cerebrasAPI && window.cerebrasAPI.regenerateProblem) {
        const feedback = (p.feedback || '').trim();
        const isScience = p.type === 'science';

        // Only inject cross-curricular if this problem already had it,
        // or if the teacher's feedback explicitly requests science context
        const feedbackLower = feedback.toLowerCase();
        const feedbackRequestsScience = feedbackLower.includes('science') || feedbackLower.includes('cross-curricular') || feedbackLower.includes('cross curricular');
        const hasCross = !!(p.crossCurricular) || feedbackRequestsScience;

        const regenOpts = {
          format: _options.format || 'mix',
          crossCurricular: hasCross,
          scienceTeks: _options.scienceTeks,
          isScience: isScience
        };

        const MAX_REGEN_RETRIES = 3;
        let bestMapped = null;
        let bestValidation = null;

        for (let attempt = 0; attempt <= (savedOverride || isScience ? 0 : MAX_REGEN_RETRIES); attempt++) {
          const newProblem = await window.cerebrasAPI.regenerateProblem(
            _options.grade, p.teks, p.operation || '', feedback, regenOpts
          );

          if (!newProblem) continue;

          // Map the new problem to review schema
          const mapped = isScience
            ? _mapApiToReview([], [newProblem], _options.grade)[0]
            : _mapApiToReview([newProblem], [], _options.grade)[0];
          if (!mapped) continue;

          mapped.teksOverride = savedOverride;
          const teksRules = window.TEKS_RULES || {};
          const v = window.ValidationEngine
            ? window.ValidationEngine.validateProblem(mapped, teksRules)
            : { category: 'yellow', chips: {}, flags: [] };

          bestMapped = mapped;
          bestValidation = v;

          const hasTeksFailure = v.chips && v.chips.teks === 'fail';
          if (!hasTeksFailure || savedOverride) {
            if (savedOverride && hasTeksFailure) {
              console.log(`[Review] Problem ${idx + 1}: TEKS violation overridden by teacher`);
            }
            break; // Good enough — use this one
          }
          console.log(`[Review] Problem ${idx + 1}: TEKS violation on regeneration, retrying (${attempt + 1}/${MAX_REGEN_RETRIES})`);
        }

        if (bestMapped) {
          Object.assign(p, bestMapped, { status: 'pending', feedback: '', favorited: false, whyThisIsGood: null });
          p.teksOverride = savedOverride;
          if (bestValidation) {
            // Check if retries were exhausted (TEKS still failing without override)
            const hasTeksFailure = bestValidation.chips && bestValidation.chips.teks === 'fail';
            if (hasTeksFailure && !savedOverride) {
              bestValidation.retryExhausted = true;
              bestValidation.retryMessage = 'Could not generate within TEKS constraints. Enable TEKS Override to go beyond limits.';
              console.log(`[Review] Problem ${idx + 1}: All retries exhausted, showing best attempt`);
            }
            _validation[p.id] = bestValidation;
          }
        } else {
          p.status = 'pending';
        }
      } else {
        console.warn('[TeacherReview] regenerateProblem not available');
        p.status = 'pending';
        p.feedback = '';
      }
    } catch (err) {
      console.error('[TeacherReview] Regeneration failed:', err);
      p.status = 'pending';
    }

    _render();
  }

  async function _autoRegenerateFailures() {
    const MAX_RETRIES = 3;
    const teksRules = window.TEKS_RULES || {};
    if (!window.cerebrasAPI || !window.cerebrasAPI.regenerateProblem || !window.ValidationEngine) return;

    for (let i = 0; i < _problems.length; i++) {
      const p = _problems[i];
      if (p.type === 'science') continue;
      if (p.status === 'approved') continue;

      const v = _validation[p.id];
      if (!v || v.category !== 'red') continue;

      // Hard gate failure detected — auto-regenerate
      console.log(`[AutoRegen] Problem ${i + 1} failed hard gate — auto-regenerating (TEKS: ${p.teks})`);
      p.status = 'regenerating';
      _render();

      let fixed = false;
      for (let retry = 0; retry < MAX_RETRIES; retry++) {
        try {
          const hasCross = !!(p.crossCurricular);
          const newProblem = await window.cerebrasAPI.regenerateProblem(
            _options.grade,
            p.teks,
            p.operation || '',
            'Previous problem failed TEKS validation. Generate a new problem that strictly follows TEKS constraints.',
            {
              format: _options.format || 'mix',
              crossCurricular: hasCross,
              scienceTeks: _options.scienceTeks,
              isScience: false
            }
          );

          if (newProblem) {
            const mapped = _mapApiToReview([newProblem], [], _options.grade)[0];
            if (mapped) {
              Object.assign(p, mapped, { status: 'pending', feedback: '', favorited: false });
              const newV = window.ValidationEngine.validateProblem(p, teksRules);
              _validation[p.id] = newV;

              if (newV.category !== 'red') {
                console.log(`[AutoRegen] Problem ${i + 1} fixed on retry ${retry + 1}`);
                fixed = true;
                break;
              } else {
                console.log(`[AutoRegen] Problem ${i + 1} retry ${retry + 1} still failed`);
              }
            }
          }
        } catch (err) {
          console.error(`[AutoRegen] Problem ${i + 1} retry ${retry + 1} error:`, err);
        }
      }

      if (!fixed) {
        p.status = 'pending';
        console.warn(`[AutoRegen] Problem ${i + 1} could not be auto-fixed after ${MAX_RETRIES} retries`);
      }

      _render();
    }

    // Re-sort after auto-regeneration (fewer reds should be at top now)
    _problems.sort((a, b) => {
      const va = _validation[a.id] || { category: 'yellow' };
      const vb = _validation[b.id] || { category: 'yellow' };
      if (a.type === 'science' && b.type !== 'science') return 1;
      if (a.type !== 'science' && b.type === 'science') return -1;
      return (SORT_PRIORITY[va.category] || 1) - (SORT_PRIORITY[vb.category] || 1);
    });
    _selectedIdx = 0;
    _render();
  }

  function _saveCustomProblem() {
    const p = _problems[_selectedIdx];
    if (!p || !_customQ.trim() || !_customA.trim()) return;

    const answerVal = parseFloat(_customA) || _customA;

    // Build expression from answer and operation
    const expr = typeof answerVal === 'number' ? `${answerVal}` : _customA;

    Object.assign(p, {
      displayText: _customQ,
      answer: answerVal,
      expression: expr,
      teks: _customTeks || p.teks,
      difficulty: _customDiff,
      operation: _customOp,
      source: 'uploaded',
      status: 'approved',
      favorited: _customFav,
      crossCurricular: _customSci ? { scienceTeks: _customSci, label: 'Teacher-assigned' } : null,
      flagged: false,
      flagReason: null,
      feedback: '',
      numbers: typeof answerVal === 'number' ? [answerVal] : []
    });

    // Re-validate (uploaded skips layers 2-4)
    if (window.ValidationEngine) {
      const teksRules = window.TEKS_RULES || {};
      _validation[p.id] = window.ValidationEngine.validateProblem(p, teksRules);
    }

    // Flywheel: if favorited, save
    if (_customFav && window.exemplarBank) {
      window.exemplarBank.save(p.teks, _buildExemplarSchema(p));
    }

    _showCustomForm = false;
    _customQ = '';
    _customA = '';
    _customFav = false;

    // Auto-advance
    const nextIdx = _problems.findIndex((x, i) => i > _selectedIdx && x.status !== 'approved');
    if (nextIdx !== -1) _selectedIdx = nextIdx;

    _render();
  }

  // ── Convert Back to API Format ────────────────────────────────

  function _convertBackToApi() {
    const mathProblems = [];
    const scienceProblems = [];

    _problems.forEach(p => {
      if (p.type === 'science') {
        // Convert back to API science format
        const letters = ['A', 'B', 'C', 'D'];
        scienceProblems.push({
          id: p.id,
          afterFirewall: p._original ? p._original.afterFirewall : 0,
          question: p.question,
          options: (p.options || []).map((text, i) => ({ letter: letters[i], text })),
          correctAnswer: letters[p.correctIndex] || 'A',
          teks: p.teks
        });
      } else {
        // Convert back to API math format
        mathProblems.push({
          id: p.id,
          firewallNumber: p._original ? p._original.firewallNumber : 0,
          narrative: p.displayText,
          expression: p.expression,
          correctAnswer: p.answer,
          operation: p.operation,
          operands: p.numbers,
          teks: p.teks,
          primaryType: p._original ? p._original.primaryType : 'computation',
          difficulty: p.difficulty,
          diagnosticFor: p._original ? p._original.diagnosticFor : [],
          answerType: p.answerType || 'integer',
          scienceTeksConnection: p.crossCurricular ? p.crossCurricular.scienceTeks : null
        });
      }
    });

    // Sort math by firewallNumber, science by afterFirewall
    mathProblems.sort((a, b) => a.firewallNumber - b.firewallNumber);
    scienceProblems.sort((a, b) => a.afterFirewall - b.afterFirewall);

    return { math: mathProblems, science: scienceProblems };
  }

  // ── Helpers ───────────────────────────────────────────────────

  function _getTeksDescription(code, gradeLevel) {
    if (!code) return '';
    // Try TEKS_RULES_DATA first (math, detailed)
    const rules = window.TEKS_RULES_DATA || {};
    if (rules[code] && rules[code].text) return rules[code].text;
    // Fall back to TEKS_DATA (has both math + science)
    const grade = gradeLevel || (_options.grade);
    if (typeof TEKS_DATA !== 'undefined' && TEKS_DATA[grade]) {
      const all = [...(TEKS_DATA[grade].math || []), ...(TEKS_DATA[grade].science || [])];
      const match = all.find(t => t.code === code);
      if (match && match.description) return match.description;
    }
    return '';
  }

  function _esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  // ── Public API ────────────────────────────────────────────────
  return { init, show, hide };
})();

window.TeacherReview = TeacherReview;
