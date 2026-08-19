'=============================================================================
' InserirLegendasCompletas v1.0
' Descrição: 1) Insere "Foto N" abaixo das imagens (rápido, texto puro)
'            2) Converte para campo SEQ nativo do Word (estilo Caption)
'=============================================================================

Sub InserirLegendasCompletas()

    Dim i As Long
    Dim totalPics As Long
    Dim rng As Range
    Dim para As Paragraph
    Dim texto As String
    Dim nomeEstilo As String
    
    Application.ScreenUpdating = False
    
    '=====================================================================
    ' PASSO 1 — Inserir "Foto N" abaixo de cada imagem
    '           (loop reverso: penultima → 2a)
    '=====================================================================
    
    totalPics = ActiveDocument.InlineShapes.Count
    
    For i = totalPics - 1 To 2 Step -1
        
        Set rng = ActiveDocument.InlineShapes(i).Range
        rng.Collapse wdCollapseEnd
        rng.InsertAfter vbCrLf & "Foto " & (i - 1)
        
    Next i
    
    '=====================================================================
    ' PASSO 2 — Converter "Foto N" para campo SEQ com estilo Caption
    '=====================================================================
    
    ' Descobre nome do estilo Caption (PT-BR = "Legenda", EN = "Caption")
    On Error Resume Next
    nomeEstilo = ActiveDocument.Styles(wdStyleCaption).NameLocal
    If Err.Number <> 0 Then nomeEstilo = "Caption"
    On Error GoTo 0
    
    For Each para In ActiveDocument.Paragraphs
        
        Set rng = para.Range
        rng.MoveEnd wdCharacter, -1
        texto = rng.Text
        
        If UCase(Left(texto, 5)) = "FOTO " And IsNumeric(Mid(texto, 6)) Then
            
            ' Aplica estilo Caption
            If para.Style.NameLocal <> nomeEstilo Then
                para.Style = nomeEstilo
            End If
            
            ' Isola o numero
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
            
            ' Substitui numero por campo SEQ
            rng.Fields.Add Range:=rng, _
                Type:=wdFieldEmpty, _
                Text:="SEQ Foto \* ARABIC", _
                PreserveFormatting:=True
        End If
    Next para
    
    Application.ScreenUpdating = True
    
    MsgBox "Concluido!" & vbCrLf & _
           totalPics - 2 & " imagem(ns) legendadas com campo SEQ nativo.", _
           vbInformation, "Inserir Legendas Completas"

End Sub
