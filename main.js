// Mapeamento base: somente letras não acentuadas, números e espaço
const baseMorseMap = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',
  'E': '.',     'F': '..-.',  'G': '--.',   'H': '....',
  'I': '..',    'J': '.---',  'K': '-.-',   'L': '.-..',
  'M': '--',    'N': '-.',    'O': '---',   'P': '.--.',
  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',
  'Y': '-.--',  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  ' ': ' '  // Espaço representado por barra para separar palavras
};

// Mapeamento completo para a conversão de texto para Morse (inclui letras acentuadas)
const morseCodeMap = Object.assign({}, baseMorseMap);
morseCodeMap['À'] = baseMorseMap['A'];
morseCodeMap['Á'] = baseMorseMap['A'];
morseCodeMap['Â'] = baseMorseMap['A'];
morseCodeMap['Ã'] = baseMorseMap['A'];
morseCodeMap['É'] = baseMorseMap['E'];
morseCodeMap['Ê'] = baseMorseMap['E'];
morseCodeMap['Í'] = baseMorseMap['I'];
morseCodeMap['Ó'] = baseMorseMap['O'];
morseCodeMap['Ô'] = baseMorseMap['O'];
morseCodeMap['Õ'] = baseMorseMap['O'];
morseCodeMap['Ú'] = baseMorseMap['U'];
morseCodeMap['Ü'] = baseMorseMap['U'];
morseCodeMap['Ç'] = baseMorseMap['C'];

// Cria o mapeamento reverso usando somente o baseMorseMap
const textMap = {};
for (let key in baseMorseMap) {
  textMap[baseMorseMap[key]] = key;
}

// Função para remover acentos usando normalização Unicode
function removeAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para converter texto em código Morse
function textToMorse(text) {
  text = removeAccents(text).toUpperCase();
  return text
    .split('')
    .map(ch => (morseCodeMap[ch] ? morseCodeMap[ch] : ''))
    .join(' ');
}

// Função para converter código Morse em texto
function morseToText(morse) {
  return morse
    .split(' ')
    .map(code => (code === '/' ? ' ' : (textMap[code] ? textMap[code] : '')))
    .join('');
}

// Helper para renderizar o código Morse com marcação do símbolo atual
function renderMorse(lettersSymbols, currentLetter, currentSymbol) {
  return lettersSymbols
    .map((symbols, li) => {
      return symbols
        .map((symbol, si) => {
          if (li === currentLetter && si === currentSymbol) {
            return `<span class="current-symbol">${symbol}</span>`;
          } else {
            return `<span>${symbol}</span>`;
          }
        })
        .join('');
    })
    .join(' ');
}

// Função para verificar se o flash está ativado
function isFlashEnabled() {
  return document.getElementById('flashToggle').checked;
}

// Função para exibir o flash na tela
function flashScreen(color, duration) {
  if (!isFlashEnabled()) return;
  
  const overlay = document.getElementById('flashOverlay');
  overlay.style.backgroundColor = color;
  overlay.style.opacity = 1;
  setTimeout(() => {
    overlay.style.opacity = 0;
  }, duration);
}

// Variáveis para controle de velocidade e execução
const baseDotDuration = 200; // em milissegundos
let isPlaying = false;
let stopPlayback = false;

// Função para obter a velocidade definida pelo usuário
function getSpeedMultiplier() {
  return parseFloat(document.getElementById('speedControl').value);
}

// Função que retorna a duração ajustada com base na velocidade
function getDurations() {
  const speed = getSpeedMultiplier();
  return {
    dot: baseDotDuration / speed,
    dash: (baseDotDuration * 3) / speed,
    elementGap: baseDotDuration / speed,
    letterGap: (baseDotDuration * 3) / speed,
    wordGap: (baseDotDuration * 7) / speed
  };
}

// Função para pausar a execução por um tempo definido
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Criação do AudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Função para gerar um beep com duração definida e exibir flash
async function beep(duration, color) {
  flashScreen(color, duration);
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  
  return new Promise(resolve => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 600; // Frequência em Hz
    oscillator.type = 'sine';
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      resolve();
    }, duration);
  });
}

// Função que reproduz UM ciclo (única execução) do código Morse
async function playOneCycle(morse) {
  const lettersArray = morse.split(' ');
  const lettersSymbols = lettersArray.map(letter => letter.split(''));

  function updateDisplay(currentLetter, currentSymbol) {
    document.getElementById('morseOutput').innerHTML = renderMorse(lettersSymbols, currentLetter, currentSymbol);
  }

  updateDisplay(-1, -1);
  const { dot, dash, elementGap, letterGap, wordGap } = getDurations();

  outerLoop:
  for (let i = 0; i < lettersSymbols.length; i++) {
    let letter = lettersSymbols[i];
    if (letter.length === 1 && letter[0] === '/') {
      updateDisplay(-1, -1);
      if (stopPlayback) break outerLoop;
      await sleep(wordGap);
      continue;
    }
    for (let j = 0; j < letter.length; j++) {
      if (stopPlayback) break outerLoop;
      updateDisplay(i, j);
      let symbol = letter[j];
      if (symbol === '.') {
        await beep(dot, "yellow");
      } else if (symbol === '-') {
        await beep(dash, "red");
      }
      updateDisplay(-1, -1);
      if (stopPlayback) break outerLoop;
      if (j < letter.length - 1) {
        await sleep(elementGap);
      }
    }
    if (stopPlayback) break outerLoop;
    if (i < lettersSymbols.length - 1) {
      await sleep(letterGap);
    }
  }
  document.getElementById('morseOutput').textContent = morse;
}

// Função que gerencia a reprodução em loop (caso a opção esteja ativa)
async function playMorseSoundLoop(morse) {
  isPlaying = true;
  stopPlayback = false;
  document.getElementById('playSound').disabled = true;
  document.getElementById('convertToMorse').disabled = true;
  document.getElementById('speedControl').disabled = true;
  document.getElementById('loopToggle').disabled = true;
  document.getElementById('flashToggle').disabled = true;
  document.getElementById('stopSound').disabled = false;
  
  while (true) {
    await playOneCycle(morse);
    if (stopPlayback || !document.getElementById('loopToggle').checked) {
      break;
    }
  }
  
  isPlaying = false;
  stopPlayback = false;
  document.getElementById('playSound').disabled = false;
  document.getElementById('convertToMorse').disabled = false;
  document.getElementById('speedControl').disabled = false;
  document.getElementById('loopToggle').disabled = false;
  document.getElementById('flashToggle').disabled = false;
  document.getElementById('stopSound').disabled = true;
}

// Função para iniciar a reprodução (loop ou único ciclo)
async function playMorseSound(morse) {
  if (document.getElementById('loopToggle').checked) {
    await playMorseSoundLoop(morse);
  } else {
    isPlaying = true;
    stopPlayback = false;
    document.getElementById('playSound').disabled = true;
    document.getElementById('convertToMorse').disabled = true;
    document.getElementById('speedControl').disabled = true;
    document.getElementById('loopToggle').disabled = true;
    document.getElementById('flashToggle').disabled = true;
    document.getElementById('stopSound').disabled = false;
    
    await playOneCycle(morse);
    
    isPlaying = false;
    stopPlayback = false;
    document.getElementById('playSound').disabled = false;
    document.getElementById('convertToMorse').disabled = false;
    document.getElementById('speedControl').disabled = false;
    document.getElementById('loopToggle').disabled = false;
    document.getElementById('flashToggle').disabled = false;
    document.getElementById('stopSound').disabled = true;
  }
}

// Função auxiliar para adicionar listeners de click e touchstart
function addButtonListeners(id, handler) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', handler);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handler();
  });
}

// Eventos dos botões
addButtonListeners('convertToMorse', () => {
  const input = document.getElementById('textInput').value;
  const morse = textToMorse(input);
  document.getElementById('morseOutput').textContent = morse;
  document.getElementById('playSound').disabled = (morse.trim() === '');
});

addButtonListeners('playSound', async () => {
  const morse = document.getElementById('morseOutput').textContent;
  if (morse) {
    await playMorseSound(morse);
  }
});

addButtonListeners('stopSound', () => {
  if (isPlaying) {
    stopPlayback = true;
  }
});

addButtonListeners('convertToText', () => {
  const input = document.getElementById('morseInput').value;
  const text = morseToText(input.trim());
  document.getElementById('textOutput').textContent = text;
});
