import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  Mic, 
  Camera, 
  Check, 
  CheckCheck,
  ChevronLeft,
  Image as ImageIcon,
  FileText,
  X,
  Bot
} from 'lucide-react';

// --- Types ---

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  isSystemEvent?: boolean;
}

interface ServiceOrder {
  id: string;
  title: string; // Acts as "Contact Name"
  client: string;
  status: 'open' | 'in_progress' | 'completed';
  description: string;
  messages: Message[];
  unreadCount: number;
  createdAt: Date;
}

// --- Mock Data ---

const MOCK_USERS: Record<string, User> = {
  'u1': { id: 'u1', name: 'Você', avatar: 'https://i.pravatar.cc/150?u=u1' },
  'u2': { id: 'u2', name: 'Ana Souza', avatar: 'https://i.pravatar.cc/150?u=u2', isOnline: true },
  'sys': { id: 'sys', name: 'Sistema', avatar: '' },
  'ai': { id: 'ai', name: 'Assistente IA', avatar: '', isOnline: true },
};

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-884',
    title: 'Ana Souza - Vazamento AC',
    client: 'Ana Souza',
    status: 'in_progress',
    description: 'Ar condicionado pingando na sala 404',
    unreadCount: 4,
    createdAt: new Date('2024-05-10T09:00'),
    messages: [
      { id: 'm1', senderId: 'sys', text: 'OS Criada: Vazamento AC', timestamp: new Date('2024-05-10T09:00'), status: 'read', isSystemEvent: true },
      { id: 'm2', senderId: 'u2', text: 'Olá, preciso de ajuda urgente na sala 404.', timestamp: new Date('2024-05-10T09:05'), status: 'read' },
      { id: 'm3', senderId: 'u2', text: 'Segue a foto:', timestamp: new Date('2024-05-10T09:06'), status: 'read', attachments: [{ id: 'a1', type: 'image', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400', name: 'foto.jpg' }] },
      { id: 'm4', senderId: 'u1', text: 'Estou a caminho, chego em 10min.', timestamp: new Date('2024-05-10T09:15'), status: 'read' },
    ]
  },
  {
    id: 'OS-885',
    title: 'Condomínio Solar',
    client: 'Zelador',
    status: 'open',
    description: 'Lâmpadas queimadas corredor B',
    unreadCount: 0,
    createdAt: new Date('2024-05-11T10:00'),
    messages: [
      { id: 'm1', senderId: 'sys', text: 'OS Criada: Troca de Lâmpadas', timestamp: new Date('2024-05-11T10:00'), status: 'delivered', isSystemEvent: true },
      { id: 'm2', senderId: 'u2', text: 'Aguardando aprovação do orçamento.', timestamp: new Date('2024-05-11T10:30'), status: 'delivered' }
    ]
  },
  {
    id: 'OS-886',
    title: 'Manutenção Elevador',
    client: 'Sindico',
    status: 'completed',
    description: 'Barulho estranho no elevador de serviço',
    unreadCount: 1,
    createdAt: new Date('2024-05-11T14:00'),
    messages: [
       { id: 'm1', senderId: 'u2', text: 'Obrigado pelo serviço rápido!', timestamp: new Date('2024-05-11T14:00'), status: 'read' }
    ]
  }
];

// --- Sub-Components ---

const Avatar = ({ url, name, size = 'md' }: { url?: string, name: string, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', // Standard List
    lg: 'w-10 h-10', // Header
    xl: 'w-48 h-48', // Profile
  };

  if (!url) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-500 flex items-center justify-center text-white font-medium`}>
        {name.substring(0, 1)}
      </div>
    );
  }

  return (
    <img src={url} alt={name} className={`${sizeClasses[size]} rounded-full object-cover border border-white/5`} />
  );
};

const MessageStatus = ({ status }: { status: Message['status'] }) => {
  if (status === 'sent') return <Check className="w-4 h-4 text-[#8696a0]" />;
  if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-[#8696a0]" />;
  if (status === 'read') return <CheckCheck className="w-4 h-4 text-[#53bdeb]" />; // Blue ticks
  return null;
};

// --- Main Component ---

const App = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null); // Null on mobile initially
  const [inputText, setInputText] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [selectedOrder?.messages]);

  // Responsive: If on mobile, selecting an order hides the list
  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    // On mobile we would typically navigate, here we just render condtionally
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedOrder) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'u1',
      text: inputText,
      timestamp: new Date(),
      status: 'sent',
    };

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, messages: [...o.messages, newMessage] };
      }
      return o;
    }));
    setInputText('');
    
    // Simulate generic AI or system response if needed, but for now just send
  };

  const handleConsultAI = async () => {
    if (!selectedOrder) return;
    setAiThinking(true);
    
    // Simulating "typing" state
    try {
        const conversationHistory = selectedOrder.messages
        .filter(m => !m.isSystemEvent)
        .map(m => `${MOCK_USERS[m.senderId]?.name || 'User'}: ${m.text}`)
        .join('\n');

      const prompt = `Responda como um assistente técnico em uma conversa de WhatsApp. Seja breve e útil.
      Contexto da OS: ${selectedOrder.title} - ${selectedOrder.description}
      Histórico:
      ${conversationHistory}`;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const responseText = result.text || '';

      const aiMsg: Message = {
        id: Date.now().toString(),
        senderId: 'ai',
        text: responseText,
        timestamp: new Date(),
        status: 'read',
      };
      
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id) {
          return { ...o, messages: [...o.messages, aiMsg] };
        }
        return o;
      }));

    } catch (e) {
      console.error(e);
    } finally {
        setAiThinking(false);
    }
  };

  // --- Views ---

  const renderSidebar = () => (
    <div className={`${selectedOrderId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[400px] h-full bg-[var(--wa-bg-sidebar)] border-r border-[var(--wa-border)]`}>
      {/* Sidebar Header */}
      <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center justify-between shrink-0">
        <Avatar name="Me" url={MOCK_USERS['u1'].avatar} size="md" />
        <div className="flex gap-6 text-[var(--wa-panel-header-icon)]">
          <button title="Status (Story)"><div className="w-6 h-6 rounded-full border-2 border-dashed border-[var(--wa-panel-header-icon)] opacity-60"></div></button>
          <button title="New Chat"><div className="w-6 h-6 bg-[var(--wa-panel-header-icon)] opacity-60 rounded-sm"></div></button>
          <button title="Menu"><MoreVertical className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="h-[50px] bg-[var(--wa-bg-sidebar)] flex items-center px-3 py-2 border-b border-[var(--wa-border)]">
        <div className="flex-1 h-full bg-[var(--wa-header)] rounded-lg flex items-center px-3 gap-3">
          <Search className="w-5 h-5 text-[var(--wa-panel-header-icon)]" />
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            className="bg-transparent border-none outline-none text-[var(--wa-text-primary)] text-sm w-full placeholder-[#8696a0]"
          />
        </div>
        <button className="ml-2 text-[var(--wa-panel-header-icon)]">
           <div className="w-5 h-5"><div className="w-full h-[2px] bg-current my-1"></div><div className="w-2/3 h-[2px] bg-current my-1"></div></div>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {orders.map(order => {
            const lastMsg = order.messages[order.messages.length - 1];
            return (
                <div 
                    key={order.id}
                    onClick={() => handleSelectOrder(order.id)}
                    className={`flex items-center px-3 py-3 cursor-pointer hover:bg-[var(--wa-bg-app)] transition-colors group ${selectedOrderId === order.id ? 'bg-[var(--wa-header)]' : ''}`}
                >
                    <div className="relative shrink-0">
                        <Avatar name={order.client} url={MOCK_USERS['u2'].avatar} size="lg" />
                    </div>
                    <div className="flex-1 ml-3 border-b border-[var(--wa-border)] pb-3 group-hover:border-transparent h-full flex flex-col justify-center">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-[var(--wa-text-primary)] font-normal text-[17px]">{order.title}</h3>
                            <span className={`text-xs ${order.unreadCount > 0 ? 'text-[var(--wa-primary)]' : 'text-[var(--wa-text-secondary)]'}`}>
                                {lastMsg?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                            <p className="text-[var(--wa-text-secondary)] text-[14px] truncate max-w-[200px] flex items-center gap-1">
                                {lastMsg?.senderId === 'u1' && <MessageStatus status={lastMsg.status} />}
                                {lastMsg?.text}
                            </p>
                            {order.unreadCount > 0 && (
                                <span className="bg-[var(--wa-primary)] text-black font-bold text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                                    {order.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
        
        {/* Archive / Footer filler */}
        <div className="p-8 text-center text-[var(--wa-text-secondary)] text-xs flex flex-col items-center gap-2">
            <span className="flex items-center gap-1"><div className="w-3 h-3 border border-current"></div> Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    </div>
  );

  const renderChat = () => {
    if (!selectedOrder) {
        return (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[var(--wa-border)] border-b-[6px] border-[var(--wa-primary)] text-[#aebac1]">
                <div className="max-w-[560px] text-center">
                    <h1 className="text-[32px] font-light text-[var(--wa-text-primary)] mb-5">WhatsApp Service Orders</h1>
                    <p className="mb-8">Send and receive service orders without keeping your phone online.<br/>Use WhatsApp on up to 4 linked devices and 1 phone.</p>
                    <div className="flex items-center justify-center gap-2 text-xs">
                         <div className="w-3 h-3 bg-gray-500 rounded-full"></div> End-to-end encrypted
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full w-full bg-[var(--wa-bg-app)] ${selectedOrderId ? 'flex' : 'hidden'}`}>
            {/* Chat Header */}
            <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
                    <button className="md:hidden text-[var(--wa-panel-header-icon)] mr-1" onClick={(e) => { e.stopPropagation(); setSelectedOrderId(null); }}>
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <Avatar name={selectedOrder.client} url={MOCK_USERS['u2'].avatar} />
                    <div className="flex flex-col">
                        <span className="text-[var(--wa-text-primary)] font-normal text-base leading-tight">{selectedOrder.title}</span>
                        <span className="text-[var(--wa-text-secondary)] text-xs truncate">click here for OS details</span>
                    </div>
                </div>
                <div className="flex gap-6 text-[var(--wa-panel-header-icon)]">
                    <button onClick={handleConsultAI} className={`transition-colors ${aiThinking ? 'text-[var(--wa-primary)] animate-pulse' : ''}`} title="Consultar IA">
                        <Bot className="w-6 h-6" />
                    </button>
                    <button><Video className="w-6 h-6" /></button>
                    <button><Phone className="w-6 h-6" /></button>
                    <div className="w-px h-6 bg-[var(--wa-border)]"></div>
                    <button><Search className="w-6 h-6" /></button>
                    <button><MoreVertical className="w-6 h-6" /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 wa-chat-bg overflow-y-auto p-4 sm:p-9 flex flex-col relative">
                <div className="flex justify-center mb-6 sticky top-0 z-0">
                    <span className="bg-[var(--wa-system-message)] text-[var(--wa-text-secondary)] text-xs px-3 py-1.5 rounded-lg shadow-sm uppercase">
                        {selectedOrder.createdAt?.toLocaleDateString()}
                    </span>
                </div>
                
                {selectedOrder.messages.map((msg, idx) => {
                    const isMe = msg.senderId === 'u1';
                    const isSys = msg.isSystemEvent;
                    const isAi = msg.senderId === 'ai';

                    if (isSys) {
                         return (
                            <div key={msg.id} className="flex justify-center mb-3">
                                <span className="bg-[var(--wa-system-message)] text-[#ffd279] text-xs px-4 py-1.5 rounded-lg text-center shadow-sm flex items-center gap-1">
                                    <div className="w-3 h-3 bg-[#ffd279] rounded-full text-black text-[8px] flex items-center justify-center">!</div>
                                    {msg.text}
                                </span>
                            </div>
                         );
                    }

                    return (
                        <div 
                            key={msg.id} 
                            className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'} ${idx === selectedOrder.messages.length -1 ? 'mb-4' : ''}`}
                        >
                            <div className={`relative max-w-[85%] sm:max-w-[65%] rounded-lg p-2 shadow-sm text-sm group ${
                                isMe 
                                    ? 'bg-[var(--wa-message-out)] text-[#e9edef] rounded-tr-none' 
                                    : 'bg-[var(--wa-message-in)] text-[var(--wa-text-primary)] rounded-tl-none'
                                }`}
                                style={{ boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)' }}
                            >
                                {isAi && <div className="text-[var(--wa-primary)] text-xs font-bold mb-1 flex items-center gap-1"><Bot className="w-3 h-3"/> Assistente IA</div>}
                                
                                {msg.attachments?.map(att => (
                                    <div key={att.id} className="mb-2 rounded-lg overflow-hidden relative">
                                        <img src={att.url} className="w-full h-auto max-h-[300px] object-cover" />
                                    </div>
                                ))}

                                <div className="pr-16 whitespace-pre-wrap leading-relaxed">
                                    {msg.text}
                                </div>
                                
                                <div className="absolute right-2 bottom-1 flex items-center gap-1">
                                    <span className="text-[11px] text-[var(--wa-text-secondary)]">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && <MessageStatus status={msg.status} />}
                                </div>
                                
                                {/* Tail simulation (CSS triangle) could go here but rounded corners do the job well enough for simplicity */}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="min-h-[62px] bg-[var(--wa-header)] px-4 py-2 flex items-end gap-3 z-10">
                <div className="flex gap-2 pb-2 text-[var(--wa-panel-header-icon)]">
                    <button><Smile className="w-6 h-6" /></button>
                    <button><Paperclip className="w-6 h-6" /></button>
                </div>
                
                <div className="flex-1 bg-[var(--wa-input-bg)] rounded-lg min-h-[42px] flex items-center px-3 py-2">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message"
                        className="w-full bg-transparent border-none outline-none text-[var(--wa-text-primary)] placeholder-[var(--wa-text-secondary)] text-sm"
                    />
                </div>
                
                {inputText ? (
                     <button onClick={handleSendMessage} className="pb-2 text-[var(--wa-primary)]">
                        <div className="w-10 h-10 bg-[var(--wa-primary)] rounded-full flex items-center justify-center text-black">
                            {/* Send icon specifically looks different in WhatsApp but standard Send is ok */}
                            <svg viewBox="0 0 24 24" width="24" height="24" className="">
                                <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
                            </svg>
                        </div>
                    </button>
                ) : (
                    <button className="pb-2 text-[var(--wa-panel-header-icon)]">
                        <Mic className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
  };

  const renderDetails = () => {
      if (!selectedOrder || !showDetails) return null;
      
      return (
          <div className="w-[350px] bg-[var(--wa-bg-sidebar)] border-l border-[var(--wa-border)] flex flex-col h-full absolute right-0 z-20 md:static shadow-xl">
              <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center gap-4 shrink-0">
                  <button onClick={() => setShowDetails(false)} className="text-[var(--wa-panel-header-icon)]"><X className="w-6 h-6"/></button>
                  <span className="text-[var(--wa-text-primary)] font-normal text-base">OS Info</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                  <div className="bg-[var(--wa-bg-sidebar)] p-6 flex flex-col items-center border-b border-[var(--wa-bg-app)] mb-2">
                      <Avatar name={selectedOrder.client} url={MOCK_USERS['u2'].avatar} size="xl" />
                      <h2 className="mt-4 text-[20px] text-[var(--wa-text-primary)] font-normal">{selectedOrder.client}</h2>
                      <span className="text-[var(--wa-text-secondary)] text-base">{selectedOrder.id}</span>
                  </div>

                  <div className="bg-[var(--wa-bg-sidebar)] p-4 border-b border-[var(--wa-bg-app)] mb-2">
                      <span className="text-[var(--wa-secondary)] text-sm mb-1 block">Description</span>
                      <p className="text-[var(--wa-text-primary)] text-base">{selectedOrder.description}</p>
                  </div>

                  <div className="bg-[var(--wa-bg-sidebar)] p-4 border-b border-[var(--wa-bg-app)] mb-2">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-[var(--wa-secondary)] text-sm">Media, Links and Docs</span>
                          <span className="text-[var(--wa-secondary)] text-sm flex items-center">201 <ChevronLeft className="w-4 h-4 rotate-180"/></span>
                      </div>
                      <div className="flex gap-2 overflow-hidden">
                          {selectedOrder.messages.flatMap(m => m.attachments || []).map(att => (
                               <img key={att.id} src={att.url} className="w-20 h-20 object-cover rounded-lg" />
                          ))}
                           <div className="w-20 h-20 bg-[var(--wa-bg-app)] rounded-lg flex items-center justify-center text-[var(--wa-secondary)]">
                               <FileText className="w-6 h-6"/>
                           </div>
                      </div>
                  </div>

                  <div className="p-4">
                       <button className="w-full py-3 flex items-center gap-4 text-[#f15c6d] hover:bg-[var(--wa-bg-app)] px-4 rounded-lg transition-colors">
                           <div className="w-5"><X className="w-5 h-5"/></div>
                           <span>Block Service Order</span>
                       </button>
                        <button className="w-full py-3 flex items-center gap-4 text-[#f15c6d] hover:bg-[var(--wa-bg-app)] px-4 rounded-lg transition-colors">
                           <div className="w-5"><span className="text-xl leading-none">👎</span></div>
                           <span>Report Contact</span>
                       </button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="flex h-screen w-full relative">
        {renderSidebar()}
        {renderChat()}
        {renderDetails()}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);