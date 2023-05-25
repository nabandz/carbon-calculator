//Текстовый input 
const treesCount = document.querySelector('#trees-count'),
      yearPeriod = document.querySelector('#year-period');

//Range input
const treesCountRange = document.querySelector('#trees-count-range'),
      yearPeriodRange = document.querySelector('#year-period-range');

//Ползунок input
const treesCountThumb = document.querySelector('#trees-count-thumb'),
      yearPeriodThumb = document.querySelector('#year-period-thumb');

//Прогресс input
const treesCountProgress = document.querySelector('#trees-count-progress'),
      yearPeriodProgress = document.querySelector('#year-period-progress');

//Все текстовые input
const inputsValue = document.querySelectorAll('.range-slider__value-input');

//Все range input
const inputsRange = document.querySelectorAll('.range-slider__range');

//Все кнопки выбора вида дерева
const treesType = document.querySelectorAll('#trees-type div');

//Результат вычислений
const result = document.querySelector('.calculator__content span');

const calculateBtn = document.querySelector('.calculator__btn');

//Ссылка на JSON формат Google таблицы
const googleURL = "https://script.googleusercontent.com/macros/echo?user_content_key=bvBSIlF2bjlXFvS5LZNjbJQczXJ_uoisj4NqwgLrzaDBhzucQmHxuLiqOnwwA3W26ENADkejXoWZu4YDgQrERcwEQxCF8Yapm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnC7HMnGsz6Xp2XhZ7BK8LvP3OMzkTxWfMkOfJDxTvul0Iw_0OIOkr-IRkpRCwcUE0U-IRuWuNmslrFExFD2-NEPMkkmxyZQDU9z9Jw9Md8uu&lib=Mue0-WLH1vOvvuPzGQMdMRljDP7qHGGZS";

function assignValue() {
    treesCount.value = treesCountRange.value;
    yearPeriod.value = yearPeriodRange.value;

    const maxValueTrees = treesCount.getAttribute("max"),
          maxValueYear = yearPeriod.getAttribute("max");

    const userValueTrees = (treesCount.value / maxValueTrees) * 100 + "%",
          userValueYear = (yearPeriod.value / maxValueYear) * 100 + "%";

    treesCountProgress.style.width = userValueTrees;
    treesCountThumb.style.left = userValueTrees;

    yearPeriodProgress.style.width = userValueYear;
    yearPeriodThumb.style.left = userValueYear;
}

assignValue();

function assignValueRange() {
    treesCountRange.value = treesCount.value;
    yearPeriodRange.value = yearPeriod.value;

    const maxValueTrees = treesCountRange.getAttribute("max"),
          maxValueYear = yearPeriodRange.getAttribute("max");

    const userValueTrees = (treesCountRange.value / maxValueTrees) * 100 + "%",
          userValueYear = (yearPeriodRange.value / maxValueYear) * 100 + "%";

    treesCountProgress.style.width = userValueTrees;
    treesCountThumb.style.left = userValueTrees;

    yearPeriodProgress.style.width = userValueYear;
    yearPeriodThumb.style.left = userValueYear;
}

assignValueRange();

//Получение данных их range input
for (let inputR of inputsRange) {
    inputR.addEventListener('input', () => {
        assignValue();
        //calculatuon(treesCount.value, yearPeriod.value);
    })
}

//Получение данных их текстового input
for (let inputV of inputsValue) {
    inputV.addEventListener('input', () => {
        assignValueRange();
        //calculatuon(treesCount.value, yearPeriod.value);
    })
}

//Определение вида дерева
//let currentTreeType = treesType[0];

for (let treeType of treesType) {
    treeType.addEventListener('click', () => {
        if (!treeType.classList.contains('calculator__choose-item_inactive')) {
            for (let item of treesType) {
                item.classList.remove('calculator__choose-item_active');
            }
            treeType.classList.add('calculator__choose-item_active');
        }
    });
}

//Получение значений поглощения CO2
async function assignCO2Value(yearPeriod = 25) {
    const currentObj = await getResource(googleURL).then(data => data.sheetList.find(elem => elem.Age == yearPeriod));
    let currentCO2Value = currentObj.CO2.toFixed(1);
    console.log("Значение СО2: " + currentCO2Value);
    return currentCO2Value;
}

//Рассчет поглощения СО2
let previousYearPeriod = 0;

calculateBtn.addEventListener('click', () => {
    calculatuon(treesCount.value, yearPeriod.value);
});

async function calculatuon(treesCount = 500, yearPeriod = 25) {
    if (previousYearPeriod != yearPeriod) {
        currentCO2 = await assignCO2Value(yearPeriod).then(value => value);
    }
    previousYearPeriod = yearPeriod;

    result.textContent = Math.round(treesCount * currentCO2) + " тонн";
}

//calculatuon(treesCount.value, yearPeriod.value);

//Получение данных из Google таблицы
async function getResource(url) {
    let result = await fetch(url);

    if (!result.ok) {
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
}