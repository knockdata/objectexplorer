# Images

`png` `jpg` `jpeg` `webp` `gif` `tiff` `tif` `svg` `ico`, and on a Mac `heic` `avif` `bmp` `psd` and
camera raw

<AppDemo open="folder/demo/image/archipelago-dusk.jpg" image="/screenshot/image-exif.png" alt="An image with its EXIF and GPS metadata beside it" />

The picture, fitted to the pane, with what the file carries in a card over its top right corner:
the EXIF tags of the image and of the camera and its settings, and the GPS position worked out in
degrees where there is one. A PNG shows the text chunks it holds, and a GIF its comments.

A PNG is shown at its own size, no wider than the pane, and a button flips the background behind it
between light and dark, so a transparent picture can be seen on either.

An `.ico` shows every size it contains side by side, each named by its size and depth, rather than
only the largest.

An SVG is painted by the app's own painter, not handed to a browser, and its text is a click away.

On Windows and Linux the app's own decoders draw PNG, JPEG, GIF, WebP and TIFF. On a Mac the
system's decoder draws those and more — HEIC, AVIF, BMP, Photoshop and camera raw files among them.

Next: [audio and video](/formats/media).
