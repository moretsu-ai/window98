import React, { useState } from 'react';

interface RowData {
  id: number;
  item: string;
  qty: number;
  unitCost: number;
  category: string;
}

const initialRows: RowData[] = [
  { id: 1, item: 'Bamboo Walking Sticks (Reinforced)', qty: 78, unitCost: 0.20, category: 'Equipment' },
  { id: 2, item: 'Khadi Sandals (Extra padding)', qty: 80, unitCost: 0.30, category: 'Apparel' },
  { id: 3, item: 'Roasted Chickpeas & Jaggery (Rations)', qty: 45, unitCost: 0.15, category: 'Food' },
  { id: 4, item: 'Earthen Water Pots (Natural Cooler)', qty: 30, unitCost: 0.10, category: 'Hydration' },
  { id: 5, item: 'Telegrams to Lord Irwin ("Still Walking")', qty: 4, unitCost: 1.25, category: 'Diplomacy' },
  { id: 6, item: 'Emergency Cotton Bandages for Blisters', qty: 50, unitCost: 0.05, category: 'Medical' },
  { id: 7, item: 'Brass Cooking Pan for Boiling Seawater', qty: 12, unitCost: 1.50, category: 'Manufacturing' },
];

export const RetroSpreadsheet: React.FC = () => {
  const [rows] = useState<RowData[]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: string }>({ r: 1, c: 'B' });

  const totalExpense = rows.reduce((acc, r) => acc + r.qty * r.unitCost, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontSize: 11 }}>
      {/* Disclaimer */}
      <div style={{ backgroundColor: '#fffbe6', padding: '3px 8px', borderBottom: '1px solid #808080', color: '#993300' }}>
        <strong>[FICTIONAL PARODY ARCHIVE]</strong> Microsoft Excel 97 — 04_TRAVEL_EXPENSES.xls (Preserved 1998)
      </div>

      {/* Menu bar */}
      <div className="win98-menubar" style={{ borderBottom: 'none' }}>
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Insert</span>
        <span className="win98-menu-item">Format</span>
        <span className="win98-menu-item">Tools</span>
        <span className="win98-menu-item">Data</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="win98-toolbar" style={{ gap: 4, padding: '2px 4px' }}>
        <button className="win98-btn" style={{ fontWeight: 'bold' }}>B</button>
        <button className="win98-btn" style={{ fontStyle: 'italic' }}>I</button>
        <button className="win98-btn" style={{ textDecoration: 'underline' }}>U</button>
        <div style={{ width: 2, height: 16, borderLeft: '1px solid #808080' }} />
        <span style={{ fontSize: 11, padding: '2px 4px' }}>Font: MS Sans Serif 9pt</span>
        <div style={{ width: 2, height: 16, borderLeft: '1px solid #808080' }} />
        <button className="win98-btn">Σ AutoSum</button>
      </div>

      {/* Formula bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 6px', backgroundColor: '#e0e0e0', borderTop: '1px solid #ffffff', borderBottom: '1px solid #808080' }}>
        <span style={{ fontWeight: 'bold', width: 35 }}>{selectedCell.c}{selectedCell.r}</span>
        <span style={{ color: '#666' }}>fx:</span>
        <input
          type="text"
          readOnly
          value={
            selectedCell.r === 9
              ? `=SUM(D2:D8)`
              : rows[selectedCell.r - 2]
              ? selectedCell.c === 'D'
                ? `=(B${selectedCell.r}*C${selectedCell.r})`
                : rows[selectedCell.r - 2].item
              : 'DANDI SALT EXPEDITION LEDGER'
          }
          style={{ flex: 1, height: 18, backgroundColor: '#ffffff', fontSize: 11 }}
        />
      </div>

      {/* Spreadsheet Grid */}
      <div className="inset-border" style={{ flex: 1, backgroundColor: '#ffffff', margin: 2, overflow: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#d4d0c8', textAlign: 'center' }}>
              <th style={{ width: 30, border: '1px solid #808080' }}></th>
              <th style={{ width: 240, border: '1px solid #808080', padding: 3 }}>A (Item Description)</th>
              <th style={{ width: 60, border: '1px solid #808080', padding: 3 }}>B (Qty)</th>
              <th style={{ width: 80, border: '1px solid #808080', padding: 3 }}>C (Unit ₹)</th>
              <th style={{ width: 90, border: '1px solid #808080', padding: 3 }}>D (Total ₹)</th>
              <th style={{ width: 110, border: '1px solid #808080', padding: 3 }}>E (Category)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const rNum = idx + 2;
              const subtotal = row.qty * row.unitCost;
              return (
                <tr key={row.id}>
                  <td style={{ backgroundColor: '#d4d0c8', textAlign: 'center', border: '1px solid #808080', fontWeight: 'bold' }}>
                    {rNum}
                  </td>
                  <td
                    onClick={() => setSelectedCell({ r: rNum, c: 'A' })}
                    style={{
                      border: '1px solid #dfdfdf',
                      padding: '2px 6px',
                      backgroundColor: selectedCell.r === rNum && selectedCell.c === 'A' ? '#000080' : 'transparent',
                      color: selectedCell.r === rNum && selectedCell.c === 'A' ? '#ffffff' : '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    {row.item}
                  </td>
                  <td
                    onClick={() => setSelectedCell({ r: rNum, c: 'B' })}
                    style={{
                      border: '1px solid #dfdfdf',
                      padding: '2px 6px',
                      textAlign: 'right',
                      backgroundColor: selectedCell.r === rNum && selectedCell.c === 'B' ? '#000080' : 'transparent',
                      color: selectedCell.r === rNum && selectedCell.c === 'B' ? '#ffffff' : '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    {row.qty}
                  </td>
                  <td
                    onClick={() => setSelectedCell({ r: rNum, c: 'C' })}
                    style={{
                      border: '1px solid #dfdfdf',
                      padding: '2px 6px',
                      textAlign: 'right',
                      backgroundColor: selectedCell.r === rNum && selectedCell.c === 'C' ? '#000080' : 'transparent',
                      color: selectedCell.r === rNum && selectedCell.c === 'C' ? '#ffffff' : '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    ₹{row.unitCost.toFixed(2)}
                  </td>
                  <td
                    onClick={() => setSelectedCell({ r: rNum, c: 'D' })}
                    style={{
                      border: '1px solid #dfdfdf',
                      padding: '2px 6px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      backgroundColor: selectedCell.r === rNum && selectedCell.c === 'D' ? '#000080' : 'transparent',
                      color: selectedCell.r === rNum && selectedCell.c === 'D' ? '#ffffff' : '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    ₹{subtotal.toFixed(2)}
                  </td>
                  <td
                    onClick={() => setSelectedCell({ r: rNum, c: 'E' })}
                    style={{
                      border: '1px solid #dfdfdf',
                      padding: '2px 6px',
                      color: '#666666',
                      backgroundColor: selectedCell.r === rNum && selectedCell.c === 'E' ? '#000080' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {row.category}
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <td style={{ backgroundColor: '#d4d0c8', textAlign: 'center', border: '1px solid #808080' }}>9</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', color: '#000080' }}>TOTAL EXPEDITION COST</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', textAlign: 'right' }}>299</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', textAlign: 'right' }}>-</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', textAlign: 'right', color: '#800000' }}>₹{totalExpense.toFixed(2)}</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px' }}>Funded by Public</td>
            </tr>

            {/* Net Liberation Row */}
            <tr style={{ backgroundColor: '#e8ffe8', fontWeight: 'bold' }}>
              <td style={{ backgroundColor: '#d4d0c8', textAlign: 'center', border: '1px solid #808080' }}>10</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', color: '#006600' }}>BRITISH SALT TAX BROKEN</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', textAlign: 'right' }}>∞</td >
              <td style={{ border: '1px solid #808080', padding: '3px 6px', textAlign: 'right' }}>Free</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', textAlign: 'right', color: '#006600' }}>PRICELESS</td>
              <td style={{ border: '1px solid #808080', padding: '3px 6px', color: '#006600' }}>National Dignity</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sheet tab */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '2px 8px', backgroundColor: '#d4d0c8', borderTop: '1px solid #808080' }}>
        <div style={{ padding: '2px 8px', backgroundColor: '#ffffff', border: '1px solid #808080', borderBottom: 'none', fontWeight: 'bold' }}>
          Dandi_Budget_1930
        </div>
        <div style={{ padding: '2px 8px', color: '#666' }}>Sheet2</div>
        <div style={{ padding: '2px 8px', color: '#666' }}>Sheet3</div>
        <span style={{ marginLeft: 'auto', color: '#333' }}>Ready | Sum=₹{totalExpense.toFixed(2)}</span>
      </div>
    </div>
  );
};

