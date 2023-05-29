//Текстовый input 
const treesCount = document.querySelector('#trees-count'),
      yearPeriod = document.querySelector('#year-period');

//Range input
const treesCountRange = document.querySelector('#trees-count-range'),
      yearPeriodRange = document.querySelector('#year-period-range');

//Ползунок input
/* const treesCountThumb = document.querySelector('#trees-count-thumb'),
      yearPeriodThumb = document.querySelector('#year-period-thumb'); */

//Прогресс input
const treesCountProgress = document.querySelector('#trees-count-progress'),
      yearPeriodProgress = document.querySelector('#year-period-progress');

//Все текстовые input
const inputsValue = document.querySelectorAll('.range-slider__value-input');

//Все range input
const inputsRange = document.querySelectorAll('.range-slider__range');

//Все кнопки выбора вида дерева
const treesType = document.querySelectorAll('#trees-type div');

//Все пункты выбора локаций
const treesLocation = document.querySelector('.calculator__location');

//Результат вычислений
const result = document.querySelector('.calculator__content span');

//Кнопка для вычисления результата
const calculateBtn = document.querySelector('.calculator__btn');

function checkInputMinMax(currentInput) {
    if (+currentInput.value > currentInput.max) {
        currentInput.value = currentInput.max;
        return currentInput.value;
    }

    else if (+currentInput.value <= currentInput.min) {
        currentInput.value = 1;
        return currentInput.value;
    }

    return currentInput.value;
}

function assignValue() {
    checkInputMinMax(treesCount);
    checkInputMinMax(yearPeriod);

    treesCount.value = treesCountRange.value;
    yearPeriod.value = yearPeriodRange.value;

    const maxValueTrees = treesCount.getAttribute("max"),
          maxValueYear = yearPeriod.getAttribute("max");

    const userValueTrees = (treesCount.value / maxValueTrees) * 100 + "%",
          userValueYear = (yearPeriod.value / maxValueYear) * 100 + "%";

    treesCountProgress.style.width = userValueTrees;
    //treesCountThumb.style.left = userValueTrees;

    yearPeriodProgress.style.width = userValueYear;
    //yearPeriodThumb.style.left = userValueYear;
}

assignValue();

function assignValueRange() {
    checkInputMinMax(treesCount);
    checkInputMinMax(yearPeriod);

    treesCountRange.value = treesCount.value;
    yearPeriodRange.value = yearPeriod.value;

    const maxValueTrees = treesCountRange.getAttribute("max"),
          maxValueYear = yearPeriodRange.getAttribute("max");

    const userValueTrees = (treesCountRange.value / maxValueTrees) * 100 + "%",
          userValueYear = (yearPeriodRange.value / maxValueYear) * 100 + "%";

    treesCountProgress.style.width = userValueTrees;
    //treesCountThumb.style.left = userValueTrees;

    yearPeriodProgress.style.width = userValueYear;
    //yearPeriodThumb.style.left = userValueYear;
}

assignValueRange();

//Получение данных их range input
for (let inputR of inputsRange) {
    inputR.addEventListener('input', () => {
        assignValue();

        result.textContent = '__';
        //calculation(treesCount.value, yearPeriod.value);
    })
}

//Получение данных их текстового input
for (let inputV of inputsValue) {
    inputV.addEventListener('input', () => {
        assignValueRange();

        result.textContent = '__';
        //calculation(treesCount.value, yearPeriod.value);
    })
}

//Ссылка на данные из Google таблицы (JSON)
let currentGoogleURL = '';

const googleSheets = [
    {
        treeType: 'pine',
        location: 'good-pine',
        googleURL: 'https://script.google.com/macros/s/AKfycbw2mXOFZNfriVzv2Ecx1-70zU-CroXpgMPmZWpkqnGB-PymY-2IaeOltmwZ5c2hU6HBTA/exec',
    },
    {
        treeType: 'oak',
        location: 'good-pine',
        googleURL: 'https://script.google.com/macros/s/AKfycbw2mXOFZNfriVzv2Ecx1-70zU-CroXpgMPmZWpkqnGB-PymY-2IaeOltmwZ5c2hU6HBTA/exec',
    },
    {
        treeType: 'pine',
        location: 'normal-pine',
        googleURL: 'https://script.google.com/macros/s/AKfycbypwpGBHND_2IOyPsB9z-K6FzMSqi9W36n6l04NuQREY7UkU6LbVL0Wdqz4e2wdRJ0rdg/exec',
    },
    {
        treeType: 'oak',
        location: 'normal-pine',
        googleURL: 'https://script.google.com/macros/s/AKfycbypwpGBHND_2IOyPsB9z-K6FzMSqi9W36n6l04NuQREY7UkU6LbVL0Wdqz4e2wdRJ0rdg/exec',
    },
]

//Определение выбранного вида дерева
let currentTreeType = treesType[0].dataset.name;
//console.log("Изначальный вид дерева: " + currentTreeType);

for (let currentTree of treesType) {
    currentTree.addEventListener('click', () => {
        if (!currentTree.classList.contains('calculator__choose-item_inactive')) {
            for (let item of treesType) {
                item.classList.remove('calculator__choose-item_active');
            }
            currentTree.classList.add('calculator__choose-item_active');

            currentTreeType = currentTree.dataset.name;
            //console.log("Выбранный вид дерева: " + currentTreeType);
            selectGoogleSheet(currentTreeType, currentTreeLocation);

            result.textContent = '__';
        }
    });
}

//Определение выбранной локации
let currentTreeLocation = treesLocation[0].value;
//console.log("Изначальная локация: " + currentTreeLocation);

treesLocation.addEventListener('change', () => {
    currentTreeLocation = treesLocation.value;
    //console.log("Выбранная локация: " + currentTreeLocation);
    selectGoogleSheet(currentTreeType, currentTreeLocation);

    result.textContent = '__';
});

//Определение необходимой Google таблицы
function selectGoogleSheet(treeType = currentTreeType, treeLocation = currentTreeLocation) {
    const currentOb = googleSheets.find(el => el.treeType == treeType && el.location == treeLocation);
    currentGoogleURL = currentOb.googleURL;
    //console.log("Выбранная таблица: " + currentGoogleURL);
}

selectGoogleSheet();

//Получение данных из Google таблицы
async function getResource(url) {
    let result = await fetch(url);

    if (!result.ok) {
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
}

//Получение значений поглощения CO2
async function assignCO2Value(yearPeriod = 25) {
    const currentObj = await getResource(currentGoogleURL).then(data => data.calculationResult.find(elem => elem.age == yearPeriod));
    let currentCO2Value = currentObj.CO2Value.toFixed(1);
    //console.log("Значение СО2: " + currentCO2Value + " для " + yearPeriod + " лет");

    return currentCO2Value;
}

//Рассчет компенсации СО2
let previousYearPeriod = 0;
let previousGoogleURL = '';

async function calculation(treesCount = 4000, yearPeriod = 25, googleURL) {
    if (previousYearPeriod != yearPeriod || previousGoogleURL != googleURL) {
        currentCO2 = await assignCO2Value(yearPeriod).then(value => value);
    }
    previousYearPeriod = yearPeriod;

    result.textContent = ((treesCount / 4000) * currentCO2).toFixed(3) + " тонн СО2";
}

calculation(treesCount.value, yearPeriod.value);

calculateBtn.addEventListener('click', () => {
    calculation(treesCount.value, yearPeriod.value, currentGoogleURL);
});