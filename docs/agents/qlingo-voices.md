# Better voices for QLingo

QLingo's 🔊 says a word with your computer's own voice for that language. Every system comes with
compact voices, which sound flat in most languages. A better voice is a free download from your
system, done once, and every app then uses it. QLingo takes the best voice installed by itself:
premium, then enhanced, then compact.

**Settings → QLingo** shows the voice that says each language, and its quality. **Better Voice…** under
the list opens the steps for your system, and on a Mac or on Windows the system's own page for it.

<img src="/screenshot/qlingo-voice-settings.png" alt="Settings → QLingo: each language with its voice, Lili (Premium) for Chinese, Alva (Premium) for Swedish, Thomas (compact) for French; under the list a line saying how many of the languages ticked have only a compact voice and the Better Voice… button; How to get a better voice opened with its five steps">

## On a Mac

1. In **Settings → QLingo**, press **Better Voice…**. System Settings opens on **Accessibility →
   Read & Speak** (on macOS 15 and earlier, **Spoken Content**).

   <img src="/screenshot/qlingo-voice-mac-read-speak.png" alt="System Settings, Accessibility → Read & Speak: Accessibility Reader, Speak selection, Speak item under the pointer, Speak announcements, Speak typing feedback, then System speech language and System voice (Samantha) with its menu">

2. Open the **System voice** menu and choose **Manage Voices…**.
3. Choose a language on the left, then press the download button beside a voice marked **Premium**
   (the best) or **Enhanced**.
4. Press **Done**. QLingo uses the new voice at once: its language's row names it.

The Siri voices in that list are not given to apps, so QLingo cannot use them: pick a Premium or an
Enhanced voice instead.

## On Windows

1. In **Settings → QLingo**, press **Better Voice…**. Settings opens on **Time & language → Speech**.
2. Under **Manage voices**, press **Add voices**.

   <img src="/screenshot/qlingo-voice-windows-speech.png" alt="Windows Settings, Time & language → Speech: Choose a voice, Voice speed, Preview voice, and under Manage voices the Add voices button">

3. Type the language (Swedish, Chinese …), tick it and press **Add**.

   <img src="/screenshot/qlingo-voice-windows-packages.png" alt="The Voice packages box: Swedish typed in its search, Swedish (Sweden) ticked, and the Add and Cancel buttons">

4. Wait for the download. Windows installs it in the background, in a few minutes, sometimes only
   once Windows Update has run.

   <img src="/screenshot/qlingo-voice-windows-added.png" alt="Back on Speech, a red line under Add voices: To use new voices, close and reopen settings as well as any apps that use voices">

5. QLingo uses the new voice within seconds, without a restart: its language's row names it.

Windows' natural voices belong to Narrator and are not given to apps, so QLingo cannot use them.

## On Linux

Linux has no settings page for voices: they come as packages for speech-dispatcher, the service
apps speak through. Its own voices (eSpeak) are the most robotic of all. The commands below are for
Debian and Ubuntu; other distributions have the same packages under similar names.

1. Open a terminal.
2. English, Russian, Ukrainian, Polish and Brazilian Portuguese, by RHVoice:

   ```sh
   sudo apt install speech-dispatcher-rhvoice rhvoice-english rhvoice-russian rhvoice-ukrainian
   ```

3. English, German, French, Italian and Spanish, by Pico:

   ```sh
   sudo apt install speech-dispatcher-pico
   ```

4. Start speech-dispatcher again so it loads them. It starts by itself at the next word:

   ```sh
   killall speech-dispatcher
   ```

5. QLingo uses them within seconds: its language's row names the voice and its engine, such as
   `Aleksandr (rhvoice)`. Other languages keep eSpeak's voice.

## In the browser

In the browser, QLingo speaks with the voices the browser lists, which are your system's voices. A
voice installed with the steps above shows there too; a browser that was open may need a restart
before it lists it.
