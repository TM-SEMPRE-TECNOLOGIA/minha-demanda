Sub InserirLegendasRapido()

Dim i As Long
Dim totalPics As Long
Dim rng As Range

Application.ScreenUpdating = False

totalPics = ActiveDocument.InlineShapes.Count

For i = totalPics - 1 To 2 Step -1

    Set rng = ActiveDocument.InlineShapes(i).Range
    rng.Collapse wdCollapseEnd

    rng.InsertAfter vbCrLf & "Foto " & (i - 1)

Next i

Application.ScreenUpdating = True

End Sub
