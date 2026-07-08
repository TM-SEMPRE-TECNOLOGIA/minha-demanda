import { ServiceOrder, User } from '../types';

export const MOCK_USERS: Record<string, User> = {
    'u1': { id: 'u1', name: 'Técnico(a) Campo', avatar: 'https://i.pravatar.cc/150?u=u1', role: 'technician' },
    'coord': { id: 'coord', name: 'Coordenação MAFFENG', avatar: 'https://i.pravatar.cc/150?u=coord', role: 'coordinator' },
    'sys': { id: 'sys', name: 'Sistema', role: 'system' },
    'ai': { id: 'ai', name: 'Assistente IA', role: 'ai' },
};

export const INITIAL_ORDERS: ServiceOrder[] = [
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
