import { DropZone, createDataUri } from 'ascender';

const dropZoneEl = document.querySelector('.dropzone');
const fileListEl = document.querySelector('.file-previews');
const instance = DropZone(dropZoneEl, { accept: 'image/jpeg,image/png,image/gif,image/svg+xml' });
instance.on('fileadded', async file => {
  const dataUri = await createDataUri(file);
  fileListEl.innerHTML += `<figure class="preview"><img alt="${file.name}" src="${dataUri}" /></figure>`;
});
