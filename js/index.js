const $form = document.getElementById('form-search');
const $input = document.getElementById('input-search');
const $gallery = document.getElementById('gallery');
const $DivButtonMas = document.getElementById('button-div');
const $modalMode = document.querySelector('.modal-mode');
const $modalWindow = document.querySelector('.modal-window');
const $spanClose = document.querySelector('.modal-close');
const apiKey = '03izeRvt75kC5OcSOvEgat_NSWfaW1wDNQvLegH6ifA';
const $iconSearch = document.querySelector('.icon-search');

let imgForPage = 30;

document.addEventListener('DOMContentLoaded', () => {
  $input.value = 'Parrot';
  let keyword = 'parrot';
  let positionPage = 1;
  apiFetch(keyword, positionPage);
});

$iconSearch.addEventListener('click', (e) => {
  e.preventDefault();
  let keyword = $input.value;
  let positionPage = 1;
  $gallery.innerHTML = '';
  apiFetch(keyword, positionPage);
});

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  let positionPage = 1;
  let keyword = $input.value;
  $gallery.innerHTML = '';
  apiFetch(keyword, positionPage);
});

const apiFetch = async (keyword, positionPage) => {
  $gallery.style.display = 'flex';
  $galleryGuardado.style.display = 'none';
  if (keyword.length < 1) {
    $DivButtonMas.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos/?query=${keyword}&page=${positionPage}&per_page=${imgForPage}&client_id=${apiKey}`
    );
    let data = await response.json();
    createImages(data);
    recarge(data, positionPage);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const recarge = (data, positionPage) => {
  let totalP = data.total;
  let totalPages = totalP / 30;

  if (positionPage < totalPages) {
    $DivButtonMas.innerHTML = `<button id="button-agregar" class="button-mas-imagenes">MÁS IMÁGENES</button>`;
    const $buttonMas = document.getElementById('button-agregar');
    $buttonMas.addEventListener('click', () => {
      positionPage = positionPage + 1;
      apiFetch($input.value, positionPage);
    });
  } else {
    $DivButtonMas.innerHTML = '';
  }
};

let arrImagenes = [];
let arrImagenesGuardadas =
  JSON.parse(localStorage.getItem('arrGuardadas')) || [];

const createImages = (data) => {
  data.results.forEach((elem) => {
    let $imageDiv = document.createElement('div');
    $imageDiv.className = 'div-image';
    $imageDiv.setAttribute('id', elem.id);
    $imageDiv.addEventListener('click', modalM);

    let $image = document.createElement('img');
    $image.src = elem.urls.regular;

    $imageDiv.appendChild($image);
    $gallery.appendChild($imageDiv);

    const buttonAddDirect = document.createElement('button');
    buttonAddDirect.className = 'button-span-add';
    buttonAddDirect.innerHTML = 'Guardar';
    buttonAddDirect.setAttribute('id', elem.id);
    buttonAddDirect.addEventListener('click', setGuardado);

    const $h3 = document.createElement('h3');

    $imageDiv.addEventListener('mouseover', () => {
      $imageDiv.appendChild(buttonAddDirect);

      buttonAddDirect.style.opacity = '0';
      setTimeout(() => {
        buttonAddDirect.style.opacity = '1';
      }, 100);

      $h3.textContent = $input.value.toUpperCase();
      $h3.className = 'h3-hover';
      $imageDiv.appendChild($h3);
      setTimeout(() => {
        $h3.style.opacity = '1';
      }, 120);

      $imageDiv.addEventListener('mouseleave', () => {
        $imageDiv.removeChild(buttonAddDirect);
        $image.style.opacity = '1';
        $imageDiv.removeChild($h3);
      });
    });
    arrImagenes.push($imageDiv);
  });
};

function modalM(event) {
  $modalWindow.innerHTML = '';
  $modalMode.style.display = 'block';

  const imageUrl = document.createElement('img');
  imageUrl.src = event.target.src;
  $modalWindow.appendChild(imageUrl);

  $modalWindow.appendChild($spanClose);

  $spanClose.addEventListener('click', () => {
    $modalMode.style.display = 'none';
  });

  $modalMode.addEventListener('click', () => {
    $modalMode.style.display = 'none';
  });

  const $buttonAdd = document.createElement('button');
  const $buttonDescargar = document.createElement('button');
  const $buttonAddDiv = document.createElement('div');
  $buttonAddDiv.className = 'button-div-modal';
  $buttonAdd.setAttribute('id', event.currentTarget.id);

  $buttonAdd.textContent = 'Guardar';
  $buttonDescargar.textContent = 'Compartir';
  $buttonAddDiv.appendChild($buttonAdd);
  $buttonAddDiv.appendChild($buttonDescargar);
  $modalWindow.appendChild($buttonAddDiv);

  $buttonDescargar.addEventListener('click', () => {
    window.location.href = 'mailto:destinatario@example.com';
  });

  $buttonAdd.addEventListener('click', setGuardado);
}

function setGuardado(event) {
  event.stopPropagation();
  event.preventDefault();

  let addImg = arrImagenes.find((elem) => {
    return elem.id === event.currentTarget.id;
  });
  console.log(addImg);

  let dataImage = {
    id: addImg.id,
    imageUrl: addImg.firstElementChild.src,
  };

  console.log(dataImage);

  if (arrImagenesGuardadas.some((elem) => elem.id === dataImage.id)) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'error',
      title: 'Ya guardaste esta Imagen',
    });
    return;
  } else {
    arrImagenesGuardadas.push(dataImage);
  }

  localStorage.setItem('arrGuardadas', JSON.stringify(arrImagenesGuardadas));

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: 'success',
    title: 'Guardado Correctamente',
  });
}

const $buttonGuardado = document.getElementById('a-guardado');

$buttonGuardado.addEventListener('click', mostrarGuardado);

const $galleryGuardado = document.getElementById('gallery-guardados');

function mostrarGuardado(event) {
  event.preventDefault();
  $gallery.style.display = 'none';
  $galleryGuardado.style.display = 'flex';

  $DivButtonMas.innerHTML = '';
  $gallery.innerHTML = '';
  $galleryGuardado.innerHTML = '';
  arrImagenesGuardadas.forEach((elem) => {
    let $div = document.createElement('div');
    $div.className = 'div-image-guardada';
    let $img = document.createElement('img');
    $img.src = elem.imageUrl;
    let $span = document.createElement('span');
    $span.className = 'span-eliminar';
    $span.innerHTML = '&#10006;';

    $span.addEventListener('click', () => {
      const index = arrImagenesGuardadas.findIndex((img) => {
        return img.id === elem.id;
      });
      console.log(index);

      arrImagenesGuardadas.splice(index, 1);
      localStorage.setItem(
        'arrGuardadas',
        JSON.stringify(arrImagenesGuardadas)
      );
      $galleryGuardado.removeChild($div);
    });

    $div.appendChild($span);

    $div.appendChild($img);
    $galleryGuardado.appendChild($div);
  });
}
