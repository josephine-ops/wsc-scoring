import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;600;700&display=swap";
document.head.appendChild(fontLink);

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal: #8B1A2F; --teal-dark: #6A1223; --teal-light: #F7EAEC; --teal-mid: #D4A0AB;
    --aff: #4a90d9; --aff-light: #e8f2fc;
    --neg: #e8703a; --neg-light: #fdf0ea;
    --green: #27ae60; --red: #e74c3c; --amber: #f39c12; --amber-light: #fef5e4;
    --bg: #faf7f8; --white: #ffffff;
    --text: #1a2e35; --text-mid: #4a6570; --text-light: #8fadb5;
    --border: #e8d0d5; --radius: 12px;
    --shadow: 0 2px 16px rgba(139,26,47,0.10);
  }
  body { background: var(--bg); font-family: 'Nunito Sans', sans-serif; color: var(--text); min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--teal-light); }
  ::-webkit-scrollbar-thumb { background: var(--teal-mid); border-radius: 3px; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes modalIn { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* Header */
  .header {
    background: var(--teal); padding: 0 20px; height: 58px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 200;
    box-shadow: 0 2px 12px rgba(139,26,47,0.3);
  }
  .header-brand { display: flex; align-items: center; gap: 10px; }
  .header-logo {
    width: 34px; height: 34px; background: white; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 900; color: var(--teal); font-family: 'Nunito', sans-serif;
  }
  .header-name { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 15px; color: white; line-height: 1.2; }
  .header-sub { font-size: 10px; color: rgba(255,255,255,0.75); letter-spacing: 0.08em; text-transform: uppercase; }

  /* Tabs */
  .tabs { background: var(--white); border-bottom: 2px solid var(--border); padding: 0 20px; display: flex; }
  .tab {
    padding: 13px 20px; border: none; background: transparent;
    font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
    color: var(--text-light); cursor: pointer; transition: all 0.2s;
    border-bottom: 3px solid transparent; margin-bottom: -2px;
    letter-spacing: 0.05em; text-transform: uppercase;
    display: flex; align-items: center; gap: 6px;
  }
  .tab.active { color: var(--teal); border-bottom-color: var(--teal); }
  .tab:not(.active):hover { color: var(--text-mid); }
  .tab-badge {
    background: var(--teal); color: white; font-size: 10px; font-weight: 800;
    padding: 1px 6px; border-radius: 10px; min-width: 18px; text-align: center;
  }

  /* Main */
  .main { flex: 1; padding: 20px 16px; max-width: 680px; margin: 0 auto; width: 100%; }

  /* Card */
  .card {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
    margin-bottom: 14px; box-shadow: var(--shadow); overflow: hidden;
    animation: slideUp 0.3s ease forwards;
  }
  .card-head {
    padding: 13px 17px; display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, var(--teal-light), var(--white));
  }
  .step-num {
    width: 26px; height: 26px; border-radius: 50%; background: var(--teal);
    color: white; font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .card-title { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800; color: var(--text); }
  .card-body { padding: 16px; }

  /* Form */
  .field { margin-bottom: 13px; }
  .field:last-child { margin-bottom: 0; }
  .label { display: block; font-size: 10px; font-weight: 700; color: var(--text-light); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
  .input {
    width: 100%; border: 1.5px solid var(--border); border-radius: 8px;
    padding: 9px 12px; font-family: 'Nunito Sans', sans-serif; font-size: 14px;
    color: var(--text); background: var(--bg); transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 3px rgba(139,26,47,0.1); }
  .input::placeholder { color: var(--text-light); }
  .input:disabled { opacity: 0.5; cursor: not-allowed; }
  .grid3 { display: grid; grid-template-columns: 80px 1fr 80px; gap: 12px; }

  /* Scores */
  .score-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .score-row:last-child { margin-bottom: 0; }
  .score-cat { font-size: 12px; font-weight: 600; color: var(--text-mid); width: 100px; flex-shrink: 0; }
  .score-btns { display: flex; gap: 5px; }
  .score-btn {
    width: 34px; height: 34px; border-radius: 7px; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-light); font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .score-btn:hover:not(.sel) { border-color: var(--teal); color: var(--teal); }
  .score-btn.sel { color: white; transform: scale(1.1); }

  /* ID letter */
  .id-row { display: flex; gap: 7px; }
  .id-btn {
    width: 36px; height: 36px; border-radius: 7px; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-light); font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .id-btn:hover:not(.sel) { border-color: var(--teal); color: var(--teal); }
  .id-btn.sel { background: var(--teal-light); border-color: var(--teal); color: var(--teal-dark); }
  .id-btn.warn { border-color: var(--amber); }
  .id-btn.warn.sel { background: var(--amber-light); border-color: var(--amber); color: #a0690a; }

  /* Duplicate letter warning */
  .dup-warning {
    display: flex; align-items: center; gap: 6px;
    background: var(--amber-light); border: 1px solid #f5d78a; border-radius: 7px;
    padding: 7px 10px; margin-top: 8px;
    font-size: 11px; font-weight: 700; color: #8a5c00;
  }

  /* Team divider */
  .team-divider { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .team-label {
    font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
    padding: 3px 11px; border-radius: 20px; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap;
  }
  .team-label.aff { background: var(--aff-light); color: var(--aff); }
  .team-label.neg { background: var(--neg-light); color: var(--neg); }
  .team-divider-line { flex: 1; height: 1px; background: var(--border); }

  /* Speaker block */
  .speaker-block {
    background: var(--bg); border: 1px solid var(--border); border-radius: 9px;
    padding: 13px; margin-bottom: 9px;
  }
  .speaker-block.has-dup { border-color: var(--amber); }
  .speaker-block-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px; }
  .speaker-num { font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800; color: var(--text-mid); }

  /* Best speaker — position + wow */
  .best-speaker-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .best-pos-btns { display: flex; gap: 6px; }
  .best-btn {
    padding: 6px 12px; border-radius: 7px; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-light); font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .best-btn:hover:not(.sel) { border-color: var(--teal); color: var(--teal); }
  .best-btn.sel { background: var(--teal); color: white; border-color: var(--teal); }
  .wow-divider { width: 1px; height: 24px; background: var(--border); }
  .wow-btn {
    padding: 6px 12px; border-radius: 7px; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-light); font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .wow-btn:hover:not(.sel) { border-color: var(--amber); color: var(--amber); }
  .wow-btn.sel { background: var(--amber); color: white; border-color: var(--amber); }
  .wow-hint { font-size: 10px; color: var(--text-light); font-weight: 600; margin-top: 4px; font-style: italic; }

  /* Winner */
  .winner-row { display: flex; gap: 12px; }
  .winner-btn {
    flex: 1; padding: 15px 12px; border-radius: 10px; border: 2px solid var(--border);
    background: var(--bg); cursor: pointer; transition: all 0.2s; text-align: center;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
  }
  .winner-btn .wid { font-size: 11px; font-weight: 600; color: var(--text-light); margin-top: 3px; }
  .winner-btn.aff.sel { background: var(--aff-light); border-color: var(--aff); color: var(--aff); }
  .winner-btn.aff:hover:not(.sel) { border-color: var(--aff); }
  .winner-btn.neg.sel { background: var(--neg-light); border-color: var(--neg); color: var(--neg); }
  .winner-btn.neg:hover:not(.sel) { border-color: var(--neg); }

  /* Misc */
  .check-row { display: flex; align-items: center; gap: 7px; margin-top: 7px; }
  .check-row input { accent-color: var(--teal); width: 15px; height: 15px; cursor: pointer; }
  .check-row label { font-size: 12px; color: var(--text-light); cursor: pointer; font-weight: 600; }
  /* Validation checklist */
  .checklist-card {
    background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius);
    margin-bottom: 14px; overflow: hidden; box-shadow: var(--shadow);
  }
  .checklist-card.all-good { border-color: var(--green); }
  .checklist-card.has-errors { border-color: #f5c6c2; }
  .checklist-head {
    padding: 12px 16px; display: flex; align-items: center; gap: 9px;
  }
  .checklist-head.all-good { background: #eafaf1; border-bottom: 1px solid #a9dfbf; }
  .checklist-head.has-errors { background: #fdecea; border-bottom: 1px solid #f5c6c2; }
  .checklist-head-title { font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; }
  .checklist-head.all-good .checklist-head-title { color: var(--green); }
  .checklist-head.has-errors .checklist-head-title { color: var(--red); }
  .checklist-body { padding: 10px 16px 14px; }
  .checklist-group { margin-bottom: 10px; }
  .checklist-group:last-child { margin-bottom: 0; }
  .checklist-group-label { font-size: 10px; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
  .checklist-items { display: flex; flex-direction: column; gap: 4px; }
  .checklist-item { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; }
  .checklist-item.ok { color: #1e8449; }
  .checklist-item.err { color: var(--red); }
  .ci-dot { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; }
  .ci-dot.ok { background: var(--green); color: white; }
  .ci-dot.err { background: #fdecea; border: 1.5px solid var(--red); color: var(--red); }

  .submit-btn {
    width: 100%; padding: 15px; border-radius: 10px; border: none;
    background: var(--teal); color: white;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(139,26,47,0.3);
  }
  .submit-btn:hover:not(:disabled) { background: var(--teal-dark); transform: translateY(-1px); }
  .submit-btn:disabled { background: #b0cece; box-shadow: none; cursor: not-allowed; opacity: 0.7; }
  .hint { font-size: 11px; color: var(--text-light); font-weight: 600; margin-bottom: 11px; }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    color: white; padding: 11px 22px; border-radius: 40px;
    font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px;
    z-index: 999; animation: fadeIn 0.3s ease; white-space: nowrap;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .toast.ok { background: var(--green); }
  .toast.warn { background: var(--amber); }

  /* Dashboard */
  .dash-empty { text-align: center; padding: 60px 24px; color: var(--text-light); }
  .dash-empty .icon { font-size: 48px; margin-bottom: 12px; }
  .dash-empty p { font-size: 14px; font-weight: 600; }
  .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
  .stat-card {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 14px; text-align: center; box-shadow: var(--shadow);
  }
  .stat-val { font-family: 'Nunito', sans-serif; font-size: 28px; font-weight: 900; color: var(--teal); }
  .stat-label { font-size: 10px; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
  .section-hd {
    font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
    color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
  }
  .section-hd::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .submissions-list { display: flex; flex-direction: column; gap: 10px; }

  /* Submission card */
  .submission-card {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; box-shadow: var(--shadow); cursor: pointer;
    transition: box-shadow 0.2s, transform 0.15s;
    animation: slideUp 0.3s ease forwards;
  }
  .submission-card:hover { box-shadow: 0 6px 24px rgba(139,26,47,0.18); transform: translateY(-2px); }
  .sub-head {
    padding: 11px 15px; display: flex; align-items: center; justify-content: space-between;
    background: var(--teal-light); border-bottom: 1px solid var(--border);
  }
  .sub-round { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14px; color: var(--teal-dark); }
  .sub-judge { font-size: 11px; color: var(--text-light); font-weight: 600; }
  .sub-room {
    background: var(--teal); color: white; font-family: 'Nunito', sans-serif;
    font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px;
  }
  .sub-body { padding: 13px 15px; }
  .sub-teams { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 11px; }
  .sub-team { padding: 9px 11px; border-radius: 8px; }
  .sub-team.aff { background: var(--aff-light); }
  .sub-team.neg { background: var(--neg-light); }
  .sub-team-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-light); margin-bottom: 2px; }
  .sub-team-id { font-family: 'Nunito', sans-serif; font-size: 20px; font-weight: 900; }
  .sub-team.aff .sub-team-id { color: var(--aff); }
  .sub-team.neg .sub-team-id { color: var(--neg); }
  .sub-team-scores { font-size: 11px; color: var(--text-mid); margin-top: 3px; font-weight: 600; }
  .sub-footer { display: flex; align-items: center; justify-content: space-between; }
  .sub-winner-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 20px; font-family: 'Nunito', sans-serif;
    font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .sub-winner-badge.aff { background: var(--aff-light); color: var(--aff); }
  .sub-winner-badge.neg { background: var(--neg-light); color: var(--neg); }
  .sub-flag {
    background: var(--amber-light); color: #8a5c00; border: 1px solid #f5d78a;
    font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px;
  }
  .tap-hint { font-size: 10px; color: var(--text-light); font-weight: 600; }
  .missing-tag {
    background: #fdecea; color: var(--red); border: 1px solid #f5c6c2;
    font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 10px;
    letter-spacing: 0.04em; text-transform: uppercase; margin-left: 5px;
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(15,30,40,0.55);
    z-index: 500; display: flex; align-items: flex-end;
    backdrop-filter: blur(2px);
  }
  .modal {
    background: var(--white); border-radius: 20px 20px 0 0;
    width: 100%; max-width: 680px; margin: 0 auto;
    max-height: 90vh; overflow-y: auto;
    animation: modalIn 0.3s ease forwards;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.2);
  }
  .modal-handle {
    width: 36px; height: 4px; background: var(--border); border-radius: 2px;
    margin: 12px auto 0;
  }
  .modal-head {
    padding: 16px 20px 14px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--white); z-index: 1;
  }
  .modal-title { font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 900; color: var(--text); }
  .modal-close {
    width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-mid); font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-weight: 700;
    transition: all 0.15s;
  }
  .modal-close:hover { background: var(--border); }
  .modal-body { padding: 18px 20px 30px; }
  .modal-section { margin-bottom: 20px; }
  .modal-section-title {
    font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
    color: var(--text-light); text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
  }
  .modal-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .modal-info-row { display: flex; justify-content: space-between; margin-bottom: 7px; font-size: 13px; }
  .modal-info-label { color: var(--text-light); font-weight: 600; }
  .modal-info-val { color: var(--text); font-weight: 700; }
  .modal-spk-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .modal-spk-table th {
    text-align: left; font-size: 10px; font-weight: 800; color: var(--text-light);
    text-transform: uppercase; letter-spacing: 0.06em; padding: 6px 8px;
    border-bottom: 1px solid var(--border);
  }
  .modal-spk-table td { padding: 8px 8px; border-bottom: 1px solid var(--teal-light); font-weight: 600; }
  .modal-spk-table tr:last-child td { border-bottom: none; }
  .modal-spk-table .total { font-family: 'Nunito', sans-serif; font-weight: 900; color: var(--teal-dark); }
  .modal-team-head {
    display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  }
  .wow-chip {
    background: var(--amber); color: white; font-size: 10px; font-weight: 800;
    padding: 1px 7px; border-radius: 10px; letter-spacing: 0.04em;
  }
  .modal-score-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 6px; }
  .score-pill {
    font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 15px;
    padding: 3px 10px; border-radius: 8px; min-width: 36px; text-align: center;
  }
  .score-pill.aff { background: var(--aff-light); color: var(--aff); }
  .score-pill.neg { background: var(--neg-light); color: var(--neg); }
  .score-pill.teal { background: var(--teal-light); color: var(--teal-dark); }
`;
document.head.appendChild(style);

// ── Helpers ───────────────────────────────────────────────────────────────────
const SCORES = [2, 3, 4, 5, 6, 7];

function ScoreSelector({ value, onChange, color }) {
  const c = color || "var(--teal)";
  return (
    <div className="score-btns">
      {SCORES.map(s => (
        <button
          key={s}
          className={`score-btn ${value === s ? "sel" : ""}`}
          style={value === s ? { background: c, borderColor: c } : {}}
          onClick={() => onChange(s === value ? null : s)}
        >{s}</button>
      ))}
    </div>
  );
}

function IDLetterSelector({ value, onChange, dupLetters = [] }) {
  return (
    <div className="id-row">
      {["A", "B", "C"].map(l => {
        const isDup = dupLetters.includes(l);
        return (
          <button
            key={l}
            className={`id-btn ${value === l ? "sel" : ""} ${isDup ? "warn" : ""}`}
            onClick={() => onChange(l === value ? null : l)}
          >{l}</button>
        );
      })}
    </div>
  );
}

// Returns letters that appear more than once in the speakers array
function getDupLetters(speakers) {
  const letters = speakers.map(s => s.idLetter).filter(Boolean);
  return letters.filter((l, i) => letters.indexOf(l) !== i);
}

const mkSpeaker = () => ({ idLetter: null, presentation: null, strategy: null, content: null });
const mkTeam = () => ({ id: "", missing: false, speakers: [mkSpeaker(), mkSpeaker(), mkSpeaker()], bestSpeakerPos: null, bestSpeakerWow: false, teamwork: null, feedback: null });
const mkForm = () => ({ roundNum: "", judgeName: "", room: "", aff: mkTeam(), neg: mkTeam(), winner: null });

// ── Speaker Block ─────────────────────────────────────────────────────────────
function SpeakerBlock({ spk, idx, onChange, teamColor, dupLetters }) {
  const set = (k, v) => onChange({ ...spk, [k]: v });
  const isDup = spk.idLetter && dupLetters.includes(spk.idLetter);
  return (
    <div className={`speaker-block ${isDup ? "has-dup" : ""}`}>
      <div className="speaker-block-head">
        <span className="speaker-num">Speaker {idx + 1}</span>
        <IDLetterSelector value={spk.idLetter} onChange={v => set("idLetter", v)} dupLetters={dupLetters} />
      </div>
      {isDup && (
        <div className="dup-warning">
          ⚠️ Letter <strong>{spk.idLetter}</strong> is used more than once for this team — please review.
        </div>
      )}
      <div style={{ marginTop: isDup ? 10 : 0 }}>
        <div className="score-row">
          <span className="score-cat">Presentation</span>
          <ScoreSelector value={spk.presentation} onChange={v => set("presentation", v)} color={teamColor} />
        </div>
        <div className="score-row">
          <span className="score-cat">Strategy</span>
          <ScoreSelector value={spk.strategy} onChange={v => set("strategy", v)} color={teamColor} />
        </div>
        <div className="score-row">
          <span className="score-cat">Content</span>
          <ScoreSelector value={spk.content} onChange={v => set("content", v)} color={teamColor} />
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ sub, onClose }) {
  const spkTotal = (spk) => (spk.presentation || 0) + (spk.strategy || 0) + (spk.content || 0);
  const teamSpkTotal = (team) => team.speakers.reduce((a, s) => a + spkTotal(s), 0);
  const hasDups = (team) => getDupLetters(team.speakers).length > 0;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-handle" />
        <div className="modal-head">
          <div className="modal-title">Round {sub.roundNum} · Room {sub.room || "—"}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">

          {/* Setup */}
          <div className="modal-section">
            <div className="modal-section-title">Setup</div>
            <div className="modal-info-row"><span className="modal-info-label">Judge</span><span className="modal-info-val">{sub.judgeName}</span></div>
            <div className="modal-info-row"><span className="modal-info-label">Round</span><span className="modal-info-val">{sub.roundNum}</span></div>
            <div className="modal-info-row"><span className="modal-info-label">Room</span><span className="modal-info-val">{sub.room || "—"}</span></div>
          </div>

          {/* Teams */}
          {[["aff", sub.aff, "Affirmative"], ["neg", sub.neg, "Negative"]].map(([side, team, label]) => (
            <div className="modal-section" key={side}>
              <div className="modal-section-title">{label} #{team.id || "—"}{team.missing && <span className="missing-tag">Missing</span>}</div>
              {hasDups(team) && (
                <div className="dup-warning" style={{ marginBottom: 10 }}>⚠️ Duplicate speaker letters detected — please review.</div>
              )}
              <table className="modal-spk-table">
                <thead>
                  <tr>
                    <th>Spk</th><th>ID</th><th>Pres.</th><th>Strat.</th><th>Content</th><th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {team.speakers.map((spk, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{spk.idLetter || "—"}</td>
                      <td>{spk.presentation || "—"}</td>
                      <td>{spk.strategy || "—"}</td>
                      <td>{spk.content || "—"}</td>
                      <td className="total">{spkTotal(spk) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="modal-score-row" style={{ gap: 8 }}>
                  <span className="modal-info-label" style={{ fontSize: 12 }}>Best Speaker</span>
                  <span className="modal-info-val" style={{ fontSize: 13 }}>
                    {team.bestSpeakerPos || "—"}
                    {team.bestSpeakerWow && <span className="wow-chip" style={{ marginLeft: 6 }}>WOW!</span>}
                  </span>
                </div>
                <div className="modal-score-row" style={{ gap: 8 }}>
                  <span className="modal-info-label" style={{ fontSize: 12 }}>Teamwork</span>
                  <span className={`score-pill ${side}`}>{team.teamwork || "—"}</span>
                </div>
                <div className="modal-score-row" style={{ gap: 8 }}>
                  <span className="modal-info-label" style={{ fontSize: 12 }}>Feedback</span>
                  <span className={`score-pill ${side}`}>{team.feedback || "—"}</span>
                </div>
                <div className="modal-score-row" style={{ gap: 8 }}>
                  <span className="modal-info-label" style={{ fontSize: 12 }}>Speaker Total</span>
                  <span className="score-pill teal">{teamSpkTotal(team)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Winner */}
          <div className="modal-section">
            <div className="modal-section-title">Result</div>
            {sub.winner ? (
              <span className={`sub-winner-badge ${sub.winner}`} style={{ fontSize: 13, padding: "6px 14px" }}>
                🏆 {sub.winner === "aff" ? "Affirmative" : "Negative"} wins (#{sub[sub.winner].id || "—"})
              </span>
            ) : (
              <span style={{ color: "var(--text-light)", fontSize: 13, fontWeight: 600 }}>No winner recorded</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Submission Card ───────────────────────────────────────────────────────────
function SubmissionCard({ sub, onClick }) {
  const totalSpk = (team) => team.speakers.reduce((a, s) => a + (s.presentation || 0) + (s.strategy || 0) + (s.content || 0), 0);
  const hasAnyDup = getDupLetters(sub.aff.speakers).length > 0 || getDupLetters(sub.neg.speakers).length > 0;

  return (
    <div className="submission-card" onClick={onClick}>
      <div className="sub-head">
        <div>
          <div className="sub-round">Round {sub.roundNum}</div>
          <div className="sub-judge">👤 {sub.judgeName}</div>
        </div>
        <div className="sub-room">Room {sub.room || "—"}</div>
      </div>
      <div className="sub-body">
        <div className="sub-teams">
          {[["aff", sub.aff], ["neg", sub.neg]].map(([side, team]) => (
            <div key={side} className={`sub-team ${side}`}>
              <div className="sub-team-label">
                {side === "aff" ? "Affirmative" : "Negative"}
                {team.missing && <span className="missing-tag">Missing</span>}
              </div>
              <div className="sub-team-id">#{team.id || "—"}</div>
              <div className="sub-team-scores">
                Spk: {totalSpk(team)} · TW: {team.teamwork || "—"} · FB: {team.feedback || "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="sub-footer">
          {sub.winner
            ? <span className={`sub-winner-badge ${sub.winner}`}>🏆 {sub.winner === "aff" ? "Affirmative" : "Negative"} wins</span>
            : <span style={{ color: "var(--text-light)", fontSize: 12, fontWeight: 600 }}>No winner recorded</span>
          }
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {hasAnyDup && <span className="sub-flag">⚠️ Review</span>}
            <span className="tap-hint">Tap to expand →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────
function getValidationErrors(form) {
  const errors = { setup: [], aff: [], neg: [], summary: [] };
  if (!form.roundNum) errors.setup.push("Round number");
  if (!form.judgeName.trim()) errors.setup.push("Judge name");
  if (!form.room.trim()) errors.setup.push("Room number");
  for (const [side, label] of [["aff", "Affirmative"], ["neg", "Negative"]]) {
    const team = form[side];
    if (!team.id.trim()) errors[side].push("Team ID");
    team.speakers.forEach((spk, i) => {
      if (!spk.idLetter) errors[side].push("Speaker " + (i+1) + ": ID letter");
      if (!spk.presentation) errors[side].push("Speaker " + (i+1) + ": Presentation");
      if (!spk.strategy) errors[side].push("Speaker " + (i+1) + ": Strategy");
      if (!spk.content) errors[side].push("Speaker " + (i+1) + ": Content");
    });
    if (!team.bestSpeakerPos) errors[side].push("Best speaker");
    if (!team.teamwork) errors[side].push("Teamwork score");
    if (!team.feedback) errors[side].push("Feedback score");
  }
  if (!form.winner) errors.summary.push("Winning team");
  return errors;
}

function ValidationChecklist({ form }) {
  const errors = getValidationErrors(form);
  const groups = [
    { key: "setup", label: "Setup" },
    { key: "aff", label: "Affirmative" },
    { key: "neg", label: "Negative" },
    { key: "summary", label: "Result" },
  ];
  const totalErrors = Object.values(errors).flat().length;
  const allGood = totalErrors === 0;
  return (
    <div className={"checklist-card " + (allGood ? "all-good" : "has-errors")}>
      <div className={"checklist-head " + (allGood ? "all-good" : "has-errors")}>
        <span style={{ fontSize: 16 }}>{allGood ? "✅" : "⛔"}</span>
        <span className="checklist-head-title">
          {allGood ? "Ready to submit!" : totalErrors + " item" + (totalErrors !== 1 ? "s" : "") + " still needed"}
        </span>
      </div>
      {!allGood && (
        <div className="checklist-body">
          {groups.map(g => (
            <div className="checklist-group" key={g.key}>
              <div className="checklist-group-label">{g.label}</div>
              <div className="checklist-items">
                {errors[g.key].length === 0 ? (
                  <div className="checklist-item ok"><span className="ci-dot ok">✓</span> All complete</div>
                ) : (
                  errors[g.key].map((e, i) => (
                    <div key={i} className="checklist-item err"><span className="ci-dot err">!</span> {e}</div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
const QUEUE_KEY = "wsc_offline_queue";

function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; }
}
function saveQueue(q) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export default function App() {
  const [tab, setTab] = useState("judge");
  const [form, setForm] = useState(mkForm());
  const [submissions, setSubmissions] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(getQueue().length);

  useEffect(() => {
    loadSubmissions();
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-sync whenever we come back online
  useEffect(() => {
    if (isOnline) syncQueue();
  }, [isOnline]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        showToast("⚠️ Could not load submissions.", "warn");
      } else {
        const mapped = data.map(row => ({
          id: row.id,
          roundNum: row.round_num,
          judgeName: row.judge_name,
          room: row.room,
          winner: row.winner,
          aff: row.aff,
          neg: row.neg,
        }));
        setSubmissions(mapped);
      }
    } catch {
      showToast("⚠️ Could not load submissions.", "warn");
    }
    setLoading(false);
  };

  const syncQueue = async () => {
    const queue = getQueue();
    if (queue.length === 0) return;
    const remaining = [];
    for (const item of queue) {
      try {
        const { error } = await supabase.from("submissions").insert(item);
        if (error) remaining.push(item);
      } catch {
        remaining.push(item);
      }
    }
    saveQueue(remaining);
    setQueueCount(remaining.length);
    if (remaining.length < queue.length) {
      showToast(`✅ ${queue.length - remaining.length} queued submission(s) synced!`);
      await loadSubmissions();
    }
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    const errs = getValidationErrors(form);
    const totalErrors = Object.values(errs).flat().length;
    if (totalErrors > 0) return;
    const affDups = getDupLetters(form.aff.speakers).length > 0;
    const negDups = getDupLetters(form.neg.speakers).length > 0;

    const payload = {
      round_num: form.roundNum,
      judge_name: form.judgeName,
      room: form.room,
      winner: form.winner,
      aff: form.aff,
      neg: form.neg,
    };

    if (!isOnline) {
      const queue = getQueue();
      queue.push(payload);
      saveQueue(queue);
      setQueueCount(queue.length);
      setForm(mkForm());
      setTab("dashboard");
      showToast("📴 Saved offline — will sync when connected.", "warn");
      return;
    }

    let error = null;
    try {
      const result = await supabase.from("submissions").insert(payload);
      error = result.error;
    } catch {
      error = { message: "Network error" };
    }

    if (error) {
      // Fall back to offline queue
      const queue = getQueue();
      queue.push(payload);
      saveQueue(queue);
      setQueueCount(queue.length);
      setForm(mkForm());
      setTab("dashboard");
      showToast("📴 Saved offline — will sync when connected.", "warn");
      return;
    }

    await loadSubmissions();
    setForm(mkForm());
    setTab("dashboard");
    if (affDups || negDups) {
      showToast("⚠️ Submitted with duplicate speaker letters — flagged for review.", "warn");
    } else {
      showToast("✅ Score sheet submitted!");
    }
  };

  const updateTeamSpk = (side, i, spk) => {
    const speakers = [...form[side].speakers];
    speakers[i] = spk;
    setField(side, { ...form[side], speakers });
  };

  const affWins = submissions.filter(s => s.winner === "aff").length;
  const negWins = submissions.filter(s => s.winner === "neg").length;

  return (
    <div className="app">
      <div className="header">
        <div className="header-brand">
          <div className="header-logo">W</div>
          <div>
            <div className="header-name">World Scholar's Cup</div>
            <div className="header-sub">Debate Scoring</div>
          </div>
        </div>
        {!isOnline && <span style={{ background: "rgba(0,0,0,0.3)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>📴 Offline</span>}
      </div>

      {!isOnline && (
        <div style={{ background: "#fff3cd", borderBottom: "1px solid #ffc107", padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#856404", textAlign: "center" }}>
          No internet connection — submissions will be saved and synced automatically when you reconnect.
        </div>
      )}
      {isOnline && queueCount > 0 && (
        <div style={{ background: "#d4edda", borderBottom: "1px solid #28a745", padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#155724", textAlign: "center", cursor: "pointer" }} onClick={syncQueue}>
          🔄 {queueCount} offline submission(s) pending — tap to sync now
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${tab === "judge" ? "active" : ""}`} onClick={() => setTab("judge")}>📋 Judge Form</button>
        <button className={`tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>
          📊 Organizer
          {submissions.length > 0 && <span className="tab-badge">{submissions.length}</span>}
        </button>
      </div>

      <div className="main">
        {tab === "judge" && (
          <div className="fade-in">
            {/* Step 1 */}
            <div className="card">
              <div className="card-head"><span className="step-num">1</span><span className="card-title">Set Up the Debate</span></div>
              <div className="card-body">
                <div className="grid3">
                  <div className="field">
                    <label className="label">Round</label>
                    <select className="input" value={form.roundNum} onChange={e => setField("roundNum", e.target.value)}>
                      <option value="">—</option>
                      <option>1</option><option>2</option><option>3</option>
                    </select>
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label className="label">Your Name</label>
                    <input className="input" placeholder="Print name neatly" value={form.judgeName} onChange={e => setField("judgeName", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Room Number</label>
                  <input className="input" placeholder="e.g. 5" value={form.room} onChange={e => setField("room", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Steps 2–7: alternating speakers */}
            {[0, 1, 2].map(i => {
              const stepAff = 2 + i * 2;
              const stepNeg = stepAff + 1;
              const affDups = getDupLetters(form.aff.speakers);
              const negDups = getDupLetters(form.neg.speakers);
              return (
                <div key={i}>
                  <div className="card">
                    <div className="card-head">
                      <span className="step-num">{stepAff}</span>
                      <span className="card-title" style={{ color: "var(--aff)" }}>Affirmative Speaker {i + 1}</span>
                    </div>
                    <div className="card-body">
                      {i === 0 && (
                        <div className="field">
                          <label className="label">Affirmative Team ID</label>
                          <input className="input" style={{ borderColor: form.aff.id ? "var(--aff)" : undefined }}
                            placeholder="3-digit ID e.g. 777" maxLength={3} value={form.aff.id}
                            onChange={e => setField("aff", { ...form.aff, id: e.target.value.replace(/\D/g, "") })} />
                          <div className="check-row">
                            <input type="checkbox" id="miss-aff" checked={form.aff.missing} onChange={e => setField("aff", { ...form.aff, missing: e.target.checked })} />
                            <label htmlFor="miss-aff">Team member missing</label>
                          </div>
                        </div>
                      )}
                      <SpeakerBlock spk={form.aff.speakers[i]} idx={i}
                        onChange={spk => updateTeamSpk("aff", i, spk)}
                        teamColor="var(--aff)" dupLetters={affDups} />
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <span className="step-num">{stepNeg}</span>
                      <span className="card-title" style={{ color: "var(--neg)" }}>Negative Speaker {i + 1}</span>
                    </div>
                    <div className="card-body">
                      {i === 0 && (
                        <div className="field">
                          <label className="label">Negative Team ID</label>
                          <input className="input" style={{ borderColor: form.neg.id ? "var(--neg)" : undefined }}
                            placeholder="3-digit ID e.g. 781" maxLength={3} value={form.neg.id}
                            onChange={e => setField("neg", { ...form.neg, id: e.target.value.replace(/\D/g, "") })} />
                          <div className="check-row">
                            <input type="checkbox" id="miss-neg" checked={form.neg.missing} onChange={e => setField("neg", { ...form.neg, missing: e.target.checked })} />
                            <label htmlFor="miss-neg">Team member missing</label>
                          </div>
                        </div>
                      )}
                      <SpeakerBlock spk={form.neg.speakers[i]} idx={i}
                        onChange={spk => updateTeamSpk("neg", i, spk)}
                        teamColor="var(--neg)" dupLetters={negDups} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Steps 8–9: Best speaker + teamwork */}
            <div className="card">
              <div className="card-head"><span className="step-num">8–9</span><span className="card-title">Best Speaker & Teamwork</span></div>
              <div className="card-body">
                {[["aff", "Affirmative", "var(--aff)"], ["neg", "Negative", "var(--neg)"]].map(([side, label, color], si) => (
                  <div key={side} style={{ marginBottom: si === 0 ? 18 : 0 }}>
                    <div className="team-divider"><span className={`team-label ${side}`}>{label}</span><div className="team-divider-line" /></div>
                    <div className="field">
                      <label className="label">Best Speaker</label>
                      <div className="best-speaker-row">
                        <div className="best-pos-btns">
                          {["1st", "2nd", "3rd"].map(opt => (
                            <button key={opt}
                              className={`best-btn ${form[side].bestSpeakerPos === opt ? "sel" : ""}`}
                              onClick={() => setField(side, { ...form[side], bestSpeakerPos: form[side].bestSpeakerPos === opt ? null : opt })}
                            >{opt}</button>
                          ))}
                        </div>
                        <div className="wow-divider" />
                        <button
                          className={`wow-btn ${form[side].bestSpeakerWow ? "sel" : ""}`}
                          onClick={() => setField(side, { ...form[side], bestSpeakerWow: !form[side].bestSpeakerWow })}
                        >⭐ Wow!</button>
                      </div>
                      <div className="wow-hint">Wow! is an intensifier — select a position AND Wow! to award both.</div>
                    </div>
                    <div className="field">
                      <label className="label">Teamwork Score</label>
                      <ScoreSelector value={form[side].teamwork} onChange={v => setField(side, { ...form[side], teamwork: v })} color={color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 11: Feedback */}
            <div className="card">
              <div className="card-head"><span className="step-num">11</span><span className="card-title">Feedback Scores</span></div>
              <div className="card-body">
                <p className="hint">How kind, courteous, and constructive was each team to the other?</p>
                {[["aff", "Affirmative", "var(--aff)"], ["neg", "Negative", "var(--neg)"]].map(([side, label, color]) => (
                  <div key={side} className="score-row" style={{ marginBottom: 10 }}>
                    <span className="score-cat">{label}</span>
                    <ScoreSelector value={form[side].feedback} onChange={v => setField(side, { ...form[side], feedback: v })} color={color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Step 10: Winner */}
            <div className="card">
              <div className="card-head"><span className="step-num">10</span><span className="card-title">Choose the Winning Team</span></div>
              <div className="card-body">
                <p className="hint">Don't announce yet — there can be no ties.</p>
                <div className="winner-row">
                  <button className={`winner-btn aff ${form.winner === "aff" ? "sel" : ""}`} onClick={() => setField("winner", form.winner === "aff" ? null : "aff")}>
                    🔵 Affirmative
                    <div className="wid">#{form.aff.id || "—"}</div>
                  </button>
                  <button className={`winner-btn neg ${form.winner === "neg" ? "sel" : ""}`} onClick={() => setField("winner", form.winner === "neg" ? null : "neg")}>
                    🟠 Negative
                    <div className="wid">#{form.neg.id || "—"}</div>
                  </button>
                </div>
              </div>
            </div>

            <ValidationChecklist form={form} />
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={Object.values(getValidationErrors(form)).flat().length > 0}
            >Submit Score Sheet →</button>
            <div style={{ height: 32 }} />
          </div>
        )}

        {tab === "dashboard" && (
          <div className="fade-in">
            {loading ? (
              <div className="dash-empty">
                <div className="icon">⏳</div>
                <p>Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="dash-empty">
                <div className="icon">📋</div>
                <p>No submissions yet.</p>
                <p style={{ marginTop: 6, fontSize: 13 }}>Judges submit from the Judge Form tab.</p>
              </div>
            ) : (
              <>
                <div className="stats-bar">
                  <div className="stat-card"><div className="stat-val">{submissions.length}</div><div className="stat-label">Rounds</div></div>
                  <div className="stat-card"><div className="stat-val" style={{ color: "var(--aff)" }}>{affWins}</div><div className="stat-label">Aff Wins</div></div>
                  <div className="stat-card"><div className="stat-val" style={{ color: "var(--neg)" }}>{negWins}</div><div className="stat-label">Neg Wins</div></div>
                </div>
                <div className="section-hd">All Submissions</div>
                <div className="submissions-list">
                  {submissions.map(sub => (
                    <SubmissionCard key={sub.id} sub={sub} onClick={() => setSelectedSub(sub)} />
                  ))}
                </div>
                <div style={{ height: 32 }} />
              </>
            )}
          </div>
        )}
      </div>

      {selectedSub && <DetailModal sub={selectedSub} onClose={() => setSelectedSub(null)} />}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
