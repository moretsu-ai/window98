import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../../utils/audio';

interface ChatMessage {
  id: string;
  time: string;
  sender: string;
  text: string;
  isAction?: boolean;
  isSystem?: boolean;
}

const initialMessages: ChatMessage[] = [
  { id: '1', time: '06:30', sender: 'System', text: '*** Now talking in #dandi-march-1930 [TOP SECRET PARODY ARCHIVE]', isSystem: true },
  { id: '2', time: '06:30', sender: 'System', text: '*** Topic: 240 miles to Dandi. Free the salt, free the nation. No violence, high stamina.', isSystem: true },
  { id: '3', time: '06:31', sender: 'Bapu', text: 'Good morning everyone. Laces tied? We step out from Sabarmati at dawn.' },
  { id: '4', time: '06:32', sender: 'Sardar_Patel', text: 'Bapu, are you sure we cannot take a single bullock cart? Or at least a bicycle?' },
  { id: '5', time: '06:33', sender: 'Bapu', text: 'Non-violence applies to bullocks too, Sardar. Walking builds moral fiber and calf muscles.' },
  { id: '6', time: '06:34', sender: 'Sarojini_Naidu', text: 'I packed lemons, salt shaker prototypes, and 4 patriotic poems.' },
  { id: '7', time: '06:35', sender: 'Jawaharlal_N', text: 'The international press is already telegraphing. The British Viceroy is confused.' },
  { id: '8', time: '06:36', sender: 'Lord_Irwin_Lurking', text: '...Wait, you are walking 240 miles just for sodium chloride?' },
  { id: '9', time: '06:37', sender: 'Bapu', text: 'It is not just sodium chloride, Lord Irwin. It is sovereign dignity.' },
  { id: '10', time: '06:38', sender: 'Sardar_Patel', text: 'And also, we refuse to pay 8.2% tax on seawater seasoning!' },
  { id: '11', time: '06:39', sender: 'System', text: '*** Lord_Irwin_Lurking was kicked by Bapu (Reason: Ahimsa breach attempt)', isSystem: true },
];

export const RetroChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundManager.playClick();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      time: timeStr,
      sender: 'Guest1998',
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Automatic humorous reply from Bapu or Sardar
    setTimeout(() => {
      const replies = [
        { sender: 'Bapu', text: 'Welcome to the March, traveler. Drink plenty of water and keep the faith.' },
        { sender: 'Sardar_Patel', text: 'Stay in line, comrade! We have 14 miles to cover before lunch.' },
        { sender: 'Sarojini_Naidu', text: 'Well said! A stanza of revolution in every step!' },
        { sender: 'Bapu', text: 'Remember: A pinch of salt made by free hands is worth more than crowns.' },
      ];
      const botReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: botReply.sender,
          text: botReply.text,
        },
      ]);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontFamily: 'monospace' }}>
      {/* Notice header */}
      <div style={{ backgroundColor: '#ffffcc', color: '#800000', padding: '4px 8px', fontSize: 11, borderBottom: '1px solid #808080' }}>
        <strong>[FICTIONAL PARODY ARCHIVE]</strong> mIRC v5.41 — Reconstructed 1930 Dandi Salt March Group Chat
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Chat log */}
        <div
          className="inset-border"
          style={{
            flex: 1,
            backgroundColor: '#000080',
            color: '#ffffff',
            margin: 2,
            padding: 8,
            overflowY: 'auto',
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {messages.map((m) => {
            if (m.isSystem) {
              return (
                <div key={m.id} style={{ color: '#00ff00', marginBottom: 2 }}>
                  <span style={{ color: '#a0a0a0' }}>[{m.time}] </span>
                  {m.text}
                </div>
              );
            }
            return (
              <div key={m.id} style={{ marginBottom: 2 }}>
                <span style={{ color: '#a0a0a0' }}>[{m.time}] </span>
                <span style={{ color: m.sender === 'Bapu' ? '#ffff00' : m.sender === 'Guest1998' ? '#00ffff' : '#ff9999', fontWeight: 'bold' }}>
                  &lt;{m.sender}&gt;{' '}
                </span>
                <span>{m.text}</span>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* User list */}
        <div
          className="inset-border"
          style={{
            width: 140,
            backgroundColor: '#ffffff',
            margin: 2,
            padding: 6,
            fontSize: 11,
            overflowY: 'auto',
          }}
        >
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #c0c0c0', paddingBottom: 2, marginBottom: 4 }}>
            Participants (5)
          </div>
          <div style={{ color: '#800000', fontWeight: 'bold' }}>@Bapu</div>
          <div style={{ color: '#000080' }}>+Sardar_Patel</div>
          <div style={{ color: '#006600' }}>+Sarojini_Naidu</div>
          <div style={{ color: '#660066' }}>+Jawaharlal_N</div>
          <div style={{ color: '#333333' }}>Guest1998 (You)</div>
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 4, padding: 4 }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message to the marchers..."
          style={{ flex: 1, height: 22, fontFamily: 'monospace', fontSize: 12 }}
        />
        <button type="submit" className="win98-btn" style={{ padding: '0 12px' }}>
          Send
        </button>
      </form>
    </div>
  );
};

