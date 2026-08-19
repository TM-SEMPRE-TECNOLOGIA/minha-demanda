# -*- coding: utf-8 -*-
"""Valida caminhos dos arquivos de Previsão Orçamentária + planilha do hub."""
import os, re

caminhos = {
    "0908": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/4 - CONTRATO - SÃO PAULO - 0908 - ATUALIZADO/Modelo RAT - SP 0908 - VALOR REPACUADA.xlsx",
    "1507": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/5 - CONTRATO - CUIABA - 1507 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - CUIABA - LEVANTAMENTO PREVENTIVO - Atualizado Fevereiro 2026.xlsx",
    "1565": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/9 - CONTRATO - SAO JOSE DO RIO PRETO - 1565 - ATUALIZADO/Modelo RAT - SP 1565.xlsx",
    "2056": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/1 - CONTRATO - DIVINÓPOLIS - 2056 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - DIVINÓPOLIS - LEVANTAMENTO PREVENTIVO - REPACTUAÇÃO - Atualizado Fevereiro 2026.xlsx",
    "2057": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/2 - CONTRATO - VARGINHA - 2057 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - VARGINHA - LEVANTAMENTO PREVENTIVO - REPACTUAÇÃO - Atualizado Fevereiro 2026.xlsx",
    "2626": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/6 - CONTRATO - SALINAS - 2626 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - SALINAS - LEVANTAMENTO PREVENTIVO - Atualizado Fevereiro 2026.xlsx",
    "2627": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/7 - CONTRATO - VALADARES - 2627 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - VALADARES - LEVANTAMENTO PREVENTIVO - Atualizado Fevereiro 2026.xlsx",
    "3575": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/8 - CONTRATO - TANGARA DA SERRA - 3575 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - TANGARA DA SERRA - LEVANTAMENTO PREVENTIVO - Atualizado Fev 2026.xlsx",
    "6122": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/3 - CONTRATO - MATO GROSSO DO SUL - 6122 - ATUALIZADO/PREVISÃO ORÇAMENTÁRIA PARA APROVAÇÃO - MATO GROSSO DO SUL - LEVANTAMENTO PREVENTIVO - Atualizado Fevereiro 2026.xlsx",
    "PLANILHA": r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/02 - Documentos Preventivas/MEMORIAL DE CÁLCULO - PARA TODOS OS CONTRATOS.xlsx",
}

ok = 0
for k, p in caminhos.items():
    ex = os.path.isfile(p)
    ok += ex
    print(f"{'OK ' if ex else 'FALTA'} {k}: {p}")
print(f"\n{ok}/{len(caminhos)} arquivos encontrados")
