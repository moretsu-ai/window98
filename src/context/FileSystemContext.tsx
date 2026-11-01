import React, { createContext, useContext, useState, useEffect } from 'react';
import { VFSItem } from '../types/filesystem';

interface FileSystemContextType {
  items: Record<string, VFSItem>;
  getFolderItems: (folderPath: string) => VFSItem[];
  getItem: (path: string) => VFSItem | undefined;
  readFile: (path: string) => string | undefined;
  writeFile: (path: string, content: string, mimeType?: string) => void;
  deleteItem: (path: string) => void;
  renameItem: (oldPath: string, newName: string) => void;
  createFolder: (parentPath: string, folderName: string) => void;
  searchItems: (query: string) => VFSItem[];
  restoreDefaultVFS: () => void;
}

const STORAGE_KEY = 'win98_vfs_abandoned_computer_v2';

const defaultVFS: Record<string, VFSItem> = {
  // Drives & Root Folders
  'C:': {
    id: 'c-drive',
    name: 'Drive (C:)',
    path: 'C:',
    type: 'folder',
    size: 2147483648,
    modifiedDate: '06/25/1998 12:00 PM',
    isSystem: true,
  },
  'C:\\My Documents': {
    id: 'my-documents',
    name: 'My Documents',
    path: 'C:\\My Documents',
    type: 'folder',
    size: 56000000,
    modifiedDate: '10/24/1998 03:22 PM',
  },
  'C:\\My Documents\\My Pictures': {
    id: 'my-pictures',
    name: 'My Pictures',
    path: 'C:\\My Documents\\My Pictures',
    type: 'folder',
    size: 1400000,
    modifiedDate: '10/24/1998 04:12 PM',
  },
  'C:\\Program Files': {
    id: 'program-files',
    name: 'Program Files',
    path: 'C:\\Program Files',
    type: 'folder',
    size: 154000000,
    modifiedDate: '06/25/1998 12:00 PM',
    isSystem: true,
  },
  'C:\\Windows': {
    id: 'windows',
    name: 'Windows',
    path: 'C:\\Windows',
    type: 'folder',
    size: 320000000,
    modifiedDate: '06/25/1998 12:00 PM',
    isSystem: true,
  },
  'C:\\Windows\\System32': {
    id: 'system32',
    name: 'System32',
    path: 'C:\\Windows\\System32',
    type: 'folder',
    size: 110000000,
    modifiedDate: '06/25/1998 12:00 PM',
    isSystem: true,
  },
  'C:\\Recycle Bin': {
    id: 'recycle-bin',
    name: 'Recycle Bin',
    path: 'C:\\Recycle Bin',
    type: 'folder',
    size: 4096,
    modifiedDate: '10/28/1998 09:15 AM',
  },

  // Classified Dandi Archive Folders
  'C:\\My Documents\\Classified': {
    id: 'folder-classified',
    name: 'Classified',
    path: 'C:\\My Documents\\Classified',
    type: 'folder',
    size: 24000000,
    modifiedDate: '10/02/1998 06:30 AM',
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED': {
    id: 'folder-project-dandi',
    name: 'PROJECT_DANDI_CLASSIFIED',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED',
    type: 'folder',
    size: 19300000,
    modifiedDate: '10/02/1998 06:30 AM',
  },

  // Project Dandi Classified Files
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\01_MISSION_BRIEFING.txt': {
    id: 'dandi-01',
    name: '01_MISSION_BRIEFING.txt',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\01_MISSION_BRIEFING.txt',
    type: 'file',
    size: 1420,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'text/plain',
    content: `================================================================================
                    TOP SECRET // RESTRICTED ACCESS // 1930
             HISTORICAL RECONSTRUCTION ARCHIVE — PRESERVED 1998
================================================================================
[FICTIONAL PARODY NOTICE: This text is a work of creative parody for the
 Windows 98 abandoned computer recreation. It is NOT an authentic archive.]

CODE NAME:         OPERATION WHITE HARVEST (PROJECT DANDI)
DATE INITIATED:    12 MARCH 1930 (06:30 HRS IST)
PRIMARY AGENT:     M. K. GANDHI (CODENAME: BAPU)
SECONDARY AGENTS:  S. VALLABHBHAI PATEL, S. NAIDU, J. NEHRU
TOTAL COMPANIONS:  78 DEDICATED SATYAGRAHIS

MISSION OBJECTIVE:
March 240 miles (385 km) from Sabarmati Ashram to the coastal village of Dandi.
Collect natural salt from the shores of the Arabian Sea without paying the
oppressive British colonial salt tax of 8.2 annas per maund.

TACTICAL PROTOCOLS:
1. STRICT AHIMSA: No weapons, no aggression, zero retaliation under any provocation.
2. DISCIPLINE: 10 to 15 miles per day. Early morning departures. Simple khadi attire.
3. WEAPONRY: Truth (Satya), Soul-force (Satyagraha), and a pinch of sodium chloride.
4. TARGET OUTCOME: Shake the foundations of the British Raj by making salt universally
   free for every human being.

================================================================================
STATUS: MISSION SUCCESSFUL (APRIL 6, 1930) // PRESERVED IN VIRTUAL DISK 1998
================================================================================`,
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\02_SECRET_MEETING_MINUTES.txt': {
    id: 'dandi-02',
    name: '02_SECRET_MEETING_MINUTES.txt',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\02_SECRET_MEETING_MINUTES.txt',
    type: 'file',
    size: 1280,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'text/plain',
    content: `================================================================================
                SABARMATI ASHRAM EMERGENCY STRATEGY MINUTES
                    DATE: MARCH 10, 1930 // TOP SECRET
================================================================================
[FICTIONAL PARODY ARCHIVE // NOT AUTHENTIC HISTORICAL DOCUMENTATION]

PRESENT: Bapu (Chair), Sardar Patel, Sarojini Naidu, Jawaharlal Nehru, 12 Ashramites

AGENDA ITEM 1: Choosing the Point of Resistance
- Nehru suggested protesting British railway tariffs.
- Patel suggested agricultural land revenue strikes.
- Bapu overruled both: "Salt is eaten by the prince and the peasant alike.
  Taxing seawater is like taxing the morning breeze. We march to the sea."

AGENDA ITEM 2: Logistics and Transport
- Patel: "Can we not take a train for the first 100 miles?"
- Bapu: "The British run the trains. If we walk, every village between here
  and the sea will awaken. And walking burns calories."
- Sarojini Naidu: "I will pack poetry books, fresh lemons, and first-aid kits."

AGENDA ITEM 3: Anticipating British Response
- Intelligence reports indicate Viceroy Lord Irwin believes the salt march is
  "a laughing matter" and will collapse after 3 days of sore feet.
- Bapu: "First they ignore you, then they laugh at you, then they fight you,
  then you win."
- Meeting adjourned at 21:00 with prayer.`,
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\03_DANDI_GROUP_CHAT.txt': {
    id: 'dandi-03',
    name: '03_DANDI_GROUP_CHAT.txt',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\03_DANDI_GROUP_CHAT.txt',
    type: 'file',
    size: 1850,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'text/plain',
    content: `================================================================================
               #dandi-march-1930 CHAT LOGS [MIRC TRANSCRIPT]
================================================================================
[FICTIONAL PARODY ARCHIVE]
Double-click this file in Windows Explorer to open the interactive chat interface!

[12-Mar-1930 06:30] * Bapu has entered #dandi-march-1930
[12-Mar-1930 06:31] <Bapu> Step count initialized: 0 / 500,000 steps.
[12-Mar-1930 06:32] <Sardar_Patel> Walking stick calibrated. Shoes tied.
[12-Mar-1930 06:33] <Sarojini_Naidu> Weather forecast: sunny with a chance of revolution.
[12-Mar-1930 06:34] <Lord_Irwin_Lurking> ...You cannot simply walk to the sea and pick up salt.
[12-Mar-1930 06:35] <Bapu> Watch us, Your Excellency.
[12-Mar-1930 06:36] <Sardar_Patel> Free salt for everyone!`,
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\04_TRAVEL_EXPENSES.xls': {
    id: 'dandi-04',
    name: '04_TRAVEL_EXPENSES.xls',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\04_TRAVEL_EXPENSES.xls',
    type: 'file',
    size: 4096,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'application/vnd.ms-excel',
    content: `MICROSOFT EXCEL 97 SPREADSHEET (04_TRAVEL_EXPENSES.xls)
Double click in Explorer to open interactive spreadsheet viewer.
Total expedition cost: ₹32.70
Net Economic Liberation: Priceless`,
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\05_PERSONAL_DIARY.txt': {
    id: 'dandi-05',
    name: '05_PERSONAL_DIARY.txt',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\05_PERSONAL_DIARY.txt',
    type: 'file',
    size: 1540,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'text/plain',
    content: `================================================================================
             EXTRACTS FROM MARCH VOLUNTEER #42 DIARY (1930)
================================================================================
[FICTIONAL PARODY ARCHIVE // HUMOROUS CREATIVE WRITING]

DAY 1: Sabarmati Ashram
The dust has settled. We set off. Bapu is 61 years old, but walks like he has
turbo-charged roller skates hidden in his khadi dhoti. The young volunteers are
sweating trying to keep pace.

DAY 7: Navsari District
Blisters have formed alliances on both my heels. Sardar Patel gave us roasted
chickpeas and told us to stop whining. A local villager gave us sweet milk.
Morale is at 200%.

DAY 18: Approaching the Coast
The breeze smells salty. We can hear the Arabian Sea in the distance. The police
are watching us through binoculars, utterly perplexed as to why 50,000 people
have walked 200 miles with zero weapons.

DAY 24: April 6, 1930 — Dandi Beach
At 6:30 AM, after morning prayers, Bapu walked into the sea waves, bent down,
and scooped up a lump of muddy salt.
"With this, I am shaking the foundations of the British Empire."
We all wept. Then we had breakfast. Best breakfast in human history.`,
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\06_OPERATION_SALT.exe': {
    id: 'dandi-06',
    name: '06_OPERATION_SALT.exe',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\06_OPERATION_SALT.exe',
    type: 'file',
    size: 32768,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'application/x-msdownload',
    content: `SIMULATED EXECUTABLE: OPERATION_SALT.EXE
Double-click to launch the harmless simulated mission-success screen.`,
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\07_UNSEEN_FOOTAGE': {
    id: 'dandi-07',
    name: '07_UNSEEN_FOOTAGE',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\07_UNSEEN_FOOTAGE',
    type: 'folder',
    size: 8500000,
    modifiedDate: '10/02/1998 06:30 AM',
  },
  'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\08_WITNESS_STATEMENTS.txt': {
    id: 'dandi-08',
    name: '08_WITNESS_STATEMENTS.txt',
    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED\\08_WITNESS_STATEMENTS.txt',
    type: 'file',
    size: 1390,
    modifiedDate: '10/02/1998 06:30 AM',
    mimeType: 'text/plain',
    content: `================================================================================
           COLONIAL POLICE ARCHIVE: DECLASSIFIED STATEMENTS (1930)
================================================================================
[FICTIONAL PARODY ARCHIVE // CREATIVE COMEDY]

WITNESS 1: District Magistrate, Surat
"We prepared 400 armed constables expecting riots, barricades, or stone throwing.
Instead, they walked past singing bhajans and offering us fresh water. My deputy
started feeling guilty and asked if he could also have some salt. What are we
supposed to do with this?"

WITNESS 2: Village Elder, Aslali
"When Mahatma ji entered our village, the whole population came out. He told us
to boycott foreign cloth and spin our own cotton. My grandmother immediately threw
away her British kettle. British merchants are panicking."

WITNESS 3: Telegram Operator, Bombay
"All telegraph lines to London are jammed with messages saying 'GANDHI PICKED UP SALT'.
The Prime Minister in London sent a reply: 'What kind of salt? Did he pay the duty?'
I telegraphed back: 'No sir, it came from the ocean.'"`,
  },

  // Bundled Documents from documents/
  'C:\\My Documents\\Personal context.html': {
    id: 'doc-personal-context',
    name: 'Personal context.html',
    path: 'C:\\My Documents\\Personal context.html',
    type: 'file',
    size: 772756,
    modifiedDate: '10/12/2026 10:01 AM',
    url: '/documents/Personal context.html',
    mimeType: 'text/html',
  },
  'C:\\My Documents\\Pragya Dewangan Personal Kundali.pdf': {
    id: 'doc-kundali',
    name: 'Pragya Dewangan Personal Kundali.pdf',
    path: 'C:\\My Documents\\Pragya Dewangan Personal Kundali.pdf',
    type: 'file',
    size: 55131506,
    modifiedDate: '06/06/2026 10:59 AM',
    url: '/documents/Pragya Dewangan Personal Kundali.pdf',
    mimeType: 'application/pdf',
  },
  'C:\\My Documents\\hacktoberfest-2026-fest-certificate-2026-01a08bf1-a33b-4c73-d19c-de07387e9498.pdf': {
    id: 'doc-hacktoberfest',
    name: 'Hacktoberfest 2026 Certificate.pdf',
    path: 'C:\\My Documents\\hacktoberfest-2026-fest-certificate-2026-01a08bf1-a33b-4c73-d19c-de07387e9498.pdf',
    type: 'file',
    size: 64273,
    modifiedDate: '10/12/2026 10:36 AM',
    url: '/documents/hacktoberfest-2026-fest-certificate-2026-01a08bf1-a33b-4c73-d19c-de07387e9498.pdf',
    mimeType: 'application/pdf',
  },

  // Bundled Nostalgic Images in My Pictures
  'C:\\My Documents\\My Pictures\\Windows 98 Clouds.jpg': {
    id: 'pic-clouds',
    name: 'Windows 98 Clouds.jpg',
    path: 'C:\\My Documents\\My Pictures\\Windows 98 Clouds.jpg',
    type: 'file',
    size: 106383,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.32.jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Vintage Floppy Disk.jpg': {
    id: 'pic-floppy',
    name: 'Vintage Floppy Disk.jpg',
    path: 'C:\\My Documents\\My Pictures\\Vintage Floppy Disk.jpg',
    type: 'file',
    size: 258876,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.33.jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Samsung CRT Monitor.jpg': {
    id: 'pic-crt',
    name: 'Samsung CRT Monitor.jpg',
    path: 'C:\\My Documents\\My Pictures\\Samsung CRT Monitor.jpg',
    type: 'file',
    size: 67015,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.33 (1).jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Family Portrait 1998.jpg': {
    id: 'pic-family',
    name: 'Family Portrait 1998.jpg',
    path: 'C:\\My Documents\\My Pictures\\Family Portrait 1998.jpg',
    type: 'file',
    size: 78565,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.34.jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Nokia Red Phone.jpg': {
    id: 'pic-nokia-red',
    name: 'Nokia Red Phone.jpg',
    path: 'C:\\My Documents\\My Pictures\\Nokia Red Phone.jpg',
    type: 'file',
    size: 78990,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.34 (1).jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\PM Atal Bihari Vajpayee 1998.jpg': {
    id: 'pic-pm',
    name: 'PM Atal Bihari Vajpayee 1998.jpg',
    path: 'C:\\My Documents\\My Pictures\\PM Atal Bihari Vajpayee 1998.jpg',
    type: 'file',
    size: 151375,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.35 (1).jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\1998 FIFA World Cup.jpg': {
    id: 'pic-fifa',
    name: '1998 FIFA World Cup.jpg',
    path: 'C:\\My Documents\\My Pictures\\1998 FIFA World Cup.jpg',
    type: 'file',
    size: 87517,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.36.jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\McDonalds 1998 Website.jpg': {
    id: 'pic-mcdonalds',
    name: 'McDonalds 1998 Website.jpg',
    path: 'C:\\My Documents\\My Pictures\\McDonalds 1998 Website.jpg',
    type: 'file',
    size: 97627,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.59.jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Netflix 1998 Free DVD Trial.jpg': {
    id: 'pic-netflix',
    name: 'Netflix 1998 Free DVD Trial.jpg',
    path: 'C:\\My Documents\\My Pictures\\Netflix 1998 Free DVD Trial.jpg',
    type: 'file',
    size: 115854,
    modifiedDate: '11/01/1998 03:20 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.59 (1).jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Nokia 3310 Classic.jpg': {
    id: 'pic-nokia-3310',
    name: 'Nokia 3310 Classic.jpg',
    path: 'C:\\My Documents\\My Pictures\\Nokia 3310 Classic.jpg',
    type: 'file',
    size: 48790,
    modifiedDate: '11/01/1998 03:21 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.21.00.jpeg',
    mimeType: 'image/jpeg',
  },
  'C:\\My Documents\\My Pictures\\Floppy and CD Drives.jpg': {
    id: 'pic-drives',
    name: 'Floppy and CD Drives.jpg',
    path: 'C:\\My Documents\\My Pictures\\Floppy and CD Drives.jpg',
    type: 'file',
    size: 52093,
    modifiedDate: '11/01/1998 03:21 PM',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.21.00 (1).jpeg',
    mimeType: 'image/jpeg',
  },

  // Backstory & Lore Documents
  'C:\\My Documents\\secret_diary.txt': {
    id: 'doc-diary',
    name: 'secret_diary.txt',
    path: 'C:\\My Documents\\secret_diary.txt',
    type: 'file',
    size: 1048,
    modifiedDate: '10/18/1999 11:42 PM',
    mimeType: 'text/plain',
    content: `October 18, 1999 - Late Night

If you are reading this, you found the computer I abandoned in the attic.
The dial-up modem was screaming at 56kbps for 3 hours today while I downloaded an MP3.
I found a weird site called zxc.com claiming it doubles your RAM and makes the 28.8k modem fly at light speed.
Something felt off about that download... every time it finished, the monitor flickered and I heard laughter.

Don't tell anyone about the secret update shortcut: Ctrl+Shift+Alt+U.
And definitely don't click the Settings icon three times... strange things hatch in this machine.

- P.D.`,
  },
  'C:\\My Documents\\TODO.txt': {
    id: 'doc-todo',
    name: 'TODO.txt',
    path: 'C:\\My Documents\\TODO.txt',
    type: 'file',
    size: 412,
    modifiedDate: '11/01/1998 02:15 PM',
    mimeType: 'text/plain',
    content: `WINDOWS 98 PC TO-DO LIST:
[x] Install Internet Explorer 4.0
[x] Beat Minesweeper Beginner in under 20 seconds
[x] Order DVD from that new Netflix website ($20/mo)
[ ] Defrag hard drive C:
[ ] Backup family photos to 3.5" floppy disks
[ ] Figure out why the computer keeps saying "Peep-peep"`,
  },
  'C:\\Windows\\System32\\classified_notes.txt': {
    id: 'doc-classified',
    name: 'classified_notes.txt',
    path: 'C:\\Windows\\System32\\classified_notes.txt',
    type: 'file',
    size: 618,
    modifiedDate: '09/04/1998 04:30 PM',
    mimeType: 'text/plain',
    isSystem: true,
    content: `SYSTEM WARNING LOG:
Incident #98-ALPHA:
Unauthorized connection detected to domain: zxc.com
Payload identifier: ULTRA_SPEED_ACCELERATOR_PRO_98.EXE
Warning: Do not execute untrusted binaries downloaded from Internet Explorer.
Suspicious jaw tremors and laughing skull anomalies reported across department machines.`,
  },
  'C:\\Recycle Bin\\old_homework.txt': {
    id: 'doc-recycle',
    name: 'old_homework.txt',
    path: 'C:\\Recycle Bin\\old_homework.txt',
    type: 'file',
    size: 340,
    modifiedDate: '04/12/1998 08:30 PM',
    mimeType: 'text/plain',
    content: `ESSAY DRAFT 1:
Title: Will the Internet Replace Libraries by the Year 2026?
By: Student

In conclusion, although computers with Windows 98 and Netscape Navigator are impressive, it is highly doubtful that people will ever read books or communicate entirely through illuminated glass screens.`,
  },
};

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<string, VFSItem>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultVFS, ...parsed };
      }
    } catch (e) {}
    return defaultVFS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const getFolderItems = (folderPath: string): VFSItem[] => {
    const cleanFolder = folderPath.replace(/\\$/, '');
    return Object.values(items).filter((item) => {
      if (item.path === cleanFolder) return false;
      const lastSlashIndex = item.path.lastIndexOf('\\');
      if (lastSlashIndex === -1) {
        return cleanFolder === 'C:';
      }
      const parent = item.path.substring(0, lastSlashIndex);
      return parent.toLowerCase() === cleanFolder.toLowerCase();
    });
  };

  const getItem = (path: string): VFSItem | undefined => {
    return items[path];
  };

  const readFile = (path: string): string | undefined => {
    return items[path]?.content;
  };

  const writeFile = (path: string, content: string, mimeType = 'text/plain') => {
    const name = path.split('\\').pop() || 'Untitled';
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) => ({
      ...prev,
      [path]: {
        id: 'file-' + Date.now(),
        name,
        path,
        type: 'file',
        size: content.length,
        modifiedDate: dateStr,
        content,
        mimeType,
      },
    }));
  };

  const deleteItem = (path: string) => {
    setItems((prev) => {
      const next = { ...prev };
      // Delete item and any children if it's a folder
      Object.keys(next).forEach((key) => {
        if (key === path || key.startsWith(path + '\\')) {
          delete next[key];
        }
      });
      return next;
    });
  };

  const renameItem = (oldPath: string, newName: string) => {
    setItems((prev) => {
      const item = prev[oldPath];
      if (!item) return prev;
      const parentPath = oldPath.substring(0, oldPath.lastIndexOf('\\'));
      const newPath = parentPath ? `${parentPath}\\${newName}` : newName;
      const next = { ...prev };
      delete next[oldPath];
      next[newPath] = {
        ...item,
        name: newName,
        path: newPath,
      };
      // If folder, update descendants
      if (item.type === 'folder') {
        Object.keys(prev).forEach((key) => {
          if (key.startsWith(oldPath + '\\')) {
            const rel = key.substring(oldPath.length);
            const descendant = prev[key];
            delete next[key];
            next[newPath + rel] = {
              ...descendant,
              path: newPath + rel,
            };
          }
        });
      }
      return next;
    });
  };

  const createFolder = (parentPath: string, folderName: string) => {
    const cleanParent = parentPath.replace(/\\$/, '');
    const newPath = `${cleanParent}\\${folderName}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) => ({
      ...prev,
      [newPath]: {
        id: 'folder-' + Date.now(),
        name: folderName,
        path: newPath,
        type: 'folder',
        size: 0,
        modifiedDate: dateStr,
      },
    }));
  };

  const searchItems = (query: string): VFSItem[] => {
    const q = query.toLowerCase();
    return Object.values(items).filter(
      (item) => item.name.toLowerCase().includes(q) || (item.content && item.content.toLowerCase().includes(q))
    );
  };

  const restoreDefaultVFS = () => {
    setItems(defaultVFS);
  };

  return (
    <FileSystemContext.Provider
      value={{
        items,
        getFolderItems,
        getItem,
        readFile,
        writeFile,
        deleteItem,
        renameItem,
        createFolder,
        searchItems,
        restoreDefaultVFS,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error('useFileSystem must be used within FileSystemProvider');
  return context;
};
