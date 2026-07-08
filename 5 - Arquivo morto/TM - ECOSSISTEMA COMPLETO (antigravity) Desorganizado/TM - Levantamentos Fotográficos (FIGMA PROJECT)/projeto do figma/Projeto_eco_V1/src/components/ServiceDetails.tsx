import React from 'react';
import { X, MapPin, Briefcase, AlertTriangle, Camera, FileText, CheckCheck, ChevronLeft } from 'lucide-react';
import { ServiceOrder } from '../types';
import Avatar from './Avatar';

interface ServiceDetailsProps {
    order: ServiceOrder | null;
    show: boolean;
    onClose: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ order, show, onClose }) => {
    if (!order || !show) return null;

    return (
        <div className="w-[350px] bg-[var(--wa-bg-sidebar)] border-l border-[var(--wa-border)] flex flex-col h-full absolute right-0 z-30 md:static shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-[60px] bg-[var(--wa-header)] px-4 flex items-center gap-4 shrink-0 border-b border-[var(--wa-border)]">
                <button onClick={onClose} className="text-[var(--wa-panel-header-icon)] hover:text-[var(--wa-text-primary)] transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <span className="text-[var(--wa-text-primary)] font-semibold text-lg">Dados da OS</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Profile Card */}
                <div className="bg-[var(--wa-header)] p-6 flex flex-col items-center mb-2 shadow-sm">
                    <Avatar name={order.client} size="xl" />
                    <h2 className="mt-4 text-[22px] text-[var(--wa-text-primary)] font-semibold text-center leading-tight">{order.client}</h2>
                    <span className="text-[var(--wa-text-secondary)] text-sm mt-1">{order.code}</span>
                </div>

                {/* Info Block */}
                <div className="bg-[var(--wa-header)] p-5 mb-2 shadow-sm">
                    <h3 className="text-[var(--wa-text-secondary)] text-sm font-medium mb-3 uppercase tracking-wider">Detalhes</h3>

                    <div className="flex items-start gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-[var(--wa-text-secondary)] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[var(--wa-text-primary)] text-sm">{order.address}</p>
                            <p className="text-[var(--wa-text-secondary)] text-xs">Endereço</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                        <Briefcase className="w-5 h-5 text-[var(--wa-text-secondary)] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[var(--wa-text-primary)] text-sm">{order.serviceType}</p>
                            <p className="text-[var(--wa-text-secondary)] text-xs">Tipo de Serviço</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${['Urgente', 'Alta'].includes(order.priority) ? 'text-red-500' : 'text-[var(--wa-text-secondary)]'}`} />
                        <div>
                            <p className={`text-sm font-medium ${['Urgente', 'Alta'].includes(order.priority) ? 'text-red-500' : 'text-[var(--wa-text-primary)]'}`}>{order.priority}</p>
                            <p className="text-[var(--wa-text-secondary)] text-xs">Prioridade</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-[var(--wa-header)] p-5 mb-2 shadow-sm">
                    <h3 className="text-[var(--wa-text-secondary)] text-sm font-medium mb-3 uppercase tracking-wider">Descrição</h3>
                    <p className="text-[var(--wa-text-primary)] text-sm leading-relaxed">{order.description}</p>
                </div>

                {/* Media */}
                <div className="bg-[var(--wa-header)] p-5 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[var(--wa-text-secondary)] text-sm font-medium">Mídia e Documentos</span>
                        <span className="text-[var(--wa-text-secondary)] text-sm flex items-center hover:text-[var(--wa-primary)] cursor-pointer transition-colors">Ver tudo <ChevronLeft className="w-4 h-4 rotate-180" /></span>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-20 h-20 bg-[var(--wa-bg-sidebar)] rounded-lg flex items-center justify-center text-[var(--wa-text-secondary)] border border-[var(--wa-border)] cursor-pointer hover:border-[var(--wa-primary)] hover:text-[var(--wa-primary)] transition-all">
                            <Camera className="w-6 h-6" />
                        </button>
                        <button className="w-20 h-20 bg-[var(--wa-bg-sidebar)] rounded-lg flex items-center justify-center text-[var(--wa-text-secondary)] border border-[var(--wa-border)] cursor-pointer hover:border-[var(--wa-primary)] hover:text-[var(--wa-primary)] transition-all">
                            <FileText className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-8 flex flex-col gap-3">
                    <button className="w-full py-3 flex items-center justify-center gap-2 text-white bg-[var(--wa-primary)] hover:opacity-90 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
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
    );
};

export default ServiceDetails;
