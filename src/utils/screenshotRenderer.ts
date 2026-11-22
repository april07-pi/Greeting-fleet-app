export interface ScreenshotOptions {
  inputName: string;
  displayedGreeting: string;
  theme: 'light' | 'dark';
  viewport: 'desktop' | 'mobile';
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function renderFletScreenshot(options: ScreenshotOptions): string {
  const isMobile = options.viewport === 'mobile';
  const width = isMobile ? 460 : 960;
  const height = isMobile ? 760 : 620;
  const scale = 2;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  ctx.scale(scale, scale);

  const isDark = options.theme === 'dark';
  const windowBg = isDark ? '#0F172A' : '#FFFFFF';
  const titleBarBg = isDark ? '#1E293B' : '#F1F5F9';
  const borderColor = isDark ? '#334155' : '#CBD5E1';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const fieldBg = isDark ? '#1E293B' : '#FFFFFF';
  const fieldBorder = '#0284C7';
  const buttonBg = isDark ? '#1E293B' : '#F8FAFC';
  const buttonText = isDark ? '#38BDF8' : '#0284C7';
  const buttonBorder = isDark ? '#334155' : '#E2E8F0';

  // Window frame background
  ctx.fillStyle = windowBg;
  ctx.fillRect(0, 0, width, height);

  // Title Bar
  const titleBarHeight = 44;
  ctx.fillStyle = titleBarBg;
  ctx.fillRect(0, 0, width, titleBarHeight);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, titleBarHeight);
  ctx.lineTo(width, titleBarHeight);
  ctx.stroke();

  // Window controls (macOS/Desktop style)
  const dots = ['#EF4444', '#F59E0B', '#10B981'];
  dots.forEach((color, idx) => {
    ctx.beginPath();
    ctx.arc(22 + idx * 18, titleBarHeight / 2, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // Window Title
  ctx.fillStyle = textPrimary;
  ctx.font = '600 13px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Greeting App', width / 2, titleBarHeight / 2);

  // Center Column stack geometry
  const centerX = width / 2;
  const contentCenterY = titleBarHeight + (height - titleBarHeight) / 2;

  const fieldW = isMobile ? 310 : 320;
  const fieldH = 54;
  const btnW = 136;
  const btnH = 44;
  const spacing = 22;

  const hasGreeting = options.displayedGreeting.trim().length > 0;
  const totalHeight = fieldH + spacing + btnH + (hasGreeting ? spacing + 32 : 0);
  const startY = contentCenterY - totalHeight / 2;

  // 1. TextField
  const fieldX = centerX - fieldW / 2;
  const fieldY = startY;

  ctx.fillStyle = fieldBg;
  drawRoundedRect(ctx, fieldX, fieldY, fieldW, fieldH, 8);
  ctx.fill();

  ctx.strokeStyle = fieldBorder;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, fieldX, fieldY, fieldW, fieldH, 8);
  ctx.stroke();

  // Floating Label on TextField border
  const labelText = 'Enter your name';
  ctx.font = '500 12px "Plus Jakarta Sans", system-ui, sans-serif';
  const labelMetrics = ctx.measureText(labelText);
  const labelPad = 6;
  ctx.fillStyle = windowBg;
  ctx.fillRect(fieldX + 12, fieldY - 8, labelMetrics.width + labelPad * 2, 16);

  ctx.fillStyle = fieldBorder;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, fieldX + 12 + labelPad, fieldY);

  // TextField Value
  ctx.font = '400 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillStyle = options.inputName ? textPrimary : textMuted;
  ctx.fillText(options.inputName || 'e.g. Kwazi', fieldX + 16, fieldY + fieldH / 2 + 1);

  // 2. ElevatedButton ("Greet Me")
  const btnX = centerX - btnW / 2;
  const btnY = fieldY + fieldH + spacing;

  ctx.save();
  ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(15, 23, 42, 0.14)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = buttonBg;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 22);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = buttonBorder;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 22);
  ctx.stroke();

  ctx.fillStyle = buttonText;
  ctx.font = '600 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Greet Me', centerX, btnY + btnH / 2);

  // 3. Text Control Output
  if (hasGreeting) {
    const textY = btnY + btnH + spacing + 16;
    ctx.fillStyle = textPrimary;
    ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.displayedGreeting, centerX, textY);
  }

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  URL.revokeObjectURL(url);
}
