# The Abandoned Computer — Windows 98 Recreation

An authentic, nostalgic, and interactive recreation of an abandoned Windows 98 desktop computer discovered after decades in an attic. Built with modern web technologies, this simulator faithfully recreates the look, feel, beveled 3D controls, sound effects, applications, and quirky mysteries of the late 90s computing era.

---

## Project Overview

*The Abandoned Computer* transports users back to 1998. The computer feels lived-in, complete with real personal documents, vintage photographs, early websites, classic desktop applications, retro games, and three independent interactive Easter eggs (including the infamous screaming skull download prank and a fake Windows update troll).

All functionality operates inside a sandboxed virtual environment in the browser with local persistence. No actual host system files, settings, or operating systems are touched.

---

## Implemented Features

### Authentic Windows 98 Desktop
- **Classic Visuals:** Classic `#008080` teal background, 3D beveled inset/outset borders, and retro typography.
- **Desktop Icons:** Draggable, selectable desktop icons with double-click execution and dotted focus rings.
- **Desktop Context Menu:** Right-click desktop menu with options to Arrange Icons, Refresh, Create New Text Document, and open Display Properties.
- **Audio Synthesizer:** Built-in Web Audio API synthesizer for the iconic Windows 98 boot chime, button clicks, error chords, and game effects, with zero external network dependencies.

### Taskbar & Start Menu
- **Windows 98 Start Menu:** Complete with 2-level cascading flyout menus (Programs, Documents, Settings, Find, Help, Run, Shut Down).
- **Task Switcher:** Bottom taskbar showing open windows with active/inactive depressed button states and minimize/restore toggling.
- **Quick Launch:** Desktop and Internet Explorer shortcut buttons.
- **System Tray:** Live digital 12-hour clock (AM/PM) and an audio speaker mute/unmute control.

### Window Manager
- **Draggable & Resizable:** Windows can be dragged by the title bar and resized from the bottom-right grip corner.
- **Viewport Clamping:** Prevents windows from getting lost outside the screen bounds.
- **Window Controls:** Full support for Minimize (`_`), Maximize/Restore (`□`/`❐`), and Close (`✕`).
- **Stacking Order:** Focus and z-index elevation when clicking any part of an active or background window.

### Virtual Filesystem (VFS)
- **Local Storage Persistence:** Virtual file operations persist across page reloads via browser `localStorage`.
- **Directory Hierarchy:**
  - `C:\`
  - `C:\My Documents` (contains bundled documents and personal backstory files)
  - `C:\My Documents\My Pictures` (contains 11 vintage 1998 photographs, monitor shots, and floppy drives)
  - `C:\Program Files` (Internet Explorer, Accessories)
  - `C:\Windows\System32` (system configuration logs and classified security reports)
  - `C:\Recycle Bin` (deleted files and discarded homework drafts)
- **Operations:** Read, write, create folder, rename, delete, and file search.

### Bundled Document Integration
The files in the project's `documents/` folder have been integrated into the virtual filesystem:
1. **`Personal context.html`**: Exported HTML document, viewable in a sandboxed viewer.
2. **`Pragya Dewangan Personal Kundali.pdf`**: PDF document with embedded viewer and download backup.
3. **`hacktoberfest-2026-fest-certificate-2026-01a08bf1-a33b-4c73-d19c-de07387e9498.pdf`**: Verified developer certificate.
4. **Vintage Image Gallery**: 11 authentic 1998 images integrated into `C:\My Documents\My Pictures\`.

### Built-in Applications
- **My Computer:** Displays floppy drive (A:), hard drive (C:), CD-ROM drive (D:), and Control Panel with capacity indicators.
- **File Explorer:** Multi-pane explorer with address bar, history (Back/Forward), Up one level, tree navigation, and icon/details view modes.
- **Notepad:** Functional text editor with File menu, word wrap, cursor status, and `Ctrl+S` keyboard shortcuts to save directly back to the VFS.
- **Paint:** Interactive canvas with Pencil, Brush, Eraser, Fill bucket, Line, Rectangle, Ellipse, stroke size selection, 16-color retro palette, and PNG export to the virtual filesystem.
- **Calculator:** Standard Windows 98 pocket calculator layout with arithmetic, memory registers (MC, MR, MS, M+), keyboard input, and a secret `1998 =` discovery chime.
- **Control Panel:** Tabbed interface with Display (wallpaper switcher between Teal and Windows 98 Clouds), Date/Time, Sound scheme test, and System Properties.
- **Internet Explorer:** Fictional 1998 browser experience featuring:
  - `home.microsoft.com` / `msn.com` (1998 portal with news, stock tickers, and tech headlines)
  - `google.com` (1998 Google Beta with exclamation mark)
  - `mcdonalds.com` (1998 McDonald's website with Ronald McDonald visual)
  - `netflix.com` (1998 DVD-by-mail $20/month trial service)
  - `zxc.com` (Special domain housing Easter Egg 02)
- **Image Viewer:** Dedicated image viewer with zoom, 1:1 scale, and 90-degree rotation.
- **Document Viewer:** Dedicated PDF and HTML reader with copy download actions.

### Retro Games
- **Minesweeper:** Authentic 9x9 grid with 10 mines, classic smiley button (`🙂`, `😮`, `😎`, `😵`), right-click flagging, flood-fill algorithm, mine counter, and timer.
- **Solitaire (Klondike):** 7 tableau columns, 4 foundation piles, draw pile, waste pile, card moving, and victory detection.
- **Nokia Snake 98:** Nostalgic green phosphor LCD handheld theme with snake movement, food generation, score, high score, and keyboard/D-pad controls.

### System Dialogs
- **Shut Down Windows:** Safe simulation offering Shut Down, Restart, and MS-DOS mode. Shutting down renders the iconic orange text: *"It's now safe to turn off your computer."*
- **Run Dialog:** Command launcher for `notepad`, `calc`, `paint`, `explorer`, `winmine`, `sol`, `snake`, `control`, etc.
- **Help Topics:** Guided help system documenting backstory clues and secret features.

---

## Screenshots and Demo

### Live Demo
> **Live Demo URL:** `https://your-deployment-url-here.vercel.app` *(Replace with your deployed URL upon hosting)*

### Application Previews
*(Place screenshots in `screenshots/` directory when creating repository releases)*
- Desktop & Window Management
- Internet Explorer & 1998 Portals
- Minesweeper, Solitaire & Nokia Snake 98
- Screaming Skull & Windows Update Easter Eggs

---

## Easter Egg Guide

### Easter Egg 01 — Bouncing Egg and Baby Chick 🐣
- **Activation:** Click the **Control Panel / Settings** icon on the desktop three times in rapid succession.
- **Experience:** A bouncing egg appears on the screen. Clicking the egg 5 times cracks the shell progressively until an adorable baby chick hatches chirping *"Peep-peep!"*.
- **Audio:** Plays retro chick song / synthesized chirping for up to 10 seconds.
- **Cleanup:** Automatically restores desktop state after 9.5 seconds, or immediately via the Close button or `Escape`.

### Easter Egg 02 — Screaming Skull Prank 💀
- **Activation:** Open **Internet Explorer**, navigate to `zxc.com`, and click **DOWNLOAD NOW: ULTRA_SPEED_ACCELERATOR_PRO_98.EXE**.
- **Phase 1 (Black Screen):** After the simulated download completes, the screen cuts to black for 2 seconds.
- **Phase 2 (Animated Skull):** The supplied screaming skull illustration appears against a black background with screen shake. The stationary cranium remains steady while the lower jaw opens and closes independently in a frantic laughing/screaming animation. An eerie cyber virus alarm plays.
- **Phase 3 (The Reveal):** Transitions to a friendly message: *"GOT YOU! 😂 JUST KIDDING! Your computer is perfectly safe. No files were harmed. Welcome back to Windows 98!"*
- **Phase 4 (Restoration):** Returns cleanly to the browser and desktop. The downloaded file is safely preserved in `C:\My Documents`.

### Easter Egg 03 — Fake Windows Update Troll 🔄
- **Activation:** Press the global keyboard shortcut: `Ctrl + Shift + Alt + U`. (Ignored if currently typing into an input or textarea).
- **Phase 1 (Modern Update Screen):** The screen turns blue with a rotating Windows circular spinner, displaying progress from 0% up to 99% with status updates and humorous messages (*"Optimizing your patience..."*, *"Checking your intelligence..."*, *"Calculating how much time you've wasted..."*).
- **Phase 2 (SpongeBob Time-Passage Sequence):** At 99%, the progress freezes for ~9 seconds on *"Finalizing updates..."*, then automatically plays all three local video clips from `spongebob/` in exact sequence:
  1. `12 Seconds Later` (`vlipsy-spongebob-squarepants-twelve-seconds-later-8fZQBuhW.mp4`)
  2. `10 Hours Later` (`vlipsy-spongebob-squarepants-ten-hours-later-9fwEnlag.mp4`)
  3. `1 Eternity Later` (`vlipsy-spongebobsquarepantsoneeternitylater-gyck95iN.mp4`)
- **Phase 3 (100% Complete):** Reaches 100% with a green checkmark: *"UPDATE SUCCESSFUL!"*.
- **Phase 4 (Meme Reveal):** Shows *"HAHAHA! YOU GOT TROLLED! 😂"* with random local memes (Gandhi memes, Bollywood/Indian reaction memes, UPSC student memes) with **SHOW ANOTHER MEME** and **HAHA, OK!** buttons.
- **Early Exit:** Pressing `Escape` at any point cleanly cancels the troll and restores the desktop.

---

## Documents and Assets

### Bundled Documents (`documents/`)
- `Personal context.html` — Exported Google Gemini conversation.
- `Pragya Dewangan Personal Kundali.pdf` — Personal Kundali document.
- `hacktoberfest-2026-fest-certificate-2026-01a08bf1-a33b-4c73-d19c-de07387e9498.pdf` — Hacktoberfest certificate.
- Vintage Photographs (`documents/*.jpeg`) — Historical photos including 1998 FIFA World Cup, 3.5" floppy disks, Samsung CRT monitor, McDonald's 1998 site, and early Netflix DVD rental flyers.

### Video Media (`spongebob/`)
- `vlipsy-spongebob-squarepants-twelve-seconds-later-8fZQBuhW.mp4`
- `vlipsy-spongebob-squarepants-ten-hours-later-9fwEnlag.mp4`
- `vlipsy-spongebobsquarepantsoneeternitylater-gyck95iN.mp4`

### Graphic & Audio Assets
- `public/skull.jpg` / `skull_upper.png` / `skull_jaw.png` — Screaming skull illustration separated into stationary cranium and independent animated jaw.
- `public/audio/chick-song.wav` — Audio for Easter Egg 01.
- `public/audio/fake-virus.wav` — Dissonant siren audio for Easter Egg 02.

---

## Technology Stack

- **Language:** TypeScript (ES2020)
- **Framework:** React 19
- **Bundler & Dev Server:** Vite 7
- **Styling:** Custom authentic Windows 98 CSS (`src/styles/win98.css`) with beveled 3D borders, pixel font rendering, and system color palette
- **Audio Engine:** Web Audio API with oscillators, white noise buffers, and HTML5 audio fallbacks
- **Testing:** Custom Node.js automated verification suite (`test/verify-project.js`)

---

## Project Structure

```
window_98/
├── documents/                       # Original bundled documents & images
│   ├── Personal context.html
│   ├── Pragya Dewangan Personal Kundali.pdf
│   ├── hacktoberfest-2026-fest-certificate-2026...pdf
│   └── WhatsApp Image 2026-11-01 at 15.20.*.jpeg
├── public/                          # Static public assets served by Vite
│   ├── audio/                       # Sound effects (chick-song, fake-virus)
│   ├── documents/                   # Bundled documents available at runtime
│   ├── spongebob/                   # 3 SpongeBob time-passage video clips
│   ├── skull.jpg                    # Full screaming skull illustration
│   ├── skull_upper.png              # Stationary cranium layer
│   └── skull_jaw.png                # Independent jaw layer
├── spongebob/                       # Original video clips
├── src/
│   ├── components/
│   │   ├── apps/                    # Core applications
│   │   │   ├── games/               # Minesweeper, Solitaire, Snake
│   │   │   ├── Calculator.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── DocumentViewer.tsx
│   │   │   ├── FileExplorer.tsx
│   │   │   ├── ImageViewer.tsx
│   │   │   ├── InternetExplorer.tsx
│   │   │   ├── MyComputer.tsx
│   │   │   ├── Notepad.tsx
│   │   │   └── Paint.tsx
│   │   ├── common/                  # WinIcon vector graphics
│   │   ├── desktop/                 # Desktop surface & icons
│   │   ├── dialogs/                 # Shutdown, Run, Help dialogs
│   │   ├── easter-eggs/             # Chick, Skull, Update troll components
│   │   ├── taskbar/                 # Taskbar & Start Menu
│   │   └── window/                  # WindowFrame & WindowRenderer
│   ├── context/                     # FileSystem, WindowManager, EasterEgg contexts
│   ├── styles/                      # win98.css design system
│   ├── types/                       # TypeScript interfaces
│   ├── utils/                       # Web Audio synthesizer manager
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # React DOM entry
│   └── vite-env.d.ts                # Vite client declarations
├── test/
│   └── verify-project.js            # 62-point automated verification suite
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended; developed and tested on Node.js v24)
- npm (v9 or higher)

### Setup Steps
```bash
# Clone or navigate to the project directory
cd window_98

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:3000` to interact with the Windows 98 desktop.

---

## Production Build

To compile TypeScript and bundle the static web application for production:

```bash
npm run build
```

The output will be generated in the `dist/` directory, ready to be deployed to any static web host.

To preview the production build locally:

```bash
npm run preview
```

---

## Running as a Desktop Application

The application is structured as a single-page web application. It can be wrapped into an Electron desktop executable using `@electron/packager` or `electron-forge` if native desktop packaging is required:

```bash
# Optional: if wrapping with Electron
npx electron .
```

*Note: The core application runs directly in any modern desktop or mobile browser without requiring Electron.*

---

## Deployment

The static output in `dist/` can be deployed directly to:
- **Vercel:** Run `vercel deploy` or connect your GitHub repository with root directory `./` and build command `npm run build`.
- **Netlify:** Set publish directory to `dist` and build command to `npm run build`.
- **GitHub Pages:** Deploy the contents of `dist` using the `gh-pages` branch or GitHub Actions static workflow.

---

## Testing & Verification

Run the automated test suite:

```bash
npm test
```

### Verification Coverage (62/62 Tests Passing)
- **Asset Integrity:** Verifies presence and valid byte sizes of all 3 SpongeBob MP4 clips, bundled HTML/PDF documents, audio WAV files, and split skull illustration layers.
- **Component Contracts:** Validates existence and typing of all 32 core components and contexts.
- **Easter Egg 01:** Confirms 3-click trigger, 5-click hatching sequence, "Peep-peep!" dialog, audio playback, and auto-cleanup.
- **Easter Egg 02:** Verifies trigger exclusivity to `zxc.com` download, 2s black screen, independent skull jaw animation, and safe reveal message.
- **Easter Egg 03:** Verifies `Ctrl + Shift + Alt + U` shortcut, input element exclusion, 0%–99% progress steps, 99% freeze, 3-clip SpongeBob sequence order, and local meme rotation.
- **Production Build:** Passes `tsc` typechecking and `vite build` without warnings or errors.

---

## Safety & Security Notice

> **Important Safety Notice:**
> All pranks, update screens, and computer warnings in this application are completely simulated inside the web browser canvas.
> - The application **never** accesses or modifies real files on your physical machine.
> - The update screen **never** restarts or alters your host operating system.
> - The screaming skull prank is a visual animation that does not run malware or execute binaries.
> - Simulated downloads are safely sandboxed text records stored exclusively in browser memory and `localStorage`.

---

## Known Limitations

1. **Audio Autoplay Policies:** Modern browsers may block audio until the user has performed at least one click or keypress on the page. The application handles this gracefully with visible continue buttons.
2. **Large PDF Files:** Very large PDF documents (e.g. 50MB+) may take a moment to stream depending on local browser memory. A "Save Copy" button is provided for direct download.
3. **Screen Size:** While optimized for standard desktop resolutions (1024x768 and up), windows are automatically constrained to fit within viewport boundaries on smaller displays.

---

## Credits and Licensing

- **Microsoft Windows 98:** Windows 98, icons, and trademarks are property of Microsoft Corporation. This project is a nostalgic educational recreation.
- **SpongeBob SquarePants:** Time-card clips (`12 Seconds Later`, `10 Hours Later`, `1 Eternity Later`) are copyright Nickelodeon / Paramount Global, utilized here for humorous parody and transformative tribute.
- **Illustration:** Screaming skull illustration courtesy of user-supplied assets.
- **License:** Distributed under the MIT License.
# window98_Ghandhi_desktop
