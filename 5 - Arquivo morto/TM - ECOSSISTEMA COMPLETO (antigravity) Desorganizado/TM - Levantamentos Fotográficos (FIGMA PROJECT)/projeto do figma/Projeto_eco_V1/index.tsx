import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
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
    Bot,
    MapPin,
    Calendar,
    AlertTriangle,
    Briefcase
} from 'lucide-react';

// --- Types aligned with PRD ---

interface User {
    id: string;
    name: string;
    avatar: string;
    role: 'coordinator' | 'technician' | 'client' | 'system' | 'ai';
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
    id: string;      // e.g. OS-2025-001
    code: string;    // Display Code
    client: string;
    address: string;
    serviceType: string; // e.g., 'Levantamento Fotográfico'
    priority: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
    deadline: Date;
    status: 'pendente' | 'atribuida' | 'em_campo' | 'concluida';
    description: string;
    messages: Message[];
    unreadCount: number;
    createdAt: Date;
}

// --- Mock Data ---

const MOCK_USERS: Record<string, User> = {
    'u1': { id: 'u1', name: 'Técnico(a) Campo', avatar: 'https://i.pravatar.cc/150?u=u1', role: 'technician' },
    'coord': { id: 'coord', name: 'Coordenação MAFFENG', avatar: 'https://i.pravatar.cc/150?u=coord', role: 'coordinator' },
    'sys': { id: 'sys', name: 'Sistema', avatar: '', role: 'system' },
    'ai': { id: 'ai', name: 'Assistente IA', avatar: '', role: 'ai' },
};

const INITIAL_ORDERS: ServiceOrder[] = [
    {
        id: 'OS-2025-001',
        code: 'OS-001',
        client: 'Agência Centro',
        address: 'Rua Principal, 100 - Centro',
        serviceType: 'Levantamento Predial',
        priority: 'Alta',
        deadline: new Date('2025-11-25T18:00'),
        status: 'em_campo',
        description: 'Levantamento completo de pintura e infraestrutura de AC.',
        unreadCount: 2,
        createdAt: new Date('2025-11-20T08:00'),
        messages: [
            { id: 'm1', senderId: 'sys', text: 'OS Iniciada: Levantamento Predial', timestamp: new Date('2025-11-20T08:00'), status: 'read', isSystemEvent: true },
            { id: 'm2', senderId: 'coord', text: 'Olá, favor priorizar a sala de máquinas.', timestamp: new Date('2025-11-20T08:05'), status: 'read' },
            { id: 'm3', senderId: 'u1', text: 'Entendido. Já estou no local.', timestamp: new Date('2025-11-20T09:00'), status: 'read' },
            { id: 'm4', senderId: 'sys', text: 'Ambiente "Recepção" selecionado.', timestamp: new Date('2025-11-20T09:05'), status: 'delivered', isSystemEvent: true },
        ]
    },
    {
        id: 'OS-2025-002',
        code: 'OS-002',
        client: 'Condomínio Solar',
        address: 'Av. das Flores, 500',
        serviceType: 'Inspeção Elétrica',
        priority: 'Normal',
        deadline: new Date('2025-11-30T10:00'),
        status: 'pendente',
        description: 'Verificação de quadros de energia do bloco B.',
        unreadCount: 1,
        createdAt: new Date('2025-11-21T10:00'),
        messages: [
            { id: 'm1', senderId: 'sys', text: 'OS Criada. Aguardando aceite.', timestamp: new Date('2025-11-21T10:00'), status: 'delivered', isSystemEvent: true },
            { id: 'm2', senderId: 'coord', text: 'Confirmar disponibilidade para terça-feira.', timestamp: new Date('2025-11-21T10:30'), status: 'delivered' }
        ]
    }
];

// --- Sub-Components ---

const Avatar = ({ url, name, size = 'md' }: { url?: string, name: string, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10', // Standard List
        lg: 'w-10 h-10', // Header
        xl: 'w-32 h-32', // Profile
    };

    const initial = name ? name.substring(0, 1).toUpperCase() : '?';

    return (
        <div className={`shrink-0 relative ${sizeClasses[size]}`}>
            {url ? (
                <img src={url} alt={name} className="w-full h-full rounded-full object-cover border border-white/10" />
            ) : (
                <div className="w-full h-full rounded-full bg-[var(--wa-primary)] flex items-center justify-center text-white font-bold">
                    {initial}
                </div>
            )}
        </div>
    );
};

const MessageStatus = ({ status }: { status: Message['status'] }) => {
    if (status === 'sent') return <Check className="w-4 h-4 text-[var(--wa-text-secondary)]" />;
    if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-[var(--wa-text-secondary)]" />;
    if (status === 'read') return <CheckCheck className="w-4 h-4 text-[#53bdeb]" />;
    return null;
};

// --- Main Component ---

const App = () => {
    const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [aiThinking, setAiThinking] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOrder = orders.find(o => o.id === selectedOrderId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [selectedOrder?.messages]);

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

        // Simulate AI response for "help" or similar keywords
        if (inputText.toLowerCase().includes('ajuda') || inputText.toLowerCase().includes('medida')) {
            setTimeout(() => handleConsultAI(), 1000);
        }
    };

    const handleConsultAI = async () => {
        if (!selectedOrder) return;
        setAiThinking(true);

        // Simulating AI thinking delay
        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now().toString(),
                senderId: 'ai',
                text: `(Simulação IA) Baseado no histórico da ${selectedOrder.code}, recomendo verificar também as instalações do quadro ${selectedOrder.code === 'OS-001' ? 'QGBT-03' : 'secundário'}.`,
                timestamp: new Date(),
                status: 'read',
            };

            setOrders(prev => prev.map(o => {
                if (o.id === selectedOrder.id) {
                    return { ...o, messages: [...o.messages, aiMsg] };
                }
                return o;
            }));
            setAiThinking(false);
        }, 1500);
    };

    // --- Views ---

    const renderSidebar = () => (
        <div className={`${selectedOrderId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[400px] h-full bg-[var(--wa-bg-sidebar)] border-r border-[var(--wa-border)] transition-colors duration-300`}>
            {/* Sidebar Header */}
            <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center justify-between shrink-0 shadow-sm border-b border-[var(--wa-border)]">
                <div className="flex items-center gap-3">
                    <Avatar name={MOCK_USERS['u1'].name} url={MOCK_USERS['u1'].avatar} size="md" />
                    <span className="font-semibold text-[var(--wa-text-primary)] hidden sm:block">Meus Levantamentos</span>
                </div>
                <div className="flex gap-5 text-[var(--wa-panel-header-icon)]">
                    <button title="Status"><div className="w-6 h-6 rounded-full border-2 border-dashed border-current opacity-60"></div></button>
                    <button title="Menu"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-[var(--wa-bg-sidebar)] p-2">
                <div className="bg-[var(--wa-header)] rounded-lg flex items-center px-4 py-1.5 gap-3 border border-[var(--wa-border)] focus-within:ring-2 focus-within:ring-[var(--wa-primary)] focus-within:border-transparent transition-all">
                    <Search className="w-4 h-4 text-[var(--wa-panel-header-icon)]" />
                    <input
                        type="text"
                        placeholder="Pesquisar OS ou endereço..."
                        className="bg-transparent border-none outline-none text-[var(--wa-text-primary)] text-sm w-full placeholder:text-[var(--wa-text-secondary)]"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {orders.map(order => {
                    const lastMsg = order.messages[order.messages.length - 1];
                    return (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`flex items-center px-3 py-3 cursor-pointer hover:bg-[var(--wa-bg-app)]/50 transition-colors group ${selectedOrderId === order.id ? 'bg-[var(--wa-header)]' : ''}`}
                        >
                            <div className="relative shrink-0">
                                <Avatar name={order.client} url="" size="lg" />
                            </div>
                            <div className="flex-1 ml-3 border-b border-[var(--wa-border)] pb-3 group-hover:border-transparent h-full flex flex-col justify-center min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-[var(--wa-text-primary)] font-medium text-[16px] truncate">{order.code} • {order.client}</h3>
                                    <span className={`text-[11px] shrink-0 ml-2 ${order.unreadCount > 0 ? 'text-[var(--wa-primary)] font-bold' : 'text-[var(--wa-text-secondary)]'}`}>
                                        {lastMsg?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[var(--wa-text-secondary)] text-[14px] truncate flex items-center gap-1.5 flex-1 mr-2">
                                        {lastMsg?.senderId === 'u1' && <MessageStatus status={lastMsg.status} />}
                                        <span className="truncate">{lastMsg?.text}</span>
                                    </p>
                                    {order.unreadCount > 0 && (
                                        <span className="bg-[var(--wa-primary)] text-white font-bold text-[10px] rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 animate-in zoom-in">
                                            {order.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderChat = () => {
        if (!selectedOrder) {
            return (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[var(--wa-bg-app)] border-b-[6px] border-[var(--wa-primary)] text-[var(--wa-text-secondary)] relative overflow-hidden">
                    <div className="absolute inset-0 wa-chat-bg opacity-30 z-0 pointer-events-none"></div>
                    <div className="z-10 text-center p-8 bg-[var(--wa-header)]/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md border border-[var(--wa-border)]">
                        <div className="w-16 h-16 bg-[var(--wa-primary)]/10 text-[var(--wa-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bot className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--wa-text-primary)] mb-3">TMS Service Chat</h1>
                        <p className="text-sm">Selecione uma ordem de serviço para iniciar o levantamento fotográfico.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className={`flex flex-col h-full w-full bg-[var(--wa-bg-app)] ${selectedOrderId ? 'flex' : 'hidden'} relative`}>
                {/* Chat Header */}
                <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center justify-between shrink-0 z-20 shadow-sm border-b border-[var(--wa-border)]">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowDetails(!showDetails)}>
                        <button className="md:hidden text-[var(--wa-panel-header-icon)] mr-1" onClick={(e) => { e.stopPropagation(); setSelectedOrderId(null); }}>
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <Avatar name={selectedOrder.client} url="" />
                        <div className="flex flex-col">
                            <span className="text-[var(--wa-text-primary)] font-semibold text-base leading-tight">{selectedOrder.client}</span>
                            <span className="text-[var(--wa-text-secondary)] text-xs truncate flex items-center gap-1">
                                {selectedOrder.address}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 sm:gap-6 text-[var(--wa-panel-header-icon)]">
                        <button
                            onClick={handleConsultAI}
                            className={`transition-all hover:bg-[var(--wa-primary)]/10 p-2 rounded-full ${aiThinking ? 'text-[var(--wa-primary)] animate-pulse' : ''}`}
                            title="Assistente IA"
                        >
                            <Bot className="w-5 h-5" />
                        </button>
                        <button className="hidden sm:block hover:bg-[var(--wa-primary)]/10 p-2 rounded-full"><Search className="w-5 h-5" /></button>
                        <button className="hover:bg-[var(--wa-primary)]/10 p-2 rounded-full"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 wa-chat-bg overflow-y-auto p-4 sm:p-9 flex flex-col relative">
                    <div className="flex justify-center mb-6 sticky top-0 z-10 pointer-events-none">
                        <span className="bg-[var(--wa-system-message)]/90 backdrop-blur-md text-[var(--wa-text-primary)] text-xs px-4 py-1.5 rounded-lg shadow-sm font-medium border border-[var(--wa-border)]">
                            {selectedOrder.createdAt?.toLocaleDateString()}
                        </span>
                    </div>

                    {selectedOrder.messages.map((msg, idx) => {
                        const isMe = msg.senderId === 'u1';
                        const isSys = msg.isSystemEvent;
                        const isAi = msg.senderId === 'ai';

                        if (isSys) {
                            return (
                                <div key={msg.id} className="flex justify-center mb-4">
                                    <span className="bg-[var(--wa-system-message)] text-[var(--wa-text-secondary)] text-xs px-4 py-2 rounded-lg text-center shadow-sm border border-[var(--wa-border)] flex items-center gap-2 max-w-[80%]">
                                        <AlertTriangle className="w-3 h-3 text-[var(--wa-primary)]" />
                                        {msg.text}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={msg.id}
                                className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'} ${idx === selectedOrder.messages.length - 1 ? 'mb-4' : ''}`}
                            >
                                <div className={`relative max-w-[85%] sm:max-w-[65%] rounded-2xl p-3 shadow-sm text-[15px] group ${isMe
                                        ? 'bg-[var(--wa-message-out)] text-[#ffffff] rounded-tr-sm' // Ocean Breeze green usually has white text
                                        : 'bg-[var(--wa-message-in)] text-[var(--wa-text-primary)] rounded-tl-sm border border-[var(--wa-border)]'
                                    }`}
                                >
                                    {isAi && <div className="text-[var(--wa-primary)] text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-wide"><Bot className="w-3 h-3" /> Assistente Inteligente</div>}
                                    {msg.senderId === 'coord' && <div className="text-[#f59e0b] text-xs font-bold mb-1 uppercase tracking-wide">Coordenação</div>}

                                    {msg.attachments?.map(att => (
                                        <div key={att.id} className="mb-2 rounded-lg overflow-hidden border border-black/10">
                                            <img src={att.url} className="w-full h-auto max-h-[300px] object-cover" />
                                        </div>
                                    ))}

                                    <div className="pr-14 whitespace-pre-wrap leading-relaxed">
                                        {msg.text}
                                    </div>

                                    <div className="absolute right-2 bottom-1.5 flex items-center gap-1 opacity-70">
                                        <span className="text-[10px] uppercase font-medium">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && <MessageStatus status={msg.status} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="min-h-[62px] bg-[var(--wa-header)] px-2 sm:px-4 py-2 flex items-end gap-2 z-20 border-t border-[var(--wa-border)]">
                    <div className="flex gap-1 pb-2 text-[var(--wa-panel-header-icon)]">
                        <button className="p-2 hover:bg-[var(--wa-bg-sidebar)] rounded-full transition-colors"><Smile className="w-6 h-6" /></button>
                        <button className="p-2 hover:bg-[var(--wa-bg-sidebar)] rounded-full transition-colors"><Paperclip className="w-6 h-6" /></button>
                    </div>

                    <div className="flex-1 bg-[var(--wa-input-bg)] rounded-2xl min-h-[42px] flex items-center px-4 py-2 border border-[var(--wa-border)] focus-within:border-[var(--wa-primary)] focus-within:ring-1 focus-within:ring-[var(--wa-primary)] transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Digite uma mensagem..."
                            className="w-full bg-transparent border-none outline-none text-[var(--wa-text-primary)] placeholder:text-[var(--wa-text-secondary)] text-[15px]"
                        />
                    </div>

                    {inputText ? (
                        <button onClick={handleSendMessage} className="pb-2 text-[var(--wa-primary)] ml-1 hover:scale-110 transition-transform">
                            <div className="w-10 h-10 bg-[var(--wa-primary)] rounded-full flex items-center justify-center text-white shadow-md">
                                <svg viewBox="0 0 24 24" width="24" height="24" className="ml-1">
                                    <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
                                </svg>
                            </div>
                        </button>
                    ) : (
                        <button className="pb-2 text-[var(--wa-panel-header-icon)] ml-1 hover:text-[var(--wa-primary)] transition-colors">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <Mic className="w-6 h-6" />
                            </div>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderDetails = () => {
        if (!selectedOrder || !showDetails) return null;

        return (
            <div className="w-[350px] bg-[var(--wa-bg-sidebar)] border-l border-[var(--wa-border)] flex flex-col h-full absolute right-0 z-30 md:static shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center gap-4 shrink-0 border-b border-[var(--wa-border)]">
                    <button onClick={() => setShowDetails(false)} className="text-[var(--wa-panel-header-icon)] hover:text-[var(--wa-text-primary)]"><X className="w-6 h-6" /></button>
                    <span className="text-[var(--wa-text-primary)] font-semibold text-lg">Dados da OS</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="bg-[var(--wa-header)] p-6 flex flex-col items-center mb-2 shadow-sm">
                        <Avatar name={selectedOrder.client} url="" size="xl" />
                        <h2 className="mt-4 text-[22px] text-[var(--wa-text-primary)] font-semibold text-center leading-tight">{selectedOrder.client}</h2>
                        <span className="text-[var(--wa-text-secondary)] text-sm mt-1">{selectedOrder.code}</span>
                    </div>

                    <div className="bg-[var(--wa-header)] p-5 mb-2 shadow-sm">
                        <h3 className="text-[var(--wa-text-secondary)] text-sm font-medium mb-3 uppercase tracking-wider">Detalhes</h3>

                        <div className="flex items-start gap-3 mb-4">
                            <MapPin className="w-5 h-5 text-[var(--wa-text-secondary)] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[var(--wa-text-primary)] text-sm">{selectedOrder.address}</p>
                                <p className="text-[var(--wa-text-secondary)] text-xs">Endereço</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mb-4">
                            <Briefcase className="w-5 h-5 text-[var(--wa-text-secondary)] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[var(--wa-text-primary)] text-sm">{selectedOrder.serviceType}</p>
                                <p className="text-[var(--wa-text-secondary)] text-xs">Tipo de Serviço</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${selectedOrder.priority === 'Urgente' || selectedOrder.priority === 'Alta' ? 'text-red-500' : 'text-[var(--wa-text-secondary)]'}`} />
                            <div>
                                <p className={`text-sm font-medium ${selectedOrder.priority === 'Urgente' || selectedOrder.priority === 'Alta' ? 'text-red-500' : 'text-[var(--wa-text-primary)]'}`}>{selectedOrder.priority}</p>
                                <p className="text-[var(--wa-text-secondary)] text-xs">Prioridade</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--wa-header)] p-5 mb-2 shadow-sm">
                        <h3 className="text-[var(--wa-text-secondary)] text-sm font-medium mb-3 uppercase tracking-wider">Descrição</h3>
                        <p className="text-[var(--wa-text-primary)] text-sm leading-relaxed">{selectedOrder.description}</p>
                    </div>

                    <div className="bg-[var(--wa-header)] p-5 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[var(--wa-text-secondary)] text-sm font-medium">Mídia e Documentos</span>
                            <span className="text-[var(--wa-text-secondary)] text-sm flex items-center hover:text-[var(--wa-primary)] cursor-pointer">Ver tudo <ChevronLeft className="w-4 h-4 rotate-180" /></span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-20 h-20 bg-[var(--wa-bg-sidebar)] rounded-lg flex items-center justify-center text-[var(--wa-text-secondary)] border border-[var(--wa-border)] cursor-pointer hover:border-[var(--wa-primary)] hover:text-[var(--wa-primary)] transition-all">
                                <Camera className="w-6 h-6" />
                            </div>
                            <div className="w-20 h-20 bg-[var(--wa-bg-sidebar)] rounded-lg flex items-center justify-center text-[var(--wa-text-secondary)] border border-[var(--wa-border)] cursor-pointer hover:border-[var(--wa-primary)] hover:text-[var(--wa-primary)] transition-all">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="px-5 pb-8 flex flex-col gap-3">
                        <button className="w-full py-3 flex items-center justify-center gap-2 text-white bg-[var(--wa-primary)] hover:opacity-90 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <CheckCheck className="w-5 h-5" />
                            <span>Concluir Levantamento</span>
                        </button>
                        <button className="w-full py-3 flex items-center justify-center gap-2 text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 rounded-xl transition-colors font-medium">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Reportar Problema</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full relative overflow-hidden bg-[var(--wa-bg-sidebar)]">
            {renderSidebar()}
            {renderChat()}
            {renderDetails()}
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
