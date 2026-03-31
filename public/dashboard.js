function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const map = {dashboard:'Dashboard',trends:'Trend Engine',sources:'Quellen',generator:'Generator',planner:'Wochenplaner',images:'Bilder & Watermark',analytics:'Performance',profile:'Firmenprofil'};
  document.querySelectorAll('.nav-item').forEach(n => {
    if(n.textContent.trim().startsWith(map[page] || '___')) n.classList.add('active');
  });
}

function runScan() {
  var btn = document.getElementById('scan-btn');
  var status = document.getElementById('ai-status');
  btn.disabled = true;
  btn.innerHTML = '<span class="ai-spinner"></span>Scannt...';
  status.innerHTML = '<span class="ai-spinner"></span>Crawle Quellen...';
  setTimeout(function() { status.innerHTML = '<span class="ai-spinner"></span>Analysiere Inhalte...'; }, 1200);
  setTimeout(function() { status.innerHTML = '<span class="ai-spinner"></span>Extrahiere Themen...'; }, 2400);
  setTimeout(function() { status.innerHTML = '<span class="ai-spinner"></span>Berechne Trend-Scores...'; }, 3600);
  setTimeout(function() {
    status.innerHTML = '<span style="color: var(--brand);">7 Trends erkannt. 3 hochrelevant für Maler Müller GmbH.</span>';
    btn.disabled = false; btn.innerHTML = 'Jetzt scannen';
  }, 4800);
}

function genFromTrend(t) {
  nav('generator');
  var sel = document.getElementById('gen-trend');
  for(var i=0; i<sel.options.length; i++) {
    if(sel.options[i].text.toLowerCase().includes(t.toLowerCase().split(' ')[0])) { sel.selectedIndex=i; break; }
  }
}

function generateContent() {
  var out = document.getElementById('ig-post');
  out.innerHTML = '<span class="ai-spinner"></span>Generiere...';
  var trend = document.getElementById('gen-trend').value;
  setTimeout(function() {
    if(trend.includes('Fachkräftemangel')) {
      out.innerHTML = '🛠️ <strong>Wir suchen dich – Ausbildung bei Maler Müller!</strong><br><br>Der Handwerk braucht Nachwuchs – und wir investieren in ihn. Bei uns lernst du von Profis mit über 40 Jahren Erfahrung in Stuttgart.<br><br>✅ Top-Ausbildungsvergütung<br>✅ Übernahmechance garantiert<br>✅ Familienfreundliches Team<br><br>👉 Jetzt Ausbildungsplatz anfragen – Link in Bio!';
    } else if(trend.includes('KfW')) {
      out.innerHTML = '💰 <strong>KfW-Förderung: Bis zu 50.000 € für Ihre Sanierung!</strong><br><br>Die aktuellen KfW-Programme machen Fassaden- und Dachsanierungen so günstig wie nie. Als zertifizierter Betrieb helfen wir Ihnen von der Antragstellung bis zur Fertigstellung.<br><br>👉 Kostenlose Erstberatung – jetzt Termin vereinbaren!';
    } else {
      out.innerHTML = '🔧 <strong>Jetzt Heizkosten senken – mit professioneller Fassade!</strong><br><br>Die Energiepreise steigen weiter – Zeit zu handeln! Wir sanieren Ihre Fassade fachgerecht & schnell in Stuttgart und Umgebung. Bis zu 25% Ersparnis möglich.<br><br>👉 Kostenlose Beratung anfragen – Link in Bio!';
    }
  }, 1800);
}

function addSource() {
  var url = document.getElementById('src-url').value;
  if(!url) { document.getElementById('src-url').focus(); return; }
  var type = document.getElementById('src-type').value;
  alert('Quelle "' + url + '" wird hinzugefügt und gescannt...');
  document.getElementById('src-url').value = '';
}

function saveSource() { addSource(); }

function autoplan() {
  alert('KI-Auto-Plan: Wochenplan wird anhand der Top-Trends automatisch befüllt...');
}

function updateWatermark() {
  var pos = document.querySelector('input[name="wm-pos"]:checked').value;
  var ov = document.getElementById('wm-overlay');
  ov.style.bottom = ''; ov.style.top = ''; ov.style.left = ''; ov.style.right = '';
  ov.style.transform = '';
  if(pos==='bl') { ov.style.bottom='12px'; ov.style.left='12px'; }
  else if(pos==='br') { ov.style.bottom='12px'; ov.style.right='12px'; }
  else if(pos==='tl') { ov.style.top='12px'; ov.style.left='12px'; }
  else if(pos==='tr') { ov.style.top='12px'; ov.style.right='12px'; }
  else { ov.style.top='50%'; ov.style.left='50%'; ov.style.transform='translate(-50%,-50%)'; }
}

document.querySelectorAll('input[name="wm-pos"]').forEach(function(r) {
  r.addEventListener('change', updateWatermark);
});

function logoUploaded(input) {
  if(input.files && input.files[0]) {
    document.getElementById('logo-preview').style.display = 'block';
    document.getElementById('logo-preview').textContent = 'Logo geladen: ' + input.files[0].name;
    document.getElementById('wm-overlay').textContent = input.files[0].name.split('.')[0].substring(0,8);
  }
}

function genImage() {
  alert('Bildgenerierung: In der Produktion wird hier die KI-Bildgenerierungs-API angebunden (DALL-E, Midjourney via API oder Stable Diffusion). Das Bild wird danach automatisch mit dem Watermark via Sharp verarbeitet und gespeichert.');
}

function genImagePrompt() {
  var topic = document.getElementById('img-topic').value || 'Fassade sanieren Herbst Stuttgart';
  var out = document.getElementById('img-prompt-out');
  out.style.display = 'block';
  out.textContent = 'Generiere Prompt...';
  setTimeout(function() {
    out.textContent = 'Professional photo of a freshly painted residential house facade in Stuttgart, Germany, warm autumn sunlight, handcraft quality work, before/after split, clean white and beige tones, realistic architectural photography, 4k, sharp detail, golden hour lighting, German suburban neighborhood';
  }, 1200);
}