export interface User {
    id: string;
    name: string;
    avatar?: string;
    role: 'coordinator' | 'technician' | 'client' | 'system' | 'ai';
    isOnline?: boolean;
}

export interface Attachment {
    id: string;
    type: 'image' | 'file';
    url: string;
    name: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    attachments?: Attachment[];
    isSystemEvent?: boolean;
}

export interface ServiceOrder {
    id: string;      // e.g. OS-2025-001
    code: string;    // Display Code e.g. OS-001
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
