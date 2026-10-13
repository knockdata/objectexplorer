# Hex

<AppDemo open="folder/demo/table/nl_train_stations.parquet" view="hex" tree-path="folder/demo/table/nl_train_stations.parquet" :off="['tour', 'auth', 'tree', 'activity', 'header', 'footer']" image="/screenshot/hex.png" alt="The hex viewer: offsets, hex pairs and the ASCII column" />

Any file, straight to bytes. Offsets, sixteen hex pairs a row and the ASCII column. The file is
mapped rather than read in, and only the rows on screen are drawn, so a large file opens at once
instead of after a spinner.

It is exactly what you need when a format is not recognized and the first 64 bytes decide what it is:
a magic number, a header, a footer at a known offset. A file of no known format that holds binary
opens in hex by itself.

Hex is in the toolbar as **0x**, for every file whose bytes are all on this machine. A large zip in
a bucket that has only been browsed is not — only the pages you opened were copied.

Next: [archives](/explore/archives).
