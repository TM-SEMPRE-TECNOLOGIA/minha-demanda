import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Bot, ChevronLeft } from 'lucide-react';
import { ServiceOrder, Message, User } from './types';
import { INITIAL_ORDERS, MOCK_USERS } from './data/mock';
import './styles/ocean-breeze.css';

// Components
import Avatar from './components/Avatar';
import SidebarItem from './components/SidebarItem';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ServiceDetails from './components/ServiceDetails';

const App = () => {
    const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [aiThinking, setAiThinking] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;
    const currentUser: User = MOCK_USERS['u1'];

    // Scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedOrder?.messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedOrder) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUser.id,
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

        // Simulate AI or System Response
        if (inputText.toLowerCase().includes('ajuda') || inputText.toLowerCase().includes('medida')) {
            setTimeout(() => handleConsultAI(selectedOrder.id), 1000);
        }
    };

    const handleConsultAI = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        setAiThinking(true);

        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now().toString(),
                senderId: 'ai',
                text: `(Simulação IA) Baseado no histórico da ${order.code}, recomendo verificar também as instalações do quadro ${order.code === 'OS-001' ? 'QGBT-03' : 'secundário'}.`,
                timestamp: new Date(),
                status: 'read',
            };

            setOrders(prev => prev.map(o => {
                if (o.id === orderId) {
                    return { ...o, messages: [...o.messages, aiMsg] };
                }
                return o;
            }));
            setAiThinking(false);
        }, 1500);
    };

    return (
        <div className="flex h-screen w-full relative overflow-hidden bg-[var(--wa-bg-sidebar)] text-[var(--TM-foreground)]">

            {/* Sidebar (List) */}
            <div className={`${selectedOrderId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[400px] h-full bg-[var(--wa-bg-sidebar)] border-r border-[var(--wa-border)] transition-all duration-300`}>

                {/* Header */}
                <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center justify-between shrink-0 shadow-sm border-b border-[var(--wa-border)]">
                    <div className="flex items-center gap-3">
                        <Avatar name={currentUser.name} url={currentUser.avatar} size="md" />
                        <span className="font-semibold text-[var(--wa-text-primary)] hidden sm:block">Meus Levantamentos</span>
                    </div>
                    <div className="flex gap-4 text-[var(--wa-panel-header-icon)]">
                        <button title="Status" className="hover:bg-black/5 p-1 rounded-full"><div className="w-5 h-5 rounded-full border-2 border-dashed border-current opacity-60"></div></button>
                        <button title="Menu" className="hover:bg-black/5 p-1 rounded-full"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-[var(--wa-bg-sidebar)] p-2 border-b border-[var(--wa-border)]">
                    <div className="bg-[var(--wa-header)] rounded-lg flex items-center px-4 py-1.5 gap-3 border border-[var(--wa-border)] focus-within:ring-2 focus-within:ring-[var(--TM-ring)] transition-all">
                        <Search className="w-4 h-4 text-[var(--wa-panel-header-icon)]" />
                        <input
                            type="text"
                            placeholder="Pesquisar OS ou endereço..."
                            className="bg-transparent border-none outline-none text-[var(--wa-text-primary)] text-sm w-full placeholder:text-[var(--wa-text-secondary)]"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {orders.map(order => (
                        <SidebarItem
                            key={order.id}
                            order={order}
                            isActive={selectedOrderId === order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex flex-col h-full flex-1 bg-[var(--wa-bg-app)] ${selectedOrderId ? 'flex' : 'hidden md:flex'} relative`}>
                {selectedOrder ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center justify-between shrink-0 z-20 shadow-sm border-b border-[var(--wa-border)]">
                            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowDetails(!showDetails)}>
                                <button className="md:hidden text-[var(--wa-panel-header-icon)] mr-1" onClick={(e) => { e.stopPropagation(); setSelectedOrderId(null); }}>
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <Avatar name={selectedOrder.client} size="md" />
                                <div className="flex flex-col">
                                    <span className="text-[var(--wa-text-primary)] font-semibold text-base leading-tight">{selectedOrder.client}</span>
                                    <span className="text-[var(--wa-text-secondary)] text-xs truncate flex items-center gap-1">
                                        {selectedOrder.address}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 sm:gap-6 text-[var(--wa-panel-header-icon)]">
                                <button
                                    onClick={() => handleConsultAI(selectedOrder.id)}
                                    className={`transition-all hover:bg-[var(--TM-primary)]/10 p-2 rounded-full ${aiThinking ? 'text-[var(--TM-primary)] animate-pulse' : ''}`}
                                    title="Assistente IA"
                                >
                                    <Bot className="w-5 h-5" />
                                </button>
                                <button className="hidden sm:block hover:bg-black/5 p-2 rounded-full"><Search className="w-5 h-5" /></button>
                                <button className="hover:bg-black/5 p-2 rounded-full"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 wa-chat-bg overflow-y-auto p-4 sm:p-9 flex flex-col relative custom-scrollbar">
                            <div className="flex justify-center mb-6 sticky top-0 z-10 pointer-events-none">
                                <span className="bg-[var(--wa-system-message)]/90 backdrop-blur-md text-[var(--wa-text-primary)] text-xs px-4 py-1.5 rounded-lg shadow-sm font-medium border border-[var(--wa-border)]">
                                    {selectedOrder.createdAt?.toLocaleDateString()}
                                </span>
                            </div>

                            {selectedOrder.messages.map((msg, idx) => (
                                <ChatMessage key={msg.id} message={msg} isMe={msg.senderId === currentUser.id} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <ChatInput value={inputText} onChange={setInputText} onSend={handleSendMessage} />
                    </>
                ) : (
                    /* Empty State */
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[var(--wa-bg-app)] border-b-[6px] border-[var(--TM-primary)] text-[var(--wa-text-secondary)] relative overflow-hidden">
                        <div className="absolute inset-0 wa-chat-bg opacity-30 z-0 pointer-events-none"></div>
                        <div className="z-10 text-center p-8 bg-[var(--wa-header)]/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md border border-[var(--wa-border)]">
                            <div className="w-16 h-16 bg-[var(--TM-primary)]/10 text-[var(--TM-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bot className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-[var(--wa-text-primary)] mb-3">TMS Service Chat</h1>
                            <p className="text-sm">Selecione uma ordem de serviço para iniciar o levantamento fotográfico.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Panel */}
            <ServiceDetails
                order={selectedOrder}
                show={showDetails}
                onClose={() => setShowDetails(false)}
            />
        </div>
    );
};

export default App;
