import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const ACCENT = '#F59E0B';
const BG = '#1C1917';
const BG_PANEL = '#292524';
const TEXT = '#F5F5F4';
const MUTED = '#A8A29E';

/** Generate a decorative dot-grid pattern string for the left panel */
function generatePattern(rows: number, cols: number): string[] {
  const chars = ['.', '*', '·', '•', '×', '/', '\\', '-', '+', '~', ':', ';'];
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      line += chars[Math.floor(Math.abs(Math.sin(r * 13 + c * 7) * 1000) % chars.length)];
      if (c < cols - 1) line += ' ';
    }
    lines.push(line);
  }
  return lines;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || "Raaj's Blog";
  const subtitle =
    searchParams.get('subtitle') ||
    'Thoughts on engineering, design, and building great software.';

  const patternLines = generatePattern(22, 20);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: BG,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Left panel – decorative pattern */}
        <div
          style={{
            width: '460',
            height: '630',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: BG_PANEL,
            padding: '30px',
            position: 'relative',
          }}
        >
          {/* pattern overlay */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              backgroundColor: '#1C1917',
              borderRadius: '8px',
              padding: '24px 20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              border: '1px solid #44403C',
              transform: 'rotate(-2deg)',
            }}
          >
            {patternLines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  fontSize: '13',
                  lineHeight: '1.1',
                  letterSpacing: '2px',
                  color: '#A8A29E',
                  fontFamily: 'monospace',
                  opacity: 0.5,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel – content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 56px',
          }}
        >
          {/* Top section – title & subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '48',
                fontWeight: 700,
                color: TEXT,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '22',
                color: MUTED,
                lineHeight: 1.5,
                maxWidth: '560px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom section – branding */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Accent mark / icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40',
                height: '40',
                borderRadius: '10px',
                backgroundColor: ACCENT,
                color: '#FFFFFF',
                fontSize: '22',
                fontWeight: 700,
              }}
            >
              R
            </div>
            <div
              style={{
                fontSize: '26',
                fontWeight: 600,
                color: TEXT,
                letterSpacing: '-0.01em',
              }}
            >
              Raaj Blogs
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
