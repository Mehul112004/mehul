import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './AIAssistant.module.css';
import { useLimelightStore } from '../store/useLimelightStore';
import { FilterService } from '../services/filterService';
import { askRag } from '../services/ragService';

const labelMessages = [
  "Ask me about Mehul?",
  "Check out my projects",
  "Learn about my stack",
  "View architecture logs",
  "Inquire about expertise"
];

interface Message {
  id: string;
  sender: 'SYSTEM' | 'USER' | 'DONNA';
  text: string;
}


export function AIAssistant() {
  const isOpen = useLimelightStore((state) => state.isChatbotOpen);
  const setIsOpen = useLimelightStore((state) => state.setChatbotOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentlyTypingId, setCurrentlyTypingId] = useState<string | null>(null);
  const [labelMessage, setLabelMessage] = useState('Ask me about Mehul?');
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const updateCursorPosition = () => {
    if (inputRef.current && measureRef.current && cursorRef.current) {
      const selStart = inputRef.current.selectionStart ?? 0;
      measureRef.current.textContent = inputRef.current.value.substring(0, selStart);
      const scrollLeft = inputRef.current.scrollLeft;
      const offset = measureRef.current.offsetWidth - scrollLeft;
      cursorRef.current.style.left = `${offset}px`;
    }
  };

  useLayoutEffect(() => {
    updateCursorPosition();
  }, [inputValue]);

  const activateLimelight = useLimelightStore((state) => state.activateLimelight);
  const deactivateLimelight = useLimelightStore((state) => state.deactivateLimelight);

  const typeMessage = async (
    sender: 'SYSTEM' | 'USER' | 'DONNA',
    fullText: string,
    speed: number = 20,
    highlightIds?: string[]
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
      
      // Activate highlighting once typing is underway or finished
      if (highlightIds && highlightIds.length > 0 && i === Math.min(10, fullText.length - 1)) {
        activateLimelight(highlightIds);
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

    const activeIds = useLimelightStore.getState().highlightedProjectIds;
    console.log('[Limelight Debug] Chatbot runInitialSequence checking activeIds:', activeIds);
    if (activeIds.length > 0) {
      const id = activeIds[0];
      let name = id;
      if (id === 'c_helper') name = 'C_Helper: Crypto Intelligence';
      else if (id === 'mayax') name = 'MayaX: AI Interior Design';
      else if (id === 'blockex') name = 'Blockex: Safari Extension';
      else if (id === 'peer_focus') name = 'Peer Focus: Co-Working Rooms';
      else if (id === 'wallulu') name = 'Wallulu: Wallpaper Browser';
      else if (id === 'exp_gohappy') name = 'GoHappy Club';
      else if (id === 'exp_drupsc') name = 'Dr. UPSC';
      else if (id === 'edu_skit') name = 'SKIT Jaipur';

      console.log('[Limelight Debug] Chatbot keeping activeId limelight:', id);
      await typeMessage(
        'DONNA',
        `DONNA online. I see you're looking at ${name}. Let me know if you have any questions about this work.`,
        25,
        activeIds
      );
    } else {
      console.log('[Limelight Debug] Chatbot running default introductory sequence.');
      await typeMessage(
        'DONNA',
        "DONNA online. I am your AI assistant. Ask me anything about Mehul's project architectures, tech stacks, or professional experience, and I will query his portfolio index to guide you.",
        25
      );
    }
  };

  // Auto-load logic: Open terminal after 1000ms and run sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!useLimelightStore.getState().isProjectDetailsOpen) {
        setIsOpen(true);
        runInitialSequence();
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chatbot capabilities label cycle
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
      return;
    }

    const initialDelay = setTimeout(() => {
      let currentIndex = 0;
      let isCancelled = false;

      const runCycle = async () => {
        if (isCancelled) return;

        setLabelMessage(labelMessages[currentIndex]);
        setIsExpanded(true);

        // Hold for 3s so the user has more time to notice and read it
        await new Promise((resolve) => setTimeout(resolve, 3000));
        if (isCancelled) return;

        setIsExpanded(false);

        // Wait for transition to finish (400ms) + 4s pause = 4400ms
        await new Promise((resolve) => setTimeout(resolve, 4400));
        if (isCancelled) return;

        currentIndex = (currentIndex + 1) % labelMessages.length;
        runCycle();
      };

      runCycle();

      return () => {
        isCancelled = true;
      };
    }, 3000); // Start cycling after 3 seconds initial delay

    return () => {
      clearTimeout(initialDelay);
    };
  }, [isOpen]);

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
      
      // Run validation filter
      const filterResult = FilterService.filter(userText);

      // Type user message
      await typeMessage('USER', userText, 15);
      
      if (!filterResult.isValid) {
        // Display terminal error line for rejected message
        setTimeout(async () => {
          await typeMessage('SYSTEM', `ERROR: Message rejected - ${filterResult.reason}`, 10);
        }, 400);
        return;
      }

      // Query live RAG pipeline
      setTimeout(async () => {
        try {
          await typeMessage('SYSTEM', 'Querying neural fabric for project context...', 10);
          const ragResponse = await askRag(filterResult.sanitizedText);

          // Type Donna answer and highlight corresponding limelight elements
          await typeMessage('DONNA', ragResponse.answer, 20, ragResponse.limelightIds);

          // Display sources
          if (ragResponse.sources.length > 0) {
            const uniqueSources = Array.from(new Set(ragResponse.sources));
            await typeMessage('SYSTEM', `Sources: ${uniqueSources.join(', ')}`, 10);
          }
        } catch (error: any) {
          console.error('RAG Query Failure:', error);
          await typeMessage(
            'SYSTEM', 
            `ERROR: Pipeline query failed. Make sure index.json is ingested and VITE_GROQ_API_KEY is active.`,
            10
          );
        }
      }, 400);
    }
  };

  return (
    <>
      {/* Floating AI Assistant Container */}
      <div className={styles.assistantContainer} style={{ zIndex: 110 }}>
        {/* Collapsible Label */}
        <div 
          className={`${styles.labelPill} ${isExpanded ? styles.expanded : ''}`} 
          id="ai-label-pill"
        >
          <span className={styles.labelText} id="ai-label-text">
            {labelMessage}
          </span>
        </div>

        {/* AI Assistant Donna Trigger */}
        <div 
          className={styles.trigger} 
          id="ai-trigger"
          onClick={toggleTerminal}
        >
          <span className={`material-symbols-outlined ${styles.triggerIcon}`}>
            cognition
          </span>
        </div>
      </div>

      {/* AI Terminal Window */}
      {isOpen && (
        <div className={`${styles.terminal} ai-terminal`} id="ai-terminal" style={{ zIndex: 100 }}>
          {/* Header */}
          <div className={styles.terminalHeader}>
            <span className={styles.terminalTitle}>
              DONNA_v1.0.2 // AI_ASSISTANT
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
              <div className={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.input}
                  placeholder={currentlyTypingId ? "Donna typing..." : "Type command..."}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    updateCursorPosition();
                  }}
                  onKeyDown={(e) => {
                    handleKeyPress(e);
                    setTimeout(updateCursorPosition, 0);
                  }}
                  onKeyUp={updateCursorPosition}
                  onSelect={updateCursorPosition}
                  onClick={updateCursorPosition}
                  onScroll={updateCursorPosition}
                  onFocus={updateCursorPosition}
                  autoComplete="off"
                  disabled={currentlyTypingId !== null}
                />
                {currentlyTypingId === null && (
                  <div 
                    ref={cursorRef} 
                    className={styles.terminalCursor} 
                  />
                )}
                <span ref={measureRef} className={styles.measure} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
