/* =============================================
   Mi Firma por Colombia — App Logic
   ============================================= */

(function () {
  'use strict';

  /* ── Config ── */
  const CANVAS_SIZE   = 1080;          // output image size in px (square, 1:1 for social media)
  const TEMPLATE_SRC  = 'img/plantilla.webp';

  /* Name zone: where the name is rendered (fraction of canvas size, 0–1) */
  const NAME_ZONE = {
    x:      0.08,   // left edge — alineado al rectángulo blanco
    y:      0.14,   // top of zone
    width:  0.9,   // ancho del rectángulo blanco
    height: 0.5,   // alto del rectángulo blanco
  };

  /* ── State ── */
  const state = {
    name:           '',
    font:           'Wonderkid',
    color:          '#4b248d',
    templateLoaded: false,
    templateImg:    null,
  };

  /* ── DOM refs ── */
  const canvas      = document.getElementById('preview-canvas');
  const ctx         = canvas.getContext('2d');
  const input       = document.getElementById('nombre-input');
  const charCount   = document.getElementById('char-count');
  const btnDownload = document.getElementById('btn-download');
  const placeholder = document.getElementById('canvas-placeholder');
  const shareHint   = document.getElementById('share-hint');
  const wrapper     = document.getElementById('canvas-wrapper');

  const step1 = document.getElementById('step1-indicator');
  const step2 = document.getElementById('step2-indicator');
  const step3 = document.getElementById('step3-indicator');

  /* ── Init ── */
  canvas.width  = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  loadTemplate();

  /* ── Template loader ── */
  function loadTemplate() {
    const img = new Image();
    img.onload = function () {
      state.templateImg    = img;
      state.templateLoaded = true;
      render();
    };
    img.onerror = function () {
      state.templateLoaded = false;
      state.templateImg    = null;
      render();
    };
    img.src = TEMPLATE_SRC;
  }

  /* ── Main render ── */
  function render() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (state.templateLoaded && state.templateImg) {
      drawTemplate();
    } else {
      drawFallbackTemplate();
    }

    if (state.name.trim()) {
      drawName();
    }
  }

  /* ── Draw real template ── */
  function drawTemplate() {
    ctx.drawImage(state.templateImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  /* ── Draw fallback demo template ── */
  function drawFallbackTemplate() {
    const S = CANVAS_SIZE;

    /* Background gradient (deep dark blue) */
    const bg = ctx.createLinearGradient(0, 0, S, S);
    bg.addColorStop(0, '#050A14');
    bg.addColorStop(1, '#0D1B2E');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);

    /* ── Colombian flag stripe (bottom) ── */
    const stripeH = S * 0.06;

    // Yellow
    ctx.fillStyle = '#FCD116';
    ctx.fillRect(0, S - stripeH * 3, S, stripeH * 1.5);

    // Blue
    ctx.fillStyle = '#003087';
    ctx.fillRect(0, S - stripeH * 1.5, S, stripeH * 0.75);

    // Red
    ctx.fillStyle = '#CE1126';
    ctx.fillRect(0, S - stripeH * 0.75, S, stripeH * 0.75);

    /* Subtle grid overlay */
    ctx.save();
    ctx.strokeStyle = 'rgba(252,209,22,0.04)';
    ctx.lineWidth = 1;
    const grid = 72;
    for (let x = 0; x <= S; x += grid) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke();
    }
    for (let y = 0; y <= S; y += grid) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }
    ctx.restore();

    /* Circular emblem background */
    const cx = S * 0.5, cy = S * 0.3, r = S * 0.22;
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    radGrad.addColorStop(0,   'rgba(252,209,22,0.18)');
    radGrad.addColorStop(0.7, 'rgba(252,209,22,0.06)');
    radGrad.addColorStop(1,   'rgba(252,209,22,0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    /* Outer ring */
    ctx.save();
    ctx.strokeStyle = 'rgba(252,209,22,0.35)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    /* Flag emoji / map icon placeholder */
    ctx.font = `${S * 0.12}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🇨🇴', cx, cy);

    /* Campaign headline */
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${S * 0.048}px 'Playfair Display', Georgia, serif`;
    ctx.fillText('Mi Firma por Colombia', S / 2, S * 0.56);

    /* Tagline */
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `${S * 0.022}px 'Inter', Arial, sans-serif`;
    ctx.fillText('Cada firma cuenta · Cada voz importa', S / 2, S * 0.605);

    /* Name zone indicator (dashed box) */
    const nz = getNameZonePx();
    ctx.save();
    ctx.strokeStyle = 'rgba(252,209,22,0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.roundRect(nz.x, nz.y, nz.w, nz.h, 10);
    ctx.stroke();
    ctx.restore();

    /* Placeholder text inside zone */
    if (!state.name.trim()) {
      ctx.fillStyle = 'rgba(252,209,22,0.2)';
      ctx.font      = `italic ${S * 0.028}px 'Inter', Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Tu nombre irá aquí', S / 2, nz.y + nz.h / 2 + S * 0.012);
    }

    /* Bottom watermark */
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font      = `${S * 0.016}px 'Inter', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('mifirmaporcolombia.co', S / 2, S - stripeH * 3 - S * 0.02);
  }

  /* ── Draw the user's name ── */
  function drawName() {
    const S    = CANVAS_SIZE;
    const nz   = getNameZonePx();
    const name = state.name.trim().toUpperCase();
    const maxW = nz.w * 0.9;
    const cx   = nz.x + nz.w / 2;

    ctx.save();
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = state.color;
    ctx.letterSpacing = '2px';

    /* Split into two lines if text exceeds maxW */
    let fontSize = nz.h * 0.62;
    ctx.font = buildFont(fontSize);

    const lines = wrapText(ctx, name, maxW);

    /* If two lines, halve the zone height per line and shrink font to fit each */
    if (lines.length > 1) {
      fontSize = nz.h * 0.38;
      ctx.font = buildFont(fontSize);
      /* Ensure each line fits */
      while (fontSize > 20 && lines.some(l => ctx.measureText(l).width > maxW)) {
        fontSize -= 2;
        ctx.font = buildFont(fontSize);
      }
    } else {
      /* Single line — shrink until it fits */
      while (ctx.measureText(lines[0]).width > maxW && fontSize > 20) {
        fontSize -= 2;
        ctx.font = buildFont(fontSize);
      }
    }

    const lineH   = fontSize * 1.05;
    const totalH  = lines.length * lineH;
    const startY  = nz.y + nz.h / 2 - totalH / 2 + lineH / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, cx, startY + i * lineH);
    });

    ctx.restore();
  }

  /* Split name at the middle word boundary when it overflows maxW */
  function wrapText(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return [text];

    const words = text.split(' ');
    if (words.length === 1) return [text]; // single word, can't split

    /* Find the split point closest to the middle character */
    let best = 1;
    let bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const line1 = words.slice(0, i).join(' ');
      const line2 = words.slice(i).join(' ');
      const diff  = Math.abs(line1.length - line2.length);
      if (diff < bestDiff) { bestDiff = diff; best = i; }
    }

    return [
      words.slice(0, best).join(' '),
      words.slice(best).join(' '),
    ];
  }

  function buildFont(size) {
    return `${size}px 'Wonderkid', serif`;
  }

  function getNameZonePx() {
    const S = CANVAS_SIZE;
    return {
      x: S * NAME_ZONE.x,
      y: S * NAME_ZONE.y,
      w: S * NAME_ZONE.width,
      h: S * NAME_ZONE.height,
    };
  }

  /* ── Step progress ── */
  function updateSteps() {
    const hasName = state.name.trim().length > 0;
    step1.className = 'step' + (hasName ? ' done' : ' active');
    step2.className = 'step' + (hasName ? ' active' : '');
    step3.className = 'step';
  }

  function markStep3() {
    step1.className = 'step done';
    step2.className = 'step done';
    step3.className = 'step active';
  }

  /* ── Input handler ── */
  let debounceTimer;
  input.addEventListener('input', function () {
    state.name = this.value;
    charCount.textContent = this.value.length;

    const hasName = state.name.trim().length > 0;
    btnDownload.disabled = !hasName;
    shareHint.style.display = 'none';

    if (hasName) {
      placeholder.classList.add('hidden');
      wrapper.classList.add('rendering');
      setTimeout(() => wrapper.classList.remove('rendering'), 700);
    } else {
      placeholder.classList.remove('hidden');
    }

    updateSteps();

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 60);
  });

  /* ── Download ── */
  btnDownload.addEventListener('click', async function () {
    if (!state.name.trim()) return;

    /* Ensure custom font is loaded before rendering to canvas */
    try {
      await document.fonts.load(`80px 'Wonderkid'`);
    } catch (e) { /* continue even if font API unavailable */ }

    render();

    const safeName = state.name.trim()
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 40);

    try {
      const dataURL = canvas.toDataURL('image/png', 1.0);
      const link    = document.createElement('a');
      link.download = `MiFirmaPorColombia_${safeName}.png`;
      link.href     = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('⚠️ Para descargar, haz clic derecho sobre index.html en VS Code → "Open with Live Server".\n\nEsto abre la página en http://localhost y la descarga funcionará correctamente.');
      return;
    }

    markStep3();
    shareHint.style.display = 'block';
    shareHint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ── Initial render ── */
  render();

})();
