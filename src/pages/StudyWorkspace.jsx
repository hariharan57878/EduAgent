import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MousePointer2, PenTool, Square, Circle as CircleIcon, Minus, 
  StickyNote, Type, TableProperties, Trash2, Eraser,
  CheckCircle2, ArrowLeft, LayoutGrid, Undo2, Redo2, Download, Image as ImageIcon, FileText,
  ArrowUpToLine, ArrowDownToLine, ZoomIn, ZoomOut, Bot, Mic, Send, Volume2, Sparkles, Loader2, User, Upload, File, Save, Cloud
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { workspaceService } from '../services/api';
import './StudyWorkspace.css';

const TOOLS = [
  { id: 'select', label: 'Select & Pan', icon: MousePointer2, iconColor: '#581c87', activeBg: '#f3e8ff' },
  { id: 'draw', label: 'Draw Freehand', icon: PenTool, iconColor: '#ef4444', activeBg: '#fee2e2' },
  { id: 'eraser', label: 'Eraser', icon: Eraser, iconColor: '#9ca3af', activeBg: '#f3f4f6' },
  { id: 'shapes', label: 'Square', icon: Square, iconColor: '#1f2937', activeBg: '#f3f4f6' },
  { id: 'circle', label: 'Circle', icon: CircleIcon, iconColor: '#1f2937', activeBg: '#f3f4f6' },
  { id: 'line', label: 'Connector Line', icon: Minus, iconColor: '#3b82f6', rotate: '-45deg', activeBg: '#dbeafe' },
  { id: 'note', label: 'Sticky Note', icon: StickyNote, iconColor: '#f59e0b', activeBg: '#fef3c7' },
  { id: 'text', label: 'Text Box', icon: Type, iconColor: '#8b5cf6', activeBg: '#ede9fe' },
  { id: 'table', label: 'Table', icon: TableProperties, iconColor: '#1e3a8a', activeBg: '#dbeafe' }
];

const StudyWorkspace = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  
  const [roadmapData, setRoadmapData] = useState(() => {
    const saved = localStorage.getItem('roadmap');
    return saved ? JSON.parse(saved) : null;
  });
  
  const roadmap = roadmapData?.modules || [];
  const moduleFromState = location.state?.module;
  
  const moduleTitle = moduleFromState?.title || decodeURIComponent(moduleId || 'Learning Module');
  
  // Board State & Persistence
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [status, setStatus] = useState('In Progress');
  const [messages, setMessages] = useState([]);
  const [savingStatus, setSavingStatus] = useState('idle'); 
  const startTime = useRef(Date.now());
  const notesCounter = useRef(0);

  // Initialize tracking for Adaptive Learning Engine
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const boardRes = await workspaceService.getWhiteboard(moduleTitle);
        if (boardRes.data.success) {
           setElements(boardRes.data.elements || []);
        }

        const learnAllRes = await workspaceService.getAllLearning();
        if (learnAllRes.data.success) {
           const moduleInfo = learnAllRes.data.progress.find(m => m.moduleTitle === moduleTitle);
           if (moduleInfo) {
              setStatus(moduleInfo.status);
              // Store startedAt if not set
              if (!moduleInfo.startedAt) {
                 await workspaceService.updateLearning({ moduleTitle, startedAt: Date.now(), status: 'In Progress' });
              }
           } else {
              // Create it
              await workspaceService.updateLearning({ moduleTitle, startedAt: Date.now(), status: 'In Progress' });
           }
        }
      } catch (err) {
        console.error("Failed to fetch workspace from cloud", err);
      }
    };
    
    fetchWorkspace();

    // Cleanup: save time spent when leaving
    return async () => {
      try {
        const sessionMinutes = Math.floor((Date.now() - startTime.current) / 60000);
        await workspaceService.updateLearning({ 
          moduleTitle, 
          timeSpent: sessionMinutes, 
          notesCount: notesCounter.current 
        });
      } catch (err) {}
    };
  }, [moduleTitle]);

  // Debounced Cloud Sync for elements
  useEffect(() => {
    if (elements.length === 0) return;
    
    setSavingStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await workspaceService.saveWhiteboard(moduleTitle, elements);
        setSavingStatus('saved');
        setTimeout(() => setSavingStatus('idle'), 2000);
      } catch (err) {
        setSavingStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [elements, moduleTitle]);

  const saveState = (newElements) => {
    setHistory(prev => [...prev.slice(-20), elements]); 
    setFuture([]);
    setElements(newElements);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setFuture([elements, ...future]);
      setHistory(history.slice(0, -1));
      setElements(prevState);
    }
  };

  const handleRedo = () => {
    if (future.length > 0) {
      const nextState = future[0];
      setHistory(prev => [...prev, elements]);
      setFuture(future.slice(1));
      setElements(nextState);
    }
  };

  const handleMarkComplete = async () => {
    setStatus('Completed');
    const totalSessionMinutes = Math.floor((Date.now() - startTime.current) / 60000);
    
    try {
      await workspaceService.updateLearning({ 
        moduleTitle, 
        status: 'Completed', 
        completedAt: Date.now(),
        timeSpent: totalSessionMinutes,
        notesCount: notesCounter.current
      });
      
      // Navigate out
      setTimeout(() => navigate('/roadmap'), 1000);
    } catch (err) {
      console.error("Completion sync failed", err);
    }
  };
  
  // Tools and Transform States
  const [activeTool, setActiveTool] = useState('select');
  const [currentAction, setCurrentAction] = useState(null);

  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // AI Assistant State
  const [isAIOpen, setIsAIOpen] = useState(true);
  const [aiQuery, setAiQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const chatAreaRef = useRef(null);
  const [isMouseFollowEnabled, setIsMouseFollowEnabled] = useState(false);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatHistory, isAILoading]);

  const handleSubmitAI = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAILoading(true);
    const userInput = aiQuery;
    setAiQuery('');
    
    // SECTION 2 & 3: DATA COLLECTION + USER STATE
    const roadmap = JSON.parse(localStorage.getItem('roadmap') || '{}');
    const learningData = JSON.parse(localStorage.getItem('learningData') || '[]');
    const currentLearning = learningData.find(m => m.moduleTitle === moduleTitle) || { timeSpent: 0, notesCount: 0 };
    
    const { timeSpent, notesCount } = currentLearning;
    const FAST_TIME = 10;
    const HIGH_TIME = 30;
    const HIGH_NOTES = 5;

    let userState = "steady learner";
    if (timeSpent < FAST_TIME && notesCount < 2) userState = "fast learner";
    else if (timeSpent > HIGH_TIME || notesCount > HIGH_NOTES) userState = "struggling";

    // SECTION 4: BUILD AI PROMPT
    const structuredPrompt = `
      User Goal: ${roadmap.title || 'Learning Topic'}
      Current Module: ${moduleTitle}
      User Behavior: Time: ${timeSpent}m, Notes: ${notesCount}, State: ${userState}
      Question: ${userInput}
      Instruction: Explain for a ${userState}. 3-5 lines max. Practical example included. Suggest 1 next step.
    `;

    // Visual log for user 
    setChatHistory(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Simulate smart backend response with context-aware logic
    setTimeout(() => {
      let resp = "";
      const sStep = "👉 **Suggested next step:** ";

      if (userState === "struggling") {
         resp = `I've analyzed your progress on **${moduleTitle}**. Let's simplify this concept:

• **Core Analogy:** Think of this as [Simplified Analogy].
• **Key Focus:** For now, focus exclusively on [Core Concept].

${sStep} Review the basic prerequisite diagram on your whiteboard before continuing.`;
      } else if (userState === "fast learner") {
         resp = `Maintaining great momentum! To keep you challenged on **${moduleTitle}**:

• **The Deep Dive:** "${userInput}" is actually a shorthand for [Advanced Point].
• **Real-world Edge Case:** In scale systems, you'd apply this to [Optimize Edge Case].

${sStep} Try drawing an architectural sketch of this optimization on the canvas!`;
      } else {
         resp = `Excellent question about **${moduleTitle}**. Here is the breakdown:

• **Explanation:** Technically, it refers to [Direct Explanation].
• **Practical Application:** If you were building a [App Name], you'd use this to handle [Specific Usecase].

${sStep} Write a quick summary or code snippet on your whiteboard and move to the next topic.`;
      }
      
      setChatHistory(prev => [...prev, { role: 'ai', content: resp }]);
      setIsAILoading(false);
    }, 1800);
  };

  // Wheel to Zoom
  // Use a ref for the center workspace to attach non-passive wheel listener
  const centerWsRef = useRef(null);

  // Suppress browser zoom but allow whiteboard zoom
  useEffect(() => {
    const handleWheelNative = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(z => Math.max(0.1, Math.min(z - e.deltaY * 0.01, 4)));
      } else {
        // Panning only if inside the center workspace
        setPanPosition(prev => ({ 
          x: prev.x - e.deltaX, 
          y: prev.y - e.deltaY 
        }));
      }
    };

    const ws = centerWsRef.current;
    if (ws) {
      ws.addEventListener('wheel', handleWheelNative, { passive: false });
    }
    return () => {
      if (ws) {
        ws.removeEventListener('wheel', handleWheelNative);
      }
    };
  }, []);

  const handlePointerMove = (e) => {
    // Calculate coordinates relative to the whiteboard container
    const rect = centerWsRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const canvasX = (e.clientX - rect.left - panPosition.x) / zoom;
    const canvasY = (e.clientY - rect.top - panPosition.y) / zoom;

    if ((activeTool === 'select' || activeTool === 'eraser') && isPanning) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      setPanPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPointer.current = { x: e.clientX, y: e.clientY };
    }
    else if (currentAction?.type === 'draw') {
      setElements(prev => prev.map(el => 
        el.id === currentAction.id ? { ...el, points: [...el.points, {x: canvasX, y: canvasY}] } : el
      ));
    }
    else if (currentAction?.type === 'line') {
      setElements(prev => prev.map(el => 
        el.id === currentAction.id ? { ...el, end: {x: canvasX, y: canvasY} } : el
      ));
    }
    else if (currentAction?.type === 'resize') {
      const el = elements.find(item => item.id === currentAction.id);
      if (el) {
        const newWidth = Math.max(50, canvasX - el.position.x);
        const newHeight = Math.max(50, canvasY - el.position.y);
        setElements(prev => prev.map(item => 
          item.id === currentAction.id ? { ...item, size: { width: newWidth, height: newHeight } } : item
        ));
      }
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setCurrentAction(null);
  };

  const handlePointerDown = (e) => {
    // Only drag canvas if clicking directly on it
    if (e.target.closest('.ws-element') || e.target.closest('.ws-ui-layer') || e.target.closest('.ws-roadmap-sidebar')) {
      return; 
    }
    
    const rect = centerWsRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = (e.clientX - rect.left - panPosition.x) / zoom;
    const canvasY = (e.clientY - rect.top - panPosition.y) / zoom;

    if (activeTool === 'select' || activeTool === 'eraser') {
      setIsPanning(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
    } 
    else if (activeTool === 'draw') {
      const id = Date.now().toString();
      const newEl = { id, type: 'draw', points: [{x: canvasX, y: canvasY}], color: '#ef4444', zIndex: 10 };
      setHistory(prev => [...prev.slice(-20), elements]); // Start drawing history
      setFuture([]);
      setElements(prev => [...prev, newEl]);
      setCurrentAction({ type: 'draw', id });
    }
    else if (activeTool === 'line') {
      const id = Date.now().toString();
      const newEl = { id, type: 'line', start: {x: canvasX, y: canvasY}, end: {x: canvasX, y: canvasY}, color: '#3b82f6', zIndex: 10 };
      setHistory(prev => [...prev.slice(-20), elements]); 
      setFuture([]);
      setElements(prev => [...prev, newEl]);
      setCurrentAction({ type: 'line', id });
    }
  };

  const spawnElement = (type) => {
    const sidebarOffsetWidth = 280;
    const viewWidth = window.innerWidth - sidebarOffsetWidth;
    
    // Drop perfectly in the center factoring pan and zoom
    const centerX = ((sidebarOffsetWidth + (viewWidth / 2) - panPosition.x) / zoom) - 50 + (Math.random() * 40 - 20);
    const centerY = (((window.innerHeight / 2) - panPosition.y) / zoom) - 50 + (Math.random() * 40 - 20);
    
    const id = Date.now().toString();
    const defaultWidth = type === 'note' ? 200 : 250;
    const defaultHeight = type === 'note' ? 200 : 80;
    
    const newEl = { 
      id, 
      type, 
      position: { x: centerX, y: centerY }, 
      size: { width: defaultWidth, height: defaultHeight },
      content: '', 
      zIndex: 10 
    };
    
    if (type === 'note') {
      notesCounter.current += 1;
    }

    if (type === 'table') {
      newEl.data = [['Header', 'Header'], ['Data', 'Data']];
    }

    saveState([...elements, newEl]);
    setActiveTool('select'); 
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const sidebarOffsetWidth = 280;
      const viewWidth = window.innerWidth - sidebarOffsetWidth;
      const centerX = ((sidebarOffsetWidth + (viewWidth / 2) - panPosition.x) / zoom) - 100;
      const centerY = (((window.innerHeight / 2) - panPosition.y) / zoom) - 100;

      const id = Date.now().toString();
      const isImage = file.type.startsWith('image/');
      
      const newEl = { 
        id, 
        type: isImage ? 'image' : 'file', 
        position: { x: centerX, y: centerY }, 
        url: event.target.result,
        name: file.name,
        zIndex: 10 
      };
      saveState([...elements, newEl]);
    };
    
    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else {
        // For other files, we just take the name for now or a placeholder
        reader.readAsDataURL(file); // maybe overkill for giant files? 
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Generic Interactivity
  const updateElementProps = (id, newProps) => {
    saveState(elements.map(el => el.id === id ? { ...el, ...newProps } : el));
  };

  const deleteElement = (id) => {
    saveState(elements.filter(el => el.id !== id));
  };

  const handleElementInteraction = (e, id) => {
    if (activeTool === 'eraser') {
      e.stopPropagation();
      deleteElement(id);
    } else if (activeTool === 'select') {
      // Auto bring-to-front on click
      const highestZIndex = Math.max(...elements.map(el => el.zIndex || 10), 10);
      const target = elements.find(el => el.id === id);
      if (target && (target.zIndex || 10) < highestZIndex) {
         saveState(elements.map(el => el.id === id ? { ...el, zIndex: highestZIndex + 1 } : el));
      }
    } else {
      e.stopPropagation(); // Block drags outside select tool
    }
  };

  const bringForward = (id) => {
    saveState(elements.map(el => el.id === id ? { ...el, zIndex: (el.zIndex || 10) + 1 } : el));
  };
  const sendBackward = (id) => {
    saveState(elements.map(el => el.id === id ? { ...el, zIndex: Math.max(0, (el.zIndex || 10) - 1) } : el));
  };

  // EXPORT ENGINE using HTML2CANVAS & JSPDF
  const exportImage = async () => {
    const layer = document.querySelector('.notes-layer');
    if (!layer) return;
    const canvas = await html2canvas(layer, { backgroundColor: '#f3f4f6', scale: 2 });
    const link = document.createElement('a');
    link.download = `${moduleTitle}-whiteboard.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportPDF = async () => {
    const layer = document.querySelector('.notes-layer');
    if (!layer) return;
    const canvas = await html2canvas(layer, { backgroundColor: '#f3f4f6', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${moduleTitle}-whiteboard.pdf`);
  };

  const renderElementContent = (el) => {
    if (el.type === 'note') {
      return (
        <textarea
          className="ws-input-note"
          value={el.content}
          onChange={(e) => setElements(elements.map(eObj => eObj.id === el.id ? { ...eObj, content: e.target.value } : eObj))}
          onBlur={() => updateElementProps(el.id, { content: el.content })} // Save step on blur
          placeholder="Type notes..."
          onPointerDown={(e) => e.stopPropagation()}
        />
      );
    }
    if (el.type === 'shapes' || el.type === 'circle' || el.type === 'text') {
      return (
        <textarea
          className="ws-input-text"
          value={el.content}
          onChange={(e) => setElements(elements.map(eObj => eObj.id === el.id ? { ...eObj, content: e.target.value } : eObj))}
          onBlur={() => updateElementProps(el.id, { content: el.content })}
          placeholder="Type here..."
          onPointerDown={(e) => e.stopPropagation()}
        />
      );
    }
    if (el.type === 'table') {
      return (
        <table className="ws-table-element">
          <tbody>
            {el.data.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>
                    <input 
                      value={cell} 
                      onChange={(e) => {
                        const newData = [...el.data];
                        newData[rIdx] = [...newData[rIdx]];
                        newData[rIdx][cIdx] = e.target.value;
                        setElements(elements.map(eObj => eObj.id === el.id ? { ...eObj, data: newData } : eObj));
                      }} 
                      onBlur={() => updateElementProps(el.id, { data: el.data })}
                      onPointerDown={e => e.stopPropagation()}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (el.type === 'image') {
      return (
        <div className="ws-content-image">
          <img src={el.url} alt={el.name} style={{ width: '100%', borderRadius: '4px' }} />
        </div>
      );
    }
    if (el.type === 'file') {
      return (
        <div className="ws-content-file">
          <File size={32} color="#8b5cf6" />
          <div className="file-info">
            <span className="file-name">{el.name}</span>
            <a href={el.url} download={el.name} className="file-dl">Download</a>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`study-workspace 
        ${isPanning ? 'is-panning' : ''} 
        ${['draw', 'line'].includes(activeTool) ? 'is-drawing' : 'is-selectable'}
        ${activeTool === 'eraser' ? 'is-erasing' : ''}`}
    >
      {/* Sidebar Navigation */}
      <aside className="ws-roadmap-sidebar" onWheel={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
        <div className="ws-rside-header">
          <h3>Module Roadmap</h3>
        </div>
        <div className="ws-rside-list">
          {roadmap.length > 0 ? roadmap.map((mod, idx) => {
            const isCompleted = mod.status === 'Completed' || mod.status === 'completed';
            const isCurrent = mod.title === moduleTitle;
            return (
              <div key={idx} className={`ws-rside-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="ws-rside-status">
                  {isCompleted ? <CheckCircle2 size={16} className="text-success" /> : <div className="ws-rm-dot" />}
                </div>
                <div className="ws-rside-content">
                  <h4>{mod.title}</h4>
                  <span className="ws-rm-badge">{mod.status || 'Not Started'}</span>
                </div>
              </div>
            );
          }) : (
            <div className="ws-rside-empty">No roadmap provided.</div>
          )}
        </div>
        <div className="ws-rside-footer">
          <button className="ws-rside-btn-back" onClick={() => navigate('/roadmap')}>
            <ArrowLeft size={16} /> Exit Workspace
          </button>
        </div>
      </aside>

      <div 
        className="ws-center-workspace" 
        ref={centerWsRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Infinite Canvas Background that scales precisely with Zoom */}
        <div 
          className="canvas-bg"
          style={{ 
            backgroundPosition: `${panPosition.x}px ${panPosition.y}px`,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            left: 0,
            width: '100%'
          }}
        />

        {/* Notes / Render Layer factored intricately by Pan/Zoom transforms */}
        <div 
          className="notes-layer" 
          style={{ 
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
          ref={canvasRef}
        >
          {/* SVG Drawing Layer Support */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'visible', pointerEvents: activeTool === 'eraser' ? 'auto' : 'none', zIndex: 1 }}>
            {elements.filter(e => e.type === 'draw').map(el => (
              <polyline 
                key={el.id} 
                points={el.points.map(p => `${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={el.color} 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ pointerEvents: activeTool === 'eraser' ? 'stroke' : 'none', cursor: 'cell', zIndex: el.zIndex || 1 }}
                onPointerDown={(e) => handleElementInteraction(e, el.id)}
              />
            ))}
            {elements.filter(e => e.type === 'line').map(el => (
              <line 
                key={el.id} x1={el.start.x} y1={el.start.y} x2={el.end.x} y2={el.end.y} stroke={el.color} strokeWidth="4" strokeLinecap="round" 
                style={{ pointerEvents: activeTool === 'eraser' ? 'stroke' : 'none', cursor: 'cell', zIndex: el.zIndex || 1 }}
                onPointerDown={(e) => handleElementInteraction(e, el.id)}
              />
            ))}
          </svg>

        {elements.length === 0 && (
          <div className="canvas-placeholder" style={{ 
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`
          }}>
            <LayoutGrid size={48} className="placeholder-icon" />
            <p>Your whiteboard is empty.</p>
            <p className="sub-text">Use the toolbar to sketch, drop shapes, or generate flowcharts.</p>
          </div>
        )}
        
        {/* Draggable HTML Canvas Objects */}
          {elements.filter(e => ['note', 'text', 'shapes', 'circle', 'table', 'image', 'file'].includes(e.type)).map(el => (
            <motion.div
              key={el.id}
              className={`ws-element elementType-${el.type}`}
              drag={activeTool === 'select'}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.9, x: el.position.x, y: el.position.y }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={activeTool === 'select' ? { scale: 1.01 } : {}}
              whileDrag={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.2)", zIndex: 50 }}
              onDragEnd={(e, info) => {
                // Update true transform origin safely on end
                saveState(elements.map(item => item.id === el.id ? { ...item, position: { x: el.position.x + info.offset.x / zoom, y: el.position.y + info.offset.y / zoom }} : item));
              }}
              onPointerDown={(e) => handleElementInteraction(e, el.id)}
              style={{ x: el.position.x, y: el.position.y, zIndex: el.zIndex || 10, width: el.size?.width, height: el.size?.height }}
            >
              <div className="ws-element-header drag-handle" style={{ cursor: activeTool === 'select' ? 'grab' : 'default' }}>
                <div className="layer-controls">
                  <button title="Bring Forward" onClick={() => bringForward(el.id)}><ArrowUpToLine size={12}/></button>
                  <button title="Send Backward" onClick={() => sendBackward(el.id)}><ArrowDownToLine size={12}/></button>
                </div>
                <button className="btn-delete-element" onClick={() => deleteElement(el.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
              {renderElementContent(el)}
              
              {/* Resize Handle */}
              {(el.type === 'note' || el.type === 'text' || el.type === 'image') && (
                <div 
                  className="ws-resize-handle"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setCurrentAction({ type: 'resize', id: el.id });
                  }}
                />
              )}

              <div className="ws-el-actions">
                <button 
                  className="ws-el-btn trash" 
                  onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
                {el.type === 'note' && (
                   <div className="ws-note-controls">
                      <button className="dot red" onClick={() => updateElementProps(el.id, { color: '#fee2e2' })} />
                      <button className="dot blue" onClick={() => updateElementProps(el.id, { color: '#e0f2fe' })} />
                      <button className="dot green" onClick={() => updateElementProps(el.id, { color: '#dcfce7' })} />
                      <button className="dot yellow" onClick={() => updateElementProps(el.id, { color: '#fef3c7' })} />
                   </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Top Nav (Exporting & Collaboration) */}
        <div className="ws-ui-layer ws-top-nav" style={{ left: '84px', right: '24px' }}>
          <div className="ws-top-controls-group">
            <div className="ws-history-group">
              <button className="ws-btn-secondary" onClick={handleUndo} disabled={history.length === 0} title="Undo">
                <Undo2 size={16} />
              </button>
              <button className="ws-btn-secondary" onClick={handleRedo} disabled={future.length === 0} title="Redo">
                <Redo2 size={16} />
              </button>
              <div className="ws-vertical-divider" />
              <button className="ws-btn-secondary" onClick={() => deleteElement(elements[elements.length - 1]?.id)} title="Delete Last">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="ws-cloud-status">
              {savingStatus === 'saving' && <><Loader2 size={14} className="spin-icon" /> Saving...</>}
              {savingStatus === 'saved' && <><Cloud size={14} color="#10b981" /> Saved to Cloud</>}
              {savingStatus === 'error' && <><X size={14} color="#ef4444" /> Sync Error</>}
            </div>

            <div className="ws-zoom-group">
              <button className="ws-btn-secondary" onClick={() => setZoom(z => Math.min(z + 0.1, 3))}><ZoomIn size={16}/></button>
              <span className="ws-zoom-level">{Math.round(zoom * 100)}%</span>
              <button className="ws-btn-secondary" onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))}><ZoomOut size={16}/></button>
            </div>
          </div>
          
          <div className="ws-export-group">
              <button 
                  className="ws-btn-primary" 
                  onClick={() => setIsAIOpen(!isAIOpen)}
                  style={{ 
                    color: isAIOpen ? 'white' : '#8b5cf6', 
                    backgroundColor: isAIOpen ? '#8b5cf6' : 'rgba(139, 92, 246, 0.05)',
                    borderColor: '#8b5cf6' 
                  }}
                >
                  <Bot size={16} /> {isAIOpen ? 'Close Assistant' : 'Open Assistant'}
                </button>
            <div className="ws-vertical-divider" />
            <button className="ws-btn-primary" onClick={exportImage}>
              <ImageIcon size={16} /> Export PNG
            </button>
            <button className="ws-btn-primary" onClick={exportPDF}>
              <FileText size={16} /> Export PDF
            </button>
          </div>
        </div>

        {/* Vertical Tool Palette (Left anchored) */}
        <div className="ws-ui-layer ws-left-tools" style={{ left: '24px' }}>
          <button className="ws-btn-round" onClick={() => navigate('/roadmap')} title="Close and return">
            <X size={20} strokeWidth={2.5} />
          </button>
          <div className="ws-toolbar-vertical">
            <label className="ws-tool-btn" title="Upload File" style={{ cursor: 'pointer' }}>
               <input type="file" hidden onChange={handleFileUpload} />
               <Upload size={20} strokeWidth={2.5} color="#4b5563" />
            </label>
            <div className="ws-tool-divider" style={{ width: '20px', height: '1px', background: '#e5e7eb', margin: '4px 0' }} />
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  className={`ws-tool-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTool(tool.id);
                    if (['note', 'text', 'shapes', 'circle', 'table'].includes(tool.id)) {
                      spawnElement(tool.id);
                    }
                  }}
                  title={tool.label}
                  style={{ backgroundColor: isActive ? tool.activeBg : 'transparent' }}
                >
                  <Icon size={20} strokeWidth={2.5} color={isActive ? tool.iconColor : '#4b5563'} style={{ transform: tool.rotate ? `rotate(${tool.rotate})` : 'none' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Right Module Info & Complete Pill */}
        <div className="ws-ui-layer ws-bottom-right">
          <div className="ws-info-pill">
            <span className="ws-module-title">{moduleTitle}</span>
            <div className="ws-divider" />
            <span className={`ws-status-text ${status === 'Completed' ? 'completed' : ''}`}>
              {status}
            </span>
            <div className="ws-divider" />
            <button 
              className={`ws-btn-complete ${status === 'Completed' ? 'completed' : ''}`}
              onClick={handleMarkComplete}
              disabled={status === 'Completed'}
            >
              {status === 'Completed' ? <><CheckCircle2 size={16} /> Done</> : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Side Panel */}
      {isAIOpen && (
        <motion.div 
          className="ws-ai-panel"
          onWheel={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="ws-ai-header">
            <div className="ws-ai-title">
              <Bot size={20} color="#8b5cf6" />
              <h3>Study Assistant</h3>
            </div>
            <button className="ws-ai-close" onClick={() => setIsAIOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="ws-ai-content">
            <div className="ws-ai-chat-area" ref={chatAreaRef} style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatHistory.length === 0 ? (
                <div className="ws-ai-empty">
                  Hi! I'm your Study Assistant. I can explain concepts, help brainstorm, or guide your roadmap. What do you want to learn?
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`ws-ai-message ${msg.role === 'ai' ? 'ws-ai-msg-bot' : 'ws-ai-msg-user'}`}>
                    <p>{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="ws-ai-input-area">
            <div className="ws-chat-input-row">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitAI()}
                placeholder="Ask AI about this module..."
                disabled={isAILoading}
              />
              <button 
                className="ws-chat-send" 
                onClick={handleSubmitAI}
                disabled={!aiQuery.trim() || isAILoading}
              >
                <Send size={18} />
              </button>
            </div>
            {isAILoading && (
              <div className="ws-ai-thinking-state">
                <Loader2 size={12} className="spin-icon" /> Thinking based on your progress...
              </div>
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default StudyWorkspace;
