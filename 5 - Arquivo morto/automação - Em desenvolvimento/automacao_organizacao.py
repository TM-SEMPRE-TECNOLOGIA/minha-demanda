# =================================================================================================
# SCRIPT DE AUTOMAÇÃO DE ORGANIZAÇÃO DE FOTOS - LEVANTAMENTO PREVENTIVO
# Baseado no padrão manual de organização do usuário
# =================================================================================================
#
# ESTRUTURA IDENTIFICADA:
#
# 📁 Raiz do Projeto
#  ├── - Fachada.jpg (foto única da fachada)
#  ├── - Envio portal (fotos para envio)
#  │
#  ├── 📁 - Área externa
#  │    ├── - Vista ampla (fotos gerais/panorâmicas)
#  │    ├── 1 - Pintura acrílica
#  │    │    ├── - Detalhes (antes/depois)
#  │    │    └── [arquivos renomeados por medida: "45,00 x 7,00.jpg"]
#  │    ├── 2 - Pintura automotiva
#  │    ├── 3 - Pintura esmalte em porta
#  │    ├── 4 - Película e policarbonato
#  │    ├── 5 - Grafema
#  │    ├── 6 - Pictograma
#  │    ├── 7 - Adesivo
#  │    ├── 8 - Telhado
#  │    │    ├── - Vista ampla
#  │    │    └── 8.1 - Telhas de fibrocimento
#  │    └── 9 - SPDA
#  │
#  └── 📁 - Área interna
#       ├── 1 - Autoatendimento
#       │    ├── - Vista ampla
#       │    ├── 1.1 - Pintura acrílica
#       │    ├── 1.2 - Pintura automotiva
#       │    ├── 1.3 - Pintura esmalte metal
#       │    ├── 1.4 - Piso tátil
#       │    └── 1.5 - Lâmpadas TAA
#       ├── 2 - Atendimento
#       │    ├── - Vista ampla
#       │    ├── 2.1 - Pintura acrílica
#       │    ├── 2.2 - Forro
#       │    └── 2.3 - Pintura esmalte em porta
#       ├── ... (demais ambientes)
#       └── 15 - Casa de máquina 2
#
# PADRÃO DE RENOMEAÇÃO DE ARQUIVOS:
# - Quando há medidas (ex: "Pintura da parede 7x45") -> "45,00 x 7,00.jpg" (altura x largura, vírgula decimal)
# - Quando é item específico (ex: "Grafema") -> "Grafema - 2,10 x 0,90.jpg"
# - Quando não há medida clara -> mantém nome original
#
# =================================================================================================

import os
import shutil
import re

# =================================================================================================
# CONFIGURAÇÃO - MAPEAMENTO DE AMBIENTES (Área Interna)
# =================================================================================================
# Chave: Nome que aparece no chat do WhatsApp
# Valor: Nome da pasta numerada

AMBIENTES_INTERNOS = {
    "autoatendimento": "1 - Autoatendimento",
    "atendimento": "2 - Atendimento",
    "caiex": "3 - Caiex",
    "suporte": "4 - Suporte",
    "sala de apoio operacional": "5 - Sala de apoio operacional",
    "corredor de acesso": "6 - Corredor de acesso",
    "copa": "7 - Copa",
    "sala online": "8 - Sala online",
    "banheiro pne": "9 - Banheiro PNE",
    "banheiro feminino": "10 - Banheiro feminino",
    "banheiro masculino": "11 - Banheiro masculino",
    "corredor de abastecimento": "12 - Corredor de abastecimento",
    "cofre": "13 - Cofre",
    "casa de máquina": "14 - Casa de máquina",
    "casa de máquina 2": "15 - Casa de máquina 2",
}

# =================================================================================================
# CONFIGURAÇÃO - MAPEAMENTO DE SERVIÇOS (Área Externa)
# =================================================================================================
# Chave: Palavra-chave do serviço
# Valor: Pasta de destino

SERVICOS_EXTERNOS = {
    "pintura da parede": "1 - Pintura acrílica",
    "pintura parede": "1 - Pintura acrílica",
    "pintura acrílica": "1 - Pintura acrílica",
    "pintura do letreiro": "2 - Pintura automotiva",
    "pintura do suporte": "2 - Pintura automotiva",
    "pintura do pórtico": "2 - Pintura automotiva",
    "pintura automotiva": "2 - Pintura automotiva",
    "pintura bandeira": "2 - Pintura automotiva",
    "pintura da porta": "3 - Pintura esmalte em porta",
    "pintura do portão": "3 - Pintura esmalte em porta",
    "pintura esmalte": "3 - Pintura esmalte em porta",
    "prisma": "4 - Película e policarbonato",
    "película": "4 - Película e policarbonato",
    "policarbonato": "4 - Película e policarbonato",
    "grafema": "5 - Grafema",
    "pictograma": "6 - Pictograma",
    "pitograma": "6 - Pictograma",  # typo comum no chat
    "adesivo": "7 - Adesivo",
    "facha": "7 - Adesivo",
    "telhado": "8 - Telhado",
    "telha": "8 - Telhado",
    "spda": "9 - SPDA",
    "para-raio": "9 - SPDA",
}

# =================================================================================================
# CONFIGURAÇÃO - MAPEAMENTO DE SERVIÇOS (Área Interna)
# =================================================================================================
# O número do prefixo será substituído pelo número do ambiente
# Ex: Em "1 - Autoatendimento", "X.1 - Pintura acrílica" vira "1.1 - Pintura acrílica"

SERVICOS_INTERNOS = {
    "pintura da parede": "Pintura acrílica",
    "pintura parede": "Pintura acrílica",
    "pintura acrílica": "Pintura acrílica",
    "pintura automotiva": "Pintura automotiva",
    "pintura esmalte": "Pintura esmalte metal",
    "pintura da porta": "Pintura esmalte em porta",
    "pintura porta": "Pintura esmalte em porta",
    "piso tátil": "Piso tátil",
    "lâmpada": "Lâmpadas TAA",
    "forro": "Forro",
    "torneira": "Torneira",
    "ducha": "Troca da ducha",
    "corrimão": "Pintura esmalte metal",
    "lixeira": "Pintura esmalte metal",
    "pilar": "Pintura acrílica",
    "cinta": "Pintura acrílica",
}

# =================================================================================================
# FUNÇÕES AUXILIARES
# =================================================================================================

def extrair_medidas(texto):
    """
    Extrai medidas do texto e formata no padrão brasileiro.
    Ex: "Pintura da parede 7x45" -> ("45,00", "7,00")
    Ex: "Pintura 2.10x0.90" -> ("2,10", "0,90")
    """
    # Padrões de medida: 7x45, 7.5x45, 2,10x0,90, etc
    match = re.search(r'(\d+[.,]?\d*)\s*[xX]\s*(\d+[.,]?\d*)', texto)
    if match:
        v1 = match.group(1).replace(',', '.')
        v2 = match.group(2).replace(',', '.')
        try:
            n1 = float(v1)
            n2 = float(v2)
            # Formatar com vírgula e 2 casas decimais
            return (f"{n1:.2f}".replace('.', ','), f"{n2:.2f}".replace('.', ','))
        except:
            pass
    return None

def formatar_nome_arquivo(texto, medidas=None):
    """
    Formata o nome do arquivo baseado no padrão identificado.
    """
    if medidas:
        # Padrão: "altura x largura.jpg" ou "Descrição - altura x largura.jpg"
        # Verificar se tem prefixo descritivo (grafema, letreiro, etc)
        prefixos = ["grafema", "letreiro", "suporte", "pórtico", "bandeira", "portão"]
        prefixo = None
        for p in prefixos:
            if p in texto.lower():
                prefixo = p.capitalize()
                break
        
        if prefixo:
            return f"{prefixo} - {medidas[0]} x {medidas[1]}.jpg"
        else:
            return f"{medidas[0]} x {medidas[1]}.jpg"
    
    # Sem medidas - limpar o texto
    nome = re.sub(r'[<>:"/\\|?*]', '', texto)
    return nome[:60].strip() + ".jpg"

def identificar_servico_externo(texto):
    """Identifica a pasta de serviço externa baseada no texto."""
    texto_lower = texto.lower()
    for keyword, pasta in SERVICOS_EXTERNOS.items():
        if keyword in texto_lower:
            return pasta
    return None

def identificar_servico_interno(texto, num_ambiente):
    """
    Identifica a pasta de serviço interna e retorna com o prefixo numérico correto.
    Ex: Para ambiente "1 - Autoatendimento" e serviço "Pintura acrílica" -> "1.1 - Pintura acrílica"
    """
    texto_lower = texto.lower()
    
    # Mapeamento de ordem (baseado na estrutura observada)
    ordem_servicos = {
        "Pintura acrílica": 1,
        "Pintura automotiva": 2,
        "Pintura esmalte metal": 3,
        "Pintura esmalte em porta": 3,
        "Piso tátil": 4,
        "Lâmpadas TAA": 5,
        "Forro": 2,
        "Torneira": 2,
        "Troca da ducha": 3,
    }
    
    for keyword, servico in SERVICOS_INTERNOS.items():
        if keyword in texto_lower:
            ordem = ordem_servicos.get(servico, 1)
            return f"{num_ambiente}.{ordem} - {servico}"
    
    return None

def identificar_ambiente(texto):
    """Identifica o ambiente interno baseado no texto do chat."""
    texto_lower = texto.lower().strip()
    
    for keyword, pasta in AMBIENTES_INTERNOS.items():
        if keyword in texto_lower:
            return pasta
    return None

def extrair_numero_ambiente(pasta_ambiente):
    """Extrai o número do ambiente da pasta. Ex: "1 - Autoatendimento" -> "1" """
    match = re.match(r'^(\d+)', pasta_ambiente)
    if match:
        return match.group(1)
    return "0"

# =================================================================================================
# FUNÇÃO PRINCIPAL
# =================================================================================================

def processar_levantamento(base_dir):
    """
    Processa o log do WhatsApp e organiza as fotos conforme padrão.
    """
    
    # Encontrar arquivo de log
    log_files = [f for f in os.listdir(base_dir) if f.startswith("Conversa do WhatsApp") and f.endswith(".txt")]
    
    if not log_files:
        print("❌ ERRO: Arquivo de log do WhatsApp não encontrado na pasta.")
        return
    
    log_path = os.path.join(base_dir, log_files[0])
    print(f"📄 Lendo log: {log_files[0]}")
    
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Estado atual
    area_atual = None  # "externa" ou "interna"
    ambiente_atual = None  # Para área interna
    pasta_ambiente_atual = None
    fotos_pendentes = []
    
    # Criar estrutura base
    area_externa = os.path.join(base_dir, "- Área externa")
    area_interna = os.path.join(base_dir, "- Área interna")
    
    os.makedirs(area_externa, exist_ok=True)
    os.makedirs(area_interna, exist_ok=True)
    
    print("\n🔄 Processando mensagens...\n")
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Remover timestamp e nome do remetente
        # Formato: "24/12/2025 08:44 - Antonio LEV PREV: texto"
        match = re.match(r'^\d+/\d+/\d+ \d+:\d+ - [^:]+: (.*)$', line)
        if match:
            conteudo = match.group(1)
        else:
            conteudo = line
        
        conteudo_limpo = conteudo.replace("‎", "").strip()
        
        # Ignorar mensagens de sistema
        if any(x in line for x in ["mudou o nome do grupo", "adicionou você", "criou o grupo", "fixou uma mensagem"]):
            continue
        
        # Detectar mudança de área
        if "fachada" in conteudo_limpo.lower() and not fotos_pendentes:
            area_atual = "externa"
            continue
        
        if "área externa" in conteudo_limpo.lower() or "area externa" in conteudo_limpo.lower():
            area_atual = "externa"
            ambiente_atual = None
            print("📍 Área: EXTERNA")
            continue
        
        # Detectar ambiente interno (muda para área interna automaticamente)
        ambiente_detectado = identificar_ambiente(conteudo_limpo)
        if ambiente_detectado and "(arquivo anexado)" not in conteudo_limpo:
            area_atual = "interna"
            ambiente_atual = ambiente_detectado
            pasta_ambiente_atual = os.path.join(area_interna, ambiente_atual)
            os.makedirs(pasta_ambiente_atual, exist_ok=True)
            print(f"📍 Ambiente: {ambiente_atual}")
            continue
        
        # Detectar foto
        foto_match = re.search(r'(IMG-\d+-WA\d+\.jpg)', conteudo)
        if foto_match:
            foto = foto_match.group(1)
            fotos_pendentes.append(foto)
            continue
        
        # Se temos fotos pendentes e uma linha de texto (descrição do serviço)
        if fotos_pendentes and len(conteudo_limpo) > 2:
            # Ignorar respostas curtas
            if conteudo_limpo.lower() in ["ok", "vdd", "sim", "não", "aqui", "."]:
                continue
            
            # Ignorar mensagens que parecem chat
            if "@" in conteudo_limpo or "?" in conteudo_limpo:
                continue
            
            descricao = conteudo_limpo
            medidas = extrair_medidas(descricao)
            
            # Determinar destino
            if area_atual == "externa" or ambiente_atual is None:
                # Área externa: organizar por tipo de serviço
                servico = identificar_servico_externo(descricao)
                if servico:
                    destino = os.path.join(area_externa, servico)
                else:
                    destino = os.path.join(area_externa, "- Vista ampla")
            else:
                # Área interna: organizar por ambiente > serviço
                num_amb = extrair_numero_ambiente(ambiente_atual)
                servico = identificar_servico_interno(descricao, num_amb)
                if servico:
                    destino = os.path.join(pasta_ambiente_atual, servico)
                else:
                    destino = os.path.join(pasta_ambiente_atual, "- Vista ampla")
            
            os.makedirs(destino, exist_ok=True)
            
            # Mover e renomear fotos
            for i, foto in enumerate(fotos_pendentes):
                origem = os.path.join(base_dir, foto)
                
                if os.path.exists(origem):
                    # Gerar nome do arquivo
                    nome_base = formatar_nome_arquivo(descricao, medidas)
                    
                    # Se múltiplas fotos, adicionar sufixo
                    if len(fotos_pendentes) > 1:
                        nome, ext = os.path.splitext(nome_base)
                        nome_final = f"{nome} ({i+1}){ext}"
                    else:
                        nome_final = nome_base
                    
                    # Verificar duplicidade
                    destino_final = os.path.join(destino, nome_final)
                    contador = 1
                    while os.path.exists(destino_final):
                        nome, ext = os.path.splitext(nome_final)
                        destino_final = os.path.join(destino, f"{nome}_{contador}{ext}")
                        contador += 1
                    
                    try:
                        shutil.move(origem, destino_final)
                        print(f"  ✓ {foto} → {os.path.relpath(destino_final, base_dir)}")
                    except Exception as e:
                        print(f"  ✗ Erro ao mover {foto}: {e}")
                else:
                    print(f"  ⚠ Arquivo não encontrado: {foto}")
            
            fotos_pendentes = []
    
    # Fotos restantes sem descrição -> Vista ampla do contexto atual
    if fotos_pendentes:
        if area_atual == "externa" or ambiente_atual is None:
            destino = os.path.join(area_externa, "- Vista ampla")
        else:
            destino = os.path.join(pasta_ambiente_atual, "- Vista ampla")
        
        os.makedirs(destino, exist_ok=True)
        
        for foto in fotos_pendentes:
            origem = os.path.join(base_dir, foto)
            if os.path.exists(origem):
                try:
                    shutil.move(origem, os.path.join(destino, foto))
                    print(f"  ✓ {foto} → Vista ampla")
                except Exception as e:
                    print(f"  ✗ Erro: {e}")
    
    print("\n✅ Organização concluída!")

# =================================================================================================
# EXECUÇÃO
# =================================================================================================

if __name__ == "__main__":
    # Executar na pasta atual
    base_dir = os.getcwd()
    print(f"\n📂 Pasta de trabalho: {base_dir}\n")
    processar_levantamento(base_dir)
