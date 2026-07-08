Sub RemoverLegendasFotos()

Dim p As Paragraph
Dim tbl As Table
Dim cel As Cell
Dim txt As String
Dim i As Long

' 1. Limpa as legendas no corpo do documento (parágrafos normais)
For Each p In ActiveDocument.Paragraphs
    txt = Trim(Replace(p.Range.Text, vbCr, ""))
    
    If txt Like "Foto #" _
    Or txt Like "Foto ##" _
    Or txt Like "Foto ###" _
    Or txt Like "Foto ####" Then
        p.Range.Delete
    End If
Next p

' 2. Limpa as legendas que estão dentro de tabelas ("planilhas")
For Each tbl In ActiveDocument.Tables
    For Each cel In tbl.Range.Cells
        ' Varre de trás para frente para evitar problemas de índice
        For i = cel.Range.Paragraphs.Count To 1 Step -1
            Set p = cel.Range.Paragraphs(i)
            
            ' Limpa o texto para validação
            txt = p.Range.Text
            txt = Replace(txt, vbCr, "")
            txt = Replace(txt, Chr(7), "")
            txt = Trim(txt)
            
            If txt Like "Foto #" _
            Or txt Like "Foto ##" _
            Or txt Like "Foto ###" _
            Or txt Like "Foto ####" Then
                
                ' Se for o último ou único parágrafo da célula, limpamos o texto
                ' para não tentar deletar a marca de fim de célula (Chr(7))
                If i = cel.Range.Paragraphs.Count Then
                    p.Range.Text = ""
                Else
                    ' Se for um parágrafo intermediário, pode deletar normalmente
                    p.Range.Delete
                End If
                
            End If
        Next i
    Next cel
Next tbl

End Sub