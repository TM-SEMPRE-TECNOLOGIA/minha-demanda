import { CheckCircle2, Home, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { WorkOrder } from '../App';

interface SuccessScreenProps {
  workOrder: WorkOrder | null;
  onBackToDashboard: () => void;
}

export function SuccessScreen({ workOrder, onBackToDashboard }: SuccessScreenProps) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: 'var(--tms-gradient-login)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
            style={{
              backgroundColor: 'rgba(100, 255, 218, 0.1)',
              border: '3px solid var(--tms-neon-green)',
              boxShadow: '0 0 40px rgba(100, 255, 218, 0.3)',
            }}
          >
            <CheckCircle2 size={64} style={{ color: 'var(--tms-neon-green)' }} />
          </div>

          <h1 className="text-3xl mb-3 font-heading" style={{ color: 'var(--tms-neon-green)', fontWeight: 700 }}>
            Levantamento Enviado!
          </h1>
          <p className="text-lg font-body" style={{ color: 'var(--tms-text-primary)' }}>
            Dados enviados com sucesso
          </p>
        </div>

        {/* Details Card */}
        <div
          className="p-6 rounded-xl mb-6"
          style={{
            backgroundColor: 'var(--tms-card-bg)',
            border: '1px solid var(--tms-card-border)',
          }}
        >
          <div className="space-y-4">
            {/* OS Number */}
            <div className="text-center pb-4" style={{ borderBottom: '1px solid var(--tms-navy-light)' }}>
              <div className="text-sm mb-2 font-body" style={{ color: 'var(--tms-text-secondary)' }}>
                Ordem de Serviço
              </div>
              <div
                className="inline-block px-6 py-3 rounded-lg text-xl font-mono"
                style={{
                  backgroundColor: 'var(--tms-navy-deep)',
                  border: '2px solid var(--tms-neon-green)',
                  color: 'var(--tms-neon-green)',
                  letterSpacing: '0.05em',
                }}
              >
                {workOrder?.number}
              </div>
            </div>

            {/* Timestamp */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--tms-navy-light)' }}
                >
                  <Calendar size={20} style={{ color: 'var(--tms-cyan-vibrant)' }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm" style={{ color: 'var(--tms-text-secondary)' }}>
                    Data de Envio
                  </div>
                  <div style={{ color: 'var(--tms-text-primary)' }}>{currentDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--tms-navy-light)' }}
                >
                  <Clock size={20} style={{ color: 'var(--tms-cyan-vibrant)' }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm" style={{ color: 'var(--tms-text-secondary)' }}>
                    Horário de Envio
                  </div>
                  <div style={{ color: 'var(--tms-text-primary)' }}>{currentTime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div
          className="p-4 rounded-lg mb-8 text-center"
          style={{
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid var(--tms-cyan-vibrant)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--tms-text-primary)' }}>
            O pacote de dados (fotos + JSON + metadados) foi enviado ao Gerenciador e está sendo processado.
          </p>
        </div>

        {/* Success Checkmarks */}
        <div
          className="p-5 rounded-xl mb-8"
          style={{
            backgroundColor: 'var(--tms-card-bg)',
            border: '1px solid var(--tms-card-border)',
          }}
        >
          <div className="space-y-3">
            {[
              'Fotos capturadas e compactadas',
              'Dados validados',
              'JSON gerado',
              'Metadados anexados',
              'Pacote enviado ao servidor',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--tms-neon-green)' }}
                >
                  <CheckCircle2 size={16} style={{ color: 'var(--tms-navy-deep)' }} />
                </div>
                <span style={{ color: 'var(--tms-text-primary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onBackToDashboard}
          className="w-full h-14 rounded-lg text-lg flex items-center justify-center gap-2 transition-all"
          style={{
            backgroundColor: 'var(--tms-neon-green)',
            color: 'var(--tms-navy-deep)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Home size={20} />
          Voltar ao Dashboard
        </Button>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: 'var(--tms-text-secondary)' }}>
            TMS - Sistema MAFFENG © 2025
          </p>
        </div>
      </div>
    </div>
  );
}