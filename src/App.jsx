import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;600;700&display=swap";
document.head.appendChild(fontLink);

// ── Styles ────────────────────────────────────────────────────────────────────
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
  @keyframes timerFlash { 0%,100% { opacity:1; } 50% { opacity:0.15; } }
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

  /* Page */
  .page { padding-bottom: 8px; }
  .page-header { margin-bottom: 16px; }
  .page-step {
    font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-light); margin-bottom: 4px;
  }
  .page-title { font-family: 'Nunito', sans-serif; font-size: 22px; font-weight: 900; color: var(--teal-dark); }
  .page-badge {
    display: inline-block; font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 11px; border-radius: 20px; margin-bottom: 6px;
  }
  .page-badge.aff { background: var(--aff-light); color: var(--aff); }
  .page-badge.neg { background: var(--neg-light); color: var(--neg); }

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
  .card-title { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800; color: var(--text); }
  .card-body { padding: 16px; }

  /* Script box */
  .script-box {
    background: #fffbf0; border: 1.5px solid #f5d78a; border-radius: 10px;
    padding: 13px 15px; margin-bottom: 14px;
  }
  .script-label { font-size: 10px; font-weight: 800; color: #8a6000; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .script-text { font-size: 14px; color: #5a4000; font-weight: 600; line-height: 1.6; font-style: italic; }

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
  .grid3 { display: grid; grid-template-columns: 80px 1fr 80px; gap: 12px; }
  .check-row { display: flex; align-items: center; gap: 7px; margin-top: 7px; }
  .check-row input { accent-color: var(--teal); width: 15px; height: 15px; cursor: pointer; }
  .check-row label { font-size: 12px; color: var(--text-light); cursor: pointer; font-weight: 600; }

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
    width: 44px; height: 44px; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-light); font-family: 'Nunito', sans-serif;
    font-size: 17px; font-weight: 800; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .id-btn:hover:not(.sel) { border-color: var(--teal); color: var(--teal); }
  .id-btn.sel { border-width: 2px; }
  .id-btn.warn.sel { background: var(--amber-light); border-color: var(--amber); color: #a0690a; }
  .dup-warning {
    display: flex; align-items: center; gap: 6px;
    background: var(--amber-light); border: 1px solid #f5d78a; border-radius: 7px;
    padding: 7px 10px; margin-top: 8px;
    font-size: 11px; font-weight: 700; color: #8a5c00;
  }

  /* Best speaker */
  .best-speaker-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .best-pos-btns { display: flex; gap: 6px; }
  .best-btn {
    padding: 6px 14px; border-radius: 7px; border: 1.5px solid var(--border);
    background: var(--bg); color: var(--text-light); font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .best-btn:hover:not(.sel) { border-color: var(--teal); color: var(--teal); }
  .best-btn.sel { color: white; border-color: transparent; }
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

  /* Timer */
  .timer-block { display: flex; flex-direction: column; align-items: center; padding: 8px 0 4px; }
  .timer-display {
    font-family: 'Nunito', sans-serif; font-size: 72px; font-weight: 900;
    color: var(--teal-dark); line-height: 1; margin-bottom: 4px; transition: color 0.3s;
    letter-spacing: -2px;
  }
  .timer-display.warning { color: var(--amber); }
  .timer-display.done { color: var(--green); }
  .timer-display.flash { animation: timerFlash 0.4s ease; }
  .timer-hint-row { height: 20px; margin-bottom: 12px; }
  .timer-hint { font-size: 12px; font-weight: 700; }
  .timer-hint.warning { color: var(--amber); }
  .timer-hint.done { color: var(--green); }
  .timer-btn {
    padding: 10px 22px; border-radius: 9px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
  }
  .timer-btn.primary { background: var(--teal); color: white; box-shadow: 0 3px 12px rgba(139,26,47,0.25); }
  .timer-btn.primary:hover { background: var(--teal-dark); }
  .timer-btn.secondary { background: var(--bg); border: 1.5px solid var(--border); color: var(--text-mid); }
  .timer-btn.secondary:hover { border-color: var(--teal); color: var(--teal); }

  /* Feedback phases */
  .feedback-phase { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .feedback-phase:last-child { border-bottom: none; padding-bottom: 0; }
  .feedback-phase-label {
    font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;
  }
  .feedback-phase-label.aff { color: var(--aff); }
  .feedback-phase-label.neg { color: var(--neg); }
  .feedback-phase-label.prep { color: var(--teal-dark); }
  .phase-done-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: #eafaf1; color: var(--green); border: 1px solid #a9dfbf;
    font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px;
  }

  /* Submit */
  .submit-btn {
    width: 100%; padding: 15px; border-radius: 10px; border: none;
    background: var(--teal); color: white;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s; margin-bottom: 10px;
    box-shadow: 0 4px 16px rgba(139,26,47,0.3);
  }
  .submit-btn:hover:not(:disabled) { background: var(--teal-dark); transform: translateY(-1px); }
  .submit-btn:disabled { background: #ccc; box-shadow: none; cursor: not-allowed; opacity: 0.6; }
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
    transition: box-shadow 0.2s, transform 0.15s; animation: slideUp 0.3s ease forwards;
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

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 500;
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal-box {
    background: var(--white); border-radius: 20px 20px 0 0; width: 100%; max-width: 680px;
    max-height: 90vh; overflow-y: auto; padding: 0 0 32px;
    animation: modalIn 0.3s ease;
  }
  .modal-handle {
    width: 40px; height: 4px; background: var(--border); border-radius: 2px;
    margin: 12px auto 0;
  }
  .modal-head {
    padding: 16px 20px 14px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border); position: sticky; top: 0;
    background: var(--white); z-index: 10;
  }
  .modal-title { font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 900; color: var(--teal-dark); }
  .modal-close {
    width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--bg);
    font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--text-light); transition: background 0.2s;
  }
  .modal-close:hover { background: var(--teal-light); }
  .modal-body { padding: 16px 20px; }
  .modal-section { margin-bottom: 20px; }
  .modal-section:last-child { margin-bottom: 0; }
  .modal-section-title {
    font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-light);
    margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
  }
  .modal-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .modal-teams { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-team { border-radius: 10px; overflow: hidden; }
  .modal-team.aff { border: 1.5px solid var(--aff); }
  .modal-team.neg { border: 1.5px solid var(--neg); }
  .modal-team-head { padding: 8px 12px; font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; }
  .modal-team.aff .modal-team-head { background: var(--aff-light); color: var(--aff); }
  .modal-team.neg .modal-team-head { background: var(--neg-light); color: var(--neg); }
  .modal-team-body { padding: 10px 12px; }
  .modal-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .modal-score-row:last-child { margin-bottom: 0; }
  .modal-info-label { font-size: 11px; color: var(--text-light); font-weight: 600; }
  .modal-info-val { font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; color: var(--text); }
  .modal-speaker-row { display: flex; align-items: center; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid var(--border); }
  .modal-speaker-row:last-child { border-bottom: none; }
  .modal-spk-id { font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; }
  .modal-spk-scores { font-size: 11px; color: var(--text-mid); font-weight: 600; }
  .score-pill {
    font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 900;
    padding: 2px 10px; border-radius: 20px;
  }
  .score-pill.aff { background: var(--aff-light); color: var(--aff); }
  .score-pill.neg { background: var(--neg-light); color: var(--neg); }
  .score-pill.teal { background: var(--teal-light); color: var(--teal-dark); }
  .wow-chip {
    background: var(--amber); color: white; font-family: 'Nunito', sans-serif;
    font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 10px;
    letter-spacing: 0.04em;
  }
`;
document.head.appendChild(style);

// ── Constants & Helpers ───────────────────────────────────────────────────────
const QUEUE_KEY = "wsc_offline_queue";
function getQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; } }
function saveQueue(q) { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }

function beep(times = 1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.4 + 0.3);
      osc.start(ctx.currentTime + i * 0.4);
      osc.stop(ctx.currentTime + i * 0.4 + 0.3);
    }
  } catch {}
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m + ":" + s.toString().padStart(2, "0");
}

const ORDINALS = ["First", "Second", "Third"];

function mkSpeaker() { return { letter: "", presentation: 0, strategy: 0, content: 0 }; }
function mkTeam() { return { id: "", missing: false, speakers: [mkSpeaker(), mkSpeaker(), mkSpeaker()], bestSpeakerPos: null, bestSpeakerWow: false, teamwork: 0, feedback: 0 }; }
function mkForm() { return { roundNum: "", judgeName: "", room: "", aff: mkTeam(), neg: mkTeam(), winner: null }; }

function getDupLetters(speakers) {
  const letters = speakers.map(s => s.letter).filter(Boolean);
  return letters.filter((l, i) => letters.indexOf(l) !== i);
}

// ── Page definitions ──────────────────────────────────────────────────────────
const PAGES = [
  { type: "setup" },
  { type: "prep" },
  { type: "speaker", side: "aff", idx: 0 },
  { type: "transition", nextLabel: "Negative Speaker 1" },
  { type: "speaker", side: "neg", idx: 0 },
  { type: "transition", nextLabel: "Affirmative Speaker 2" },
  { type: "speaker", side: "aff", idx: 1 },
  { type: "transition", nextLabel: "Negative Speaker 2" },
  { type: "speaker", side: "neg", idx: 1 },
  { type: "transition", nextLabel: "Affirmative Speaker 3" },
  { type: "speaker", side: "aff", idx: 2 },
  { type: "transition", nextLabel: "Negative Speaker 3" },
  { type: "speaker", side: "neg", idx: 2 },
  { type: "final" },
  { type: "confirmation" },
];

// ── TimerBlock ────────────────────────────────────────────────────────────────
function TimerBlock({ duration, warningAt = 60, onDone, timerKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef(null);

  const triggerFlash = () => { setFlash(true); setTimeout(() => setFlash(false), 500); };

  useEffect(() => {
    setTimeLeft(duration);
    setRunning(false); setStarted(false); setDone(false);
  }, [timerKey]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false); setDone(true);
          beep(2); triggerFlash();
          if (onDone) onDone();
          return 0;
        }
        if (warningAt > 0 && prev === warningAt + 1) { beep(1); triggerFlash(); }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const isWarning = warningAt > 0 && timeLeft <= warningAt && timeLeft > 0 && started;

  return (
    <div className="timer-block">
      <div className={`timer-display ${isWarning ? "warning" : ""} ${done ? "done" : ""} ${flash ? "flash" : ""}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="timer-hint-row">
        {done ? <span className="timer-hint done">⏰ Time's up!</span>
          : isWarning ? <span className="timer-hint warning">🔔 One minute remaining</span>
          : <span>&nbsp;</span>}
      </div>
      {!started
        ? <button className="timer-btn primary" onClick={() => { setStarted(true); setRunning(true); }}>▶ Start Timer</button>
        : !done
          ? <button className="timer-btn secondary" onClick={() => setRunning(r => !r)}>{running ? "⏸ Pause" : "▶ Resume"}</button>
          : null}
    </div>
  );
}

// ── ScoreSelector ─────────────────────────────────────────────────────────────
function ScoreSelector({ value, onChange, color = "var(--teal)" }) {
  return (
    <div className="score-btns">
      {[2, 3, 4, 5, 6, 7].map(n => (
        <button key={n} className={`score-btn ${value === n ? "sel" : ""}`}
          style={value === n ? { background: color, borderColor: color } : {}}
          onClick={() => onChange(value === n ? 0 : n)}>{n}</button>
      ))}
    </div>
  );
}

// ── SetupPage ─────────────────────────────────────────────────────────────────
function SetupPage({ form, onFieldChange, onTeamChange, onNext }) {
  const canNext = form.roundNum && form.judgeName.trim() && form.room.trim()
    && form.aff.id.trim() && form.neg.id.trim();

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Step 1 of {PAGES.length - 1}</div>
        <div className="page-title">Set Up the Debate</div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="grid3">
            <div className="field">
              <label className="label">Round</label>
              <select className="input" value={form.roundNum} onChange={e => onFieldChange("roundNum", e.target.value)}>
                <option value="">—</option>
                <option>1</option><option>2</option><option>3</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Your Name</label>
              <input className="input" placeholder="Print name neatly" value={form.judgeName}
                onChange={e => onFieldChange("judgeName", e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Room</label>
              <input className="input" placeholder="e.g. 5" value={form.room}
                onChange={e => onFieldChange("room", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {[["aff", "Affirmative", "var(--aff)"], ["neg", "Negative", "var(--neg)"]].map(([side, label, color]) => (
        <div className="card" key={side}>
          <div className="card-head">
            <span className="card-title" style={{ color }}>{label} Team</span>
          </div>
          <div className="card-body">
            <div className="field">
              <label className="label">Team ID</label>
              <input className="input" style={{ borderColor: form[side].id ? color : undefined }}
                placeholder="3-digit ID e.g. 777" maxLength={3} value={form[side].id}
                onChange={e => onTeamChange(side, { ...form[side], id: e.target.value.replace(/\D/g, "") })} />
            </div>
            <div className="check-row">
              <input type="checkbox" id={`miss-${side}`} checked={form[side].missing}
                onChange={e => onTeamChange(side, { ...form[side], missing: e.target.checked })} />
              <label htmlFor={`miss-${side}`}>Team member missing</label>
            </div>
          </div>
        </div>
      ))}

      <div className="script-box">
        <div className="script-label">📢 Read aloud to participants</div>
        <div className="script-text">"Today's motion is _______________. You have 15 minutes to prepare, starting now."</div>
      </div>

      <button className="submit-btn" onClick={onNext} disabled={!canNext}>
        Start Prep Period →
      </button>
      <div style={{ height: 32 }} />
    </div>
  );
}

// ── PrepPage ──────────────────────────────────────────────────────────────────
function PrepPage({ onNext }) {
  const [done, setDone] = useState(false);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Prep Time</div>
        <div className="page-title">15-Minute Preparation</div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">⏱ Prep Timer</span></div>
        <div className="card-body" style={{ textAlign: "center" }}>
          <TimerBlock duration={15 * 60} warningAt={60} onDone={() => setDone(true)} timerKey="prep" />
        </div>
      </div>

      {done && (
        <div className="fade-in">
          <div className="script-box">
            <div className="script-label">📢 Read aloud to participants</div>
            <div className="script-text">"Time is up! All devices and outside materials must be put away. First affirmative speaker, please rise, join us at the front of the room, and begin when you feel ready."</div>
          </div>
          <button className="submit-btn" onClick={onNext}>Begin — Affirmative Speaker 1 →</button>
        </div>
      )}
      <div style={{ height: 32 }} />
    </div>
  );
}

// ── SpeakerPage ───────────────────────────────────────────────────────────────
function SpeakerPage({ side, idx, form, onSpeakerChange, onNext, isLast }) {
  const spk = form[side].speakers[idx];
  const color = side === "aff" ? "var(--aff)" : "var(--neg)";
  const sideLabel = side === "aff" ? "Affirmative" : "Negative";
  const ordinal = ORDINALS[idx];
  const dupLetters = getDupLetters(form[side].speakers);
  const hasDup = spk.letter && dupLetters.includes(spk.letter);
  const canNext = spk.letter && spk.presentation && spk.strategy && spk.content;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className={`page-badge ${side}`}>{sideLabel}</div>
        <div className="page-title">{ordinal} {sideLabel} Speaker</div>
      </div>

      <div className="script-box">
        <div className="script-label">📢 Read aloud</div>
        <div className="script-text">"{ordinal} {sideLabel} Speaker, is your letter A, B, or C? Thank you."</div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">Speaker ID Letter</span></div>
        <div className="card-body">
          <div className="id-row">
            {["A", "B", "C"].map(l => (
              <button key={l}
                className={`id-btn ${spk.letter === l ? "sel" : ""} ${hasDup && spk.letter === l ? "warn" : ""}`}
                style={spk.letter === l ? { background: color + "22", borderColor: color, color } : {}}
                onClick={() => onSpeakerChange(side, idx, { ...spk, letter: spk.letter === l ? "" : l })}>
                {l}
              </button>
            ))}
          </div>
          {hasDup && <div className="dup-warning">⚠️ This letter was already used for this team.</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">⏱ Speaker Timer — 4 minutes</span></div>
        <div className="card-body" style={{ textAlign: "center" }}>
          <TimerBlock duration={4 * 60} warningAt={60} timerKey={`${side}-${idx}`} />
        </div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">Scores</span></div>
        <div className="card-body">
          {[["Presentation", "presentation"], ["Strategy", "strategy"], ["Content", "content"]].map(([label, key]) => (
            <div className="score-row" key={key}>
              <span className="score-cat">{label}</span>
              <ScoreSelector value={spk[key]} onChange={v => onSpeakerChange(side, idx, { ...spk, [key]: v })} color={color} />
            </div>
          ))}
        </div>
      </div>

      <div className="script-box">
        <div className="script-label">📢 Read aloud when speaker finishes</div>
        <div className="script-text">"Thank you for your speech."</div>
      </div>

      <button className="submit-btn" onClick={onNext} disabled={!canNext}
        style={{ background: canNext ? (isLast ? "var(--teal)" : color) : undefined }}>
        {isLast ? "Proceed to Final Scoring →" : "Start Transition →"}
      </button>
      <div style={{ height: 32 }} />
    </div>
  );
}

// ── TransitionPage ────────────────────────────────────────────────────────────
function TransitionPage({ nextLabel, transIdx, onNext }) {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Transition</div>
        <div className="page-title">60-Second Break</div>
      </div>

      <div className="script-box">
        <div className="script-label">📢 Read aloud</div>
        <div className="script-text">"Teams, you have 60 seconds to prepare before I call up the next speaker."</div>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">⏱ Transition Timer</span></div>
        <div className="card-body" style={{ textAlign: "center" }}>
          <TimerBlock duration={60} warningAt={0} timerKey={`trans-${transIdx}`} />
        </div>
      </div>

      <button className="submit-btn" onClick={onNext}>Begin — {nextLabel} →</button>
      <div style={{ height: 32 }} />
    </div>
  );
}

// ── BestSpeakerSelector ───────────────────────────────────────────────────────
function BestSpeakerSelector({ side, team, onChange }) {
  const color = side === "aff" ? "var(--aff)" : "var(--neg)";
  return (
    <div>
      <div className="best-speaker-row">
        <div className="best-pos-btns">
          {["1st", "2nd", "3rd"].map(opt => (
            <button key={opt} className={`best-btn ${team.bestSpeakerPos === opt ? "sel" : ""}`}
              style={team.bestSpeakerPos === opt ? { background: color, borderColor: color } : {}}
              onClick={() => onChange({ ...team, bestSpeakerPos: team.bestSpeakerPos === opt ? null : opt })}>
              {opt}
            </button>
          ))}
        </div>
        <div className="wow-divider" />
        <button className={`wow-btn ${team.bestSpeakerWow ? "sel" : ""}`}
          onClick={() => onChange({ ...team, bestSpeakerWow: !team.bestSpeakerWow })}>⭐ Wow!</button>
      </div>
      <div className="wow-hint">Wow! is an intensifier — select a position AND Wow! to award both.</div>
    </div>
  );
}

// ── FinalPage ─────────────────────────────────────────────────────────────────
function FinalPage({ form, onTeamChange, onFieldChange, onSubmit, submitting }) {
  const [feedbackPhase, setFeedbackPhase] = useState(0);
  // 0 = prep period, 1 = aff feedback, 2 = neg feedback, 3 = all done

  const canSubmit = form.aff.bestSpeakerPos && form.neg.bestSpeakerPos
    && form.aff.teamwork && form.neg.teamwork
    && form.aff.feedback && form.neg.feedback
    && form.winner;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-step">Final Scoring</div>
        <div className="page-title">Feedback & Scores</div>
      </div>

      {/* Feedback timers */}
      <div className="card">
        <div className="card-head"><span className="card-title">Feedback Periods</span></div>
        <div className="card-body">

          {/* Prep period */}
          <div className="feedback-phase">
            <div className="feedback-phase-label prep">In-Team Prep (90 seconds)</div>
            {feedbackPhase === 0 ? (
              <>
                <div className="script-box" style={{ marginBottom: 14 }}>
                  <div className="script-label">📢 Read aloud</div>
                  <div className="script-text">"Before I announce the winning side, each team must give up to 90 seconds of feedback to the other team. You can divide these 90 seconds however you'd like. Your feedback must be kind, courteous, and constructive. Do not keep arguing. Instead, focus on how the other team could do even better in their next debate. You now have 90 seconds to plan your feedback. I am not allowed to give my own feedback or to explain my reasons for deciding the debate. Your prep time starts now."</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <TimerBlock duration={90} warningAt={0} timerKey="feedback-prep" onDone={() => setFeedbackPhase(1)} />
                </div>
              </>
            ) : <div className="phase-done-badge">✓ Complete</div>}
          </div>

          {/* Aff feedback */}
          {feedbackPhase >= 1 && (
            <div className="feedback-phase">
              <div className="feedback-phase-label aff">Affirmative Team Feedback (90 seconds)</div>
              {feedbackPhase === 1 ? (
                <>
                  <div className="script-box" style={{ marginBottom: 14 }}>
                    <div className="script-label">📢 Read aloud</div>
                    <div className="script-text">"Affirmative Team, your feedback please."</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <TimerBlock duration={90} warningAt={0} timerKey="feedback-aff" onDone={() => setFeedbackPhase(2)} />
                  </div>
                </>
              ) : <div className="phase-done-badge">✓ Complete</div>}
            </div>
          )}

          {/* Neg feedback */}
          {feedbackPhase >= 2 && (
            <div className="feedback-phase">
              <div className="feedback-phase-label neg">Negative Team Feedback (90 seconds)</div>
              {feedbackPhase === 2 ? (
                <>
                  <div className="script-box" style={{ marginBottom: 14 }}>
                    <div className="script-label">📢 Read aloud</div>
                    <div className="script-text">"Negative Team, your feedback please."</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <TimerBlock duration={90} warningAt={0} timerKey="feedback-neg" onDone={() => setFeedbackPhase(3)} />
                  </div>
                </>
              ) : <div className="phase-done-badge">✓ Complete</div>}
            </div>
          )}
        </div>
      </div>

      {/* Scoring */}
      {[["aff", "Affirmative"], ["neg", "Negative"]].map(([side, label]) => (
        <div className="card" key={side}>
          <div className="card-head">
            <span className="card-title" style={{ color: side === "aff" ? "var(--aff)" : "var(--neg)" }}>
              {label} — Final Scores
            </span>
          </div>
          <div className="card-body">
            <div className="field">
              <label className="label">Best Speaker</label>
              <BestSpeakerSelector side={side} team={form[side]}
                onChange={t => onTeamChange(side, t)} />
            </div>
            <div className="field">
              <label className="label">Teamwork Score</label>
              <ScoreSelector value={form[side].teamwork}
                onChange={v => onTeamChange(side, { ...form[side], teamwork: v })}
                color={side === "aff" ? "var(--aff)" : "var(--neg)"} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Feedback Score</label>
              <ScoreSelector value={form[side].feedback}
                onChange={v => onTeamChange(side, { ...form[side], feedback: v })}
                color={side === "aff" ? "var(--aff)" : "var(--neg)"} />
            </div>
          </div>
        </div>
      ))}

      {/* Winner */}
      <div className="card">
        <div className="card-head"><span className="card-title">Choose the Winning Team</span></div>
        <div className="card-body">
          <p className="hint">Don't announce yet — there can be no ties.</p>
          <div className="winner-row">
            <button className={`winner-btn aff ${form.winner === "aff" ? "sel" : ""}`}
              onClick={() => onFieldChange("winner", form.winner === "aff" ? null : "aff")}>
              🔵 Affirmative
              <div className="wid">#{form.aff.id || "—"}</div>
            </button>
            <button className={`winner-btn neg ${form.winner === "neg" ? "sel" : ""}`}
              onClick={() => onFieldChange("winner", form.winner === "neg" ? null : "neg")}>
              🟠 Negative
              <div className="wid">#{form.neg.id || "—"}</div>
            </button>
          </div>
        </div>
      </div>

      <button className="submit-btn" onClick={onSubmit} disabled={!canSubmit || submitting}>
        {submitting ? "Submitting..." : "Submit Score Sheet →"}
      </button>
      <div style={{ height: 32 }} />
    </div>
  );
}

// ── ConfirmationPage ──────────────────────────────────────────────────────────
function ConfirmationPage({ form, onNewRound }) {
  return (
    <div className="page fade-in" style={{ textAlign: "center", padding: "48px 16px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 24, fontWeight: 900, color: "var(--teal-dark)", marginBottom: 8 }}>
        Score Sheet Submitted!
      </div>
      <div style={{ fontSize: 14, color: "var(--text-light)", fontWeight: 600, marginBottom: 6 }}>
        Round {form.roundNum} · Room {form.room}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: form.winner === "aff" ? "var(--aff)" : "var(--neg)", marginBottom: 32 }}>
        {form.winner === "aff" ? "🔵 Affirmative" : "🟠 Negative"} wins
      </div>
      <button className="submit-btn" onClick={onNewRound}>Start New Round</button>
    </div>
  );
}

// ── DetailModal ───────────────────────────────────────────────────────────────
function teamSpkTotal(team) {
  return team.speakers.reduce((a, s) => a + (s.presentation || 0) + (s.strategy || 0) + (s.content || 0), 0);
}

function DetailModal({ sub, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-handle" />
        <div className="modal-head">
          <div>
            <div className="modal-title">Round {sub.roundNum} · Room {sub.room || "—"}</div>
            <div style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 600, marginTop: 2 }}>👤 {sub.judgeName}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-section-title">Teams</div>
            <div className="modal-teams">
              {[["aff", sub.aff], ["neg", sub.neg]].map(([side, team]) => (
                <div key={side} className={`modal-team ${side}`}>
                  <div className="modal-team-head">
                    {side === "aff" ? "Affirmative" : "Negative"} #{team.id || "—"}
                    {team.missing && <span style={{ marginLeft: 5, fontSize: 9, background: "#fdecea", color: "var(--red)", padding: "1px 5px", borderRadius: 8, fontWeight: 800 }}>MISSING</span>}
                  </div>
                  <div className="modal-team-body">
                    {team.speakers.map((spk, i) => (
                      <div key={i} className="modal-speaker-row">
                        <span className="modal-spk-id">{spk.letter || "?"}</span>
                        <span className="modal-spk-scores">P:{spk.presentation} S:{spk.strategy} C:{spk.content}</span>
                        <span className={`score-pill ${side}`}>{(spk.presentation || 0) + (spk.strategy || 0) + (spk.content || 0)}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8 }}>
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
                </div>
              ))}
            </div>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">Result</div>
            {sub.winner
              ? <span className={`sub-winner-badge ${sub.winner}`} style={{ fontSize: 13, padding: "6px 14px" }}>
                  🏆 {sub.winner === "aff" ? "Affirmative" : "Negative"} wins (#{sub[sub.winner].id || "—"})
                </span>
              : <span style={{ color: "var(--text-light)", fontSize: 13, fontWeight: 600 }}>No winner recorded</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SubmissionCard ────────────────────────────────────────────────────────────
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
            : <span style={{ color: "var(--text-light)", fontSize: 12, fontWeight: 600 }}>No winner recorded</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {hasAnyDup && <span className="sub-flag">⚠️ Review</span>}
            <span className="tap-hint">Tap to expand →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("judge");
  const [page, setPage] = useState(0);
  const [form, setFormState] = useState(mkForm());
  const [submissions, setSubmissions] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(getQueue().length);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem("wsc_authed") === "true");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(async () => {
      const queue = getQueue();
      if (queue.length === 0) return;
      const remaining = [];
      for (const item of queue) {
        try {
          const { error } = await supabase.from("submissions").insert(item);
          if (error) remaining.push(item);
        } catch { remaining.push(item); }
      }
      saveQueue(remaining);
      setQueueCount(remaining.length);
      if (remaining.length < queue.length) {
        const synced = queue.length - remaining.length;
        setToast({ msg: `✅ ${synced} queued submission(s) synced!`, type: "ok" });
        setTimeout(() => setToast(null), 3500);
        const { data } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
        if (data) setSubmissions(data.map(row => ({ id: row.id, roundNum: row.round_num, judgeName: row.judge_name, room: row.room, winner: row.winner, aff: row.aff, neg: row.neg })));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setSubmissions(data.map(row => ({ id: row.id, roundNum: row.round_num, judgeName: row.judge_name, room: row.room, winner: row.winner, aff: row.aff, neg: row.neg })));
      }
    } catch {}
    setLoading(false);
  };

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const onFieldChange = (key, value) => setFormState(f => ({ ...f, [key]: value }));
  const onTeamChange = (side, team) => setFormState(f => ({ ...f, [side]: team }));
  const onSpeakerChange = (side, idx, spk) => {
    setFormState(f => {
      const speakers = [...f[side].speakers];
      speakers[idx] = spk;
      return { ...f, [side]: { ...f[side], speakers } };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      round_num: form.roundNum,
      judge_name: form.judgeName,
      room: form.room,
      winner: form.winner,
      aff: form.aff,
      neg: form.neg,
    };

    let error = null;
    try {
      const result = await supabase.from("submissions").insert(payload);
      error = result.error;
    } catch { error = { message: "Network error" }; }

    setSubmitting(false);
    if (error) {
      const queue = getQueue();
      queue.push(payload);
      saveQueue(queue);
      setQueueCount(queue.length);
      showToast("📴 Saved offline — will sync when connected.", "warn");
    } else {
      await loadSubmissions();
      showToast("✅ Score sheet submitted!");
    }
    setPage(PAGES.length - 1); // go to confirmation
  };

  const handleLogin = () => {
    const correct = import.meta.env.VITE_ORGANIZER_PASSWORD;
    if (passwordInput === correct) {
      sessionStorage.setItem("wsc_authed", "true");
      setIsAuthed(true); setAuthError(false); setPasswordInput("");
    } else {
      setAuthError(true); setPasswordInput("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("wsc_authed");
    setIsAuthed(false); setTab("judge");
  };

  const nextPage = () => { setPage(p => p + 1); window.scrollTo(0, 0); };

  const renderJudgePage = () => {
    const pg = PAGES[page];
    if (pg.type === "setup") return <SetupPage form={form} onFieldChange={onFieldChange} onTeamChange={onTeamChange} onNext={nextPage} />;
    if (pg.type === "prep") return <PrepPage onNext={nextPage} />;
    if (pg.type === "speaker") {
      const isLast = pg.side === "neg" && pg.idx === 2;
      return <SpeakerPage key={`${pg.side}-${pg.idx}`} side={pg.side} idx={pg.idx} form={form} onSpeakerChange={onSpeakerChange} onNext={nextPage} isLast={isLast} />;
    }
    if (pg.type === "transition") {
      const transIdx = PAGES.slice(0, page).filter(p => p.type === "transition").length;
      return <TransitionPage key={page} nextLabel={pg.nextLabel} transIdx={transIdx} onNext={nextPage} />;
    }
    if (pg.type === "final") return <FinalPage form={form} onTeamChange={onTeamChange} onFieldChange={onFieldChange} onSubmit={handleSubmit} submitting={submitting} />;
    if (pg.type === "confirmation") return <ConfirmationPage form={form} onNewRound={() => { setFormState(mkForm()); setPage(0); window.scrollTo(0, 0); }} />;
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
          No internet — submissions will sync automatically when you reconnect.
        </div>
      )}
      {isOnline && queueCount > 0 && (
        <div style={{ background: "#d4edda", borderBottom: "1px solid #28a745", padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#155724", textAlign: "center", cursor: "pointer" }}>
          🔄 {queueCount} offline submission(s) pending — syncing shortly...
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
        {tab === "judge" && renderJudgePage()}

        {tab === "dashboard" && (
          <div className="fade-in">
            {!isAuthed ? (
              <div style={{ maxWidth: 340, margin: "60px auto 0", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 20, fontWeight: 800, color: "var(--teal-dark)", marginBottom: 6 }}>Organizer Access</div>
                <div style={{ fontSize: 13, color: "var(--text-light)", fontWeight: 600, marginBottom: 24 }}>Enter the organizer password to view submissions</div>
                <input className="input" type="password" placeholder="Password" value={passwordInput}
                  onChange={e => { setPasswordInput(e.target.value); setAuthError(false); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{ marginBottom: 10, textAlign: "center", borderColor: authError ? "var(--red)" : undefined }} />
                {authError && <div style={{ color: "var(--red)", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Incorrect password. Try again.</div>}
                <button className="submit-btn" onClick={handleLogin} disabled={!passwordInput}>Unlock Dashboard →</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <button onClick={handleLogout} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-light)", cursor: "pointer" }}>🔓 Log out</button>
                </div>
                {loading ? (
                  <div className="dash-empty"><div className="icon">⏳</div><p>Loading submissions...</p></div>
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
