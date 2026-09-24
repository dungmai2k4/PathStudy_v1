const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Let's use PowerShell via a ps1 file to extract
const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("docs/EXE201_Outcome 1  guidelines.docx")
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
[System.IO.File]::WriteAllText("docs/raw_guidelines.xml", $content)
`;

fs.writeFileSync('extract.ps1', psScript);
execSync('powershell -ExecutionPolicy Bypass -File extract.ps1');
fs.unlinkSync('extract.ps1');

const xml = fs.readFileSync('docs/raw_guidelines.xml', 'utf-8');
// Simple regex to parse text from w:p and w:t
const pMatches = xml.match(/<w:p[\s>].*?<\/w:p>/g) || [];
const lines = [];
for (const p of pMatches) {
  const tMatches = p.match(/<w:t[\s>].*?<\/w:t>/g) || [];
  let text = '';
  for (const t of tMatches) {
    const m = t.replace(/<[^>]+>/g, '');
    text += m;
  }
  if (text.trim()) {
    lines.push(text);
  }
}

fs.writeFileSync('docs/guidelines_extracted.txt', lines.join('\n'));
console.log('Extracted lines:', lines.length);
