// Basic sugaring

window.$ = (...args) => document.querySelector(...args);
window.$$ = (...args) => document.querySelectorAll(...args);
window.$on = (element, event, cb) =>
	(element.addEventListener ? element : $(element)).addEventListener(event, cb);


// Startup functions

window.onDocumentReadyCallbacks = new Map();
window.onDocumentReady = cb => {
	window.onDocumentReadyCallbacks.set(cb, cb);
};

$on(window, 'DOMContentLoaded', () =>
	window.onDocumentReadyCallbacks.forEach(cb => typeof cb === 'function' ? cb() : false)
);


// Language selection

// checkSystem helps to prevent unwanted switches
// but still contain it all in one function that is triggered on hash changes
function checkLanguage(checkSystem = false) {
	let hash = window.location.hash; // shortening the code a little

	// if switched to ru, or it's system check and we have ru in system settings
	if(hash.includes('#ru') || (checkSystem && navigator.language.includes('ru'))) {
		$$('.en').forEach(e => e.classList.remove('visible'));
		$$('.ru').forEach(e => e.classList.add('visible'));

		$$('menu.lang a').forEach(e => e.classList.remove('selected'));
		$('menu.lang a[href="#ru"]').classList.add('selected');
	}
	// if hash is empty and we care about system check, or and only if someone switched to en
	else if((checkSystem && hash.length === 0) || hash.includes('#en')) {
		$$('.ru').forEach(e => e.classList.remove('visible'));
		$$('.en').forEach(e => e.classList.add('visible'));

		$$('menu.lang a').forEach(e => e.classList.remove('selected'));
		$('menu.lang a[href="#en"]').classList.add('selected');
	}
}

// Picture data 
const pictures = [
	{
		file: '01-syamozero',
		description: {
			en:'Forest fire near Lake Syamozero, the Republic of Karelia',
			ru:'Пожар рядом с озером Сямозеро, Карелия'
		},
		moscowScale: 'moscow-5km-1'
	}, {
		file: '02-megino-aldan',
		description: {
			en:'Forest fire near the Aldan River, the Republic of Sakha (Yakutia)',
			ru:'Лесной пожар рядом с рекой Алдан, Республика Саха (Якутия)'
		},
		moscowScale: 'moscow-5km-1'
	}, {
		file: '03-sitte',
		description: {
			en:'The Sitte village surrounded by fire, near the Lena River, the Republic of Sakha (Yakutia)',
			ru:'Окруженный пожарами посёлок Ситте недалеко от реки Лена, Республика Саха (Якутия)'
		},
		moscowScale: 'moscow-5km-2'
	}, {
		file: '04-yakutsk',
		description: {
			en:'The city of Yakutsk in the smoke of forest fires, the Republic of Sakha (Yakutia). On days of dense smoke, according to IQAir, air pollution in Yakutsk exceeded the parameters recommended by the World Health Organization more than hundred times.',
			ru:'Город Якутск в дыму лесных пожаров, Республика Саха (Якутия). В дни плотного задымления, по данным IQAir, загрязнение воздуха в Якутске превысило параметры, рекомендуемые Всемирной Организацией здравоохранения (ВОЗ), более чем в сто раз.'
		},
		moscowScale: 'moscow-5km-2'
	}, {
		file: '05-mirniy-svetliy',
		description: {
			en:'The surroundings of the city of Mirny on fire, the Republic of Sakha (Yakutia)',
			ru:'Окрестности города Мирный охвачены огнём, Республика Саха (Якутия)'
		},
		moscowScale: 'moscow-10km-1'
	}, {
		file: '06-sangar',
		description: {
			en:'Forest fires on both sides of the Lena River, the Republic of Sakha (Yakutia). The Verkhoyansk ridge can be seen on the right side of the image.',
			ru:'Лесные пожары на обоих берегах реки Лена, Республика Саха (Якутия). На правой части снимка видны склоны Верхоянского хребта.'
		},
		moscowScale: 'moscow-10km-2'
	}, {
		file: '07-byas-kyol',
		description: {
			en:'Byas-Kyuel village suffering from forest fire, the Republic of Sakha (Yakutia)',
			ru:'Огонь лесных пожаров перекинулся на посёлок Бясь-Кюель, Республика Саха (Якутия)'
		},
		moscowScale: 'moscow-5km-2'
	}, {
		file: '08-bur',
		description: {
			en:'A forest fire near the cluster of the Yarakt petroleum field, the Irkutsk Region. Deforestation looks like light-green spots.',
			ru:'Лесной пожар к северу от скважин Ярактинского нефтегазоконденсатного месторождения, Иркутская область. Лесные вырубки выглядят как светло-зеленые пятна.'
		},
		moscowScale: 'moscow-10km-3'
	}, {
		file: '09-irkutskaya',
		description: {
			en:'A cluster of the Verkhnechonsk petroleum field and surrounding forest on fire, the Irkutsk Region',
			ru:'Пожар охвативший территорию скважин нефтегазоконденсатного месторождения и окружающий лес у реки Нижняя Тунгуска, Иркутская область'
		},
		moscowScale: 'moscow-3km'
	}, {
		file: '10-angara',
		description: {
			en:'Smoke from forest fires over deforestation spots near the Angara River, Krasnoyarsk Oblast',
			ru:'Дым от лесных пожаров над лесными вырубками рядом с рекой Ангара, Красноярская область'
		},
		moscowScale: 'moscow-10km-3'
	}
];

function replaceAll(str, map) {
	let re = new RegExp('\\b(?:' + Object.keys(map).join('|') + ')\\b', 'gi');
	return str.replace(re, matched => map[matched]);
}

function createPics() {
	let tpl = $('#tplPicture').innerText;

	$('section.pictures').innerHTML = pictures.map(pic => replaceAll(tpl, {
		'_pic_': pic.file,
		'_picir_': pic.file + '-ir',
		'_descru_': pic.description.ru,
		'_descen_': pic.description.en,
		'_moscow_scale_': pic.moscowScale
	})).join('');

	$$('section.pictures .picture-set')
		.forEach(e => $on(e, 'click', () => e.parentElement.classList.toggle('ir')));

	$$('section.pictures .picture-toggle.type-selector')
		.forEach(e => $on(e, 'click', () => e.parentElement.parentElement.classList.toggle('ir')));

	$$('section.pictures .picture-toggle.moscow-overlay')
		.forEach(e => $on(e, 'click', () => e.parentElement.parentElement.classList.toggle('moscow')));
}

// Page init

onDocumentReady(() => {
	createPics();

	// Setup language
	checkLanguage(true); // true => check system lang
	$on(window, 'popstate', () => checkLanguage()); // a.func becasue we don't want any args, to not check the sys lang

	console.log('loaded');
});
