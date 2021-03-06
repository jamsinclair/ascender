import { DropZone } from 'ascender';

const dropZoneEl = document.querySelector('.dropzone');
const fileListEl = document.querySelector('.file-list');
const instance = DropZone(dropZoneEl, { accept: 'image/jpeg,image/png' });
instance.on('fileadded', file => {
  fileListEl.innerHTML += `<li>${file.name} - ${file.type} - ${file.size} bytes</li>`;
});
