const modal = document.getElementById('imageUploadModal');
const titleEl = document.getElementById('imageUploadTitle');
const dropZone = document.getElementById('image-drop-zone');
const previewGrid = document.getElementById('image-preview-grid');
const fileInput = document.getElementById('hiddenFileInput');
const triggerBtn = document.getElementById('triggerImageUpload');
const confirmBtn = document.getElementById('confirmImageSelectionBtn');

let currentFiles = [];
let resolvePromise;
let rejectPromise;
let isMultiple = false;

function handleFiles(files) {
    const fileList = Array.from(files);
    
    if (!isMultiple) {
        currentFiles = fileList.slice(0, 1);
    } else {
        currentFiles.push(...fileList);
    }
    renderPreviews();
}

function renderPreviews() {
    previewGrid.innerHTML = '';
    if (currentFiles.length > 0) {
        dropZone.classList.add('hidden');
        previewGrid.classList.remove('hidden');
    } else {
        dropZone.classList.remove('hidden');
        previewGrid.classList.add('hidden');
    }

    currentFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button class="preview-remove-btn" data-index="${index}">&times;</button>
            `;
            previewGrid.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function removeFile(index) {
    currentFiles.splice(index, 1);
    renderPreviews();
}

function resetModal() {
    currentFiles = [];
    fileInput.value = '';
    renderPreviews();
}

function openModal(options) {
    isMultiple = options.multiple || false;
    fileInput.multiple = isMultiple;
    titleEl.textContent = isMultiple ? 'Selecionar Imagens' : 'Selecionar Imagem';
    resetModal();
    modal.classList.remove('hidden');
}

export const openImageUploader = (options = {}) => {
    openModal(options);
    return new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });
};

function setupEventListeners() {
    triggerBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    }, false);

    previewGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('preview-remove-btn')) {
            const index = parseInt(e.target.dataset.index, 10);
            removeFile(index);
        }
    });

    confirmBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (resolvePromise) {
            const result = isMultiple ? currentFiles : currentFiles[0];
            resolvePromise(result);
        }
    });

    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        if (rejectPromise) rejectPromise(new Error('Seleção de imagem cancelada.'));
    });
}

setupEventListeners();