"use client";

import { useEffect } from "react";
import "./styles.css";

export default function DashboardPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/dashboard.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: dashboardHtml }} />
  );
}

const dashboardHtml = `
<div class="app">
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-mark">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <div class="logo-text">HandwerkAI</div>
          <div class="logo-sub">Content Studio</div>
        </div>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-label">Übersicht</div>
      <div class="nav-item active" onclick="nav('dashboard')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        Dashboard
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-label">Intelligence</div>
      <div class="nav-item" onclick="nav('trends')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Trend Engine
        <span class="badge-count">7</span>
      </div>
      <div class="nav-item" onclick="nav('sources')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Quellen
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-label">Content</div>
      <div class="nav-item" onclick="nav('generator')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Generator
      </div>
      <div class="nav-item" onclick="nav('planner')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Wochenplaner
      </div>
      <div class="nav-item" onclick="nav('images')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Bilder & Watermark
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-label">Analyse</div>
      <div class="nav-item" onclick="nav('analytics')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        Performance
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-label">Einstellungen</div>
      <div class="nav-item" onclick="nav('profile')">
        <svg class="ni" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Firmenprofil
      </div>
    </div>
  </aside>

  <main class="main">

    <!-- DASHBOARD -->
    <div id="page-dashboard" class="page active">
      <div class="topbar">
        <div>
          <div class="topbar-title">Dashboard</div>
          <div class="topbar-sub">Maler Müller GmbH · Stuttgart</div>
        </div>
        <div class="spacer"></div>
        <button class="btn" onclick="nav('sources')">+ Quelle</button>
        <button class="btn btn-primary" onclick="nav('generator')">Content erstellen</button>
      </div>
      <div style="padding: 1.5rem;">
        <div class="notif">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          7 neue Trends erkannt – <strong style="margin: 0 4px;">Energiepreise Herbst 2025</strong> hat hohe Relevanz für deine Branche.
          <button class="btn" style="margin-left: auto; padding: 4px 10px; font-size: 11px;" onclick="nav('trends')">Anzeigen</button>
        </div>

        <div class="grid4" style="margin-bottom: 1.25rem;">
          <div class="stat-card">
            <div class="stat-label">Posts diesen Monat</div>
            <div class="stat-value">24</div>
            <div class="stat-delta delta-up">+6 vs. Vormonat</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Erkannte Trends</div>
            <div class="stat-value">7</div>
            <div class="stat-delta delta-up">3 hochrelevant</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Ø Engagement-Score</div>
            <div class="stat-value">78</div>
            <div class="stat-delta delta-up">+12 Punkte</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Geplante Beiträge</div>
            <div class="stat-value">12</div>
            <div class="stat-delta">diese Woche</div>
          </div>
        </div>

        <div class="grid2">
          <div class="card">
            <div class="card-title" style="margin-bottom: 1rem;">Top Trends diese Woche</div>
            <div class="trend-item">
              <div class="trend-score score-high">94</div>
              <div class="trend-info">
                <div class="trend-title">Steigende Energiekosten – Heizungssanierung</div>
                <div class="trend-meta">Quelle: SWR.de · vor 2h · <span class="tag tag-green" style="padding:1px 5px; font-size:10px;">Hoch</span></div>
                <div class="trend-actions">
                  <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="nav('generator')">Post erstellen</button>
                </div>
              </div>
            </div>
            <div class="trend-item">
              <div class="trend-score score-high">88</div>
              <div class="trend-info">
                <div class="trend-title">Fachkräftemangel Handwerk – Ausbildungsoffensive</div>
                <div class="trend-meta">Quelle: handwerk.de · vor 5h</div>
                <div class="trend-actions">
                  <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="nav('generator')">Post erstellen</button>
                </div>
              </div>
            </div>
            <div class="trend-item">
              <div class="trend-score score-mid">71</div>
              <div class="trend-info">
                <div class="trend-title">Förderung Dachsanierung Baden-Württemberg</div>
                <div class="trend-meta">Quelle: Baden-Württemberg.de · vor 1d</div>
                <div class="trend-actions">
                  <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="nav('generator')">Post erstellen</button>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title" style="margin-bottom: 0.75rem;">Kürzlich generiert</div>
            <div class="post-card" style="margin-bottom: 10px;">
              <div class="post-platform"><div class="platform-dot p-ig"></div> Instagram</div>
              <div class="post-body">🔧 Steigende Heizkosten? Wir helfen! Als Stuttgarter Malerbetrieb sanieren wir Ihre Fassade fachgerecht – für mehr Wärme & weniger Kosten.</div>
              <div class="post-tags">
                <span class="tag tag-gray">#Stuttgart</span>
                <span class="tag tag-gray">#Maler</span>
                <span class="tag tag-gray">#Energiesparen</span>
              </div>
            </div>
            <div class="post-card">
              <div class="post-platform"><div class="platform-dot p-fb"></div> Facebook</div>
              <div class="post-body">Wussten Sie: Bis zu 30% Wärmeverlust durch schlecht gedämmte Fassaden! Jetzt kostenlose Beratung anfragen.</div>
              <div class="post-tags">
                <span class="tag tag-gray">#Fassade</span>
                <span class="tag tag-gray">#Dämmung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TREND ENGINE -->
    <div id="page-trends" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Trend Intelligence Engine</div>
          <div class="topbar-sub">7 aktuelle Trends · zuletzt aktualisiert vor 12 Min.</div>
        </div>
        <div class="spacer"></div>
        <button class="btn btn-primary" id="scan-btn" onclick="runScan()">Jetzt scannen</button>
      </div>
      <div style="padding: 1.5rem;">
        <div class="grid2" style="margin-bottom: 1.25rem;">
          <div class="card">
            <div class="card-title" style="margin-bottom: 1rem;">Aktive Trends</div>
            <div id="trend-list">
              <div class="trend-item">
                <div class="trend-score score-high">94</div>
                <div class="trend-info">
                  <div class="trend-title">Energiekosten Herbst 2025</div>
                  <div class="trend-meta">SWR.de · Heizung, Sanierung · Engagement: Sehr hoch</div>
                  <div class="trend-actions">
                    <span class="tag tag-green">Lokal relevant</span>
                    <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="genFromTrend('Energiekosten Herbst 2025')">Post generieren</button>
                  </div>
                </div>
              </div>
              <div class="trend-item">
                <div class="trend-score score-high">88</div>
                <div class="trend-info">
                  <div class="trend-title">Fachkräftemangel – Ausbildung im Handwerk</div>
                  <div class="trend-meta">handwerk.de · Karriere, Nachwuchs</div>
                  <div class="trend-actions">
                    <span class="tag tag-amber">Mittel</span>
                    <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="genFromTrend('Fachkräftemangel Handwerk')">Post generieren</button>
                  </div>
                </div>
              </div>
              <div class="trend-item">
                <div class="trend-score score-high">85</div>
                <div class="trend-info">
                  <div class="trend-title">KfW-Förderung Dachsanierung</div>
                  <div class="trend-meta">kfw.de · Förderung, Sanierung</div>
                  <div class="trend-actions">
                    <span class="tag tag-green">Lokal relevant</span>
                    <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="genFromTrend('KfW Förderung Dachsanierung')">Post generieren</button>
                  </div>
                </div>
              </div>
              <div class="trend-item">
                <div class="trend-score score-mid">71</div>
                <div class="trend-info">
                  <div class="trend-title">Stuttgart Bausaison Herbst Tipps</div>
                  <div class="trend-meta">stuttgarter-zeitung.de · Lokal</div>
                  <div class="trend-actions">
                    <span class="tag tag-blue">Saisonal</span>
                    <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="genFromTrend('Stuttgart Herbst Bausaison')">Post generieren</button>
                  </div>
                </div>
              </div>
              <div class="trend-item">
                <div class="trend-score score-mid">64</div>
                <div class="trend-info">
                  <div class="trend-title">Wettbewerber-Analyse: Maler Schneider AG</div>
                  <div class="trend-meta">Competitor Scan · Letzte Aktionen: Rabattaktion</div>
                  <div class="trend-actions">
                    <span class="tag tag-red">Wettbewerb</span>
                    <button class="btn" style="font-size:11px; padding:3px 8px;" onclick="nav('generator')">Gegenstrategie</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 1rem;">Trend-Performance nach Quelle</div>
              <div class="chart-bar-row">
                <div class="chart-bar-label">handwerk.de</div>
                <div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:88%"></div></div></div>
                <div class="chart-bar-val">88</div>
              </div>
              <div class="chart-bar-row">
                <div class="chart-bar-label">SWR.de</div>
                <div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:82%"></div></div></div>
                <div class="chart-bar-val">82</div>
              </div>
              <div class="chart-bar-row">
                <div class="chart-bar-label">KfW RSS</div>
                <div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:75%; background: var(--accent)"></div></div></div>
                <div class="chart-bar-val">75</div>
              </div>
              <div class="chart-bar-row">
                <div class="chart-bar-label">stz.de</div>
                <div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:60%"></div></div></div>
                <div class="chart-bar-val">60</div>
              </div>
            </div>
            <div class="card">
              <div class="card-title" style="margin-bottom: 0.75rem;">KI-Analyse läuft</div>
              <div id="ai-status" style="font-size: 13px; color: var(--text2);">Klick auf "Jetzt scannen" um neue Trends zu laden.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SOURCES -->
    <div id="page-sources" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Quellen verwalten</div>
          <div class="topbar-sub">URLs, RSS-Feeds, Portale & Wettbewerber</div>
        </div>
        <div class="spacer"></div>
        <button class="btn btn-primary" onclick="addSource()">+ Quelle hinzufügen</button>
      </div>
      <div style="padding: 1.5rem;">
        <div class="grid2">
          <div class="card">
            <div class="card-title" style="margin-bottom: 1rem;">Aktive Quellen (5)</div>
            <div class="source-item">
              <div class="source-icon" style="background:#e8f5ee; color:#1a6b4a;">RSS</div>
              <div>
                <div class="source-url">handwerk.de/rss</div>
                <div class="source-type">RSS Feed · zuletzt: vor 15 Min.</div>
              </div>
              <div class="source-status"><span class="tag tag-green">Aktiv</span></div>
            </div>
            <div class="source-item">
              <div class="source-icon" style="background:#e6f1fb; color:#185fa5;">URL</div>
              <div>
                <div class="source-url">swr.de/ratgeber/handwerk</div>
                <div class="source-type">Webseite · zuletzt: vor 1h</div>
              </div>
              <div class="source-status"><span class="tag tag-green">Aktiv</span></div>
            </div>
            <div class="source-item">
              <div class="source-icon" style="background:#fef3dc; color:#9a6400;">RSS</div>
              <div>
                <div class="source-url">kfw.de/feeds/news</div>
                <div class="source-type">RSS Feed · zuletzt: vor 3h</div>
              </div>
              <div class="source-status"><span class="tag tag-green">Aktiv</span></div>
            </div>
            <div class="source-item">
              <div class="source-icon" style="background:#fdeaea; color:#a02020;">WB</div>
              <div>
                <div class="source-url">maler-schneider-ag.de</div>
                <div class="source-type">Wettbewerber · zuletzt: vor 6h</div>
              </div>
              <div class="source-status"><span class="tag tag-red">Competitor</span></div>
            </div>
            <div class="source-item">
              <div class="source-icon" style="background:#e8f5ee; color:#1a6b4a;">LOK</div>
              <div>
                <div class="source-url">stuttgarter-zeitung.de</div>
                <div class="source-type">Lokalportal · zuletzt: vor 2h</div>
              </div>
              <div class="source-status"><span class="tag tag-blue">Lokal</span></div>
            </div>
          </div>

          <div class="card">
            <div class="card-title" style="margin-bottom: 1rem;">Neue Quelle hinzufügen</div>
            <div style="margin-bottom: 12px;">
              <label class="form-label">Quellentyp</label>
              <select class="input-field" id="src-type">
                <option>Webseite (URL)</option>
                <option>RSS Feed</option>
                <option>News-Portal</option>
                <option>Blog</option>
                <option>Wettbewerber</option>
                <option>Lokales Portal</option>
              </select>
            </div>
            <div style="margin-bottom: 12px;">
              <label class="form-label">URL</label>
              <input class="input-field" type="url" id="src-url" placeholder="https://beispiel.de/rss" />
            </div>
            <div style="margin-bottom: 12px;">
              <label class="form-label">Keywords (optional)</label>
              <input class="input-field" type="text" id="src-keywords" placeholder="z.B. Sanierung, Förderung, Heizung" />
            </div>
            <div style="margin-bottom: 16px;">
              <label class="form-label">Region</label>
              <input class="input-field" type="text" id="src-region" placeholder="z.B. Stuttgart, Baden-Württemberg" />
            </div>
            <button class="btn btn-primary" style="width:100%;" onclick="saveSource()">Quelle speichern & crawlen</button>
          </div>
        </div>
      </div>
    </div>

    <!-- GENERATOR -->
    <div id="page-generator" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Content Generator</div>
          <div class="topbar-sub">KI-gestützte Post-Erstellung aus Trends</div>
        </div>
        <div class="spacer"></div>
      </div>
      <div style="padding: 1.5rem;">
        <div class="grid2">
          <div>
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 1rem;">Content-Einstellungen</div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Basis-Trend / Thema</label>
                <select class="input-field" id="gen-trend">
                  <option>Energiekosten Herbst 2025</option>
                  <option>Fachkräftemangel Handwerk</option>
                  <option>KfW Förderung Dachsanierung</option>
                  <option>Stuttgart Herbst Bausaison</option>
                  <option>Eigenes Thema eingeben...</option>
                </select>
              </div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Plattform</label>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="plat-ig" checked> Instagram
                  </label>
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="plat-fb" checked> Facebook
                  </label>
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="plat-li"> LinkedIn
                  </label>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Tonalität</label>
                <select class="input-field" id="gen-tone">
                  <option>Professionell & vertrauenswürdig</option>
                  <option>Herzlich & nahbar</option>
                  <option>Informativ & sachlich</option>
                  <option>Werbend & überzeugend</option>
                </select>
              </div>
              <div style="margin-bottom: 16px;">
                <label class="form-label">CTA-Typ</label>
                <select class="input-field" id="gen-cta">
                  <option>Kostenlose Beratung anfragen</option>
                  <option>Jetzt Angebot einholen</option>
                  <option>Link in Bio</option>
                  <option>Direkt anrufen</option>
                </select>
              </div>
              <button class="btn btn-primary" style="width:100%;" onclick="generateContent()">
                KI-Post generieren
              </button>
            </div>
          </div>

          <div id="gen-output">
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 0.75rem; display:flex; align-items:center; gap:8px;">
                <div class="platform-dot p-ig" style="width:10px;height:10px;"></div> Instagram-Post
              </div>
              <div id="ig-post" style="font-size: 13px; color: var(--text); line-height: 1.7; padding: 10px; background: var(--surface2); border-radius: var(--border-radius-md);">
                🔧 <strong>Heizkosten senken – jetzt die richtige Zeit!</strong><br><br>
                Die Energiepreise steigen wieder – und das merken viele Stuttgarter Haushalte deutlich. Als lokaler Malerbetrieb wissen wir: Eine gut gedämmte und sanierte Fassade spart bis zu 25% Heizkosten.<br><br>
                Wir bieten professionelle Fassadenmalerei & Wärmedämmung in Stuttgart und Umgebung.<br><br>
                👉 Kostenlose Beratung anfragen – Link in Bio!
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top: 8px;">
                <span class="tag tag-gray">#Stuttgart</span>
                <span class="tag tag-gray">#Maler</span>
                <span class="tag tag-gray">#Energiesparen</span>
                <span class="tag tag-gray">#Fassade</span>
                <span class="tag tag-gray">#Handwerk</span>
                <span class="tag tag-gray">#Heizkosten</span>
              </div>
              <div style="display:flex; gap:6px; margin-top: 10px;">
                <button class="btn" style="font-size:11px; padding:4px 10px;" onclick="nav('planner')">In Planer</button>
                <button class="btn" style="font-size:11px; padding:4px 10px;" onclick="nav('images')">Bild erstellen</button>
                <button class="btn btn-primary" style="font-size:11px; padding:4px 10px; margin-left:auto;">Kopieren</button>
              </div>
            </div>
            <div class="card">
              <div class="card-title" style="margin-bottom: 0.75rem; display:flex; align-items:center; gap:8px;">
                <div class="platform-dot p-fb" style="width:10px;height:10px;"></div> Facebook-Post
              </div>
              <div style="font-size: 13px; color: var(--text); line-height: 1.7; padding: 10px; background: var(--surface2); border-radius: var(--border-radius-md);">
                Wussten Sie, dass schlecht gedämmte Fassaden bis zu 30% der Heizwärme einfach verpuffen lassen? Gerade jetzt, wo die Energiekosten steigen, lohnt sich eine Sanierung besonders.<br><br>
                Wir von Maler Müller GmbH beraten Sie gerne unverbindlich – für Ihr Zuhause in Stuttgart und Umgebung. Jetzt Angebot einholen!
              </div>
              <div style="display:flex; gap:6px; margin-top: 10px;">
                <button class="btn" style="font-size:11px; padding:4px 10px;" onclick="nav('planner')">In Planer</button>
                <button class="btn btn-primary" style="font-size:11px; padding:4px 10px; margin-left:auto;">Kopieren</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PLANNER -->
    <div id="page-planner" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Wochenplaner</div>
          <div class="topbar-sub">KW 42 · 14.–20. Oktober 2025</div>
        </div>
        <div class="spacer"></div>
        <button class="btn" onclick="autoplan()">Auto-Plan KI</button>
        <button class="btn btn-primary">+ Beitrag</button>
      </div>
      <div style="padding: 1.5rem;">
        <div class="tab-row">
          <div class="tab active">Diese Woche</div>
          <div class="tab">Nächste Woche</div>
          <div class="tab">Monatsübersicht</div>
        </div>
        <div class="card">
          <div class="week-grid">
            <div class="day-col">
              <div class="day-header">Mo 14.</div>
              <div class="day-post"><div class="dp-plat">Instagram · 09:00</div><div class="dp-title">Energiekosten – Fassade sanieren</div></div>
              <div class="day-post" style="border-left-color: #1877f2;"><div class="dp-plat">Facebook · 12:00</div><div class="dp-title">Herbst Tipp: Wärme sparen</div></div>
            </div>
            <div class="day-col">
              <div class="day-header">Di 15.</div>
              <div class="day-post"><div class="dp-plat">Instagram · 10:00</div><div class="dp-title">Vorher-Nachher: Projekt Vaihingen</div></div>
            </div>
            <div class="day-col">
              <div class="day-header">Mi 16.</div>
              <div class="day-post"><div class="dp-plat">Facebook · 14:00</div><div class="dp-title">KfW-Förderung nutzen!</div></div>
              <div class="day-post"><div class="dp-plat">Instagram · 18:00</div><div class="dp-title">Team vorstellen – Lisa M.</div></div>
            </div>
            <div class="day-col">
              <div class="day-header">Do 17.</div>
              <div class="day-empty">Frei</div>
            </div>
            <div class="day-col">
              <div class="day-header">Fr 18.</div>
              <div class="day-post"><div class="dp-plat">Instagram · 11:00</div><div class="dp-title">Wochenrückblick & Projekt</div></div>
            </div>
            <div class="day-col">
              <div class="day-header">Sa 19.</div>
              <div class="day-empty">Frei</div>
            </div>
            <div class="day-col">
              <div class="day-header">So 20.</div>
              <div class="day-empty">Frei</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 1rem; font-size: 12px; color: var(--text2);">
          5 geplante Beiträge · Ø Posting-Zeit: 11:30 Uhr · Nächster Post: Montag 09:00 Uhr
        </div>
      </div>
    </div>

    <!-- IMAGES -->
    <div id="page-images" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Bilder & Watermark</div>
          <div class="topbar-sub">Logo-Upload, Watermark-Einstellungen, Bildgenerierung</div>
        </div>
        <div class="spacer"></div>
        <button class="btn btn-primary" onclick="genImage()">Bild generieren</button>
      </div>
      <div style="padding: 1.5rem;">
        <div class="grid2">
          <div>
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 1rem;">Watermark-Einstellungen</div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Logo hochladen</label>
                <div style="border: 1px dashed var(--border); border-radius: var(--border-radius-md); padding: 20px; text-align: center; cursor: pointer; color: var(--text2); font-size: 13px;" onclick="document.getElementById('logo-upload').click()">
                  Logo hier ablegen oder klicken<br>
                  <span style="font-size:11px;">PNG, SVG · max. 2MB</span>
                  <input type="file" id="logo-upload" style="display:none" accept="image/*" onchange="logoUploaded(this)">
                </div>
                <div id="logo-preview" style="margin-top: 8px; display:none; font-size:12px; color: var(--brand);">Logo geladen</div>
              </div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Position</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;"><input type="radio" name="wm-pos" value="bl" checked> Unten links</label>
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;"><input type="radio" name="wm-pos" value="br"> Unten rechts</label>
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;"><input type="radio" name="wm-pos" value="tl"> Oben links</label>
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;"><input type="radio" name="wm-pos" value="tr"> Oben rechts</label>
                  <label style="font-size:12px; display:flex; align-items:center; gap:5px; cursor:pointer;"><input type="radio" name="wm-pos" value="c"> Zentriert</label>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Transparenz: <span id="opacity-val">80%</span></label>
                <input type="range" min="10" max="100" value="80" step="5" style="width:100%"
                  oninput="document.getElementById('opacity-val').textContent=this.value+'%'; updateWatermark()">
              </div>
              <div style="margin-bottom: 16px;">
                <label class="form-label">Größe: <span id="size-val">20%</span></label>
                <input type="range" min="5" max="50" value="20" step="5" style="width:100%"
                  oninput="document.getElementById('size-val').textContent=this.value+'%'; updateWatermark()">
              </div>
            </div>
          </div>

          <div>
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 0.75rem;">Vorschau</div>
              <div class="watermark-preview" id="wm-preview">
                <div class="wm-content">
                  <h3>Fassadenmalerei Stuttgart</h3>
                  <p>Maler Müller GmbH · Professionell seit 1985</p>
                </div>
                <div class="watermark-overlay" id="wm-overlay" style="bottom:12px; left:12px;">
                  MM GmbH
                </div>
              </div>
              <div style="margin-top: 10px; font-size: 12px; color: var(--text2);">
                Jedes generierte Bild erhält automatisch dieses Watermark (serverseitig via Sharp).
              </div>
            </div>
            <div class="card">
              <div class="card-title" style="margin-bottom: 0.75rem;">Bildprompt generieren</div>
              <div style="margin-bottom: 10px;">
                <label class="form-label">Thema / Post-Kontext</label>
                <input class="input-field" type="text" id="img-topic" placeholder="z.B. Fassade sanieren Herbst Stuttgart" />
              </div>
              <button class="btn btn-primary" style="width:100%;" onclick="genImagePrompt()">Prompt generieren</button>
              <div id="img-prompt-out" style="margin-top: 10px; font-size: 12px; color: var(--text2); display:none; background: var(--surface2); padding: 8px; border-radius: var(--border-radius-md); line-height:1.6;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ANALYTICS -->
    <div id="page-analytics" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Performance & Analyse</div>
          <div class="topbar-sub">Oktober 2025</div>
        </div>
      </div>
      <div style="padding: 1.5rem;">
        <div class="grid4" style="margin-bottom: 1.25rem;">
          <div class="stat-card"><div class="stat-label">Ø Content-Score</div><div class="stat-value">78</div><div class="stat-delta delta-up">+12 vs. Vormonat</div></div>
          <div class="stat-card"><div class="stat-label">Trend-Treffer</div><div class="stat-value">83%</div><div class="stat-delta delta-up">Relevanz hoch</div></div>
          <div class="stat-card"><div class="stat-label">Generierte Posts</div><div class="stat-value">24</div><div class="stat-delta">dieser Monat</div></div>
          <div class="stat-card"><div class="stat-label">Beste Quelle</div><div class="stat-value" style="font-size:14px;">handwerk.de</div><div class="stat-delta delta-up">Score: 88</div></div>
        </div>
        <div class="grid2">
          <div class="card">
            <div class="card-title" style="margin-bottom: 1rem;">Themen-Performance</div>
            <div class="chart-bar-row"><div class="chart-bar-label">Energie sparen</div><div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:92%"></div></div></div><div class="chart-bar-val">92</div></div>
            <div class="chart-bar-row"><div class="chart-bar-label">KfW Förderung</div><div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:85%"></div></div></div><div class="chart-bar-val">85</div></div>
            <div class="chart-bar-row"><div class="chart-bar-label">Vorher-Nachher</div><div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:78%"></div></div></div><div class="chart-bar-val">78</div></div>
            <div class="chart-bar-row"><div class="chart-bar-label">Team & Ausb.</div><div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:65%"></div></div></div><div class="chart-bar-val">65</div></div>
            <div class="chart-bar-row"><div class="chart-bar-label">Saisonal</div><div class="chart-bar-wrap"><div class="progress-bar-bg"><div class="progress-bar" style="width:55%; background: var(--accent)"></div></div></div><div class="chart-bar-val">55</div></div>
          </div>
          <div class="card">
            <div class="card-title" style="margin-bottom: 1rem;">Engagement-Prognose</div>
            <div style="font-size: 13px; color: var(--text2); margin-bottom: 12px;">Nächste 7 Tage basierend auf Trend-Score</div>
            <div class="trend-item" style="padding: 8px 0;">
              <div style="flex:1; font-size: 13px; color: var(--text);">Instagram Post (Mo)</div>
              <span class="tag tag-green">Sehr hoch</span>
            </div>
            <div class="trend-item" style="padding: 8px 0;">
              <div style="flex:1; font-size: 13px; color: var(--text);">Facebook Post (Mo)</div>
              <span class="tag tag-green">Hoch</span>
            </div>
            <div class="trend-item" style="padding: 8px 0;">
              <div style="flex:1; font-size: 13px; color: var(--text);">Instagram (Mi)</div>
              <span class="tag tag-amber">Mittel</span>
            </div>
            <div class="trend-item" style="padding: 8px 0;">
              <div style="flex:1; font-size: 13px; color: var(--text);">Facebook (Mi)</div>
              <span class="tag tag-amber">Mittel</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROFILE -->
    <div id="page-profile" class="page">
      <div class="topbar">
        <div>
          <div class="topbar-title">Firmenprofil</div>
          <div class="topbar-sub">Branding, Tonalität & Zielgruppe</div>
        </div>
        <div class="spacer"></div>
        <button class="btn btn-primary">Speichern</button>
      </div>
      <div style="padding: 1.5rem;">
        <div class="grid2">
          <div>
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 1rem;">Firmendaten</div>
              <div style="margin-bottom: 12px;"><label class="form-label">Firmenname</label><input class="input-field" value="Maler Müller GmbH"></div>
              <div style="margin-bottom: 12px;"><label class="form-label">Branche</label>
                <select class="input-field">
                  <option selected>Malerbetrieb</option>
                  <option>Elektriker</option>
                  <option>Sanitär / Heizung</option>
                  <option>Dachdecker</option>
                  <option>Schreiner</option>
                  <option>Zimmerer</option>
                  <option>Fliesenleger</option>
                </select>
              </div>
              <div style="margin-bottom: 12px;"><label class="form-label">Region / Stadt</label><input class="input-field" value="Stuttgart, Baden-Württemberg"></div>
              <div style="margin-bottom: 12px;"><label class="form-label">Zielgruppe</label>
                <select class="input-field">
                  <option>Privatkunden (Hausbesitzer)</option>
                  <option>Gewerbliche Kunden</option>
                  <option>Beide</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <div class="card" style="margin-bottom: 1rem;">
              <div class="card-title" style="margin-bottom: 1rem;">Tonalität & Branding</div>
              <div style="margin-bottom: 12px;"><label class="form-label">Kommunikationsstil</label>
                <select class="input-field">
                  <option selected>Professionell & vertrauenswürdig</option>
                  <option>Herzlich & familiär</option>
                  <option>Modern & direkt</option>
                </select>
              </div>
              <div style="margin-bottom: 12px;"><label class="form-label">USPs (Kommagetrennt)</label>
                <textarea class="input-field" rows="3" style="resize:vertical;">Seit 1985 in Stuttgart, Familienunternehmen, 5 Jahre Garantie, kostenlose Erstberatung</textarea>
              </div>
              <div style="margin-bottom: 12px;">
                <label class="form-label">Hashtag-Stil</label>
                <select class="input-field">
                  <option>Gemischt (lokal + Branche)</option>
                  <option>Nur lokal</option>
                  <option>Nur Branche</option>
                </select>
              </div>
            </div>
            <div class="card">
              <div class="card-title" style="margin-bottom: 0.75rem;">Social-Media-Verbindungen</div>
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 0.5px solid var(--border);">
                <div class="platform-dot p-ig" style="width: 10px; height: 10px;"></div>
                <div style="font-size: 13px; color: var(--text);">Instagram</div>
                <span class="tag tag-amber" style="margin-left: auto;">Verbinden</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 0.5px solid var(--border);">
                <div class="platform-dot p-fb" style="width: 10px; height: 10px;"></div>
                <div style="font-size: 13px; color: var(--text);">Facebook</div>
                <span class="tag tag-amber" style="margin-left: auto;">Verbinden</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0;">
                <div class="platform-dot p-li" style="width: 10px; height: 10px;"></div>
                <div style="font-size: 13px; color: var(--text);">LinkedIn</div>
                <span class="tag tag-amber" style="margin-left: auto;">Verbinden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</div>
`;