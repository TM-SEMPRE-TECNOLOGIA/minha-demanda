import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { ServiceOrder } from '../types';
import Avatar from './Avatar';

interface SidebarItemProps {
    order: ServiceOrder;
    isActive: boolean;
    onClick: () => void;
}

const MessageStatus = ({ status }: { status: ServiceOrder['messages'][0]['status'] }) => {
    if (status === 'sent') return <Check className="w-4 h-4 text-[var(--wa-text-secondary)]" />;
    if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-[var(--wa-text-secondary)]" />;
    if (status === 'read') return <CheckCheck className="w-4 h-4 text-[#53bdeb]" />;
    return null;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ order, isActive, onClick }) => {
    const lastMsg = order.messages[order.messages.length - 1];

    return (
        <div
            onClick={onClick}
            className={`flex items-center px-3 py-3 cursor-pointer hover:bg-[var(--wa-bg-app)]/50 transition-colors group ${isActive ? 'bg-[var(--wa-header)] border-l-4 border-l-[var(--wa-primary)]' : 'border-l-4 border-l-transparent'}`}
        >
            <div className="relative shrink-0">
                <Avatar name={order.client} size="lg" />
            </div>
            <div className="flex-1 ml-3 border-b border-[var(--wa-border)] pb-3 group-hover:border-transparent h-full flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-medium text-[16px] truncate ${isActive ? 'text-[var(--wa-text-primary)] font-bold' : 'text-[var(--wa-text-primary)]'}`}>
                        {order.code} • {order.client}
                    </h3>
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
};

export default SidebarItem;
