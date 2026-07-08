import React from 'react';
import { Check, CheckCheck, Bot, AlertTriangle } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
    message: Message;
    isMe: boolean;
}

const MessageStatus = ({ status }: { status: Message['status'] }) => {
    if (status === 'sent') return <Check className="w-3.5 h-3.5 text-[var(--wa-text-secondary)]" />;
    if (status === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-[var(--wa-text-secondary)]" />;
    if (status === 'read') return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
    return null;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe }) => {
    const isSys = message.isSystemEvent;
    const isAi = message.senderId === 'ai';
    const isCoord = message.senderId === 'coord';

    if (isSys) {
        return (
            <div className="flex justify-center mb-4">
                <span className="bg-[var(--wa-system-message)] text-[var(--wa-text-secondary)] text-xs px-4 py-2 rounded-lg text-center shadow-sm border border-[var(--wa-border)] flex items-center gap-2 max-w-[80%]">
                    <AlertTriangle className="w-3 h-3 text-[var(--wa-primary)]" />
                    {message.text}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] sm:max-w-[65%] rounded-2xl p-3 shadow-sm text-[15px] group ${isMe
                ? 'bg-[var(--wa-message-out)] text-[#ffffff] rounded-tr-sm'
                : 'bg-[var(--wa-message-in)] text-[var(--wa-text-primary)] rounded-tl-sm border border-[var(--wa-border)]'
                }`}
            >
                {isAi && <div className="text-[var(--wa-primary)] text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-wide"><Bot className="w-3 h-3" /> Assistente Inteligente</div>}
                {isCoord && <div className="text-[#f59e0b] text-xs font-bold mb-1 uppercase tracking-wide">Coordenação</div>}

                {message.attachments?.map(att => (
                    <div key={att.id} className="mb-2 rounded-lg overflow-hidden border border-black/10">
                        <img src={att.url} className="w-full h-auto max-h-[300px] object-cover" alt="attachment" />
                    </div>
                ))}

                <div className="pr-14 whitespace-pre-wrap leading-relaxed">
                    {message.text}
                </div>

                <div className="absolute right-2 bottom-1.5 flex items-center gap-1 opacity-70">
                    <span className="text-[10px] uppercase font-medium">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <MessageStatus status={message.status} />}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
