$referencePath = 'C:\Users\HP\Downloads\Sample Presentation EduQual Diplomas (1).pptx'
$finalDeckPath = 'C:\Users\HP\Documents\Codex\2026-08-16\i\outputs\globalcommerce-enterprise-platform\docs\GlobalCommerce-Presentation-Jawad-Ahmad.pptx'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceZip = [System.IO.Compression.ZipFile]::OpenRead($referencePath)
$targetZip = [System.IO.Compression.ZipFile]::Open($finalDeckPath, [System.IO.Compression.ZipArchiveMode]::Update)
try {
  foreach ($entry in $sourceZip.Entries | Where-Object { $_.FullName -match '^ppt/theme/theme\d+\.xml$' }) {
    $sourceStream = $entry.Open()
    $themeBuffer = [System.IO.MemoryStream]::new()
    $sourceStream.CopyTo($themeBuffer)
    $sourceStream.Dispose()
    $oldEntry = $targetZip.GetEntry($entry.FullName)
    if ($oldEntry) { $oldEntry.Delete() }
    $newEntry = $targetZip.CreateEntry($entry.FullName)
    $destinationStream = $newEntry.Open()
    $themeBuffer.Position = 0
    $themeBuffer.CopyTo($destinationStream)
    $destinationStream.Dispose()
    $themeBuffer.Dispose()
    Write-Output "Preserved original theme bytes: $($entry.FullName)"
  }
} finally {
  $targetZip.Dispose()
  $sourceZip.Dispose()
}
