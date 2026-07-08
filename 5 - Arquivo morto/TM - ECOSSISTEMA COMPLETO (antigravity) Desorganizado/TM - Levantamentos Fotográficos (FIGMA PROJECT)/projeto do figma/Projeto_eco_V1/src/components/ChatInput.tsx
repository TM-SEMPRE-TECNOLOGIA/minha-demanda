import React, { useRef } from 'react';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onSend();
    };

    return (
        <div className="min-h-[62px] bg-[var(--wa-header)] px-2 sm:px-4 py-2 flex items-end gap-2 z-20 border-t border-[var(--wa-border)]">
            <div className="flex gap-1 pb-2 text-[var(--wa-panel-header-icon)]">
                <button className="p-2 hover:bg-[var(--wa-bg-sidebar)] rounded-full transition-colors"><Smile className="w-6 h-6" /></button>
                <button className="p-2 hover:bg-[var(--wa-bg-sidebar)] rounded-full transition-colors"><Paperclip className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 bg-[var(--wa-input-bg)] rounded-2xl min-h-[42px] flex items-center px-4 py-2 border border-[var(--wa-border)] focus-within:border-[var(--wa-primary)] focus-within:ring-1 focus-within:ring-[var(--TM-ring)] transition-all shadow-sm">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite uma mensagem..."
                    className="w-full bg-transparent border-none outline-none text-[var(--wa-text-primary)] placeholder:text-[var(--wa-text-secondary)] text-[15px]"
                />
            </div>

            {value ? (
                <button onClick={onSend} className="pb-2 text-[var(--wa-primary)] ml-1 hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-[var(--wa-primary)] rounded-full flex items-center justify-center text-white shadow-md">
                        <Send className="w-5 h-5 ml-0.5" />
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
    );
};

export default ChatInput;
