// The same Markdown headings that become section anchors in markdown.js.
export function parseOutline(source) {
  const sections = [];
  let fenced = false;
  let headingIndex = 0;
  let offset = 0;
  for (const line of String(source || '').replace(/\r\n/g, '\n').split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    else if (!fenced) {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = Math.max(2, match[1].length);
        if (level >= 2) sections.push({level, title: match[2].replace(/\*\*|\*|`/g, ''), offset, id: `section-${headingIndex}`});
        headingIndex++;
      }
    }
    offset += line.length + 1;
  }
  return sections;
}
