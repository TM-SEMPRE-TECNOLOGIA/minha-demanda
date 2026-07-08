Attribute VB_Name = "ConverterLegendasParaSEQ"
'=============================================================================
' ConverterLegendasParaSEQ
' Autor: TM Sempre Tecnologia
' Versão: 1.1
' Descrição: Macro de pós-processamento — converte "Foto N" (texto puro)
'            para legenda nativa com campo SEQ, mantendo o estilo Caption.
'
' Fluxo: Python app gera .docx com "Foto 1", "Foto 2" (estilo Caption)
'        → Usuário roda esta macro → "Foto { SEQ }" com numeração viva
'=============================================================================

Sub ConverterLegendasParaSEQ()

    Dim para As Paragraph
    Dim rng As Range
    Dim texto As String
    
    Application.ScreenUpdating = False
    
    '-----------------------------------------------------------------
    ' Varre todos os parágrafos do documento
    ' Só processa os que têm estilo "Caption"
    ' Usa NameLocal (string) em vez de comparar objetos Style
    '-----------------------------------------------------------------
    For Each para In ActiveDocument.Paragraphs
        
        If para.Style.NameLocal = "Caption" Then
            
            Set rng = para.Range
            rng.MoveEnd wdCharacter, -1          ' remove o caractere ¶
            texto = Trim(rng.Text)
            
            '----------------------------------------------------------
            ' Verifica se o texto começa com "Foto " + número
            ' Exemplo válido: "Foto 1", "Foto 42", "Foto 999"
            '----------------------------------------------------------
            If Left(texto, 5) = "Foto " And IsNumeric(Mid(texto, 6)) Then
                
                ' Ajusta o range para cobrir APENAS o número
                rng.Collapse wdCollapseStart
                rng.MoveStart wdCharacter, 5      ' pula "Foto "
                rng.End = para.Range.End - 1       ' fim sem o ¶
                
                '------------------------------------------------------
                ' Substitui o número por campo SEQ nativo do Word
                ' { SEQ Foto \* ARABIC } → numeração automática viva
                '------------------------------------------------------
                rng.Fields.Add Range:=rng, _
                    Type:=wdFieldEmpty, _
                    Text:="SEQ Foto \* ARABIC", _
                    PreserveFormatting:=True
                
            End If
        End If
    Next para
    
    Application.ScreenUpdating = True
    
    MsgBox "Concluído! Legendas convertidas para campos SEQ.", _
           vbInformation, "Converter Legendas"

End Sub
