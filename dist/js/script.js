// =======================================================================================================

$(window).on("scroll", function () {
  if ($(this).scrollTop() > 100) {
    $(".header").addClass("sticky");
    $("main").css("margin-top", "120px");
  } else {
    $(".header").removeClass("sticky");
    $("main").css("margin-top", "0px");
  }
});
// $('.wrapper').addClass('loaded');
$(".icon-menu").click(function (event) {
  event.preventDefault();
  $(this).toggleClass("_active");
  $(".menu").toggleClass("_active");
  $("body").toggleClass("_lock");
});
// =======================================================================================================
// Sliders:
let swiperMain = new Swiper(".mainslider__body", {
  // direction: 'vertical',
  slidesPerView: 1,
  autoHeight: false,
  slidesPerGroup: 1,
  centeredSlides: true,
  initialSlide: 1,
  slidesPerColumn: 1,
  loop: true,
  autoplay: {
    delay: 300000,
  },
  speed: 600,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
// _ibg
function _ibg() {
  $.each($("._ibg"), function (index, val) {
    if ($(this).find("img").length > 0) {
      $(this).css(
        "background-image",
        'url("' + $(this).find("img").attr("src") + '")'
      );
    }
  });
}
_ibg();
// =======================================================================================================
(function () {
  let navLinks = $("nav ul li a"),
    // navM = $('nav').height(),
    navM = 40,
    section = $("section"),
    documentEl = $(document);

  documentEl.on("scroll", function () {
    let currentScrollPage = documentEl.scrollTop();

    section.each(function () {
      let self = $(this);
      if (
        self.offset().top < currentScrollPage + navM &&
        currentScrollPage + navM < self.offset().top + self.outerHeight()
      ) {
        let targetClass = "." + self.attr("class") + "-page";
        navLinks.removeClass("_active");
        $(targetClass).addClass("_active");
      }
    });
  });
})();
$(document).ready(function () {
  $('nav a[href^="#"]').click(function () {
    let target = $(this).attr("href");
    $("html, body").animate(
      {
        scrollTop: $(target).offset().top,
      },
      500
    );
    // $('nav a[href^="#"]').removeClass('_active');
    // $(this).addClass('_active')
    return false;
  });
});
// =======================================================================================================
let select = function () {
  let selectHeader = document.querySelectorAll(".select__header");
  let selectItem = document.querySelectorAll(".select__item");

  selectHeader.forEach((item) => {
    item.addEventListener("click", selectToggle);
  });

  selectItem.forEach((item) => {
    item.addEventListener("click", selectChoose);
  });

  function selectToggle() {
    this.parentElement.classList.toggle("is-active");
  }

  function selectChoose() {
    let text = this.innerText,
      select = this.closest(".select"),
      currentText = select.querySelector(".select__current");
    currentText.innerText = text;
    select.classList.remove("is-active");
  }
};

select();
// =======================================================================================================
(function () {
  let original_positions = [];
  let da_elements = document.querySelectorAll("[data-da]");
  let da_elements_array = [];
  let da_match_media = [];
  // Заполняем массивы
  if (da_elements.length > 0) {
    let number = 0;
    for (let index = 0; index < da_elements.length; index++) {
      const da_element = da_elements[index];
      const da_move = da_element.getAttribute("data-da");
      const da_array = da_move.split(",");
      if (da_array.length == 3) {
        da_element.setAttribute("data-da-index", number);
        // Zapolnyaem massiv pervonachalniy pozitsii
        original_positions[number] = {
          parent: da_element.parentNode,
          index: index_in_parent(da_element),
        };
        // Zapolnyaem massiv elementov
        da_elements_array[number] = {
          element: da_element,
          destination: document.querySelector("." + da_array[0].trim()),
          place: da_array[1].trim(),
          breakpoint: da_array[2].trim(),
        };
        number++;
      }
    }
    dynamic_adapt_sort(da_elements_array);

    // Sozdaem sobitia v tochke brekpointa
    for (let index = 0; index < da_elements_array.length; index++) {
      const el = da_elements_array[index];
      const da_breakpont = el.breakpoint;
      const da_type = "max"; // Dlya MobileFirst pomenyat na min

      da_match_media.push(
        window.matchMedia("(" + da_type + "-width: " + da_breakpont + "px)")
      );
      da_match_media[index].addListener(dynamic_adapt);
    }
  }
  // Osnovnaya funksiya
  function dynamic_adapt(e) {
    for (let index = 0; index < da_elements_array.length; index++) {
      const el = da_elements_array[index];
      const da_element = el.element;
      const da_destination = el.destination;
      const da_place = el.place;
      const da_breakpont = el.breakpoint;
      const da_classname = "_dynamic_adapt_" + da_breakpont;

      if (da_match_media[index].matches) {
        // Perebrasivaem elementi
        if (!da_element.classList.contains(da_classname)) {
          let actual_index;
          if (da_place == "first") {
            actual_index = index_of_elements(da_destination)[0];
          } else if (da_place == "last") {
            actual_index = index_of_elements(da_destination)[
              index_of_elements(da_destination).length
            ];
          } else {
            actual_index = index_of_elements(da_destination)[da_place];
          }
          da_destination.insertBefore(
            da_element,
            da_destination.children[actual_index]
          );
          da_element.classList.add(da_classname);
        }
      } else {
        // Vozvrashaet na mesto
        if (da_element.classList.contains(da_classname)) {
          dynamic_adapt_back(da_element);
          da_element.classList.remove(da_classname);
        }
      }
    }
    custom_adapt();
  }

  // Vizov osnovnoi funksii
  dynamic_adapt();

  // Funksia vozvrat na mesto
  function dynamic_adapt_back(el) {
    const da_index = el.getAttribute("data-da-index");
    const original_place = original_positions[da_index];
    const parent_place = original_place["parent"];
    const index_place = original_place["index"];
    const actual_index = index_of_elements(parent_place, true)[index_place];
    parent_place.insertBefore(el, parent_place.children[actual_index]);
  }
  // Funksia polucheniya indeksa vnutri roditelya
  function index_in_parent(el) {
    let children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  // Funksia polucheniya massiva indeksov elementov vnutri roditelya
  function index_of_elements(parent, back) {
    const children = parent.children;
    const children_array = [];
    for (let i = 0; i < children.length; i++) {
      const children_element = children[i];
      if (back) {
        children_array.push(i);
      } else {
        // Isklyuchaya perenesenniy element
        if (children_element.getAttribute("data-da") == null) {
          children_array.push(i);
        }
      }
    }
    return children_array;
  }
  // Sortirovka obekta
  function dynamic_adapt_sort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) {
        return -1;
      } else {
        return 1;
      } // Dlya MobileFirst pomenyat
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  // Dopolnitelniy senarii adaptatsii
  function custom_adapt() {
    const viewport_width = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  // Слушаем изменение размера экрана ----<<>>
})();

// Обьявленям переменные
// const parent_original = document.querySelector('.content__blocks_city');
// const parent = document.querySelector('.content__column_river');
// const item = document.querySelector('.content__block_item');

// Слушаем изменение размера экрана
window.addEventListener("resize", function (event) {
  const viewport_width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  if (viewport_width < 992) {
    if (!item.classList.contains("done")) {
      parent.insertBefore(item, parent.children[2]);
      item.classList.add("done");
    }
  } else {
    if (item.classList.contains("done")) {
      parent_original.insertBefore(item, parent_original.children[2]);
      item.classList.remove("done");
    }
  }
});

// =======================================================================================================
const maskPhone = () => {
  const inputsPhone = document.querySelectorAll('input[name="phone"]');

  inputsPhone.forEach((input) => {
    let keyCode;

    const mask = (event) => {
      event.keyCode && (keyCode = event.keyCode);
      let pos = input.selectionStart;

      if (pos < 3) {
        event.preventDefault();
      }
      let matrix = "+998 (__) ___ __ __ ",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = input.value.replace(/\D/g, ""),
        newValue = matrix.replace(/[_\d]/g, (a) => {
          if (i < val.length) {
            return val.charAt(i++) || def.charAt(i);
          } else {
            return a;
          }
        });
      i = newValue.indexOf("_");
      if (i !== -1) {
        i < 5 && (i = 3);
        newValue = newValue.slice(0, i);
      }

      let reg = matrix
        .substr(0, input.value.length)
        .replace(/_+/g, (a) => {
          return "\\d{1," + a.length + "}";
        })
        .replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (
        !reg.test(input.value) ||
        input.value.length < 5 ||
        (keyCode > 20 && keyCode < 30)
      ) {
        input.value = newValue;
      }
      if (event.type == "blur" && input.value.length < 5) {
        input.value = "";
      }
    };
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  });
};
maskPhone();

// =======================================================================================================

// =======================================================================================================
// base.js
const $base = {};
window.$base = $base;
// =======================================================================================================
// modal.js
Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
};

function _createModal(options) {
  const modal = document.createElement("div");
  modal.classList.add("product-modal");
  modal.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="product-modal-overlay" data-close="true">
    <div class="product-modal-window">
      ${
        options.closable
          ? `<div class="product-modal-close" ><img data-close="true" src="img/del.svg" alt=""></div>`
          : ""
      }
      <div class="product-modal-body modalproduct-item" data-content>
        <div class="modalproduct-item__col"></div>
        <div class="modalproduct-item__col">
					<div class="modalproduct-item__content"></div></div>
        </div>
      </div>
    </div>
  </div>
  `
  );
  document.body.appendChild(modal);
  return modal;
}

$base.modal = function (options) {
  const ANIMATION_SPEED = 200;
  const $modal = _createModal(options);
  let closing = false;
  let destroyed = false;

  const modal = {
    open() {
      if (destroyed) {
        return;
      }
      !closing && $modal.classList.add("open");
    },
    close() {
      closing = true;
      $modal.classList.remove("open");
      $modal.classList.add("hide");
      setTimeout(() => {
        $modal.classList.remove("hide");
        closing = false;
      }, ANIMATION_SPEED);
    },
  };

  const listener = (event) => {
    if (event.target.dataset.close) {
      modal.close();
    }
  };

  $modal.addEventListener("click", listener);

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal);
      $modal.removeEventListener("click", listener);
      destroyed = true;
    },
    setContent(html) {
      $modal.querySelector("[data-content]").innerHTML = html;
    },
  });
};
// =======================================================================================================

// index.js
let drinks = [
  {
    id: 1,
    title: "Coca-cola",
    text: 0.6,
    price: 7000,
    img: "coca-cola",
    inCart: 0,
  },
  {
    id: 2,
    title: "Fanta",
    text: 0.7,
    price: 6000,
    img: "fanta",
    inCart: 0,
  },
  {
    id: 3,
    title: "Sprite",
    text: 0.5,
    price: 6500,
    img: "sprite",
    inCart: 0,
  },
  {
    id: 4,
    title: "Fuse teo",
    text: 0.5,
    price: 6300,
    img: "fuseteo",
    inCart: 0,
  },
  {
    id: 5,
    title: "Dena",
    text: 0.5,
    price: 6000,
    img: "dena",
    inCart: 0,
  },
  {
    id: 6,
    title: "Nestle",
    text: 0.5,
    price: 4000,
    img: "nestle",
    inCart: 0,
  },
];
let coffes = [
  {
    id: 1,
    title: "Cofe 1",
    text: "Americano",
    price: 7000,
    img: "cofe1",
    inCart: 0,
  },
  {
    id: 2,
    title: "cofe 01",
    text: "cappuchino",
    price: 6300,
    img: "cofe01",
    inCart: 0,
  },
  {
    id: 3,
    title: "cofe 2",
    text: "Americano",
    price: 6000,
    img: "cofe2",
    inCart: 0,
  },
  {
    id: 4,
    title: "Cofe 3",
    text: "Maccofe",
    price: 7000,
    img: "cofe3",
    inCart: 0,
  },
  {
    id: 5,
    title: "Maccofe",
    text: "lorem",
    price: 6500,
    img: "maccofe",
    inCart: 0,
  },
  {
    id: 6,
    title: "Nescafe",
    text: "Nescafe",
    price: 8000,
    img: "nescafe",
    inCart: 0,
  },
];
let pizzas = [
  {
    id: 1,
    title: "Веджитариан",
    text: `Моцарелла, ветчина из цыпленка, пепперони из цыпленка, кубики брынзы, томаты, шампиньоны, томатный соус, итальянские травы`,
    price: 35000,
    img: "веджитариан",
    additional: {
      img: "img/product/02.png",
      text: "Острый халапеньо",
      price: 5000,
    },
    additional2: {
      img: "img/product/03.png",
      text: "Брынза",
      price: 10000,
    },
    energy: {
      label: "Пищевая ценность в 100 гр",
      text: "Жиры: 18.6 гр Белки: 10.1 гр Углеводы: 18.6 гр",
      cost: "Энергитическая ценность: 270.7 ккал",
    },
    inCart: 0,
  },
  {
    id: 2,
    title: "Пепперони",
    text: `Моцарелла, ветчина из цыпленка, пепперони из цыпленка, кубики брынзы, томаты, шампиньоны, томатный соус, итальянские травы`,
    price: 40000,
    img: "пепперони",
    additional: {
      img: "img/product/02.png",
      text: "Острый халапеньо",
      price: 5000,
    },
    additional2: {
      img: "img/product/04.png",
      text: "Брынза",
      price: 10000,
    },
    energy: {
      label: "Пищевая ценность в 120 гр",
      text: "Жиры: 18.6 гр Белки: 10.1 гр Углеводы: 18.6 гр",
      cost: "Энергитическая ценность: 240.7 ккал",
    },
    inCart: 0,
  },
  {
    id: 3,
    title: "Ветчина и грибы",
    text: `Моцарелла, ветчина из цыпленка, пепперони из цыпленка, кубики брынзы, томаты, шампиньоны, томатный соус, итальянские травы`,
    price: 30000,
    img: "ветчинаигрибы",
    additional: {
      img: "img/product/02.png",
      text: "Острый халапеньо",
      price: 5000,
    },
    additional2: {
      img: "img/product/03.png",
      text: "Брынза",
      price: 10000,
    },
    energy: {
      label: "Пищевая ценность в 100 гр",
      text: "Жиры: 15.6 гр Белки: 10.1 гр Углеводы: 18.6 гр",
      cost: "Энергитическая ценность: 320.7 ккал",
    },
    inCart: 0,
  },
  {
    id: 4,
    title: "Маргарита",
    text: `Моцарелла, ветчина из цыпленка, пепперони из цыпленка, кубики брынзы, томаты, шампиньоны, томатный соус, итальянские травы`,
    price: 38000,
    img: "маргарита",
    additional: {
      img: "img/product/02.png",
      text: "Острый халапеньо",
      price: 5000,
    },
    additional2: {
      img: "img/product/03.png",
      text: "Брынза",
      price: 10000,
    },
    energy: {
      label: "Пищевая ценность в 100 гр",
      text: "Жиры: 16.6 гр Белки: 10.1 гр Углеводы: 18.6 гр",
      cost: "Энергитическая ценность: 240.7 ккал",
    },
    inCart: 0,
  },
  {
    id: 5,
    title: "Сырный цыпленок",
    text: `Моцарелла, ветчина из цыпленка, пепперони из цыпленка, кубики брынзы, томаты, шампиньоны, томатный соус, итальянские травы`,
    price: 40000,
    img: "сырныйцыпленок",
    additional: {
      img: "img/product/02.png",
      text: "Острый халапеньо",
      price: 5000,
    },
    additional2: {
      img: "img/product/03.png",
      text: "Брынза",
      price: 10000,
    },
    energy: {
      label: "Пищевая ценность в 100 гр",
      text: "Жиры: 18.6 гр Белки: 10.1 гр Углеводы: 18.6 гр",
      cost: "Энергитическая ценность: 270.7 ккал",
    },
    inCart: 0,
  },
];

const toHTML = (drink) => `
<div class="product__column">
	<div class="product__item item-product" >
		<div class="item-product__image">
			<img src="./img/images/${drink.img}.png" alt="${drink.title}" data-btn="img" data-id="${drink.id}">
		</div>
		<div class="item-product__content">
			<div class="item-product__label">${drink.title}</div>
			<p class="item-product__text">${drink.text} л.</p>
			<a href="#" class="item-product__btn btn" data-btn="price" data-id="${drink.id}">
				${drink.price} сум
			</a>
		</div>
	</div>
</div>
`;
const toHTMLCoffe = (coffe) => `
<div class="product__column">
	<div class="product__item item-product" >
		<div class="item-product__image">
			<img src="./img/images/${coffe.img}.png" alt="${coffe.title}" data-btm="img" data-to="${coffe.id}">
		</div>
		<div class="item-product__content">
			<div class="item-product__label">${coffe.title}</div>
			<p class="item-product__text">${coffe.text}</p>
			<a href="#" class="item-product__btn btn" data-btm="price" data-to="${coffe.id}">
			От	${coffe.price} сум
			</a>
		</div>
	</div>
</div>
`;
const toHTMLPizza = (pizza) => `
<div class="product__column">
	<div class="product__item item-product" >
		<div class="item-product__image">
			<img src="./img/images/${pizza.img}.png" alt="${pizza.title}" data-btp="img" data-pi="${pizza.id}">
		</div>
		<div class="item-product__content">
			<div class="item-product__label">${pizza.title}</div>
			<p class="item-product__text">${pizza.text}</p>
			<a href="#" class="item-product__btn btn" data-btp="price" data-pi="${pizza.id}">
			От	${pizza.price} сум
			</a>
		</div>
	</div>
</div>
`;

function render() {
  const html = drinks.map(toHTML).join("");
  document.querySelector("#drinks").innerHTML = html;
  const htmlCoffes = coffes.map(toHTMLCoffe).join("");
  document.querySelector("#coffes").innerHTML = htmlCoffes;
  const htmlPizzas = pizzas.map(toHTMLPizza).join("");
  document.querySelector("#pizzas").innerHTML = htmlPizzas;
}
render();

const priceModal = $base.modal({
  closable: true,
  content: `
	`,
});
document.addEventListener("click", (event) => {
  event.preventDefault();
  const btnType = event.target.dataset.btn;
  const id = +event.target.dataset.id;
  const drink = drinks.find((f) => f.id === id);
  if (btnType === "price" || btnType === "img") {
    priceModal.setContent(`
			<div class="product-modal-body modalproduct-item">
				<div class="modalproduct-item__col">
					<div class="modalproduct-item__image">
						<img src="./img/images/${drink.img}.png" alt="">
					</div>
				</div>
				<div class="modalproduct-item__col">
					<div class="modalproduct-item__title">${drink.title}</div>
					<div class="modalproduct-item__size">${drink.text} л</div>
					<div class="modalproduct-item__price">${drink.price} сум</div>
					<div class="modalproduct-item__footer">
					<div class="modalproduct-item__actions">
						<button type="button" onclick="addCartD(${drink.id})"  class="add-to-cart btn">В корзину</button>
					</div>
			</div>
		`);
    priceModal.open();
  }
});
document.addEventListener("click", (event) => {
  event.preventDefault();
  const btnType = event.target.dataset.btm;
  const id = +event.target.dataset.to;
  const coffe = coffes.find((t) => t.id === id);
  if (btnType === "price" || btnType === "img") {
    priceModal.setContent(`
			<div class="product-modal-body modalproduct-item">
				<div class="modalproduct-item__col">
					<div class="modalproduct-item__image">
						<img src="./img/images/${coffe.img}.png" alt="">
					</div>
				</div>
				<div class="modalproduct-item__col">
					<div class="modalproduct-item__title" data-name="${coffe.title}">${coffe.title}</div>
					<div class="modalproduct-item__size">${coffe.text}</div>
					<div class="modalproduct-item__price" data-price="${coffe.price}">${coffe.price} сум</div>
					<div class="modalproduct-item__footer">
					<div class="modalproduct-item__actions">
						<button type="button" onclick="addCartC(${coffe.id})" class="add-to-cart btn">В корзину</button>
					</div>
			</div>
		`);
    priceModal.open();
  }
});
document.addEventListener("click", (event) => {
  event.preventDefault();
  const btnType = event.target.dataset.btp;
  const id = +event.target.dataset.pi;
  const pizza = pizzas.find((p) => p.id === id);
  if (btnType === "price" || btnType === "img") {
    priceModal.setContent(`
    <div class="product-v-modal-overlay">
    <div class="product-v-modal-window">
      <div class="product-v-modal__header">
        <div class="product-v-modal__title">${pizza.title}</div>
        <button type="button" class="product-v-modal-close">
          <img data-close="true" src="img/del.svg" alt="">
        </button>
        <div class="product-v-modal__info v-modal-info">
          <div class="v-modal-info__image"><img onclick="vInfo()" src="img/comp.png" alt=""></div>
          <div class="v-modal-info__content">
            <div class="v-modal-info__item">
              <div class="v-modal-info__label">${pizza.energy.label}:</div>
              <p class="v-modal-info__text">${pizza.energy.text}</p>
              <p class="v-modal-info__text">${pizza.energy.cost}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="product-v-modal-body v-modalproduct-item">
        <div class="v-modalproduct-item__col">
          <div class="v-modalproduct-item__image">
            <img src="./img/images/${pizza.img}.png" alt="">
          </div>
        </div>
        <div class="v-modalproduct-item__col">
          <div class="v-modalproduct-item__content">
            <div class="v-modalproduct-item__text">${pizza.text}</div>
            <div class="v-modalproduct-item__actions item-v-modal">
              <div class="item-v-modal__label">Размер</div>
              <div class="item-v-modal__types">
                <div class="item-v-modal__type item-v-modal__type--small">
                  <label for="small">Маленькая</label>
                  <input type="radio" onclick="typeCheck1()" name="choose" id="small" value="small">
                </div>
                <div class="item-v-modal__type item-v-modal__type--middle _active">
                  <label for="middle">Средняя</label>
                  <input type="radio" onclick="typeCheck2()" name="choose" id="middle" value="middle" checked="true">
                </div>
                <div class="item-v-modal__type item-v-modal__type--big">
                  <label for="large">Большая</label>
                  <input type="radio" onclick="typeCheck3()" name="choose" id="large" value="large">
                </div>
              </div>
            </div>
            <div class="v-modalproduct-item__actions item-v-modal">
              <div class="item-v-modal__label">Тесто</div>
              <div class="item-v-modal__doughs">
                <div class="item-v-modal__dough item-v-modal__dough--tradition _active">
                  <label for="tradition">Традиционное</label>
                  <input type="radio" onclick="doughCheck1()" name="check" id="tradition" value="tradition" checked="true">
                </div>
                <div class="item-v-modal__dough item-v-modal__dough--thin">
                  <label for="thin">Тонкое</label>
                  <input type="radio" onclick="doughCheck2()" name="check" id="thin" value="thin">
                </div>
              </div>
            </div>
            <div class="v-modalproduct-item__add item-v-modal">
              <div class="item-v-modal__label">Добавить в пиццу</div>
              <label for="item1" onclick="addItem1()" id="additem1" class="item-v-modal__card card-v-item ">
              <input type="checkbox" id="item1" name="item">
                <div class="card-v-item__image"><img src="${pizza.additional.img}" alt=""></div>
                <div class="card-v-item__info">
                  <div class="card-v-item__text">${pizza.additional.text}</div>
                  <div class="card-v-item__price" id="itemPrice1">${pizza.additional.price} сум</div>
                </div>
                <div class="card-v-item__check"><img src="img/check.svg" alt=""></div>
              </label>
              <label for="item2" onclick="addItem2()" id="additem2" class="item-v-modal__card card-v-item">
                <input type="checkbox" name="item" id="item2" value="brinza">
                <div class="card-v-item__image"><img src="${pizza.additional2.img}" alt=""></div>
                <div class="card-v-item__info">
                  <div class="card-v-item__text">${pizza.additional2.text}</div>
                  <div class="card-v-item__price" id="itemPrice2">
                  ${pizza.additional2.price} сум</div>
                </div>
                <div class="card-v-item__check"><img src="img/check.svg" alt=""></div>
              </label>
              <div class="item-v-modal__bottom">
                <button type="submit" onclick="addCartP(${pizza.id})"  class="item-v-modal__btn btn">Добавить в корзину <span id="vbutton">${pizza.price}
                    </span> сум</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
		`);
    priceModal.open();
  }
});
// !=======================================================================================================
let toltipOverlay = document.querySelector(".tooltip-overlay");
// =======================================================================================================
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart-count").textContent = productNumbers;
  }
}
//* -- start coffe functions
function addCartC(product, action) {
  const coffe = coffes.find((c) => c.id === product);
  toltipOverlay.classList.add("_active");
  setTimeout(() => {
    toltipOverlay.classList.remove("_active");
  }, 800);
  cartNumbers(coffe, action);
  totalCost(coffe);
}
function setItems(coffe) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    let currentProduct = coffe.img;

    if (cartItems[currentProduct] == undefined) {
      cartItems = {
        ...cartItems,
        [currentProduct]: coffe,
      };
    }
    cartItems[currentProduct].inCart += 1;
  } else {
    coffe.inCart = 1;
    cartItems = {
      [coffe.img]: coffe,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}
function cartNumbers(coffe, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (action) {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart-count").textContent = productNumbers - 1;
    console.log("action running");
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart-count").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart-count").textContent = 1;
  }
  setItems(coffe);
}
function totalCost(coffe, action) {
  let cart = localStorage.getItem("totalCost");

  if (action) {
    cart = parseInt(cart);

    localStorage.setItem("totalCost", cart - coffe.price);
  } else if (cart != null) {
    cart = parseInt(cart);
    localStorage.setItem("totalCost", cart + coffe.price);
  } else {
    localStorage.setItem("totalCost", coffe.price);
  }
}
function manageQuantityC() {
  let decreaseButtons = document.querySelectorAll(".decrease");
  let increaseButtons = document.querySelectorAll(".increase");
  let currentQuantity = 0;
  let currentProduct = "";
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  for (let i = 0; i < increaseButtons.length; i++) {
    decreaseButtons[i].addEventListener("click", () => {
      console.log(cartItems);
      console.log("cliked");
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.parentElement.previousElementSibling.previousElementSibling.textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(currentProduct);

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbers(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCartC();
      }
    });

    increaseButtons[i].addEventListener("click", () => {
      console.log(cartItems);
      currentQuantity = increaseButtons[i].parentElement.querySelector("span")
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.parentElement.previousElementSibling.previousElementSibling.textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(currentProduct);

      cartItems[currentProduct].inCart += 1;
      cartNumbers(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCartC();
    });
  }
}
function displayCartC(coffe) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  let cart = localStorage.getItem("totalCost");
  cart = parseInt(cart);

  let productsContainer = document.querySelector(".product-v-modal-cart");

  if (cartItems && productsContainer) {
    productsContainer.innerHTML = "";
    Object.values(cartItems).map((item, index) => {
      productsContainer.innerHTML += `
        <div class="modal-cart__body">
          <div class="modal-cart__item item-modal-cart">
            <a href="#"   id="${
              item.id
            }" class="item-modal-cart__delete"><img src="img/basket.svg" alt=""></a>
            <div class="item-modal-cart__image"><img src="./img/images/${
              item.img
            }.png" alt=""></div>
            <div class="item-modal-cart__content">
              <div class="item-modal-cart__label">${item.title}</div>
              <p class="item-modal-cart__text">${item.text}</p>
              <div class="item-modal-cart__actions">
                <div class="item-modal-cart__quantity">
                  <button class="decrease">-</button>
                    <span>${item.inCart}</span>
                  <button class="increase">+</button>
                </div>
                <div class="item-modal-cart__price">${
                  item.inCart * item.price
                } сум</div>
              </div>
            </div>
          </div>
        </div>
        `;
    });
    productsContainer.innerHTML += `
      <div class="modal-footer">
        <div class="modal-footer__amount">
          <p>Общая сумма:</p>
         <span id="total">${cart} сум</span>
        </div>
        <button type="submit" class="modal-footer__order btn">Заказать</button>
      </div>
      `;
    deleteButtonsC();
    manageQuantityC();
  }
}
function deleteButtonsC() {
  let deleteButtons = document.querySelectorAll(".item-modal-cart__delete");
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartCost = localStorage.getItem("totalCost");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productName;
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      productName = deleteButtons[
        i
      ].parentElement.children[2].children[0].textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(productName);
      // console.log(productNumbers);

      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );
      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));

      displayCartC();
      onLoadCartNumbers();
    });
  }
}
//* -- end coffe functions --

//* -- start drink functions
function addCartD(product2) {
  const drink = drinks.find((d) => d.id === product2);
  toltipOverlay.classList.add("_active");
  setTimeout(() => {
    toltipOverlay.classList.remove("_active");
  }, 800);
  cartNumbersD(drink);
  totalCost2(drink);
  // displayCartD(drink);
}
function setItems2(drink) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    let currentProduct = drink.img;

    if (cartItems[currentProduct] == undefined) {
      cartItems = {
        ...cartItems,
        [currentProduct]: drink,
      };
    }
    cartItems[currentProduct].inCart += 1;
  } else {
    drink.inCart = 1;
    cartItems = {
      [drink.img]: drink,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}
function cartNumbersD(drink, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (action) {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart-count").textContent = productNumbers - 1;
    console.log("action running");
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart-count").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart-count").textContent = 1;
  }
  setItems2(drink);
}
function totalCost2(drink, action) {
  let cart = localStorage.getItem("totalCost");

  if (action) {
    cart = parseInt(cart);

    localStorage.setItem("totalCost", cart - drink.price);
  } else if (cart != null) {
    cart = parseInt(cart);
    localStorage.setItem("totalCost", cart + drink.price);
  } else {
    localStorage.setItem("totalCost", drink.price);
  }
}
function manageQuantityD() {
  let decreaseButtons = document.querySelectorAll(".decrease");
  let increaseButtons = document.querySelectorAll(".increase");
  let currentQuantity = 0;
  let currentProduct = "";
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  for (let i = 0; i < increaseButtons.length; i++) {
    decreaseButtons[i].addEventListener("click", () => {
      console.log(cartItems);
      console.log("cliked");
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.parentElement.previousElementSibling.previousElementSibling.textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(currentProduct);

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbersD(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCartD();
      }
    });

    increaseButtons[i].addEventListener("click", () => {
      console.log(cartItems);
      currentQuantity = increaseButtons[i].parentElement.querySelector("span")
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.parentElement.previousElementSibling.previousElementSibling.textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(currentProduct);

      cartItems[currentProduct].inCart += 1;
      cartNumbersD(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCartD();
    });
  }
}
function displayCartD(drink) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  let cart = localStorage.getItem("totalCost");
  cart = parseInt(cart);

  let productsContainer = document.querySelector(".product-v-modal-cart");

  if (cartItems && productsContainer) {
    productsContainer.innerHTML = "";
    Object.values(cartItems).map((item, index) => {
      productsContainer.innerHTML += `
        <div class="modal-cart__body">
          <div class="modal-cart__item item-modal-cart">
            <a href="#"   id="${
              item.id
            }" class="item-modal-cart__delete"><img src="img/basket.svg" alt=""></a>
            <div class="item-modal-cart__image"><img src="./img/images/${
              item.img
            }.png" alt=""></div>
            <div class="item-modal-cart__content">
              <div class="item-modal-cart__label">${item.title}</div>
              <p class="item-modal-cart__text">${item.text}</p>
              <div class="item-modal-cart__actions">
                <div class="item-modal-cart__quantity">
                  <button class="decrease">-</button>
                    <span>${item.inCart}</span>
                  <button class="increase">+</button>
                </div>
                <div class="item-modal-cart__price">${
                  item.inCart * item.price
                } сум</div>
              </div>
            </div>
          </div>
        </div>
        `;
    });
    productsContainer.innerHTML += `
      <div class="modal-footer">
        <div class="modal-footer__amount">
          <p>Общая сумма:</p>
         <span id="total">${cart} сум</span>
        </div>
        <button type="submit" class="modal-footer__order btn">Заказать</button>
      </div>
      `;
    deleteButtonsD();
    manageQuantityD();
  }
}
function deleteButtonsD() {
  let deleteButtons = document.querySelectorAll(".item-modal-cart__delete");
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartCost = localStorage.getItem("totalCost");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productName;
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      productName = deleteButtons[
        i
      ].parentElement.children[2].children[0].textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(productName);
      // console.log(productNumbers);

      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );
      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));

      displayCartD();
      onLoadCartNumbers();
    });
  }
}
//* -- end drink functions --

//* -- start pizza functions
function addCartP(product3) {
  const pizza = pizzas.find((p) => p.id === product3);
  toltipOverlay.classList.add("_active");
  setTimeout(() => {
    toltipOverlay.classList.remove("_active");
  }, 800);
  cartNumbersP(pizza);
  totalCost3(pizza);
  // displayCartP(pizza);
}
function setItems3(pizza) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    let currentProduct = pizza.img;

    if (cartItems[currentProduct] == undefined) {
      cartItems = {
        ...cartItems,
        [currentProduct]: pizza,
      };
    }
    cartItems[currentProduct].inCart += 1;
  } else {
    pizza.inCart = 1;
    cartItems = {
      [pizza.img]: pizza,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}
function cartNumbersP(pizza, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (action) {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart-count").textContent = productNumbers - 1;
    console.log("action running");
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart-count").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart-count").textContent = 1;
  }
  setItems3(pizza);
}
function totalCost3(pizza, action) {
  let cart = localStorage.getItem("totalCost");

  if (action) {
    cart = parseInt(cart);

    localStorage.setItem("totalCost", cart - pizza.price);
  } else if (cart != null) {
    cart = parseInt(cart);
    localStorage.setItem("totalCost", cart + pizza.price);
  } else {
    localStorage.setItem("totalCost", pizza.price);
  }
}
function manageQuantityP() {
  let decreaseButtons = document.querySelectorAll(".decrease");
  let increaseButtons = document.querySelectorAll(".increase");
  let currentQuantity = 0;
  let currentProduct = "";
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  for (let i = 0; i < increaseButtons.length; i++) {
    decreaseButtons[i].addEventListener("click", () => {
      console.log(cartItems);
      console.log("cliked");
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.parentElement.previousElementSibling.previousElementSibling.textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(currentProduct);

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbersP(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCartP();
      }
    });

    increaseButtons[i].addEventListener("click", () => {
      console.log(cartItems);
      currentQuantity = increaseButtons[i].parentElement.querySelector("span")
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.parentElement.previousElementSibling.previousElementSibling.textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(currentProduct);

      cartItems[currentProduct].inCart += 1;
      cartNumbersP(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCartP();
    });
  }
}
function displayCartP(pizza) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  let cart = localStorage.getItem("totalCost");
  cart = parseInt(cart);

  let productsContainer = document.querySelector(".product-v-modal-cart");

  if (cartItems && productsContainer) {
    productsContainer.innerHTML = "";
    Object.values(cartItems).map((item, index) => {
      productsContainer.innerHTML += `
        <div class="modal-cart__body">
          <div class="modal-cart__item item-modal-cart">
            <a href="#"   id="${
              item.id
            }" class="item-modal-cart__delete"><img src="img/basket.svg" alt=""></a>
            <div class="item-modal-cart__image"><img src="./img/images/${
              item.img
            }.png" alt=""></div>
            <div class="item-modal-cart__content">
              <div class="item-modal-cart__label">${item.title}</div>
              <p class="item-modal-cart__text">${item.text}</p>
              <div class="item-modal-cart__actions">
                <div class="item-modal-cart__quantity">
                  <button class="decrease">-</button>
                    <span>${item.inCart}</span>
                  <button class="increase">+</button>
                </div>
                <div class="item-modal-cart__price">${
                  item.inCart * item.price
                } сум</div>
              </div>
            </div>
          </div>
        </div>
        `;
    });
    productsContainer.innerHTML += `
      <div class="modal-footer">
        <div class="modal-footer__amount">
          <p>Общая сумма:</p>
         <span id="total">${cart} сум</span>
        </div>
        <button type="submit" class="modal-footer__order btn">Заказать</button>
      </div>
      `;
    deleteButtonsP();
    manageQuantityP();
  }
}
function deleteButtonsP() {
  let deleteButtons = document.querySelectorAll(".item-modal-cart__delete");
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartCost = localStorage.getItem("totalCost");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productName;
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      productName = deleteButtons[
        i
      ].parentElement.children[2].children[0].textContent
        .toLocaleLowerCase()
        .replace(/ /g, "")
        .trim();
      console.log(productName);
      // console.log(productNumbers);

      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );
      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));

      displayCartP();
      onLoadCartNumbers();
    });
  }
}
//* -- end pizza functions --
displayCartC(coffe);
displayCartD(drink);
displayCartP(pizza);
onLoadCartNumbers();

// =======================================================================================================

// ?=======================================================================================================

function vInfo() {
  let vContent = document.querySelector(".v-modal-info__content");
  vContent.classList.toggle("_active");
}

function typeCheck1() {
  let small = document.getElementById("small");
  let middle = document.getElementById("middle");
  let large = document.getElementById("large");
  small.setAttribute("checked", "true");
  middle.removeAttribute("checked");
  large.removeAttribute("checked");
}
function typeCheck2() {
  let small = document.getElementById("small");
  let middle = document.getElementById("middle");
  let large = document.getElementById("large");
  middle.setAttribute("checked", "true");
  small.removeAttribute("checked");
  large.removeAttribute("checked");
}
function typeCheck3() {
  let small = document.getElementById("small");
  let middle = document.getElementById("middle");
  let large = document.getElementById("large");
  large.setAttribute("checked", "true");
  small.removeAttribute("checked");
  middle.removeAttribute("checked");
}

function doughCheck1() {
  let tradition = document.getElementById("tradition");
  let thin = document.getElementById("thin");
  tradition.setAttribute("checked", "true");
  thin.removeAttribute("checked");
}
function doughCheck2() {
  let tradition = document.getElementById("tradition");
  let thin = document.getElementById("thin");
  thin.setAttribute("checked", "true");
  tradition.removeAttribute("checked");
}
function addItem1() {
  let cardItem = document.getElementById("additem1");
  let cardInput1 = document.getElementById("item1");
  cardItem.classList.toggle("_active");
  cardInput1.classList.toggle("_checked");
  let vbutton = document.getElementById("vbutton").innerText;
  let itemPrice1 = document.getElementById("itemPrice1").innerText;
  if (cardInput1.classList.contains("_checked")) {
    cardInput1.setAttribute("checked", "true");
    vbutton = parseInt(vbutton) + parseInt(itemPrice1);
    document.getElementById("vbutton").innerText = vbutton;
  } else {
    cardInput1.removeAttribute("checked");
    vbutton = parseInt(vbutton) - parseInt(itemPrice1);
    document.getElementById("vbutton").innerText = vbutton;
  }
}
function addItem2() {
  let cardItem2 = document.getElementById("additem2");
  let cardInput2 = document.getElementById("item2");
  cardItem2.classList.toggle("_active");
  cardInput2.classList.toggle("_checked");
  let vbutton = document.getElementById("vbutton").innerText;
  let itemPrice2 = document.getElementById("itemPrice2").innerText;
  if (cardInput2.classList.contains("_checked")) {
    cardInput2.setAttribute("checked", "true");
    vbutton = parseInt(vbutton) + parseInt(itemPrice2);
    document.getElementById("vbutton").innerText = vbutton;
  } else {
    cardInput2.removeAttribute("checked");
    vbutton = parseInt(vbutton) - parseInt(itemPrice2);
    document.getElementById("vbutton").innerText = vbutton;
  }
}
