window.addEventListener('DOMContentLoaded', function() {

    //Range slider
    const slider = document.querySelectorAll(".range-slider");

    slider.forEach((item) => {
        const sliderRange = item.querySelector(".range-slider__range");
        const sliderThumb = item.querySelector(".range-slider__thumb");
        const sliderValue = item.querySelector(".range-slider__value");
        const sliderProgress = item.querySelector(".range-slider__progress");

        function customSlider() {
            const maxValue = sliderRange.getAttribute("max");
            const userValue = (sliderRange.value / maxValue) * 100 + "%";
    
            sliderValue.innerHTML = sliderRange.value;

            sliderProgress.style.width = userValue;
            sliderThumb.style.left = userValue;
        }
    
        customSlider();
 
        sliderRange.addEventListener("input", () => {
            customSlider();
        });
    })

    //Calculatuon result
    const result = document.querySelector('.calculator__content span');
    let tree, period;

    tree = document.querySelector("#tree").getAttribute('value');
    period = document.querySelector("#period").getAttribute('value');

    function calcTotal() {
        result.textContent = +tree + +period;
    }

    calcTotal();

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case "tree":
                    tree = +input.value;
                    break;
                case "period":
                    period = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#tree');
    getDynamicInformation('#period');
});