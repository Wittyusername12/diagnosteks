/* =========================================
   EXEMPLAR BANK — Flywheel Mechanism
   Iron Man STEM Mission

   Lightweight localStorage wrapper.
   - Tier 1 (shared): Static STAAR seed bank from problem-exemplars.js
   - Tier 2 (teacher): Favorited + approved problems from localStorage
   Only ★ favorited AND approved problems get saved.

   Exports (global): ExemplarBank
   ========================================= */

class ExemplarBank {
  constructor() {
    this._prefix = 'exemplars:';
  }

  /**
   * Save a favorited+approved problem to the teacher's bank.
   * @param {string} teks — TEKS code (e.g., "3.4A")
   * @param {object} problemSchema — Full problem data to store
   */
  save(teks, problemSchema) {
    const key = this._prefix + teks;
    let bank = [];
    try { bank = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { bank = []; }
    bank.push({
      ...problemSchema,
      _savedAt: Date.now(),
      _source: 'teacher'
    });
    // Cap at 50 per TEKS to avoid localStorage bloat
    if (bank.length > 50) bank = bank.slice(-50);
    localStorage.setItem(key, JSON.stringify(bank));
    console.log(`[ExemplarBank] Saved to ${key} (${bank.length} total)`);
  }

  /**
   * Get exemplars from the STAAR seed bank (Batches 1-3 loaded via script tags).
   * @param {string} teks
   * @param {number} count
   * @returns {Array}
   */
  getShared(teks, count = 5) {
    if (typeof selectExemplars !== 'function' || typeof ALL_EXEMPLARS === 'undefined') return [];
    const all = selectExemplars([teks], ALL_EXEMPLARS);
    return all.slice(0, count);
  }

  /**
   * Get exemplars from this teacher's localStorage bank.
   * @param {string} teks
   * @param {number} count
   * @returns {Array}
   */
  getTeacher(teks, count = 5) {
    const key = this._prefix + teks;
    let bank = [];
    try { bank = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { bank = []; }
    // Return most recent entries (newest = highest quality, teacher improved over time)
    return bank.slice(-count);
  }

  /**
   * Get blended exemplars from both shared + teacher banks.
   * Up to 2 from shared (baseline), up to 3 from teacher (personalization).
   * If teacher bank is sparse, fill remaining from shared.
   * @param {string} teks
   * @param {number} count
   * @returns {Array}
   */
  getExemplars(teks, count = 5) {
    const teacherBank = this.getTeacher(teks, 3);
    const teacherCount = teacherBank.length;
    const sharedNeeded = Math.min(count - teacherCount, count);
    const sharedBank = this.getShared(teks, sharedNeeded);
    const blended = [...sharedBank.slice(0, count - teacherCount), ...teacherBank];
    return blended.slice(0, count);
  }
}

window.exemplarBank = new ExemplarBank();
window.ExemplarBank = ExemplarBank;
