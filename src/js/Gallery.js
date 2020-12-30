export default class Gallery {
  constructor(form, picsContainer) {
    this.form = form;
    this.picsContainer = picsContainer;
    this.contentArray = [];
    this.storage = localStorage;
  }

  init() {
    this.addContainer();
    this.addForm();
    this.loadData();
    this.showPicture();
    this.addListener();
  }

  addContainer() {
    this.pictureContainer = document.createElement('div');
    this.pictureContainer.classList.add('pics-container');

    this.container = document.createElement('div');
    this.container.classList.add('container');
    this.container.appendChild(this.pictureContainer);

    this.body = document.querySelector('body');
    this.body.insertBefore(this.container, this.body.childNodes[0]);
  }

  addListener() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete')) { this.deletePicture(e); }
      if (e.target.classList.contains('btn-submit')) { this.addPicture(e); }
    });
  }

  addForm() {
    this.container.insertBefore(this.form.getForm(), this.container.childNodes[0]);

    this.fieldTitle = document.querySelector('.field-title');
    this.fieldUrl = document.querySelector('.field-url');
  }

  static showMessage(message, element) {
    const hint = element.nextElementSibling;
    hint.textContent = message;
    hint.style.left = `${element.getBoundingClientRect().left}px`;

    if (window.screen.width > 640) {
      hint.style.top = `${element.getBoundingClientRect().top - 30}px`;
    } else {
      hint.style.top = `${element.getBoundingClientRect().top + 30}px`;
    }

    setTimeout(() => {
      hint.textContent = '';
      hint.removeAttribute('style');
    }, 2000);
  }

  getID() {
    let cnt = 0;
    // eslint-disable-next-line no-loop-func
    while (this.contentArray.some((e) => e.id === String(cnt))) {
      cnt += 1;
    }
    return String(cnt);
  }

  addPicture(e) {
    e.preventDefault();

    if (!this.fieldTitle.value) {
      Gallery.showMessage('Нужно заполнить поле', this.fieldTitle);
      return;
    }

    const img = document.createElement('img');
    img.src = this.fieldUrl.value;
    img.alt = this.fieldTitle.value;

    img.onerror = () => Gallery.showMessage('Неверный URL изображения', this.fieldUrl);

    img.onload = () => {
      img.classList.add('pic');
      img.dataset.id = this.getID();

      const container = {
        title: img.alt,
        url: img.src,
        id: img.dataset.id,
        node: this.picsContainer.getContainer(),
      };
      container.node.classList.remove('empty');
      container.node.appendChild(img);
      this.contentArray.push(container);

      this.fieldUrl.value = '';
      this.fieldTitle.value = '';

      this.showPicture();
    };
  }

  showPicture() {
    this.cleanPictureContainer();

    this.contentArray.forEach((e) => {
      this.pictureContainer.appendChild(e.node);
    });

    this.addEmptyPicture();

    this.saveData();
  }

  deletePicture(e) {
    e.preventDefault();

    const elementToDelete = e.target.closest('.pic-container');
    const img = elementToDelete.querySelector('img');

    if (img) {
      this.contentArray = this.contentArray.filter((el) => el.id !== img.dataset.id);
    }
    this.showPicture();
  }

  cleanPictureContainer() {
    this.pictureContainer.innerHTML = '';
  }

  addEmptyPicture() {
    while (this.pictureContainer.childNodes.length < 2) {
      this.pictureContainer.appendChild(this.picsContainer.getContainer());
    }
    this.pictureContainer.appendChild(this.picsContainer.getContainer());
  }

  saveData() {
    this.storage.setItem('data', JSON.stringify(this.contentArray));
  }

  loadData() {
    if (!this.storage.getItem('data')) { return; }

    const data = JSON.parse(this.storage.getItem('data'));
    data.forEach((e) => {
      const img = document.createElement('img');
      img.classList.add('pic');
      img.src = e.url;
      img.alt = e.title;
      img.dataset.id = e.id;

      e.node = this.picsContainer.getContainer();
      e.node.classList.remove('empty');
      e.node.appendChild(img);
    });

    this.contentArray = data;
  }
}
