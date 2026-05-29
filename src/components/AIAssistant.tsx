import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './AIAssistant.module.css';
import { useLimelightStore } from '../store/useLimelightStore';

interface Message {
  id: string;
  sender: 'SYSTEM' | 'USER' | 'DONNA';
  text: string;
}

const DONNA_RESPONSES = [
  "Analyzing system requirements for high-availability clusters...",
  "Querying project documentation database for architectural patterns...",
  "Architectural patterns detected: High-availability, Event-driven, Microservices.",
  "Would you like to view the source code for the Crypto Trading engine?",
  "System performance metrics are currently within nominal range."
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentlyTypingId, setCurrentlyTypingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const activateLimelight = useLimelightStore((state) => state.activateLimelight);
  const deactivateLimelight = useLimelightStore((state) => state.deactivateLimelight);

  // Auto-load logic: Open terminal after 1000ms and run sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      runInitialSequence();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const typeMessage = async (
    sender: 'SYSTEM' | 'USER' | 'DONNA',
    fullText: string,
    speed: number = 20
  ) => {
    const id = `${sender.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Add the message placeholder
    setMessages((prev) => [...prev, { id, sender, text: '' }]);
    setCurrentlyTypingId(id);

    let typed = '';
    for (let i = 0; i < fullText.length; i++) {
      typed += fullText.charAt(i);
      
      // Update the message text
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, text: typed } : msg))
      );
      
      // Check if it includes our trigger text
      if (typed.includes("Crypto Algorithmic Trading Script")) {
        activateLimelight('crypto');
      }
      
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setCurrentlyTypingId(null);
  };

  const runInitialSequence = async () => {
    if (hasInitialized) return;
    setHasInitialized(true);
    setMessages([]); // Clear any messages

    await typeMessage('SYSTEM', 'Connection established...', 10);
    await new Promise((r) => setTimeout(r, 400));
    await typeMessage('SYSTEM', 'Initializing neural fabric...', 10);
    await new Promise((r) => setTimeout(r, 600));
    await typeMessage(
      'DONNA',
      "DONNA online. I see you're interested in high-frequency systems. Let's look at the Crypto Algorithmic Trading Script specifically for its architectural robustness.",
      25
    );
  };

  const toggleTerminal = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      runInitialSequence();
    }
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && currentlyTypingId === null) {
      const userText = inputValue.trim();
      setInputValue('');
      
      // Type user message
      await typeMessage('USER', userText, 15);
      
      // Simulate Donna response with a typing effect
      setTimeout(async () => {
        const randomResponse = DONNA_RESPONSES[Math.floor(Math.random() * DONNA_RESPONSES.length)];
        await typeMessage('DONNA', randomResponse, 25);
      }, 600);
    }
  };

  return (
    <>
      {/* AI Trigger Button */}
      <div 
        className={styles.trigger} 
        id="ai-trigger"
        onClick={toggleTerminal}
        style={{ zIndex: 110 }} // Ensure it's above the backdrop
      >
        <span className={`material-symbols-outlined ${styles.triggerIcon}`}>
          cognition
        </span>
      </div>

      {/* AI Terminal Window */}
      {isOpen && (
        <div className={styles.terminal} id="ai-terminal" style={{ zIndex: 100 }}>
          {/* Header */}
          <div className={styles.terminalHeader}>
            <span className={styles.terminalTitle}>
              DONNA_v1.0.2 // ARCHITECT_ASSISTANT
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                className="green-dot" 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#22c55e', 
                  borderRadius: '50%', 
                  animation: 'pulseCustom 2s ease-in-out infinite' 
                }}
              />
              <button 
                className={styles.closeBtn} 
                onClick={() => {
                  setIsOpen(false);
                  deactivateLimelight();
                }}
              >
                <span className={`material-symbols-outlined ${styles.closeIcon}`}>
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Messages Output */}
          <div className={styles.output} ref={outputRef}>
            {messages.map((msg) => {
              if (msg.sender === 'SYSTEM') {
                return (
                  <div key={msg.id} className={styles.systemMessage}>
                    &gt; {msg.text}
                    {msg.id === currentlyTypingId && (
                      <span className={styles.typingCursor} />
                    )}
                  </div>
                );
              }
              
              return (
                <div 
                  key={msg.id} 
                  className={msg.sender === 'USER' ? styles.userMessage : styles.donnaMessage}
                >
                  <span style={{ opacity: 0.5 }}>[{msg.sender}]</span> {msg.text}
                  {msg.id === currentlyTypingId && (
                    <span className={styles.typingCursor} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Input Block */}
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <span className={styles.prompt}>&gt;&gt;</span>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder={currentlyTypingId ? "Donna typing..." : "Type command..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                autoComplete="off"
                disabled={currentlyTypingId !== null}
              />
              {currentlyTypingId === null && <div className={styles.terminalCursor}></div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
