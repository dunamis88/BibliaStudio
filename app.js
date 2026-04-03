// --- CONSTANTS ---
// Failsafe global login
function loginWithGoogle() {
    const btn = document.getElementById('btn-login');
    if (btn) { btn.style.opacity = '0.5'; btn.disabled = true; }
    
    const resetBtn = function() {
        if (btn) { btn.style.opacity = '1'; btn.disabled = false; }
    };
    
    const resetTimer = setTimeout(resetBtn, 10000);
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then(function() {
            clearTimeout(resetTimer);
            console.log("Login exitoso.");
        })
        .catch(function(err) {
            clearTimeout(resetTimer);
            resetBtn();
            console.error("Error al iniciar sesión:", err);
            if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
                alert('Error al iniciar sesión: ' + err.message);
            }
        });
}

function logout() {
    if(confirm('¿Cerrar sesión en BibliaStudio?')) {
        auth.signOut().then(() => location.reload());
    }
}

const BOOKS = [{ id: 1, n: "Génesis", c: 50, nt: false }, { id: 2, n: "Éxodo", c: 40, nt: false }, { id: 3, n: "Levítico", c: 27, nt: false }, { id: 4, n: "Números", c: 36, nt: false }, { id: 5, n: "Deuteronomio", c: 34, nt: false }, { id: 6, n: "Josué", c: 24, nt: false }, { id: 7, n: "Jueces", c: 21, nt: false }, { id: 8, n: "Rut", c: 4, nt: false }, { id: 9, n: "1 Samuel", c: 31, nt: false }, { id: 10, n: "2 Samuel", c: 24, nt: false }, { id: 11, n: "1 Reyes", c: 22, nt: false }, { id: 12, n: "2 Reyes", c: 25, nt: false }, { id: 13, n: "1 Crónicas", c: 29, nt: false }, { id: 14, n: "2 Crónicas", c: 36, nt: false }, { id: 15, n: "Esdras", c: 10, nt: false }, { id: 16, n: "Nehemías", c: 13, nt: false }, { id: 17, n: "Ester", c: 10, nt: false }, { id: 18, n: "Job", c: 42, nt: false }, { id: 19, n: "Salmos", c: 150, nt: false }, { id: 20, n: "Proverbios", c: 31, nt: false }, { id: 21, n: "Eclesiastés", c: 12, nt: false }, { id: 22, n: "Cantares", c: 8, nt: false }, { id: 23, n: "Isaías", c: 66, nt: false }, { id: 24, n: "Jeremías", c: 52, nt: false }, { id: 25, n: "Lamentaciones", c: 5, nt: false }, { id: 26, n: "Ezequiel", c: 48, nt: false }, { id: 27, n: "Daniel", c: 12, nt: false }, { id: 28, n: "Oseas", c: 14, nt: false }, { id: 29, n: "Joel", c: 3, nt: false }, { id: 30, n: "Amós", c: 9, nt: false }, { id: 31, n: "Abdías", c: 1, nt: false }, { id: 32, n: "Jonás", c: 4, nt: false }, { id: 33, n: "Miqueas", c: 7, nt: false }, { id: 34, n: "Nahúm", c: 3, nt: false }, { id: 35, n: "Habacuc", c: 3, nt: false }, { id: 36, n: "Sofonías", c: 3, nt: false }, { id: 37, n: "Hageo", c: 2, nt: false }, { id: 38, n: "Zacarías", c: 14, nt: false }, { id: 39, n: "Malaquías", c: 4, nt: false }, { id: 40, n: "Mateo", c: 28, nt: true }, { id: 41, n: "Marcos", c: 16, nt: true }, { id: 42, n: "Lucas", c: 24, nt: true }, { id: 43, n: "Juan", c: 21, nt: true }, { id: 44, n: "Hechos", c: 28, nt: true }, { id: 45, n: "Romanos", c: 16, nt: true }, { id: 46, n: "1 Corintios", c: 16, nt: true }, { id: 47, n: "2 Corintios", c: 13, nt: true }, { id: 48, n: "Gálatas", c: 6, nt: true }, { id: 49, n: "Efesios", c: 6, nt: true }, { id: 50, n: "Filipenses", c: 4, nt: true }, { id: 51, n: "Colosenses", c: 4, nt: true }, { id: 52, n: "1 Tesalonicenses", c: 5, nt: true }, { id: 53, n: "2 Tesalonicenses", c: 3, nt: true }, { id: 54, n: "1 Timoteo", c: 6, nt: true }, { id: 55, n: "2 Timoteo", c: 4, nt: true }, { id: 56, n: "Tito", c: 3, nt: true }, { id: 57, n: "Filemón", c: 1, nt: true }, { id: 58, n: "Hebreos", c: 13, nt: true }, { id: 59, n: "Santiago", c: 5, nt: true }, { id: 60, n: "1 Pedro", c: 5, nt: true }, { id: 61, n: "2 Pedro", c: 3, nt: true }, { id: 62, n: "1 Juan", c: 5, nt: true }, { id: 63, n: "2 Juan", c: 1, nt: true }, { id: 64, n: "3 Juan", c: 1, nt: true }, { id: 65, n: "Judas", c: 1, nt: true }, { id: 66, n: "Apocalipsis", c: 22, nt: true }];

const STORAGE_KEY = 'biblia_studio_v1';

// --- STATE ---
let state = {
    currentVersion: 'RV60',
    currentBook: 1, // ID
    currentChapter: 1,
    selectedVerses: [], // Array of verse numbers
    notes: {
        'initial': { title: "", subtitle: "", content: "", date: new Date().toLocaleDateString() }
    }, 
    activeNoteId: 'initial',
    highlights: {}, // Key: version_book_chapter_verse, Value: colorCode
    selectedHighlightColor: 'yellow',
    splitPos: 50, // Percentage
    currentBibleFontSize: 18,
    // History
    history: [], // Stack for back/forward [{v, b, c}]
    historyIndex: -1,
    fullHistory: [] // Unique recent visits [{v, b, c, timestamp}]
};

let bibleLibrary = {};
let readerSQL = null;

// --- INITIALIZATION ---
async function init() {
    if (window.location.protocol === 'file:') {
        alert("Atención: Los navegadores bloquean la carga de archivos (Biblias) cuando se abre el HTML directamente. Por favor, usa un servidor local como 'Live Server' en VS Code.");
    }
    loadState();
    setupResizer();
    setupEventListeners();
    updateBibleFontSize();
    
    // Initial render to show loading state
    renderBible();
    setTimeout(loadCurrentNote, 100); 
    lucide.createIcons();
    
    // Load engine and bibles
    await initBibleEngine();
    
    // Observers for responsivity
    initToolbarObservers();

    // Initial history anchor
    navigateTo(state.currentVersion, state.currentBook, state.currentChapter);
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = { ...state, ...JSON.parse(saved) };
    }
    updateUIState();
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Trigger cloud sync if logged in
    syncNotesToCloud();
}

function updateUIState() {
    const vName = state.currentVersion;
    const bObj = BOOKS.find(b => b.id === state.currentBook);
    if (!bObj) return;

    document.getElementById('current-version').textContent = vName;
    document.getElementById('current-book').textContent = bObj.n;
    document.getElementById('current-chapter').textContent = state.currentChapter;
    
    document.getElementById('bible-book-title').textContent = bObj.n;
    document.getElementById('bible-chapter-title').textContent = `Capítulo ${state.currentChapter}`;
    
    // Split View Adjustment
    const biblePanel = document.getElementById('bible-panel');
    const notesPanel = document.getElementById('notes-panel');
    if (biblePanel && notesPanel) {
        biblePanel.style.flex = state.splitPos;
        notesPanel.style.flex = 100 - state.splitPos;
    }

    // Update History Buttons State
    const btnBack = document.getElementById('btn-nav-back');
    const btnForward = document.getElementById('btn-nav-forward');
    if (btnBack && btnForward) {
        btnBack.disabled = state.historyIndex <= 0;
        btnForward.disabled = state.historyIndex >= state.history.length - 1;
    }

    const label = document.getElementById('bible-size-label');
    if (label) label.textContent = state.currentBibleFontSize;
}

// --- BIBLE ENGINE ---
async function initBibleEngine() {
    try {
        const config = { locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` };
        if (typeof initSqlJs === 'function') {
            readerSQL = await initSqlJs(config);
        }

        // Try load existing versions
        await loadBible('biblias/RV60.json', 'json', 'RV60');
        await loadBible('biblias/NVI.json', 'json', 'NVI');
        await loadBible('biblias/NTV.mybible', 'sqlite', 'NTV');

    } catch (err) {
        console.error("Bible Engine Init Error:", err);
    }
}

async function loadBible(url, type, name) {
    try {
        console.log(`Intentando cargar Biblia: ${name} desde ${url}...`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} en ${url}`);
        }

        if (type === 'json') {
            const data = await response.json();
            let items = Array.isArray(data) ? data : (data.verses || data.data || data.Bible || []);
            if (!Array.isArray(items) && typeof items === 'object') {
                items = Object.values(items).find(v => Array.isArray(v)) || [];
            }
            if (items.length > 0) {
                bibleLibrary[name] = { name, type: 'json', data: items };
                console.log(`Biblia ${name} cargada con ${items.length} versículos.`);
            } else {
                console.warn(`La biblia ${name} no tiene versículos detectables.`);
            }
        } else if (type === 'sqlite' && readerSQL) {
            const buffer = await response.arrayBuffer();
            const db = new readerSQL.Database(new Uint8Array(buffer));
            const res = db.exec("SELECT Book, Chapter, Verse, Scripture FROM Bible");
            if (res && res.length > 0) {
                const columns = res[0].columns;
                const values = res[0].values;
                const items = values.map(row => {
                    let obj = {};
                    columns.forEach((col, i) => obj[col] = row[i]);
                    return obj;
                });
                bibleLibrary[name] = { name, type: 'sqlite', data: items };
                console.log(`Biblia ${name} (SQLite) cargada con ${items.length} versículos.`);
            }
            db.close();
        }
        
        // Re-render immediately if this was the selected version
        if (state.currentVersion === name || Object.keys(bibleLibrary).length === 1) {
            if (Object.keys(bibleLibrary).length === 1 && !bibleLibrary[state.currentVersion]) {
                state.currentVersion = name;
            }
            updateUIState();
            renderBible();
        }
    } catch (e) {
        console.error(`Error crítico cargando ${name}:`, e);
    }
}

function normalizeText(text) {
    if (!text) return "";
    return text.toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove common punctuation
        .trim();
}

function cleanText(text, version) {
    if (!text) return "";
    let clean = String(text);
    
    // RTF cleanup
    clean = clean.replace(/\\'e1/g, "á").replace(/\\'e9/g, "é").replace(/\\'ed/g, "í")
                .replace(/\\'f3/g, "ó").replace(/\\'fa/g, "ú").replace(/\\'f1/g, "ñ")
                .replace(/\\'d1/g, "Ñ").replace(/\\'c1/g, "Á").replace(/\\'c9/g, "É")
                .replace(/\\'cd/g, "Í").replace(/\\'d3/g, "Ó").replace(/\\'da/g, "Ú");

    clean = clean.replace(/\{|\}/g, "");
    clean = clean.replace(/\\[a-z]+[0-9]* ?/g, "");
    clean = clean.replace(/<[^>]*>/g, ""); 
    
    // Reference extraction: Find patterns like (Jn 3:16) or [Jn 3:16]
    // Common book abbreviations can vary, but usually they are 2-4 letters followed by space and chapter:verse
    const refRegex = /\(([^)]+)\)|\[([^\]]+)\]/g;
    clean = clean.replace(refRegex, (match, p1, p2) => {
        const ref = p1 || p2;
        // Basic check if it looks like a Bible ref (has a colon)
        if (ref.includes(':')) {
            return `<span class="ref-link" data-ref="${ref}">(${ref})</span>`;
        }
        return match;
    });
    
    return clean.replace(/\s+/g, ' ').trim();
}

function renderBible(resetScroll = true) {
    const container = document.getElementById('bible-verses-container');
    const bible = bibleLibrary[state.currentVersion];

    if (!bible) {
        container.innerHTML = `
            <div class="loading">
                <i data-lucide="loader" class="spin"></i>
                <p>Cargando Versión ${state.currentVersion}...</p>
                <p style="font-size: 12px; margin-top: 10px; opacity: 0.6;">Si el error persiste, asegúrate de estar usando un servidor local (Live Server).</p>
            </div>`;
        lucide.createIcons();
        return;
    }

    const { currentBook, currentChapter } = state;
    
    // Find keys (JSON structures vary)
    const first = bible.data[0] || {};
    const keys = Object.keys(first);
    const isSql = bible.type === 'sqlite';
    
    // Improved key detection
    const bKey = isSql ? 'Book' : (keys.find(k => k.toLowerCase().replace(/\s/g, '').includes('book') || k.toLowerCase().includes('libro') || k.toLowerCase().includes('id1')) || keys[0]);
    const cKey = isSql ? 'Chapter' : (keys.find(k => k.toLowerCase().includes('chapter') || k.toLowerCase().includes('capitulo') || k.toLowerCase().includes('id2')) || keys[1]);
    const vKey = isSql ? 'Verse' : (keys.find(k => k.toLowerCase().includes('verse') || k.toLowerCase().includes('versiculo') || k.toLowerCase().includes('id3')) || keys[2]);
    const tKey = isSql ? 'Scripture' : (keys.find(k => k.toLowerCase().includes('scripture') || k.toLowerCase().includes('texto') || k.toLowerCase().includes('text') || k.toLowerCase().includes('vtext')) || keys[3]);

    const verses = bible.data
        .filter(v => parseInt(v[bKey]) === currentBook && parseInt(v[cKey]) === currentChapter)
        .sort((a, b) => parseInt(a[vKey]) - parseInt(b[vKey]));

    if (verses.length === 0) {
        container.innerHTML = `<div class="loading">Capítulo no encontrado.</div>`;
        return;
    }

    // Reset scroll ONLY if requested (usually on navigation to new chapter)
    if (resetScroll) {
        const scrollArea = document.querySelector('.bible-scroll-area');
        if (scrollArea) scrollArea.scrollTop = 0;
    }

    container.innerHTML = verses.map(v => {
        const vNum = parseInt(v[vKey]);
        const text = cleanText(v[tKey], state.currentVersion);
        const isActive = state.selectedVerses.includes(vNum);
        
        // HIGHLIGHT LOGIC
        const verseKey = `${state.currentVersion}_${state.currentBook}_${state.currentChapter}_${vNum}`;
        const hData = state.highlights[verseKey];
        // Migration support: handle string or object
        const color = (typeof hData === 'object') ? hData.c : hData;
        const highlightClass = color && color !== 'none' ? ` h-${color}` : '';
        
        return `
            <div class="verse ${isActive ? 'active' : ''}${highlightClass}" 
                 data-verse="${vNum}" 
                 onclick="handleVerseClick(event, ${vNum})">
                <span class="verse-num">${vNum}</span>
                <span class="verse-body">${text}</span>
            </div>
        `;
    }).join('');

    setupTooltipEvents();
}

// --- INTERACTION ---
function handleVerseClick(e, vNum) {
    // Primary Action: Toggle Selection (for marking colors OR importing to notes)
    const idx = state.selectedVerses.indexOf(vNum);
    if (idx > -1) {
        state.selectedVerses.splice(idx, 1);
    } else {
        if (e.ctrlKey) {
            state.selectedVerses.push(vNum);
        } else {
            state.selectedVerses = [vNum];
        }
    }
    
    state.selectedVerses.sort((a, b) => a - b);
    renderBible(false); // Do not jump to top when just selecting/deselecting a verse
    saveState();
}

function loadCurrentNote() {
    const note = state.notes[state.currentNoteId] || state.notes['default'];
    if (!note) return;
    
    document.getElementById('editor').innerHTML = note.content;
    document.getElementById('active-note-title').textContent = note.title || "Reflexión Académica";
    document.getElementById('active-note-subtitle').textContent = note.subtitle || "Añadir subtítulo...";
}

// Editable Title/Subtitle listeners
document.getElementById('active-note-title').addEventListener('input', (e) => {
    if (!state.currentNoteId) return;
    state.notes[state.currentNoteId].title = e.target.textContent;
    saveState();
});

document.getElementById('active-note-subtitle').addEventListener('input', (e) => {
    if (!state.currentNoteId) return;
    state.notes[state.currentNoteId].subtitle = e.target.textContent;
    saveState();
});

// --- EDITOR LOGIC ---
const editor = document.getElementById('editor');
editor.addEventListener('input', () => {
    if (!state.currentNoteId) return;
    state.notes[state.currentNoteId].content = editor.innerHTML;
    saveState();
});

editor.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgHTML = `<img src="${event.target.result}" style="max-width: 100%; border-radius: 8px; margin: 10px 0;">`;
                document.execCommand('insertHTML', false, imgHTML);
            };
            reader.readAsDataURL(blob);
        }
    }
});

// Show handles on image click
editor.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        currentEditingImage = e.target;
        setupImageResizeHandles(e.target);
        e.stopPropagation();
    } else if (!e.target.closest('.resize-handle')) {
        removeImageResizeHandles();
    }
});

function setupImageResizeHandles(img) {
    removeImageResizeHandles();
    
    const wrapper = document.createElement('div');
    wrapper.className = 'image-resize-wrapper';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    
    const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach(h => {
        const div = document.createElement('div');
        div.className = `resize-handle ${h}`;
        wrapper.appendChild(div);
        
        div.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startWidth = img.offsetWidth;
            
            const onMouseMove = (moveEvent) => {
                const diff = (h.includes('right') ? 1 : -1) * (moveEvent.clientX - startX);
                const newWidth = Math.max(50, startWidth + diff);
                img.style.width = `${newWidth}px`;
                img.style.height = 'auto'; // Maintain aspect ratio
            };
            
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                editor.dispatchEvent(new Event('input'));
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
    });
}

function removeImageResizeHandles() {
    const wrappers = document.querySelectorAll('.image-resize-wrapper');
    wrappers.forEach(w => {
        const img = w.querySelector('img');
        if (img) {
            w.parentNode.insertBefore(img, w);
        }
        w.remove();
    });
}

// Hide menu globally
document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG' && !e.target.closest('.resize-handle')) {
        removeImageResizeHandles();
    }
});

// Implementation for resizing removed - handles now used
document.addEventListener('DOMContentLoaded', () => {
    // Buttons for Notes Deletion logic
});

// --- EDITOR HELPERS ---
function updateEditorToolbarState() {
    const selection = window.getSelection();
    if (!selection.rangeCount || !selection.anchorNode) return;

    let node = selection.anchorNode;
    if (node.nodeType === 3) node = node.parentElement;

    const computedStyle = window.getComputedStyle(node);
    
    // Only update if we are inside a contenteditable area
    if (!node.closest('[contenteditable="true"]')) return;
    
    // Update Font Size Label (Sync with current selection)
    const fontSize = computedStyle.fontSize;
    const sizeDisplay = document.getElementById('current-size-display');
    if (sizeDisplay) {
        sizeDisplay.textContent = Math.round(parseFloat(fontSize));
    }

    // Update Font Family Label (Sync with current selection)
    const fontFamily = computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '');
    const fontDisplay = document.getElementById('current-font-display');
    if (fontDisplay) {
        const fontMap = {
            'Inter': 'Sans',
            'Libre Baskerville': 'Serif',
            'Outfit': 'Modern',
            'JetBrains Mono': 'Mono'
        };
        fontDisplay.textContent = fontMap[fontFamily] || fontFamily;
    }
}

function applyFont(fontName, displayName) {
    document.execCommand('fontName', false, fontName);
    const display = document.getElementById('current-font-display');
    if (display) display.textContent = displayName;
    document.getElementById('dropdown-font-family').classList.remove('show');
    editor.focus();
}

function applyFontSize(sizeValue, labelValue) {
    applyFontSizeSelected(sizeValue);
    const display = document.getElementById('current-size-display');
    if (display) display.textContent = labelValue || parseInt(sizeValue);
    document.getElementById('dropdown-font-size').classList.remove('show');
    editor.focus();
}

function applyFontSizeSelected(size) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const editorElem = document.getElementById('editor');
    if (!editorElem) return;

    const range = selection.getRangeAt(0);

    if (selection.isCollapsed) {
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.innerHTML = '&#8203;'; 
        range.insertNode(span);
        
        const newRange = document.createRange();
        newRange.setStart(span.firstChild, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    } else {
        // Force high-quality CSS spans
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('fontSize', false, '7'); 

        // Scan all children for the '7' or 'xxx-large' marker
        // We use a more aggressive search for anything matching the marker
        const allPotential = editorElem.querySelectorAll('font[size="7"], span');
        allPotential.forEach(el => {
            const isFontMarker = el.tagName === 'FONT' && el.getAttribute('size') === '7';
            const isSpanMarker = el.tagName === 'SPAN' && (el.style.fontSize === 'xxx-large' || el.style.fontSize.includes('large'));

            if (isFontMarker || isSpanMarker) {
                const finalSpan = document.createElement('span');
                finalSpan.style.fontSize = size;
                finalSpan.innerHTML = el.innerHTML;
                
                // Deep clean to prevent nesting issues
                finalSpan.querySelectorAll('span[style*="font-size"]').forEach(child => {
                    child.style.fontSize = 'inherit';
                });
                
                el.parentNode.replaceChild(finalSpan, el);
            }
        });
    }
    
    saveState();
    editorElem.focus();
}

function adjustSelectionFontSize(delta) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const node = selection.anchorNode.nodeType === 3 
        ? selection.anchorNode.parentElement 
        : selection.anchorNode;
        
    const currentSizeStr = window.getComputedStyle(node).fontSize;
    const currentSize = parseInt(currentSizeStr);
    const newSize = (currentSize + delta) + "px";
    
    applyFontSizeSelected(newSize);
}

/* --- FIREBASE LOGIC --- */
const firebaseConfig = {
  apiKey: "AIzaSyDMo071Sh-uGx6M3CSVRHnSQCy8moVwzuY",
  authDomain: "bibliastudio.firebaseapp.com",
  projectId: "bibliastudio",
  storageBucket: "bibliastudio.firebasestorage.app",
  messagingSenderId: "165499952758",
  appId: "1:165499952758:web:45dd0017bcb70fb9f1c957",
  measurementId: "G-950T17KL6J"
};

// Initialize Firebase (Compat mode for Vanilla JS)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sync Data to Firestore
async function syncNotesToCloud() {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        await db.collection('users').doc(user.uid).set({
            notes: state.notes,
            highlights: state.highlights,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("Datos sincronizados con la nube.");
    } catch (error) {
        console.error("Error al sincronizar con la nube:", error);
    }
}

// Load Data from Firestore
async function loadNotesFromCloud(user) {
    try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
            const data = doc.data();
            if (data.notes) state.notes = data.notes;
            if (data.highlights) state.highlights = data.highlights;
            
            saveState(); // Update local storage too
            renderNotesList();
            renderBibleViewer(); // Refresh highlights
            
            if (state.activeNoteId && state.notes[state.activeNoteId]) {
                openNote(state.activeNoteId);
            }
        }
    } catch (error) {
        console.error("Error al cargar datos de la nube:", error);
    }
}

// Auth State Monitor
auth.onAuthStateChanged(async (user) => {
    const loginBtn = document.getElementById('btn-login');
    const profileMenu = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userPhoto = document.getElementById('user-photo');

    if (user) {
        // Logged In
        loginBtn.style.display = 'none';
        profileMenu.style.display = 'flex';
        userName.textContent = user.displayName.split(' ')[0];
        userPhoto.src = user.photoURL;
        
        // Load cloud notes
        await loadNotesFromCloud(user);
    } else {
        // Logged Out
        loginBtn.style.display = 'flex';
        profileMenu.style.display = 'none';
    }
});

function setupEventListeners() {
    // --- BIBLE NAV DROPDOWNS ---
    const setupDropdown = (triggerId, dropdownId, renderFn) => {
        const trigger = document.getElementById(triggerId);
        const dropdown = document.getElementById(dropdownId);
        if (trigger && dropdown) {
            trigger.onclick = (e) => {
                e.stopPropagation();
                // Close others first
                document.querySelectorAll('.nav-dropdown').forEach(d => {
                    if (d.id !== dropdownId) d.classList.remove('show');
                });
                dropdown.classList.toggle('show');
                if (renderFn && dropdown.classList.contains('show')) renderFn();
            };
        }
    };

    setupDropdown('trigger-version', 'dropdown-version', renderVersionDropdown);
    setupDropdown('trigger-book', 'dropdown-book', renderBookDropdown);
    setupDropdown('trigger-chapter', 'dropdown-chapter', renderChapterDropdown);

    // --- HIGHLIGHTER LOGIC ---
    const btnHighlight = document.getElementById('btn-highlight-picker');
    const highlightPalette = document.getElementById('highlight-palette');
    
    if (btnHighlight) {
        btnHighlight.onclick = (e) => {
            e.stopPropagation();
            // Close other dropdowns first
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('show'));
            highlightPalette.classList.toggle('show');
        };
    }

    document.querySelectorAll('.palette-dot').forEach(dot => {
        dot.onclick = (e) => {
            e.stopPropagation();
            const color = dot.getAttribute('data-color');
            state.selectedHighlightColor = color;
            
            // ACTION: If there are selected verses, APPLY color to them
            if (state.selectedVerses.length > 0) {
                state.selectedVerses.forEach(vNum => {
                    const verseKey = `${state.currentVersion}_${state.currentBook}_${state.currentChapter}_${vNum}`;
                    if (color === 'none') {
                        delete state.highlights[verseKey];
                    } else {
                        // Store AS OBJECT to include timestamp (t) and color (c)
                        state.highlights[verseKey] = { c: color, t: Date.now() };
                    }
                });
                
                // Clear selection after applying color (Better UX)
                state.selectedVerses = [];
                renderBible(false); // Update colors without jumping to top
                saveState();
            }
            
            // Update UI selection on dots
            document.querySelectorAll('.palette-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const dotIndicator = document.getElementById('current-highlight-dot');
            if (dotIndicator) {
                dotIndicator.className = 'color-dot ' + (color === 'none' ? 'clear' : color);
                if (color === 'none') {
                    dotIndicator.style.backgroundColor = '#f1f5f9';
                    dotIndicator.innerHTML = '<i data-lucide="droplet-off" style="width:10px; height:10px; color:#718096;"></i>';
                } else {
                    dotIndicator.style.backgroundColor = '';
                    dotIndicator.innerHTML = '';
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            
            highlightPalette.classList.remove('show');
        };
    });

    // Close palette when clicking outside
    window.addEventListener('click', () => {
        if (highlightPalette) highlightPalette.classList.remove('show');
    });
    document.execCommand('styleWithCSS', false, false);

    // Toolbar selections
    const selectFont = document.getElementById('select-font-family');
    if (selectFont) {
        selectFont.addEventListener('change', (e) => {
            document.execCommand('fontName', false, e.target.value);
            editor.focus();
        });
    }

    const selectSize = document.getElementById('select-font-size');
    if (selectSize) {
        selectSize.addEventListener('change', (e) => {
            applyFontSizeSelected(e.target.value);
        });
    }

    const btnNewNote = document.getElementById('btn-new-note-quick');
    if (btnNewNote) {
        btnNewNote.onclick = () => createNewNote();
    }

    const btnClearFormat = document.getElementById('btn-clear-format');
    if (btnClearFormat) {
        btnClearFormat.addEventListener('click', () => {
            document.execCommand('removeFormat', false, null);
            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                applyFontSizeSelected('inherit');
            }
            editor.focus();
        });
    }

    // Selection change toolbar update
    document.addEventListener('selectionchange', updateEditorToolbarState);

    const triggerFont = document.getElementById('trigger-font-family');
    if (triggerFont) triggerFont.onclick = (e) => {
        e.stopPropagation();
        const target = document.getElementById('dropdown-font-family');
        const isShow = target.classList.contains('show');
        closeAllDropdowns();
        if (!isShow) target.classList.add('show');
    };

    const triggerSize = document.getElementById('trigger-font-size');
    if (triggerSize) triggerSize.onclick = (e) => {
        e.stopPropagation();
        const target = document.getElementById('dropdown-font-size');
        const isShow = target.classList.contains('show');
        closeAllDropdowns();
        if (!isShow) target.classList.add('show');
    };

    const triggerAlign = document.getElementById('trigger-alignment');
    if (triggerAlign) triggerAlign.onclick = (e) => {
        e.stopPropagation();
        const target = document.getElementById('dropdown-alignment');
        const isShow = target.classList.contains('show');
        closeAllDropdowns();
        if (!isShow) target.classList.add('show');
    };

    // Keyboard Shortcuts
    const editableAreas = ['editor', 'active-note-title', 'active-note-subtitle'];
    editableAreas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('keydown', (e) => {
                if (e.ctrlKey) {
                    if (e.key === '=' || e.key === '+') {
                        e.preventDefault();
                        adjustSelectionFontSize(2);
                    }
                    if (e.key === '-') {
                        e.preventDefault();
                        adjustSelectionFontSize(-2);
                    }
                }
            });
        }
    });

    // POPUPS AND DROPDOWNS
    const alignBtn = document.getElementById('btn-align');
    const alignPopup = document.getElementById('align-popup');
    const bibleSearchInput = document.getElementById('bible-main-search');
    const bibleSearchDropdown = document.getElementById('bible-search-dropdown');

    if (alignBtn && alignPopup) {
        alignBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alignPopup.style.display = alignPopup.style.display === 'none' ? 'flex' : 'none';
        });
        alignPopup.addEventListener('click', (e) => e.stopPropagation());
    }

    // Global click closer (Consolidated)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.std-dropdown-anchor') && 
            !e.target.closest('.nav-dropdown') && 
            !e.target.closest('.bible-search-main') &&
            !e.target.closest('.highlight-palette-wrapper') &&
            !e.target.closest('#btn-align')) {
            closeAllDropdowns();
        }
        
        // Specific popups that don't use .nav-dropdown class yet
        if (alignPopup && !e.target.closest('#btn-align')) alignPopup.style.display = 'none';
        const tablePopup = document.getElementById('table-selector-popup');
        if (tablePopup && !e.target.closest('#btn-insert-table')) tablePopup.style.display = 'none';
    });
    
    // Bible Search
    if (bibleSearchInput) {
        bibleSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 3) {
                performBibleSearch(query);
            } else {
                if (bibleSearchDropdown) bibleSearchDropdown.classList.remove('show');
            }
        });

        bibleSearchInput.addEventListener('focus', () => {
            if (bibleSearchInput.value.trim().length >= 3) {
                if (bibleSearchDropdown) bibleSearchDropdown.classList.add('show');
            }
        });
    }
    
    // Toolbar commands (Unified class)
    document.querySelectorAll('.std-tool-btn[data-command], .tool-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const command = btn.getAttribute('data-command');
            const value = btn.getAttribute('data-value');
            document.execCommand(command, false, value);
            editor.focus();
        });
    });

    const btnQuote = document.getElementById('btn-insert-quote');
    if (btnQuote) {
        btnQuote.onclick = () => {
            const selection = window.getSelection();
            let selectedText = selection.toString();
            
            const quoteContent = selectedText.length > 0 ? selectedText : "Escribe tu cita aquí...";
            const quoteHTML = `
                <div class="academic-quote" contenteditable="true">
                    "${quoteContent}"
                    <span class="quote-source" contenteditable="true"> — Nombre del Autor o Comentario</span>
                </div>
                <p><br></p>
            `;
            
            document.execCommand('insertHTML', false, quoteHTML);
            editor.focus();
        };
    }

    // Word-style Table Selector
    if (typeof setupTableSelector === 'function') setupTableSelector();

    // Special Inserts
    const btnYT = document.getElementById('btn-insert-youtube');
    if (btnYT) {
        btnYT.addEventListener('click', () => {
            const url = prompt("Pegue la URL de YouTube:");
            if (!url) return;
            const vidId = extractYoutubeId(url);
            if (!vidId) return;
            
            const embed = `
                <div class="video-container" contenteditable="false">
                    <iframe src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe>
                </div><p><br></p>`;
            document.execCommand('insertHTML', false, embed);
        });
    }

    const btnWeb = document.getElementById('btn-insert-web');
    if (btnWeb) {
        btnWeb.addEventListener('click', () => {
            const url = prompt("URL de la página web:");
            if (!url) return;
            const embed = `
                <div class="web-preview" style="border: 1px solid #ccc; border-radius: 8px; overflow: hidden; height: 300px;" contenteditable="false">
                    <iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>
                </div><p><br></p>`;
            document.execCommand('insertHTML', false, embed);
        });
    }

    // Import Current Bible Selection to Note
    const btnImport = document.getElementById('btn-import-verse');
    if (btnImport) {
        btnImport.addEventListener('click', async () => {
            if (state.selectedVerses.length === 0) {
                alert("Selecciona primero algunos versículos de la Biblia.");
                return;
            }

            const bible = bibleLibrary[state.currentVersion];
            if (!bible) return;

            const bObj = BOOKS.find(b => b.id === state.currentBook);
            const verses = state.selectedVerses.sort((a,b) => a-b);
            let combinedText = "";

            // Determine keys
            const first = bible.data[0] || {};
            const isSql = bible.type === 'sqlite';
            const keys = Object.keys(first);
            const bKey = isSql ? 'Book' : (keys.find(k => k.toLowerCase().replace(/\s/g, '').includes('book') || k.toLowerCase().includes('id1')) || keys[0]);
            const cKey = isSql ? 'Chapter' : (keys.find(k => k.toLowerCase().includes('chapter') || k.toLowerCase().includes('capitulo') || k.toLowerCase().includes('id2')) || keys[1]);
            const vKey = isSql ? 'Verse' : (keys.find(k => k.toLowerCase().includes('verse') || k.toLowerCase().includes('versiculo') || k.toLowerCase().includes('id3')) || keys[2]);
            const tKey = isSql ? 'Scripture' : (keys.find(k => k.toLowerCase().includes('scripture') || k.toLowerCase().includes('texto') || k.toLowerCase().includes('text')) || keys[3]);

            verses.forEach(vNum => {
                const vData = bible.data.find(row => 
                    parseInt(row[bKey]) === state.currentBook && 
                    parseInt(row[cKey]) === state.currentChapter && 
                    parseInt(row[vKey]) === vNum
                );
                if (vData) {
                    combinedText += `<sup>${vNum}</sup> ${cleanText(vData[tKey], state.currentVersion)} `;
                }
            });

            const vRange = verses.length > 1 ? `${verses[0]}-${verses[verses.length-1]}` : verses[0];
            const verseHTML = `
                <div class="premium-verse-card" contenteditable="false">
                    <div class="verse-card-text">"${combinedText.trim()}"</div>
                    <div class="verse-card-ref">${bObj.n} ${state.currentChapter}:${vRange} (${state.currentVersion})</div>
                </div><p><br></p>`;
            
            document.execCommand('insertHTML', false, verseHTML);
            editor.focus();
        });
    }

    // Image Upload
    const imgBtn = document.getElementById('btn-insert-image');
    const imgInput = document.getElementById('image-upload');
    if (imgBtn && imgInput) {
        imgBtn.addEventListener('click', () => imgInput.click());
        imgInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgHTML = `<img src="${event.target.result}" style="max-width: 100%; border-radius: 8px; margin: 10px 0;">`;
                    document.execCommand('insertHTML', false, imgHTML);
                    imgInput.value = ''; // Reset for same file again
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // History Controls Listeners
    const btnBack = document.getElementById('btn-nav-back');
    if (btnBack) btnBack.addEventListener('click', goBack);
    const btnFwd = document.getElementById('btn-nav-forward');
    if (btnFwd) btnFwd.addEventListener('click', goForward);
    const btnHist = document.getElementById('btn-nav-history');
    if (btnHist) {
        btnHist.addEventListener('click', (e) => {
            e.stopPropagation();
            const historyDropdown = document.getElementById('dropdown-history');
            if (historyDropdown) {
                historyDropdown.classList.toggle('show');
                renderHistoryDropdown();
            }
        });
    }

    // Settings Modal Toggle
    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            const overlay = document.getElementById('settings-overlay');
            if (overlay) overlay.style.display = 'flex';
        });
    }

    // Filter Notes
    const notesFilterInput = document.getElementById('notes-filter');
    if (notesFilterInput) {
        notesFilterInput.addEventListener('input', (e) => {
            renderNotesBrowser(normalizeText(e.target.value));
        });
    }

    // Local Bible Zoom (Corrected for direct feedback)
    const btnBZoomIn = document.getElementById('btn-bible-zoom-in');
    if (btnBZoomIn) {
        btnBZoomIn.onclick = () => {
            state.currentBibleFontSize += 2;
            updateBibleFontSize();
        };
    }

    const btnBZoomOut = document.getElementById('btn-bible-zoom-out');
    if (btnBZoomOut) {
        btnBZoomOut.onclick = () => {
            if (state.currentBibleFontSize > 10) {
                state.currentBibleFontSize -= 2;
                updateBibleFontSize();
            }
        };
    }

    // Notes & Highlights Browser
    const btnBrowseNotes = document.getElementById('btn-browse-notes');
    if (btnBrowseNotes) {
        btnBrowseNotes.addEventListener('click', () => {
            renderNotesBrowser();
            const overlay = document.getElementById('notes-overlay');
            if (overlay) overlay.style.display = 'flex';
        });
    }

    const btnBrowseHighlights = document.getElementById('btn-browse-highlights');
    if (btnBrowseHighlights) {
        btnBrowseHighlights.addEventListener('click', () => {
            renderHighlightsBrowser();
            const overlay = document.getElementById('highlights-overlay');
            if (overlay) overlay.style.display = 'flex';
        });
    }

    // Manual Save
    const btnSave = document.getElementById('btn-save-note');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            btnSave.classList.add('saving');
            saveState(); // Triggers both local and cloud sync
            setTimeout(() => btnSave.classList.remove('saving'), 800);
        });
    }

    // Chapter Arrows Navigation (Corrected for single trigger)
    const btnPrev = document.getElementById('btn-chapter-prev');
    const btnNext = document.getElementById('btn-chapter-next');

    if (btnPrev) {
        btnPrev.onclick = (e) => {
            e.stopPropagation();
            if (state.currentChapter > 1) {
                navigateTo(state.currentVersion, state.currentBook, state.currentChapter - 1);
            }
        };
    }

    if (btnNext) {
        btnNext.onclick = (e) => {
            e.stopPropagation();
            const book = BOOKS.find(b => b.id === state.currentBook);
            if (state.currentChapter < book.c) {
                navigateTo(state.currentVersion, state.currentBook, state.currentChapter + 1);
            }
        };
    }

    lucide.createIcons();
}

function updateBibleFontSize() {
    document.documentElement.style.setProperty('--bible-font-size', `${state.currentBibleFontSize}px`);
    const label = document.getElementById('bible-size-label');
    if (label) label.textContent = state.currentBibleFontSize;
    saveState();
}

function renderNotesBrowser(query = "") {
    const list = document.getElementById('notes-list');
    list.innerHTML = '';
    
    // Quick Creation Card
    const newBtn = document.createElement('div');
    newBtn.className = 'btn-new-note-modal';
    newBtn.innerHTML = `
        <i data-lucide="file-plus-2"></i>
        <div class="text-group">
            <span class="title">Crear Nueva Reflexión</span>
            <span class="sub">Empieza un nuevo documento de estudio</span>
        </div>
    `;
    newBtn.onclick = () => {
        createNewNote();
        document.getElementById('notes-overlay').style.display = 'none';
    };
    list.appendChild(newBtn);

    const sortedNotes = Object.keys(state.notes).filter(id => {
        const note = state.notes[id];
        return !query || normalizeText(note.title).includes(query) || normalizeText(note.content || "").includes(query);
    }).sort((a,b) => {
        return (state.notes[b].updatedAt || 0) - (state.notes[a].updatedAt || 0);
    });

    sortedNotes.forEach(id => {
        const note = state.notes[id];
        const date = new Date(note.updatedAt || Date.now());
        const dateStr = date.toLocaleDateString([], { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
        
        const item = document.createElement('div');
        item.className = 'note-list-item';
        item.innerHTML = `
            <div class="note-info">
                <div class="note-title">${note.title || "Sin título"}</div>
                <div class="note-meta">MODIFICADO EL ${dateStr}</div>
                <div class="note-preview">${(note.content || "").replace(/<[^>]*>/g, "").substring(0, 120)}</div>
            </div>
            <button class="icon-btn delete-btn" title="Eliminar">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        
        item.onclick = (e) => {
            if (e.target.closest('.delete-btn')) {
                if (confirm('¿Eliminar esta reflexión definitivamente?')) {
                    deleteNote(id);
                    renderNotesBrowser(query);
                }
                return;
            }
            state.currentNoteId = id;
            saveState();
            loadCurrentNote();
            document.getElementById('notes-overlay').style.display = 'none';
        };
        list.appendChild(item);
    });
    lucide.createIcons();
}

function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length == 11) ? match[2] : null;
}

// --- MODAL SYSTEM ---
// --- INLINE DROPDOWN RENDERING ---
function renderVersionDropdown() {
    const list = document.getElementById('dropdown-version');
    list.innerHTML = '';
    const versions = Object.keys(bibleLibrary);
    
    versions.forEach(v => {
        const item = document.createElement('div');
        item.className = 'version-item' + (state.currentVersion === v ? ' active' : '');
        item.textContent = v;
        item.onclick = (e) => {
            e.stopPropagation();
            state.currentVersion = v;
            saveState();
            updateUIState();
            renderBible();
            list.classList.remove('show');
        };
        list.appendChild(item);
    });
}

function renderBookDropdown() {
    const list = document.getElementById('dropdown-book');
    list.innerHTML = `
        <div class="books-columns">
            <div class="books-column" id="col-ot">
                <div class="column-header">Antiguo Testamento</div>
            </div>
            <div class="books-column" id="col-nt">
                <div class="column-header">Nuevo Testamento</div>
            </div>
        </div>
    `;
    
    const colOT = list.querySelector('#col-ot');
    const colNT = list.querySelector('#col-nt');
    
    BOOKS.forEach(b => {
        const item = document.createElement('div');
        item.className = 'book-link' + (state.currentBook === b.id ? ' active' : '');
        item.textContent = b.n;
        item.onclick = (e) => {
            e.stopPropagation();
            state.currentBook = b.id;
            state.currentChapter = 1;
            state.selectedVerses = [];
            saveState();
            updateUIState();
            renderBible();
            list.classList.remove('show');
        };
        if (b.id <= 39) colOT.appendChild(item);
        else colNT.appendChild(item);
    });
}

function renderChapterDropdown() {
    const list = document.getElementById('dropdown-chapter');
    list.innerHTML = '<div class="chapters-grid-inline"></div>';
    const grid = list.querySelector('.chapters-grid-inline');
    
    const book = BOOKS.find(b => b.id === state.currentBook);
    for (let i = 1; i <= book.c; i++) {
        const btn = document.createElement('div');
        btn.className = 'chapter-btn' + (state.currentChapter === i ? ' active' : '');
        btn.textContent = i;
        btn.onclick = (e) => {
            e.stopPropagation();
            navigateTo(state.currentVersion, state.currentBook, i);
            list.classList.remove('show');
        };
        grid.appendChild(btn);
    }
}

// --- HISTORY ENGINE ---
function navigateTo(v, b, c, isHistoryNav = false) {
    if (!isHistoryNav) {
        // If we are at a point in history and navigate elsewhere, truncate future
        if (state.historyIndex < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyIndex + 1);
        }
        
        const last = state.history[state.history.length - 1];
        if (!last || (last.v !== v || last.b !== b || last.c !== c)) {
            state.history.push({ v, b, c });
            state.historyIndex = state.history.length - 1;
            
            // Also maintain fullHistory for the dropdown (unique/most recent first)
            state.fullHistory = state.fullHistory.filter(h => h.v !== v || h.b !== b || h.c !== c);
            state.fullHistory.unshift({ v, b, c, timestamp: Date.now() });
            if (state.fullHistory.length > 50) state.fullHistory.pop(); // Cap at 50
        }
    }

    state.currentVersion = v;
    state.currentBook = b;
    state.currentChapter = c;
    state.selectedVerses = [];
    
    saveState();
    updateUIState();
    renderBible();
}

function goBack() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        const dest = state.history[state.historyIndex];
        navigateTo(dest.v, dest.b, dest.c, true);
    }
}

function goForward() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const dest = state.history[state.historyIndex];
        navigateTo(dest.v, dest.b, dest.c, true);
    }
}

function renderHistoryDropdown() {
    const list = document.getElementById('history-items-list');
    list.innerHTML = '';
    
    if (state.fullHistory.length === 0) {
        list.innerHTML = '<div style="padding: 10px; font-size: 12px; color: var(--secondary); opacity: 0.6; text-align: center;">Sin historial de lectura</div>';
        return;
    }

    state.fullHistory.forEach(h => {
        const bObj = BOOKS.find(b => b.id === h.b);
        if (!bObj) return;

        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-item-info">
                <span class="history-item-ref">${bObj.n} ${h.c}</span>
                <span class="history-item-version">${h.v}</span>
            </div>
            <span class="history-item-time">${new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        item.onclick = () => {
            navigateTo(h.v, h.b, h.c);
            document.getElementById('dropdown-history').classList.remove('show');
        };
        list.appendChild(item);
    });
}

// --- SPLIT RESIZER ---
function setupResizer() {
    const resizer = document.getElementById('main-resizer');
    const biblePanel = document.getElementById('bible-panel');
    const notesPanel = document.getElementById('notes-panel');
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
        isResizing = true;
        document.body.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const container = document.getElementById('main-split');
        const containerRect = container.getBoundingClientRect();
        const offsetX = e.clientX - containerRect.left;
        let percentage = (offsetX / containerRect.width) * 100;
        
        if (percentage < 20) percentage = 20;
        if (percentage > 80) percentage = 80;
        
        state.splitPos = percentage;
        biblePanel.style.flex = percentage;
        notesPanel.style.flex = 100 - percentage;
        
        // Update Adaptive Toolbars
        updateToolbarOverflow();
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.classList.remove('resizing');
            saveState();
        }
    });
}

// --- TOOLTIP ---
const tooltip = document.getElementById('tooltip');

function setupTooltipEvents() {
    document.querySelectorAll('.ref-link').forEach(link => {
        link.addEventListener('mouseenter', async (e) => {
            const refText = e.target.getAttribute('data-ref');
            tooltip.innerHTML = `<strong>${refText}</strong><br><div class="ref-preview">Buscando versículo...</div>`;
            tooltip.style.display = 'block';
            tooltip.style.top = `${e.pageY + 10}px`;
            tooltip.style.left = `${e.pageX + 10}px`;
            
            // Try to find the actual text
            const foundText = await findReferenceText(refText);
            tooltip.querySelector('.ref-preview').textContent = foundText || "Referencia no encontrada en esta versión.";
        });
        
        link.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        link.addEventListener('mousemove', (e) => {
            tooltip.style.top = `${e.pageY + 10}px`;
            tooltip.style.left = `${e.pageX + 10}px`;
        });
    });
}

const bookAbbr = {
    "Gn": 1, "Ex": 2, "Lv": 3, "Nm": 4, "Dt": 5, "Jos": 6, "Jue": 7, "Rt": 8, "1S": 9, "2S": 10,
    "1R": 11, "2R": 12, "1Cr": 13, "2Cr": 14, "Esd": 15, "Neh": 16, "Est": 17, "Job": 18, "Sal": 19,
    "Pr": 20, "Ec": 21, "Cnt": 22, "Is": 23, "Jr": 24, "Lm": 25, "Ez": 26, "Dn": 27, "Os": 28, "Jl": 29,
    "Am": 30, "Ab": 31, "Jon": 32, "Mi": 33, "Na": 34, "Hab": 35, "So": 36, "Ag": 37, "Zc": 38, "Ml": 39,
    "Mt": 40, "Mc": 41, "Lc": 42, "Jn": 43, "Hch": 44, "Ro": 45, "1Co": 46, "2Co": 47, "Ga": 48, "Ef": 49,
    "Flp": 50, "Col": 51, "1Ts": 52, "2Ts": 53, "1Ti": 54, "2Ti": 55, "Tit": 56, "Flm": 57, "Heb": 58,
    "Stg": 59, "1Pe": 60, "2Pe": 61, "1Jn": 62, "2Jn": 63, "3Jn": 64, "Jud": 65, "Ap": 66
};

async function findReferenceText(ref) {
    try {
        const parts = ref.split(' ');
        if (parts.length < 2) return null;
        
        let bookName = parts[0];
        let rest = parts[1];
        
        // Handle names like 1 Juan
        if (["1", "2", "3"].includes(parts[0])) {
            bookName = parts[0] + parts[1];
            rest = parts[2];
        }
        
        const [ch, vs] = rest.split(':');
        const bookId = bookAbbr[bookName] || BOOKS.find(b => b.n.startsWith(bookName))?.id;
        
        if (!bookId) return null;
        
        const bible = bibleLibrary[state.currentVersion];
        if (!bible) return null;
        
        const isSql = bible.type === 'sqlite';
        const keys = Object.keys(bible.data[0] || {});
        // Same improved detection
        const bKey = isSql ? 'Book' : (keys.find(k => k.toLowerCase().replace(/\s/g, '').includes('book') || k.toLowerCase().includes('libro') || k.toLowerCase().includes('id1')) || keys[0]);
        const cKey = isSql ? 'Chapter' : (keys.find(k => k.toLowerCase().includes('chapter') || k.toLowerCase().includes('capitulo') || k.toLowerCase().includes('id2')) || keys[1]);
        const vKey = isSql ? 'Verse' : (keys.find(k => k.toLowerCase().includes('verse') || k.toLowerCase().includes('versiculo') || k.toLowerCase().includes('id3')) || keys[2]);
        const tKey = isSql ? 'Scripture' : (keys.find(k => k.toLowerCase().includes('scripture') || k.toLowerCase().includes('texto') || k.toLowerCase().includes('text') || k.toLowerCase().includes('vtext')) || keys[3]);

        const verse = bible.data.find(v => 
            parseInt(v[bKey]) === bookId && 
            parseInt(v[cKey]) === parseInt(ch) && 
            parseInt(v[vKey]) === parseInt(vs)
        );
        
        return verse ? cleanText(verse[tKey], state.currentVersion).replace(/<[^>]*>/g, "") : null;
    } catch (err) {
        return null;
    }
}

function setupTableSelector() {
    const btn = document.getElementById('btn-insert-table');
    const popup = document.getElementById('table-selector-popup');
    const grid = document.getElementById('table-grid');
    const dimText = document.getElementById('table-dim');
    
    if (!grid) return;
    
    // Create dots
    grid.innerHTML = '';
    for (let r = 1; r <= 10; r++) {
        for (let c = 1; c <= 10; c++) {
            const dot = document.createElement('div');
            dot.className = 'table-dot';
            dot.dataset.row = r;
            dot.dataset.col = c;
            
            dot.addEventListener('mouseenter', () => highlightDots(r, c));
            dot.addEventListener('click', () => {
                insertTable(r, c);
                popup.style.display = 'none';
            });
            grid.appendChild(dot);
        }
    }
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });
    
    document.addEventListener('click', () => popup.style.display = 'none');
    popup.addEventListener('click', (e) => e.stopPropagation());
    
    function highlightDots(maxR, maxC) {
        document.querySelectorAll('.table-dot').forEach(dot => {
            const r = parseInt(dot.dataset.row);
            const c = parseInt(dot.dataset.col);
            if (r <= maxR && c <= maxC) {
                dot.classList.add('highlight');
            } else {
                dot.classList.remove('highlight');
            }
        });
        dimText.textContent = `${maxR}x${maxC}`;
    }
}

function insertTable(rows, cols) {
    let table = '<table style="width:100%; border-collapse: collapse; margin: 16px 0;">';
    for (let i = 0; i < rows; i++) {
        table += '<tr>';
        for (let j = 0; j < cols; j++) {
            table += '<td style="border: 1px solid #ddd; padding: 12px; min-width: 40px; height: 30px;">&nbsp;</td>';
        }
        table += '</tr>';
    }
    table += '</table><p><br></p>';
    
    editor.focus();
    document.execCommand('insertHTML', false, table);
}

function updateToolbarOverflow() {
    initBibleCarousel();
    initNotesCarousel();
    if (window.lucide) lucide.createIcons();
}

function initToolbarObservers() {
    initBibleCarousel();
    initNotesCarousel();
}

// Global debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// UNIVERSAL CAROUSEL SYSTEM
function initBibleCarousel() {
    setupCarousel('bible-toolbar-scrollable', 'btn-bible-scroll-left', 'btn-bible-scroll-right');
}

function initNotesCarousel() {
    setupCarousel('notes-toolbar-scrollable', 'btn-notes-scroll-left', 'btn-notes-scroll-right');
}

function setupCarousel(containerId, leftId, rightId) {
    const scrollContainer = document.getElementById(containerId);
    const btnLeft = document.getElementById(leftId);
    const btnRight = document.getElementById(rightId);
    
    if (!scrollContainer || !btnLeft || !btnRight) return;

    let currentX = 0;
    let isDown = false;
    let startX;
    let moved = false;

    const applyBoundaries = (newX) => {
        const parentWidth = scrollContainer.parentElement.clientWidth;
        const totalWidth = scrollContainer.scrollWidth;
        const maxScroll = -(totalWidth - (parentWidth - 60));
        
        if (newX > 0) return 0;
        if (totalWidth <= (parentWidth - 60)) return 0;
        if (newX < maxScroll) return maxScroll;
        return newX;
    };

    const checkOverflow = () => {
        const parentWidth = scrollContainer.parentElement.clientWidth;
        const totalWidth = scrollContainer.scrollWidth;
        const hasOverflow = totalWidth > (parentWidth - 60);

        if (hasOverflow) {
            btnLeft.style.display = currentX < 0 ? 'flex' : 'none';
            btnRight.style.display = (parentWidth - 60 - currentX) < totalWidth ? 'flex' : 'none';
        } else {
            currentX = 0;
            scrollContainer.style.transform = `translateX(0)`;
            btnLeft.style.display = 'none';
            btnRight.style.display = 'none';
        }
    };

    // Trackpad Support (Wheel)
    scrollContainer.onwheel = (e) => {
        const delta = e.deltaX || e.deltaY; // Support horizontal or vertical wheel
        if (Math.abs(delta) > 5) {
            e.preventDefault();
            scrollContainer.style.transition = 'none';
            currentX = applyBoundaries(currentX - delta);
            scrollContainer.style.transform = `translateX(${currentX}px)`;
            checkOverflow();
        }
    };

    // Mouse Drag Support
    scrollContainer.onmousedown = (e) => {
        isDown = true;
        moved = false;
        startX = e.pageX - currentX;
        scrollContainer.style.transition = 'none';
    };

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        moved = true;
        const x = e.pageX - startX;
        currentX = applyBoundaries(x);
        scrollContainer.style.transform = `translateX(${currentX}px)`;
        checkOverflow();
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDown) return;
        isDown = false;
        scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Prevent accidental clicks if moved significantly
        if (moved) {
            const preventClick = (event) => {
                event.stopImmediatePropagation();
                window.removeEventListener('click', preventClick, true);
            };
            window.addEventListener('click', preventClick, true);
        }
        checkOverflow();
    });

    btnLeft.onclick = (e) => {
        e.stopPropagation();
        scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        currentX = applyBoundaries(currentX + 200);
        scrollContainer.style.transform = `translateX(${currentX}px)`;
        checkOverflow();
    };

    btnRight.onclick = (e) => {
        e.stopPropagation();
        scrollContainer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        currentX = applyBoundaries(currentX - 200);
        scrollContainer.style.transform = `translateX(${currentX}px)`;
        checkOverflow();
    };

    const obs = new ResizeObserver(checkOverflow);
    obs.observe(scrollContainer.parentElement);
}

window.addEventListener('load', updateToolbarOverflow);
window.addEventListener('resize', updateToolbarOverflow);


function renderHighlightsBrowser(sortBy = 'book') {
    const list = document.getElementById('highlights-list');
    list.innerHTML = '';
    
    // Convert current highlights to array
    const hArray = [];
    for (const key in state.highlights) {
        const parts = key.split('_'); // version_book_chapter_verse
        const hData = state.highlights[key];
        const color = typeof hData === 'object' ? hData.c : hData;
        const timestamp = typeof hData === 'object' ? hData.t : 0;
        
        hArray.push({
            key,
            version: parts[0],
            bookId: parseInt(parts[1]),
            chapter: parseInt(parts[2]),
            verse: parseInt(parts[3]),
            color: color,
            time: timestamp
        });
    }

    if (hArray.length === 0) {
        list.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--secondary); opacity: 0.6;">Tu colección de marcadores está vacía.</div>';
        return;
    }

    // Sort
    if (sortBy === 'book') {
        hArray.sort((a,b) => a.bookId - b.bookId || a.chapter - b.chapter || a.verse - b.verse);
    } else {
        hArray.sort((a,b) => (b.time || 0) - (a.time || 0));
    }

    hArray.forEach(h => {
        const book = BOOKS.find(b => b.id === h.bookId);
        
        // Format Date elegantly
        const date = new Date(h.time || Date.now());
        const dateStr = date.toLocaleDateString([], { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
        
        let verseText = "Cargando versículo...";
        if (bibleLibrary[h.version]) {
            const bible = bibleLibrary[h.version];
            const isSql = bible.type === 'sqlite';
            const keys = Object.keys(bible.data[0] || {});
            const bKey = isSql ? 'Book' : (keys.find(k => k.toLowerCase().replace(/\s/g, '').includes('book') || k.toLowerCase().includes('libro') || k.toLowerCase().includes('id1')) || keys[0]);
            const cKey = isSql ? 'Chapter' : (keys.find(k => k.toLowerCase().includes('chapter') || k.toLowerCase().includes('capitulo') || k.toLowerCase().includes('id2')) || keys[1]);
            const vKey = isSql ? 'Verse' : (keys.find(k => k.toLowerCase().includes('verse') || k.toLowerCase().includes('versiculo') || k.toLowerCase().includes('id3')) || keys[2]);
            const tKey = isSql ? 'Scripture' : (keys.find(k => k.toLowerCase().includes('scripture') || k.toLowerCase().includes('texto') || k.toLowerCase().includes('text') || k.toLowerCase().includes('vtext')) || keys[3]);

            const vData = bible.data.find(v => 
                parseInt(v[bKey]) === h.bookId && 
                parseInt(v[cKey]) === h.chapter && 
                parseInt(v[vKey]) === h.verse
            );
            if (vData) verseText = cleanText(vData[tKey], h.version).replace(/<[^>]*>/g, "");
        }

        const item = document.createElement('div');
        item.className = 'highlight-list-item';
        item.innerHTML = `
            <div class="h-item-details">
                <div class="h-item-ref">${book ? book.n : 'Libro'} ${h.chapter}:${h.verse}</div>
                <div class="h-item-meta">${h.version} • ${dateStr}</div>
                <div class="h-item-text">"${verseText}"</div>
            </div>
            <i data-lucide="external-link" style="width: 18px; opacity: 0.3; margin-top: 4px;"></i>
        `;
        item.onclick = () => {
            state.currentVersion = h.version;
            state.currentBook = h.bookId;
            state.currentChapter = h.chapter;
            state.selectedVerses = [h.verse];
            saveState();
            updateUIState();
            renderBible();
            document.getElementById('highlights-overlay').style.display = 'none';
        };
        list.appendChild(item);
    });
    lucide.createIcons();
}

// Additional Event Listeners for Highlights
document.getElementById('btn-browse-highlights').addEventListener('click', () => {
    document.getElementById('highlights-overlay').style.display = 'flex';
    renderHighlightsBrowser('book');
});

document.getElementById('sort-h-book').onclick = () => {
    document.querySelectorAll('.sort-mini-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sort-h-book').classList.add('active');
    renderHighlightsBrowser('book');
};

document.getElementById('sort-h-date').onclick = () => {
    document.querySelectorAll('.sort-mini-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sort-h-date').classList.add('active');
    renderHighlightsBrowser('date');
};

// Start app
init();
function performBibleSearch(query) {
    const bible = bibleLibrary[state.currentVersion];
    if (!bible) return;

    const dropdown = document.getElementById('bible-search-dropdown');
    if (!dropdown) return;

    // Logic for keys (patterned after renderBible)
    const first = bible.data[0] || {};
    const keys = Object.keys(first);
    const isSql = bible.type === 'sqlite';
    const bKey = isSql ? 'Book' : (keys.find(k => k.toLowerCase().replace(/\s/g, '').includes('book') || k.toLowerCase().includes('libro') || k.toLowerCase().includes('id1')) || keys[0]);
    const cKey = isSql ? 'Chapter' : (keys.find(k => k.toLowerCase().includes('chapter') || k.toLowerCase().includes('capitulo') || k.toLowerCase().includes('id2')) || keys[1]);
    const vKey = isSql ? 'Verse' : (keys.find(k => k.toLowerCase().includes('verse') || k.toLowerCase().includes('versiculo') || k.toLowerCase().includes('id3')) || keys[2]);
    const tKey = isSql ? 'Scripture' : (keys.find(k => k.toLowerCase().includes('scripture') || k.toLowerCase().includes('texto') || k.toLowerCase().includes('text') || k.toLowerCase().includes('vtext')) || keys[3]);

    const normalizedQuery = normalizeText(query);
    const results = bible.data.filter(v => {
        const text = String(v[tKey] || "");
        const normalizedVerse = normalizeText(text);
        return normalizedVerse.includes(normalizedQuery);
    }).slice(0, 50); // Smaller limit for dropdown performance

    if (results.length === 0) {
        dropdown.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--secondary); font-size: 13px;">No hay resultados</div>';
    } else {
        dropdown.innerHTML = `
            <div class="column-header" style="background: var(--neutral); padding: 8px 12px; border-bottom: 1px solid var(--border-color);">
                ${results.length} resultados encontrados
            </div>
            <div class="search-results-list">
                ${results.map(v => {
                    const bId = parseInt(v[bKey]);
                    const cId = parseInt(v[cKey]);
                    const vId = parseInt(v[vKey]);
                    const bookName = BOOKS.find(b => b.id === bId)?.n || "Libro";
                    const cleanTextVal = cleanText(v[tKey], state.currentVersion);
                    
                    return `
                        <div class="search-result-item" onclick="jumpToVerse(${bId}, ${cId}, ${vId}); document.getElementById('bible-search-dropdown').classList.remove('show');">
                            <div class="search-result-ref">${bookName} ${cId}:${vId}</div>
                            <div class="search-result-text">${cleanTextVal}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    dropdown.classList.add('show');
}

function jumpToVerse(bookId, chapterId, verseId) {
    // Navigate first (this clears selection)
    navigateTo(state.currentVersion, bookId, chapterId);
    
    // Select AFTER navigation so it's not cleared
    state.selectedVerses = [verseId];
    
    // Render and notify
    updateUIState();
    renderBible();
    
    // Scroll specifically to this verse
    setTimeout(() => {
        const target = document.querySelector(`.verse[data-verse="${verseId}"]`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('flash-highlight');
            setTimeout(() => target.classList.remove('flash-highlight'), 2000);
        }
    }, 500);
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(d => d.classList.remove('show'));
    
    const searchDropdown = document.getElementById('bible-search-dropdown');
    if (searchDropdown) searchDropdown.classList.remove('show');
    
    const palette = document.querySelector('.highlight-palette');
    if (palette) palette.classList.remove('show');
}

function createNewNote() {
    const id = 'note-' + Date.now();
    state.notes[id] = {
        title: "Nueva Reflexión",
        subtitle: "Añadir subtítulo...",
        content: "",
        date: new Date().toLocaleDateString()
    };
    state.currentNoteId = id;
    saveState();
    loadCurrentNote();
    
    // Auto-focus title for immediate writing
    setTimeout(() => {
        const titleEl = document.getElementById('active-note-title');
        if (titleEl) {
            titleEl.focus();
            // Select all text for easy replacement
            const range = document.createRange();
            range.selectNodeContents(titleEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, 150);
}

function applyAlign(command, iconName) {
    document.execCommand(command, false, null);
    const icon = document.getElementById('current-align-icon');
    if (icon) {
        icon.setAttribute('data-lucide', iconName);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    closeAllDropdowns();
    editor.focus();
}
