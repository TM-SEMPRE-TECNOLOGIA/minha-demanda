'=============================================================================
' ConverterLegendasParaSEQ v2.1 — DIAGNÓSTICO
' Descrição: Encontra parágrafos "Foto N", converte para campo SEQ nativo
'=============================================================================

Sub ConverterLegendasParaSEQ()

    Dim para As Paragraph
    Dim rng As Range
    Dim texto As String
    Dim nomeEstilo As String
    Dim totalConvertidos As Long
    Dim debugMsg As String
    
    Application.ScreenUpdating = False
    totalConvertidos = 0
    debugMsg = ""
    
    ' Descobre nome do estilo Caption no seu Word
    On Error Resume Next
    nomeEstilo = ActiveDocument.Styles(wdStyleCaption).NameLocal
    If Err.Number <> 0 Then nomeEstilo = "Caption"
    On Error GoTo 0
    
    debugMsg = "Estilo Caption no seu Word: " & nomeEstilo & vbCrLf & vbCrLf
    
    For Each para In ActiveDocument.Paragraphs
        
        Set rng = para.Range
        rng.MoveEnd wdCharacter, -1
        texto = rng.Text
        debugMsg = debugMsg & Chr(34) & texto & Chr(34) & vbCrLf
        
        If UCase(Left(texto, 5)) = "FOTO " And IsNumeric(Mid(texto, 6)) Then
            
            ' Aplica estilo Caption se necessario
            If para.Style.NameLocal <> nomeEstilo Then
                para.Style = nomeEstilo
            End If
            
            ' Pega so o numero
            rng.Collapse wdCollapseStart
            rng.MoveStart wdCharacter, 5
            rng.End = para.Range.End - 1
            
            ' Remove espacos
            Do While Left(rng.Text, 1) = " "
                rng.MoveStart wdCharacter, 1
            Loop
            Do While Right(rng.Text, 1) = " "
                rng.MoveEnd wdCharacter, -1
            Loop
            
            ' Insere campo SEQ
            rng.Fields.Add Range:=rng, _
                Type:=wdFieldEmpty, _
                Text:="SEQ Foto \* ARABIC", _
                PreserveFormatting:=True
            
            totalConvertidos = totalConvertidos + 1
        End If
    Next para
    
    Application.ScreenUpdating = True
    
    ' Mostra diagnostico
    If totalConvertidos = 0 Then
        MsgBox "NENHUMA legenda convertida!" & vbCrLf & vbCrLf & _
               debugMsg & vbCrLf & _
               "Total paragrafos: " & ActiveDocument.Paragraphs.Count, _
               vbExclamation, "Diagnostico"
    Else
        MsgBox totalConvertidos & " legenda(s) convertida(s) para campo SEQ.", _
               vbInformation, "Converter Legendas"
    End If

End Sub
