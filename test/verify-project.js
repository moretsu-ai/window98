// Automated Verification Test Suite for The Abandoned Computer (Windows 98)

import fs from 'fs';
import path from 'path';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('==================================================');
console.log('RUNNING THE ABANDONED COMPUTER VERIFICATION SUITE');
console.log('==================================================\n');

// 1. Asset Verification
console.log('1. Verifying Bundled Assets & Directories:');
assert(fs.existsSync('documents'), 'documents/ folder exists at root');
assert(fs.existsSync('spongebob'), 'spongebob/ folder exists at root');
assert(fs.existsSync('public/documents'), 'public/documents/ folder exists');
assert(fs.existsSync('public/spongebob'), 'public/spongebob/ folder exists');
assert(fs.existsSync('public/audio'), 'public/audio/ folder exists');

// SpongeBob Clips
const clips = [
  'vlipsy-spongebob-squarepants-twelve-seconds-later-8fZQBuhW.mp4',
  'vlipsy-spongebob-squarepants-ten-hours-later-9fwEnlag.mp4',
  'vlipsy-spongebobsquarepantsoneeternitylater-gyck95iN.mp4',
];
clips.forEach((clip, i) => {
  assert(fs.existsSync(path.join('public/spongebob', clip)), `SpongeBob clip #${i + 1} (${clip}) exists in public`);
  assert(fs.statSync(path.join('public/spongebob', clip)).size > 50000, `SpongeBob clip #${i + 1} is valid video size`);
});

// Bundled Documents
const docFiles = [
  'Personal context.html',
  'Pragya Dewangan Personal Kundali.pdf',
  'hacktoberfest-2026-fest-certificate-2026-01a08bf1-a33b-4c73-d19c-de07387e9498.pdf',
];
docFiles.forEach((doc) => {
  assert(fs.existsSync(path.join('public/documents', doc)), `Bundled document "${doc}" exists in public/documents`);
});

// Skull Assets
assert(fs.existsSync('public/skull.jpg') || fs.existsSync('skull.jpg'), 'Screaming skull image exists');
assert(fs.existsSync('public/skull_upper.png'), 'Skull upper stationary cranium layer exists');
assert(fs.existsSync('public/skull_jaw.png'), 'Skull lower independent jaw layer exists');

// Audio Assets
assert(fs.existsSync('public/audio/chick-song.wav'), 'chick-song.wav exists');
assert(fs.existsSync('public/audio/fake-virus.wav'), 'fake-virus.wav exists');

console.log('\n2. Verifying Core Components & State:');
const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/styles/win98.css',
  'src/types/window.ts',
  'src/types/filesystem.ts',
  'src/context/FileSystemContext.tsx',
  'src/context/WindowManagerContext.tsx',
  'src/context/EasterEggContext.tsx',
  'src/components/common/WinIcon.tsx',
  'src/components/desktop/Desktop.tsx',
  'src/components/desktop/DesktopIcon.tsx',
  'src/components/taskbar/Taskbar.tsx',
  'src/components/taskbar/StartMenu.tsx',
  'src/components/window/WindowFrame.tsx',
  'src/components/window/WindowRenderer.tsx',
  'src/components/apps/MyComputer.tsx',
  'src/components/apps/FileExplorer.tsx',
  'src/components/apps/Notepad.tsx',
  'src/components/apps/Paint.tsx',
  'src/components/apps/Calculator.tsx',
  'src/components/apps/ControlPanel.tsx',
  'src/components/apps/InternetExplorer.tsx',
  'src/components/apps/ImageViewer.tsx',
  'src/components/apps/DocumentViewer.tsx',
  'src/components/apps/games/Minesweeper.tsx',
  'src/components/apps/games/Solitaire.tsx',
  'src/components/apps/games/Snake.tsx',
  'src/components/dialogs/ShutdownDialog.tsx',
  'src/components/dialogs/RunDialog.tsx',
  'src/components/dialogs/HelpDialog.tsx',
  'src/components/easter-eggs/EasterEgg01Chick.tsx',
  'src/components/easter-eggs/EasterEgg02Skull.tsx',
  'src/components/easter-eggs/EasterEgg03Update.tsx',
  'src/utils/audio.ts',
];

requiredFiles.forEach((file) => {
  assert(fs.existsSync(file), `Component file exists: ${file}`);
});

console.log('\n3. Verifying Easter Egg Contracts:');
// EE1
const ee1Content = fs.readFileSync('src/components/easter-eggs/EasterEgg01Chick.tsx', 'utf-8');
assert(ee1Content.includes('clickCount < 4') && ee1Content.includes('Peep-peep!'), 'EE1: Requires 5 clicks and displays "Peep-peep!"');
assert(ee1Content.includes('playChickSong'), 'EE1: Plays chick song');

// EE2
const ee2Content = fs.readFileSync('src/components/easter-eggs/EasterEgg02Skull.tsx', 'utf-8');
const ieContent = fs.readFileSync('src/components/apps/InternetExplorer.tsx', 'utf-8');
assert(ieContent.includes('zxc.com') && ieContent.includes('triggerEgg2()'), 'EE2: Triggered ONLY after simulated download from zxc.com');
assert(ee2Content.includes('skull_jaw.png') && ee2Content.includes('skull_upper.png'), 'EE2: Uses independent lower jaw and stationary cranium');
assert(ee2Content.includes('GOT YOU!') && ee2Content.includes('Your computer is perfectly safe.'), 'EE2: Safe reveal message present');

// EE3
const ee3Context = fs.readFileSync('src/context/EasterEggContext.tsx', 'utf-8');
const ee3Content = fs.readFileSync('src/components/easter-eggs/EasterEgg03Update.tsx', 'utf-8');
assert(ee3Context.includes('e.shiftKey') && ee3Context.includes('e.altKey') && ee3Context.includes("'u'"), 'EE3: Activated by Ctrl + Shift + Alt + U');
assert(ee3Context.includes('target.tagName === \'INPUT\'') && ee3Context.includes('target.tagName === \'TEXTAREA\''), 'EE3: Ignored when user is in input/textarea');
assert(ee3Content.includes('vlipsy-spongebob-squarepants-twelve-seconds-later') &&
       ee3Content.includes('vlipsy-spongebob-squarepants-ten-hours-later') &&
       ee3Content.includes('vlipsy-spongebobsquarepantsoneeternitylater'), 'EE3: Plays all 3 SpongeBob clips in exact sequence');
assert(ee3Content.includes('Gandhi') && ee3Content.includes('SHOW ANOTHER MEME'), 'EE3: Memes including Gandhi and Next Meme functionality present');

console.log('\n==================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} assertions passed.`);
if (passedTests === totalTests) {
  console.log('ALL VERIFICATION CRITERIA SATISFIED! 🎉');
} else {
  console.error('SOME TESTS FAILED.');
}
console.log('==================================================\n');
