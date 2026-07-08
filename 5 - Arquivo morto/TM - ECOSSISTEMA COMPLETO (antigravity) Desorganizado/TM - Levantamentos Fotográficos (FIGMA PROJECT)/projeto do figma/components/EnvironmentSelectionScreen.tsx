import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface EnvironmentSelectionScreenProps {
  onBack: () => void;
  selectedEnvironments: string[];
  customEnvironments: string[];
  environmentData: {
    [key: string]: {
      widePhoto?: string;
      servicePhotos: Array<{ photo: string; description: string }>;
      observations: string;
      measurements: string;
      detailPhoto?: string;
      completed?: boolean;
    };
  };
  onUpdateEnvironments: (environments: string[]) => void;
  onUpdateCustomEnvironments: (environments: string[]) => void;
  onSelectEnvironment: (environment: string) => void;
  onFinish: () => void;
  allCompleted: boolean;
}

const availableEnvironments = [
  'Sala de Autoatendimento',
  'Recepção',
  'Copa',
  'Gerência',
  'Área de Operações',
  'Cofre',
  'Banheiros',
  'Estacionamento',
  'Área Externa',
  'Sala de Reuniões',
];

export function EnvironmentSelectionScreen({
  onBack,
  selectedEnvironments,
  customEnvironments,
  environmentData,
  onUpdateEnvironments,
  onUpdateCustomEnvironments,
  onSelectEnvironment,
  onFinish,
  allCompleted,
}: EnvironmentSelectionScreenProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEnvironmentName, setNewEnvironmentName] = useState('');

  const allEnvironments = [...selectedEnvironments, ...customEnvironments];

  const toggleEnvironment = (environment: string) => {
    if (selectedEnvironments.includes(environment)) {
      onUpdateEnvironments(selectedEnvironments.filter((e) => e !== environment));
    } else {
      onUpdateEnvironments([...selectedEnvironments, environment]);
    }
  };

  const handleAddCustomEnvironment = () => {
    if (newEnvironmentName.trim()) {
      onUpdateCustomEnvironments([...customEnvironments, newEnvironmentName.trim()]);
      setNewEnvironmentName('');
      setShowAddDialog(false);
    }
  };

  const isSelected = (environment: string) => 
    selectedEnvironments.includes(environment) || customEnvironments.includes(environment);

  const isCompleted = (environment: string) => 
    environmentData[environment]?.completed || false;

  const handleEnvironmentClick = (environment: string) => {
    if (!isSelected(environment)) {
      // Se não está selecionado, seleciona e vai para captura
      if (availableEnvironments.includes(environment)) {
        onUpdateEnvironments([...selectedEnvironments, environment]);
      }
    }
    // Vai para a tela de captura
    onSelectEnvironment(environment);
  };

  const removeCustomEnvironment = (environment: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCustom = customEnvironments.filter((env) => env !== environment);
    onUpdateCustomEnvironments(updatedCustom);
  };

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: 'var(--tms-navy-deep)' }}>
      {/* Header */}
      <div
        className="px-6 py-6 sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--tms-navy-medium)',
          borderBottom: '1px solid var(--tms-border-subtle)',
        }}
      >
        <button onClick={onBack} className="flex items-center gap-2 mb-4" style={{ color: 'var(--tms-text-secondary)' }}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1 className="text-2xl mb-1 font-heading" style={{ color: 'var(--tms-text-primary)', fontWeight: 600 }}>
          Seleção de Ambientes
        </h1>
        <p className="font-body" style={{ color: 'var(--tms-text-secondary)' }}>
          Clique em um ambiente para iniciar a captura
        </p>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="px-3 py-1 rounded text-sm font-mono"
            style={{
              backgroundColor: 'var(--tms-cyan-vibrant)',
              color: 'var(--tms-navy-deep)',
              letterSpacing: '0.02em',
            }}
          >
            Passo 2 de 4
          </div>
          <div className="flex-1 h-1 rounded" style={{ backgroundColor: 'var(--tms-navy-light)' }}>
            <div
              className="h-full rounded transition-all"
              style={{
                backgroundColor: 'var(--tms-cyan-vibrant)',
                width: '50%',
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Status Count */}
      <div className="px-6 pt-6 pb-4">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--tms-card-bg)',
            border: '1px solid var(--tms-card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-body" style={{ color: 'var(--tms-text-secondary)' }}>Ambientes Selecionados: </span>
              <span className="font-mono" style={{ color: 'var(--tms-text-primary)', letterSpacing: '0.02em' }}>
                {allEnvironments.length}
              </span>
            </div>
            <div>
              <span className="font-body" style={{ color: 'var(--tms-text-secondary)' }}>Concluídos: </span>
              <span className="font-mono" style={{ color: 'var(--tms-neon-green)', letterSpacing: '0.02em' }}>
                {allEnvironments.filter(isCompleted).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Cards */}
      <div className="px-6 pb-6 space-y-6">
        {/* Predefined Environments */}
        <div>
          <h3 className="mb-3 font-heading" style={{ color: 'var(--tms-text-primary)', fontWeight: 600 }}>
            Ambientes Padrão
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {availableEnvironments.map((environment) => {
              const selected = isSelected(environment);
              const completed = isCompleted(environment);
              return (
                <div
                  key={environment}
                  onClick={() => handleEnvironmentClick(environment)}
                  className="p-5 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: selected
                      ? completed
                        ? 'rgba(100, 255, 218, 0.15)'
                        : 'rgba(100, 255, 218, 0.1)'
                      : 'var(--tms-card-bg)',
                    border: `2px solid ${selected ? (completed ? 'var(--tms-neon-green)' : 'var(--tms-cyan-vibrant)') : 'var(--tms-border-subtle)'}`,
                    boxShadow: selected ? '0 0 15px rgba(100, 255, 218, 0.2)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    if (!selected) {
                      e.currentTarget.style.borderColor = 'var(--tms-neon-green)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (!selected) {
                      e.currentTarget.style.borderColor = 'var(--tms-border-subtle)';
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span
                        className="text-lg font-body"
                        style={{ color: selected ? (completed ? 'var(--tms-neon-green)' : 'var(--tms-cyan-vibrant)') : 'var(--tms-text-primary)' }}
                      >
                        {environment}
                      </span>
                      {selected && (
                        <div className="mt-1">
                          <span className="text-sm font-body" style={{ color: 'var(--tms-text-secondary)' }}>
                            {completed ? 'Concluído ✓' : 'Em andamento...'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: completed ? 'var(--tms-neon-green)' : selected ? 'var(--tms-cyan-vibrant)' : 'transparent',
                        border: `2px solid ${completed ? 'var(--tms-neon-green)' : selected ? 'var(--tms-cyan-vibrant)' : 'var(--tms-text-secondary)'}`,
                      }}
                    >
                      {completed && <Check size={18} style={{ color: 'var(--tms-navy-deep)' }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Environments */}
        {customEnvironments.length > 0 && (
          <div>
            <h3 className="mb-3 font-heading" style={{ color: 'var(--tms-text-primary)', fontWeight: 600 }}>
              Ambientes Personalizados
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {customEnvironments.map((environment) => {
                const completed = isCompleted(environment);
                return (
                  <div
                    key={environment}
                    onClick={() => onSelectEnvironment(environment)}
                    className="p-5 rounded-xl cursor-pointer transition-all duration-200 group"
                    style={{
                      backgroundColor: completed ? 'rgba(100, 255, 218, 0.15)' : 'rgba(0, 212, 255, 0.1)',
                      border: `2px solid ${completed ? 'var(--tms-neon-green)' : 'var(--tms-cyan-vibrant)'}`,
                      boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span
                          className="text-lg font-body"
                          style={{ color: completed ? 'var(--tms-neon-green)' : 'var(--tms-cyan-vibrant)' }}
                        >
                          {environment}
                        </span>
                        <div className="mt-1">
                          <span className="text-sm font-body" style={{ color: 'var(--tms-text-secondary)' }}>
                            {completed ? 'Concluído ✓' : 'Em andamento...'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!completed && (
                          <button
                            onClick={(e) => removeCustomEnvironment(environment, e)}
                            className="p-2 rounded transition-all opacity-0 group-hover:opacity-100"
                            style={{
                              backgroundColor: 'rgba(255, 100, 100, 0.1)',
                              color: 'var(--tms-error)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 100, 100, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 100, 100, 0.1)';
                            }}
                          >
                            <X size={18} />
                          </button>
                        )}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: completed ? 'var(--tms-neon-green)' : 'var(--tms-cyan-vibrant)',
                            border: `2px solid ${completed ? 'var(--tms-neon-green)' : 'var(--tms-cyan-vibrant)'}`,
                          }}
                        >
                          {completed && <Check size={18} style={{ color: 'var(--tms-navy-deep)' }} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Custom Environment Card */}
        <div
          onClick={() => setShowAddDialog(true)}
          className="p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed"
          style={{
            backgroundColor: 'rgba(0, 212, 255, 0.05)',
            borderColor: 'var(--tms-cyan-vibrant)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <Plus size={24} style={{ color: 'var(--tms-cyan-vibrant)' }} />
            <span className="text-lg font-heading" style={{ color: 'var(--tms-cyan-vibrant)', fontWeight: 600 }}>
              Adicionar Ambiente Personalizado
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-6"
        style={{
          backgroundColor: 'var(--tms-navy-medium)',
          borderTop: '1px solid var(--tms-border-subtle)',
        }}
      >
        <Button
          onClick={onFinish}
          disabled={!allCompleted}
          className="w-full h-14 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor: allCompleted ? 'var(--tms-neon-green)' : 'var(--tms-navy-light)',
            color: allCompleted ? 'var(--tms-navy-deep)' : 'var(--tms-text-secondary)',
            cursor: allCompleted ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (allCompleted) {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Finalizar e Revisar
          <ArrowRight size={20} />
        </Button>
      </div>

      {/* Add Custom Environment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="max-w-md"
          style={{
            backgroundColor: 'var(--tms-navy-medium)',
            border: '2px solid var(--tms-neon-green)',
            boxShadow: '0 0 30px rgba(100, 255, 218, 0.3)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-heading" style={{ color: 'var(--tms-text-primary)', fontWeight: 600 }}>
              Adicionar Ambiente Personalizado
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="environment-name" className="font-body" style={{ color: 'var(--tms-text-primary)' }}>
              Nome do Ambiente
            </Label>
            <Input
              id="environment-name"
              value={newEnvironmentName}
              onChange={(e) => setNewEnvironmentName(e.target.value)}
              placeholder="Ex: Sala de Treinamento"
              className="mt-2 h-12 border-2 rounded-lg font-body"
              style={{
                backgroundColor: 'var(--tms-input-bg)',
                borderColor: 'var(--tms-input-border)',
                color: 'var(--tms-text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--tms-neon-green)';
                e.target.style.boxShadow = '0 0 0 3px rgba(100, 255, 218, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--tms-input-border)';
                e.target.style.boxShadow = 'none';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomEnvironment();
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setShowAddDialog(false)}
              className="px-6 h-12 rounded-lg font-body"
              style={{
                backgroundColor: 'var(--tms-navy-light)',
                color: 'var(--tms-text-secondary)',
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddCustomEnvironment}
              disabled={!newEnvironmentName.trim()}
              className="px-6 h-12 rounded-lg font-body"
              style={{
                backgroundColor: newEnvironmentName.trim() ? 'var(--tms-neon-green)' : 'var(--tms-navy-light)',
                color: newEnvironmentName.trim() ? 'var(--tms-navy-deep)' : 'var(--tms-text-secondary)',
              }}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}