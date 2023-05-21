window.addEventListener('DOMContentLoaded', function() {

    //Range slider
    const slider = document.querySelectorAll(".range-slider");

    slider.forEach((item) => {
        const sliderRange = item.querySelector(".range-slider__range");
        const sliderThumb = item.querySelector(".range-slider__thumb");
        const sliderValue = item.querySelector(".range-slider__value-input input");
        const sliderProgress = item.querySelector(".range-slider__progress");

        function activeSlider() {
			let currentValue = sliderRange.value;
			sliderRange.value = currentValue;
			sliderValue.value = currentValue;

            const maxValue = sliderRange.getAttribute("max");
            const userValue = (currentValue / maxValue) * 100 + "%";

            sliderValue.value = sliderRange.value;

            sliderProgress.style.width = userValue;
            sliderThumb.style.left = userValue;
		}

        activeSlider();

        function activeSliderSliderInfo() {
            if (+this.value > this.max) {
                this.value = this.max;
            }

            else if (+this.value < this.min) {
                this.value = this.min;
            }

			let currentValue = +this.value;
			sliderRange.value = currentValue;
			sliderValue.value = currentValue;

            const maxValue = sliderRange.getAttribute("max");
            const userValue = (currentValue / maxValue) * 100 + "%";

            sliderValue.value = sliderRange.value;

            sliderProgress.style.width = userValue;
            sliderThumb.style.left = userValue;
		}

        sliderRange.addEventListener("input", activeSliderSliderInfo);
	    sliderValue.addEventListener("input", activeSliderSliderInfo);
    });

    //Calculatuon result
    const result = document.querySelector('.calculator__content span');
    let tree, period;

    tree = document.querySelector("#tree").getAttribute('value');
    period = document.querySelector("#period").getAttribute('value');

    function calcTotal() {
        result.textContent = +tree * +period + " тонн";
    }

    calcTotal();

    function getCalcInformation(selector) {
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

    getCalcInformation('#tree');
    getCalcInformation('#period');

    //Button style
    function activeSliderButtonClass(selector, activeClass, inactiveClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (!elem.classList.contains(inactiveClass)) {
                    elements.forEach(elem => {
                        elem.classList.remove(activeClass);
                    });

                    e.target.classList.add(activeClass);
                }
            });
        });
    }

    activeSliderButtonClass('#trees div', 'calculator__choose-item_active', 'calculator__choose-item_inactive');
});