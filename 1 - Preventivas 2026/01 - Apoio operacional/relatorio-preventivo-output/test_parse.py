import re
import sys

def strip_bold(s):
    return re.sub(r'\*\*(.+?)\*\*', r'\1', s).strip()

def extract_code(text):
    m = re.search(r'(?:ITEM\s+)?(\d+\.\d+)', text, re.IGNORECASE)
    return m.group(1) if m else None

def parse_test(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines()]
    
    occurrences = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if 'REFERÊNCIA' in line or 'REFERNCIA' in line:
            # Encontrou o cabeçalho de uma tabela de cálculo
            # Tentar achar o título acima
            title = ""
            j = i - 1
            # Subir até achar uma linha com o código ou o topo da tabela
            while j >= 0:
                if lines[j].startswith('+') and ':' in lines[j]: # Separador de cabeçalho
                    pass
                elif lines[j].startswith('|'):
                    content = lines[j].strip('|').strip()
                    if content and not content.startswith('**REFER'):
                        title = content + " " + title
                elif lines[j] == "":
                    pass
                else:
                    break
                j -= 1
            
            title = strip_bold(title.strip())
            code = extract_code(title)
            
            if code:
                print(f"Found Code: {code} | Title: {title[:50]}...")
                # Agora pegar as linhas abaixo
                k = i + 1
                while k < len(lines):
                    if lines[k].startswith('+'):
                        if '=' in lines[k]: # Separador de cabeçalho, continuar
                            k += 1
                            continue
                        # Se for um separador simples e a próxima linha não começar com |, acabou a tabela?
                        # Não, grid tables tem +--- entre as linhas.
                        if k + 1 < len(lines) and not lines[k+1].startswith('|'):
                            break
                    elif lines[k].startswith('|'):
                        row_content = lines[k].strip('|').split('|')
                        row_content = [strip_bold(c.strip()) for c in row_content]
                        if row_content[0].startswith('Total'):
                            print(f"  Total line: {row_content}")
                            break
                        # print(f"  Data: {row_content}")
                    k += 1
                i = k
            else:
                i += 1
        else:
            i += 1

if __name__ == "__main__":
    parse_test(sys.argv[1])
