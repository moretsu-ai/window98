import React, { useState, useEffect } from 'react';
import { soundManager } from '../../../utils/audio';

type Suit = '♠' | '♥' | '♦' | '♣';
type Card = {
  id: string;
  suit: Suit;
  rank: number; // 1 (Ace) to 13 (King)
  isFaceUp: boolean;
  color: 'red' | 'black';
};

const suits: Suit[] = ['♠', '♥', '♦', '♣'];

const getRankName = (rank: number): string => {
  if (rank === 1) return 'A';
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  return String(rank);
};

export const Solitaire: React.FC = () => {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableaus, setTableaus] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [selectedCard, setSelectedCard] = useState<{ card: Card; source: 'waste' | 'tableau'; colIndex?: number } | null>(null);
  const [hasWon, setHasWon] = useState(false);

  const initGame = () => {
    soundManager.playClick();
    // Build 52 card deck
    const deck: Card[] = [];
    suits.forEach((suit) => {
      const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({
          id: `${suit}-${rank}-${Date.now()}-${Math.random()}`,
          suit,
          rank,
          color,
          isFaceUp: false,
        });
      }
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal 7 tableaus
    const newTableaus: Card[][] = [[], [], [], [], [], [], []];
    let cardIdx = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck[cardIdx++];
        if (row === col) card.isFaceUp = true;
        newTableaus[col].push(card);
      }
    }

    const remainingStock = deck.slice(cardIdx);

    setStock(remainingStock);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setTableaus(newTableaus);
    setSelectedCard(null);
    setHasWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Stock draw
  const handleStockClick = () => {
    soundManager.playClick();
    if (stock.length > 0) {
      const drawn = { ...stock[stock.length - 1], isFaceUp: true };
      setStock((s) => s.slice(0, -1));
      setWaste((w) => [...w, drawn]);
    } else if (waste.length > 0) {
      // Recycle waste back into stock
      const recycled = waste.map((c) => ({ ...c, isFaceUp: false })).reverse();
      setStock(recycled);
      setWaste([]);
    }
  };

  // Move card to foundation
  const tryMoveToFoundation = (card: Card, source: 'waste' | 'tableau', colIndex?: number) => {
    for (let f = 0; f < 4; f++) {
      const top = foundations[f][foundations[f].length - 1];
      if (!top && card.rank === 1) {
        // Ace to empty foundation
        soundManager.playClick();
        setFoundations((prev) => {
          const next = [...prev];
          next[f] = [...next[f], card];
          return next;
        });
        removeCardFromSource(source, card, colIndex);
        checkWinCondition();
        return true;
      } else if (top && top.suit === card.suit && card.rank === top.rank + 1) {
        soundManager.playClick();
        setFoundations((prev) => {
          const next = [...prev];
          next[f] = [...next[f], card];
          return next;
        });
        removeCardFromSource(source, card, colIndex);
        checkWinCondition();
        return true;
      }
    }
    return false;
  };

  const removeCardFromSource = (source: 'waste' | 'tableau', card: Card, colIndex?: number) => {
    if (source === 'waste') {
      setWaste((w) => w.filter((c) => c.id !== card.id));
    } else if (source === 'tableau' && colIndex !== undefined) {
      setTableaus((t) => {
        const next = [...t];
        next[colIndex] = next[colIndex].filter((c) => c.id !== card.id);
        // Flip top card if face down
        if (next[colIndex].length > 0) {
          next[colIndex][next[colIndex].length - 1].isFaceUp = true;
        }
        return next;
      });
    }
    setSelectedCard(null);
  };

  // Move card to tableau column
  const tryMoveToTableau = (targetCol: number) => {
    if (!selectedCard) return;
    const { card, source, colIndex } = selectedCard;
    const targetCards = tableaus[targetCol];
    const top = targetCards[targetCards.length - 1];

    if (!top) {
      // Empty column accepts King only
      if (card.rank === 13) {
        soundManager.playClick();
        moveCardsToCol(card, source, colIndex, targetCol);
      }
    } else if (top.isFaceUp && top.color !== card.color && top.rank === card.rank + 1) {
      soundManager.playClick();
      moveCardsToCol(card, source, colIndex, targetCol);
    }
  };

  const moveCardsToCol = (
    card: Card,
    source: 'waste' | 'tableau',
    fromCol: number | undefined,
    toCol: number
  ) => {
    if (source === 'waste') {
      setWaste((w) => w.filter((c) => c.id !== card.id));
      setTableaus((t) => {
        const next = [...t];
        next[toCol] = [...next[toCol], card];
        return next;
      });
    } else if (source === 'tableau' && fromCol !== undefined) {
      setTableaus((t) => {
        const next = [...t];
        const cardIndex = next[fromCol].findIndex((c) => c.id === card.id);
        const moving = next[fromCol].slice(cardIndex);
        next[fromCol] = next[fromCol].slice(0, cardIndex);
        if (next[fromCol].length > 0) {
          next[fromCol][next[fromCol].length - 1].isFaceUp = true;
        }
        next[toCol] = [...next[toCol], ...moving];
        return next;
      });
    }
    setSelectedCard(null);
  };

  const checkWinCondition = () => {
    setTimeout(() => {
      setFoundations((f) => {
        const total = f.reduce((acc, pile) => acc + pile.length, 0);
        if (total === 52) {
          soundManager.playStartup();
          setHasWon(true);
        }
        return f;
      });
    }, 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#008000' }}>
      {/* Menu Bar */}
      <div className="win98-menubar" style={{ backgroundColor: '#c0c0c0' }}>
        <span className="win98-menu-item" onClick={initGame}>Deal</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Felt Playing Field */}
      <div style={{ flex: 1, padding: 12, overflow: 'auto', position: 'relative' }}>
        {/* Top Row: Stock, Waste, and 4 Foundations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Stock & Waste */}
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Stock */}
            <div
              onClick={handleStockClick}
              style={{
                width: 58,
                height: 82,
                borderRadius: 4,
                border: '2px solid #005000',
                backgroundColor: stock.length > 0 ? '#003399' : '#006600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                boxShadow: stock.length > 0 ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              {stock.length > 0 ? '🂠' : '↺'}
            </div>

            {/* Waste */}
            <div
              style={{
                width: 58,
                height: 82,
                borderRadius: 4,
                border: '2px dashed #005000',
                position: 'relative',
              }}
            >
              {waste.length > 0 && (() => {
                const card = waste[waste.length - 1];
                const isSelected = selectedCard?.card.id === card.id;
                return (
                  <div
                    onClick={() => {
                      if (selectedCard?.card.id === card.id) {
                        tryMoveToFoundation(card, 'waste');
                      } else {
                        setSelectedCard({ card, source: 'waste' });
                      }
                    }}
                    onDoubleClick={() => tryMoveToFoundation(card, 'waste')}
                    style={{
                      width: 58,
                      height: 82,
                      backgroundColor: '#ffffff',
                      borderRadius: 4,
                      border: isSelected ? '2px solid #ffff00' : '1px solid #000',
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                      padding: 4,
                      cursor: 'pointer',
                      color: card.color === 'red' ? '#cc0000' : '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                  >
                    <div>{getRankName(card.rank)} {card.suit}</div>
                    <div style={{ fontSize: 22, textAlign: 'center' }}>{card.suit}</div>
                    <div style={{ textAlign: 'right' }}>{getRankName(card.rank)}</div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 4 Foundations */}
          <div style={{ display: 'flex', gap: 10 }}>
            {foundations.map((pile, idx) => {
              const top = pile[pile.length - 1];
              return (
                <div
                  key={idx}
                  style={{
                    width: 58,
                    height: 82,
                    borderRadius: 4,
                    border: '2px solid #005000',
                    backgroundColor: top ? '#ffffff' : '#006000',
                    position: 'relative',
                    padding: top ? 4 : 0,
                    color: top?.color === 'red' ? '#cc0000' : '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: top ? '2px 2px 4px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  {top ? (
                    <>
                      <div>{getRankName(top.rank)} {top.suit}</div>
                      <div style={{ fontSize: 22, textAlign: 'center' }}>{top.suit}</div>
                      <div style={{ textAlign: 'right' }}>{getRankName(top.rank)}</div>
                    </>
                  ) : (
                    <div style={{ color: '#004500', fontSize: 28, margin: 'auto' }}>
                      {suits[idx]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7 Tableau Columns */}
        <div style={{ display: 'flex', gap: 10, minHeight: 280 }}>
          {tableaus.map((col, colIdx) => (
            <div
              key={colIdx}
              onClick={() => tryMoveToTableau(colIdx)}
              style={{
                width: 58,
                minHeight: 82,
                borderRadius: 4,
                border: col.length === 0 ? '2px dashed #005000' : 'none',
                position: 'relative',
              }}
            >
              {col.map((card, rowIdx) => {
                const isSelected = selectedCard?.card.id === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!card.isFaceUp) return;
                      if (selectedCard?.card.id === card.id) {
                        tryMoveToFoundation(card, 'tableau', colIdx);
                      } else {
                        setSelectedCard({ card, source: 'tableau', colIndex: colIdx });
                      }
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (card.isFaceUp) tryMoveToFoundation(card, 'tableau', colIdx);
                    }}
                    style={{
                      position: 'absolute',
                      top: rowIdx * 16,
                      width: 58,
                      height: 82,
                      backgroundColor: card.isFaceUp ? '#ffffff' : '#003399',
                      borderRadius: 4,
                      border: isSelected ? '2px solid #ffff00' : '1px solid #000',
                      boxShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                      padding: card.isFaceUp ? 3 : 0,
                      cursor: card.isFaceUp ? 'pointer' : 'default',
                      color: card.color === 'red' ? '#cc0000' : '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: 'bold',
                      fontSize: 11,
                    }}
                  >
                    {card.isFaceUp ? (
                      <>
                        <div>{getRankName(card.rank)} {card.suit}</div>
                        <div style={{ fontSize: 18, textAlign: 'center' }}>{card.suit}</div>
                        <div style={{ textAlign: 'right' }}>{getRankName(card.rank)}</div>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', border: '2px solid #ffffff', borderRadius: 2 }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {hasWon && (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#c0c0c0',
              padding: 16,
              boxShadow: 'inset -1px -1px #000, inset 1px 1px #fff',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Congratulations! You Won!</div>
            <button className="win98-btn" onClick={initGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};
