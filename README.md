## MORSE CODE GENERATOR

This project is a modern web-based Morse code generator that can both convert plain text to Morse code (with audio playback) and convert Morse code back to text. The interface is built with HTML5, styled using Bootstrap and custom CSS, and the core functionality is implemented in JavaScript. The application supports features such as:

- **Text-to-Morse conversion:** Converts user input text (including accented characters) to Morse code.
- **Morse-to-Text conversion:** Converts Morse code (with spaces separating letters and a "/" for word separation) back to plain text.
- **Audio playback:** Plays the Morse code sounds using the Web Audio API.
- **Adjustable speed:** Users can change the playback speed via a range slider.
- **Loop mode:** Users can toggle looping so that the Morse code playback repeats until stopped.
- **Flash effect:** An optional visual flash effect synchronizes with the beeps, showing a yellow flash for dots (short beeps) and a red flash for dashes (long beeps). The user may enable or disable this effect.
- **Responsive design:** The UI supports touchscreen devices and adapts to various screen sizes.

---

## File Documentation

### 1. `index.html`

**Purpose:**  
The main HTML file that defines the user interface of the Morse code generator.

**Key Components:**

- **Head Section:**
  - Sets the charset to UTF-8 and the viewport for responsive design.
  - Includes the project title.
  - Links to the favicon (`favicon.png`), Bootstrap CSS (via CDN), and a custom CSS file (`styles.css`).

- **Body Section:**
  - Contains a main container (`div.container`) with a title and two main rows:
    - **Text-to-Morse Section:**  
      Includes a textarea for text input, a speed control slider, a checkbox to enable looping, a checkbox to enable/disable the flash effect, a "Convert" button, an output area to display the generated Morse code, and two buttons ("Play Sound" and "Stop") for audio playback control.
    - **Morse-to-Text Section:**  
      Contains a textarea for Morse code input, a "Convert" button, and an output area to display the resulting text.
  - An additional overlay `div` with `id="flashOverlay"` is placed at the end of the body to support the flash effect during audio playback.
  - Scripts are loaded at the bottom, including the main JavaScript file (`main.js`) and Bootstrap’s JavaScript dependencies.

---

### 2. `styles.css`

**Purpose:**  
Defines the visual style for the application, including both custom styling and modern effects.

**Key Styles:**

- **Global Styles:**  
  - The `body` has a subtle linear-gradient background and a modern sans-serif font.
  - Global text color and margin/padding settings ensure consistency.

- **Typography and Cards:**  
  - The title (`.title`) and labels (`.label-text`) are styled with custom font weights, colors, and text shadows.
  - The output area (`.output-text`) is modernized with a semi-transparent background, border, rounded corners, box-shadow, and a monospaced font for clear code display.

- **Card Components:**  
  - Cards and their headers are given rounded corners for a modern look.

- **Flash Overlay:**  
  - The `#flashOverlay` is positioned fixed and covers the entire viewport.  
  - Its opacity is controlled via CSS transitions, allowing for a smooth "flash" effect when activated.

- **Responsive Media Queries:**  
  - Adjustments are provided for smaller screens (devices with a maximum width of 576px), such as smaller font sizes and button padding.

---

### 3. `main.js`

**Purpose:**  
Contains all the JavaScript functionality for the Morse code generator, including conversion functions, audio playback, UI updates, and user interaction handling.

**Key Features and Functions:**

- **Mapping Objects:**
  - **`baseMorseMap`:**  
    Maps standard (non-accented) letters, numbers, and space to their Morse code equivalents.
  - **`morseCodeMap`:**  
    Extends the base mapping to include accented characters (e.g., Á, É) by mapping them to the same Morse code as their base letter.
  - **`textMap`:**  
    A reverse mapping from Morse code to text, built only from the base mapping to ensure consistency.

- **Text Conversion Functions:**
  - **`removeAccents(text)`:**  
    Uses Unicode normalization to strip diacritical marks from text.
  - **`textToMorse(text)`:**  
    Converts input text to Morse code after removing accents and converting to uppercase.
  - **`morseToText(morse)`:**  
    Converts Morse code back to plain text.

- **Rendering Helper:**
  - **`renderMorse(lettersSymbols, currentLetter, currentSymbol)`:**  
    Renders the Morse code string as HTML, wrapping the current symbol (if any) in a `<span>` with a class that applies a highlight effect.

- **Flash Effect:**
  - **`isFlashEnabled()`:**  
    Checks if the user has enabled the flash effect via a checkbox.
  - **`flashScreen(color, duration)`:**  
    If enabled, temporarily displays an overlay with a specified color (yellow for dots, red for dashes) to visually indicate the beep.

- **Audio Playback Functions:**
  - **`getDurations()`:**  
    Adjusts the base durations for dot, dash, and gaps based on the user-selected speed multiplier.
  - **`beep(duration, color)`:**  
    Plays an audio beep of a given duration and triggers the flash effect.
  - **`playOneCycle(morse)`:**  
    Plays one full cycle of the provided Morse code string. It also updates the UI to highlight the current symbol.
  - **`playMorseSoundLoop(morse)` and `playMorseSound(morse)`:**  
    Manage the overall playback. The code supports a looping mode (if the corresponding checkbox is enabled) so that the Morse code plays repeatedly until stopped.
    
- **UI Control and Event Listeners:**
  - Disables/enables buttons and input elements during playback to prevent user interactions that might interrupt the process.
  - Uses a helper function (`addButtonListeners`) to attach both `click` and `touchstart` events, ensuring compatibility with both desktop and touchscreen devices.
  - Event listeners are set up for converting text to Morse, converting Morse to text, starting playback, and stopping playback.

---

## Usage Instructions

1. **Setup:**
   - Place `index.html`, `styles.css`, and `main.js` in the same directory.
   - Add a `favicon.png` image in the same folder (or update the link in `index.html` to your favicon file).

2. **Launching the App:**
   - Open `index.html` in a web browser. The application will load with a modern, responsive UI.

3. **Text-to-Morse Conversion:**
   - Enter your text in the "Texto para Morse" section.
   - Adjust the speed, enable/disable looping, and choose whether to enable the flash effect.
   - Click "Converter" to generate the Morse code, which will be displayed in the output area.
   - Click "Tocar Som" to play the Morse code as audio. The current symbol being played will be highlighted, and if the flash is enabled, the screen will flash yellow for dots and red for dashes.

4. **Morse-to-Text Conversion:**
   - Enter Morse code in the "Morse para Texto" section (use spaces to separate letters and "/" to separate words).
   - Click "Converter" to convert it back to plain text, which is then displayed in the output area.

5. **Playback Controls:**
   - During playback, various controls are disabled to ensure uninterrupted operation.
   - Use the "Parar" button to stop playback at any time.
   - If loop mode is enabled, playback will repeat until stopped or the loop option is deselected.

---

This documentation should help you understand the structure, functionality, and usage of the Morse code generator project. Enjoy exploring and customizing the project as needed!
