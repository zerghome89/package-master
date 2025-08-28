document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const suitcaseGrid = document.getElementById('suitcase-grid');
    const itemList = document.getElementById('item-list');
    const currentWeightEl = document.getElementById('current-weight');
    const weightLimitEl = document.getElementById('weight-limit');
    const completeButton = document.getElementById('complete-button');
    const clearBagButton = document.getElementById('clear-bag-button');
    const travelPurposeEl = document.getElementById('travel-purpose');
    const popupMessageEl = document.getElementById('popup-message');
    const weatherForecastEl = document.getElementById('weather-forecast');
    const itemTooltip = document.getElementById('item-tooltip');
    const takeSound = document.getElementById('take-sound');
    const rotateSound = document.getElementById('rotate-sound');
    const toggleWeatherBtn = document.getElementById('toggle-weather-btn');
    const weatherForecastContent = document.getElementById('weather-forecast-content');
    const ambienceSound = document.getElementById('ambience-sound');

    // --- Modal DOM Elements ---
    const tripModal = document.getElementById('trip-modal');
    const randomTripBtn = document.getElementById('random-trip-btn');
    const selectTripBtn = document.getElementById('select-trip-btn');
    const tripSelectionDetails = document.getElementById('trip-selection-details');
    const confirmTripBtn = document.getElementById('confirm-trip-btn');
    const durationOptions = document.getElementById('duration-options');

    // --- Game Configuration ---
    let SUITCASE_ROWS;
    let SUITCASE_COLS;
    const CELL_SIZE = 50;

    // --- Game State ---
    let currentWeight = 0;
    let draggedItem = null;
    let draggedElement = null;
    let dropSucceeded = false;
    let offsetX = 0;
    let offsetY = 0;
    let suitcaseState;
    let weightLimit = 0;
    let travelData; // To hold the final travel data

    // --- Item Data (Single Source of Truth) ---
    let itemsData = []; // Will be populated after selection

    // --- Initial Data Store ---
    const initialItemsData = [
        { id: 1, name: '수영복', width: 2, height: 2, weight: 0.5, isEssential: false, color: '#FF6B6B', image: 'img/items/swimsuit.jpg' },
        { id: 2, name: '선크림', width: 1, height: 2, weight: 0.2, isEssential: false, color: '#FFD93D', image: 'img/items/sunscreen.jpg' },
        { id: 3, name: '비치타월', width: 2, height: 3, weight: 1.0, isEssential: false, color: '#6BCB77', image: 'img/items/beachtowel.jpg' },
        { id: 4, name: '내복', width: 2, height: 2, weight: 0.5, isEssential: false, color: '#D3D3D3', image: 'img/items/longjohns.jpg' },
        { id: 6, name: '책', width: 2, height: 3, weight: 0.8, isEssential: false, color: '#F7A072', image: 'img/items/book.jpg' },
        { id: 7, name: '카메라', width: 2, height: 2, weight: 1.2, isEssential: false, color: '#8A2BE2', image: 'img/items/camera.jpg' },
        { id: 8, name: '노트북', width: 4, height: 3, weight: 1.8, isEssential: false, color: '#A5A5A5', image: 'img/items/laptop.jpg' },
        { id: 9, name: '가디건', width: 2, height: 2, weight: 0.8, isEssential: false, color: '#A9A9A9', image: 'img/items/cardigan.jpg' },
        { id: 10, name: '코트', width: 2, height: 3, weight: 1.5, isEssential: false, color: '#A9A9A9', image: 'img/items/coat.jpg' },
        { id: 11, name: '우산', width: 1, height: 3, weight: 0.5, isEssential: false, color: '#7777CB', image: 'img/items/umbrella.jpg' },
        { id: 12, name: '셀카봉', width: 1, height: 3, weight: 0.3, isEssential: false, color: '#E6E6FA', image: 'img/items/selfiestick.jpg' },
        { id: 13, name: '상비약', width: 2, height: 2, weight: 0.4, isEssential: false, color: '#90EE90', image: 'img/items/medkit.jpg' },
        { id: 14, name: '스킨', width: 1, height: 2, weight: 0.3, isEssential: false, color: '#ADD8E6', image: 'img/items/skin.jpg' },
        { id: 15, name: '로션', width: 1, height: 2, weight: 0.3, isEssential: false, color: '#F0E68C', image: 'img/items/lotion.jpg' },
        { id: 17, name: '양치셋', width: 1, height: 1, weight: 0.2, isEssential: false, color: '#ADD8E6', image: 'img/items/toothbrush.jpg' },
        { id: 18, name: '잠옷', width: 2, height: 2, weight: 0.6, isEssential: false, color: '#9370DB', image: 'img/items/pajamas.jpg' },
        { id: 19, name: '패딩', width: 3, height: 4, weight: 1.5, isEssential: false, color: '#A9A9A9', image: 'img/items/padding.jpg' },
        { id: 20, name: '어댑터', width: 1, height: 1, weight: 0.5, isEssential: false, color: '#BB7777', image: 'img/items/adapter.jpg' },
        { id: 21, name: '충전기', width: 1, height: 1, weight: 0.2, isEssential: false, color: '#BB7777', image: 'img/items/charger.jpg' },
        { id: 22, name: '드라이어', width: 2, height: 3, weight: 1.2, isEssential: false, color: '#A9CCA9', image: 'img/items/dryer.jpg' },
        { id: 23, name: '기념품', width: 1, height: 1, weight: 1.5, isEssential: false, color: '#A9A9CC', image: 'img/items/souvenir.jpg' },
        { id: 24, name: '기념품', width: 1, height: 2, weight: 1.0, isEssential: false, color: '#A9A9CC', image: 'img/items/souvenir.jpg' },
        { id: 25, name: '기념품', width: 1, height: 3, weight: 0.5, isEssential: false, color: '#A9A9CC', image: 'img/items/souvenir.jpg' },
        { id: 970, name: '반팔반바지', width: 2, height: 2, weight: 0.7, isEssential: false, color: '#4D96FF', image: 'img/items/tshirt.jpg' },
        { id: 980, name: '긴팔긴바지', width: 2, height: 3, weight: 1.1, isEssential: false, color: '#4682B4', image: 'img/items/longsleeve.jpg' },
        { id: 990, name: '속옷', width: 1, height: 1, weight: 0.1, isEssential: false, color: '#FFC0CB', image: 'img/items/underwear.jpg' }
    ];

    // Define weather profiles for different seasons and hemispheres
    const weatherProfiles = {
        northern: {
            summer: { minTempRange: [24, 28], maxTempRange: [30, 35], rainChanceRange: [10, 30] },
            winter: { minTempRange: [-10, 3], maxTempRange: [0, 10], rainChanceRange: [40, 70] },
            springAutumn: { minTempRange: [10, 20], maxTempRange: [15, 25], rainChanceRange: [30, 60] }
        },
        southern: {
            summer: { minTempRange: [24, 28], maxTempRange: [30, 35], rainChanceRange: [10, 30] }, // Dec-Feb
            winter: { minTempRange: [1, 4], maxTempRange: [4, 10], rainChanceRange: [40, 70] }, // June-Aug
            springAutumn: { minTempRange: [10, 20], maxTempRange: [15, 25], rainChanceRange: [30, 60] } // Mar-May, Sep-Nov
        }
    };

    const countries = {
        '제주도': { hemisphere: 'northern', seasons: ['summer'], days: 4 },
        '호주': { hemisphere: 'southern', seasons: ['winter'], days: 6 }
    };

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // --- Sound Logic ---
    function playAmbience() {
        if (ambienceSound) {
            ambienceSound.volume = 0.5;
            ambienceSound.play().catch(error => console.error("Audio play failed:", error));
        }
    }

    // --- Modal Logic ---
    function showTripModal() {
        tripModal.style.display = 'block';
    }

    function hideTripModal() {
        tripModal.style.display = 'none';
    }

    function setupModalEventListeners() {
        confirmTripBtn.addEventListener('click', () => {
            const selectedDestination = document.querySelector('input[name="destination"]:checked');

            if (!selectedDestination) {
                alert('여행지를 선택해주세요.');
                return;
            }

            const countryName = selectedDestination.value;
            const numberOfDays = countries[countryName].days;

            initializeWithSelection(countryName, numberOfDays);
            hideTripModal();
            playAmbience();
        });
    }

    // --- Initialization Logic ---

    function generateTravelData(countryName, numberOfDays) {
        const countryInfo = countries[countryName];
        const hemisphere = countryInfo.hemisphere;
        const seasons = countryInfo.seasons;
        const randomSeason = seasons[getRandomInt(0, seasons.length - 1)];
        const profile = weatherProfiles[hemisphere][randomSeason];

        const generatedData = [];
        for (let i = 0; i < numberOfDays; i++) {
            const minTemp = getRandomInt(profile.minTempRange[0], profile.minTempRange[1]);
            const maxTemp = getRandomInt(Math.max(minTemp, profile.maxTempRange[0]), profile.maxTempRange[1]);
            const rainChance = getRandomInt(profile.rainChanceRange[0], profile.rainChanceRange[1]);
            generatedData.push({ day: `${i + 1}일차`, minTemp, maxTemp, rainChance });
        }

        const isLuxury = false;
        const accommodationType = isLuxury ? '고급 여행 (4-5성급 호텔)' : '가성비 여행 (1-2성급 호텔)';

        return {
            weather: generatedData,
            country: countryName,
            numberOfDays: numberOfDays,
            accommodationType: accommodationType
        };
    }

    function initializeWithSelection(countryName, numberOfDays) {
        travelData = generateTravelData(countryName, numberOfDays);

        switch (travelData.country) {
            case '제주도':
                SUITCASE_ROWS = 9;
                SUITCASE_COLS = 6;
                weightLimit = 10;
                break;
            case '호주':
                SUITCASE_ROWS = 11;
                SUITCASE_COLS = 8;
                weightLimit = 15;
                break;
            default:
                SUITCASE_ROWS = 11;
                SUITCASE_COLS = 8;
                weightLimit = 10;
        }

        weightLimitEl.textContent = weightLimit;
        suitcaseState = Array(SUITCASE_ROWS).fill(null).map(() => Array(SUITCASE_COLS).fill(null));

        suitcaseGrid.style.gridTemplateRows = `repeat(${SUITCASE_ROWS}, ${CELL_SIZE}px)`;
        suitcaseGrid.style.gridTemplateColumns = `repeat(${SUITCASE_COLS}, ${CELL_SIZE}px)`;
        suitcaseGrid.style.width = `${SUITCASE_COLS * CELL_SIZE}px`;
        suitcaseGrid.style.height = `${SUITCASE_ROWS * CELL_SIZE}px`;

        itemsData = JSON.parse(JSON.stringify(initialItemsData)); // Deep copy
        const itemsToDuplicate = itemsData.filter(item => item.id >= 900);
        if (itemsToDuplicate.length > 0) {
            itemsToDuplicate.forEach(baseItem => {
                for (let i = 0; i < travelData.numberOfDays - 1; i++) { // Adjusted loop
                    itemsData.push({ ...baseItem, id: baseItem.id + (i + 1) });
                }
            });
        }
        itemsData.sort((a, b) => a.id - b.id);

        createSuitcaseGrid();
        createItemList();
        setupEventListeners();
        displayWeather(travelData);
        setTravelPurpose(travelData);

        const weatherHeader = document.getElementById('weather-header');
        const toggleBtn = document.getElementById('toggle-weather-btn');
        if (weatherHeader && toggleBtn) {
            weatherHeader.textContent = `여행지 정보 (${travelData.numberOfDays}일간) `;
            weatherHeader.appendChild(toggleBtn);
        }

        const accommodationInfoEl = document.getElementById('accommodation-info');
        if (accommodationInfoEl) {
            accommodationInfoEl.textContent = `숙박 정보: ${travelData.accommodationType}`;
        }
    }

    function createSuitcaseGrid() {
        suitcaseGrid.innerHTML = '';
        for (let i = 0; i < SUITCASE_ROWS * SUITCASE_COLS; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            suitcaseGrid.appendChild(cell);
        }
    }

    function createItemList() {
        itemList.innerHTML = '';
        itemsData.forEach(itemData => {
            const itemEl = createItemElement(itemData);
            itemList.appendChild(itemEl);
        });
    }

    function createItemElement(itemData) {
        const itemEl = document.createElement('div');
        itemEl.classList.add('item');
        itemEl.draggable = true;
        itemEl.style.width = `${itemData.width * CELL_SIZE}px`;
        itemEl.style.height = `${itemData.height * CELL_SIZE}px`;

        if (itemData.image) {
            itemEl.style.backgroundImage = `url('${itemData.image}')`;
            itemEl.style.backgroundSize = 'contain';
            itemEl.style.backgroundRepeat = 'no-repeat';
            itemEl.style.backgroundPosition = 'center';
            itemEl.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        } else {
            itemEl.style.backgroundColor = itemData.color;
        }

        itemEl.innerHTML = `<span class="item-name">${itemData.name}<br>(${itemData.weight}kg)</span>`;
        itemEl.dataset.itemId = itemData.id;
        itemEl.dataset.itemName = itemData.name;
        itemEl.dataset.itemDescription = `무게: ${itemData.weight}kg, 크기: ${itemData.width}x${itemData.height}`;
        itemEl.style.boxSizing = 'border-box';
        itemEl.addEventListener('click', (e) => {
            e.preventDefault();
            rotateItemOnClick(itemEl, itemData);
        });

        itemEl.addEventListener('mouseover', (e) => {
            const itemName = e.currentTarget.dataset.itemName;
            const itemDescription = e.currentTarget.dataset.itemDescription;
            itemTooltip.innerHTML = `<strong>${itemName}</strong><br>${itemDescription}`;
            itemTooltip.style.left = `${e.pageX + 15}px`;
            itemTooltip.style.top = `${e.pageY + 15}px`;
            itemTooltip.style.display = 'block';
        });

        itemEl.addEventListener('mouseout', () => {
            itemTooltip.style.display = 'none';
        });

        return itemEl;
    }

    function displayWeather(weatherDataObj) {
        weatherForecastEl.innerHTML = '';
        weatherDataObj.weather.forEach(dayData => {
            const dayEl = document.createElement('div');
            dayEl.classList.add('weather-day');
            dayEl.innerHTML = `
                <p>${dayData.day}</p>
                <p class="temp">${dayData.minTemp}°C ~ ${dayData.maxTemp}°C</p>
                <p class="rain">강수확률: ${dayData.rainChance}%</p>
            `;
            weatherForecastEl.appendChild(dayEl);
        });
    }

    function setTravelPurpose(travelData) {
        const countryName = travelData.country;
        const weatherForecast = travelData.weather;
        const numberOfDays = travelData.numberOfDays;

        let purposeMessage = `${countryName} ${numberOfDays - 1}박 ${numberOfDays}일 여행`;

        const totalMaxTemp = weatherForecast.reduce((sum, day) => sum + day.maxTemp, 0);
        const avgMaxTemp = totalMaxTemp / weatherForecast.length;

        if (avgMaxTemp >= 28) {
            purposeMessage += " - 뜨거운 여름 휴가";
        } else if (avgMaxTemp <= 10) {
            purposeMessage += " - 쌀쌀한 겨울 여행";
        } else {
            purposeMessage += " - 쾌적한 날씨의 여행";
        }

        travelPurposeEl.textContent = purposeMessage;
    }

    function setupEventListeners() {
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragend', handleDragEnd);
        document.addEventListener('dragover', handleDragOver);
        completeButton.addEventListener('click', checkCompletion);
        clearBagButton.addEventListener('click', clearBag);

        suitcaseGrid.addEventListener('drop', handleDropOnSuitcase);
        itemList.addEventListener('drop', handleDropOnItemList);

        toggleWeatherBtn.addEventListener('click', () => {
            weatherForecastContent.classList.toggle('collapsed');
            toggleWeatherBtn.textContent = weatherForecastContent.classList.contains('collapsed') ? '펼치기' : '접기';
        });
    }

    function showPopupMessage(message, duration = 2000, fadeDuration = 1000) {
        popupMessageEl.textContent = message;
        popupMessageEl.style.transition = `opacity ${fadeDuration / 1000}s`;
        popupMessageEl.classList.add('show');

        setTimeout(() => {
            popupMessageEl.classList.remove('show');
        }, duration);
    }

    function rotateItemOnClick(element, item) {
        if (rotateSound) {
            rotateSound.currentTime = 0;
            rotateSound.play().catch(error => console.error("Audio play failed:", error));
        }

        const originalWidth = item.width;
        const originalHeight = item.height;
        
        // Try rotating
        item.width = originalHeight;
        item.height = originalWidth;

        let canRotate = true;
        if (element.parentElement === suitcaseGrid) {
            const elementTop = parseFloat(element.style.top);
            const elementLeft = parseFloat(element.style.left);
            const row = Math.round(elementTop / CELL_SIZE);
            const col = Math.round(elementLeft / CELL_SIZE);

            // Temporarily remove from grid model to check for collision
            removeItemFromSuitcase(element, false); 

            if (canPlaceItem(item, row, col)) {
                // It can be rotated, place it back in the model
                placeItem(element, item, row, col, false, false); // No sound, no weight update
            } else {
                canRotate = false;
                // It can't be rotated, put it back in the model with original dimensions
                item.width = originalWidth;
                item.height = originalHeight;
                placeItem(element, item, row, col, false, false); // No sound, no weight update
            }
        }

        if (canRotate) {
            // Visual update
            element.style.width = `${item.width * CELL_SIZE}px`;
            element.style.height = `${item.height * CELL_SIZE}px`;
        } else {
            // Revert dimension data if rotation failed
            item.width = originalWidth;
            item.height = originalHeight;
            showPopupMessage("회전할 공간이 부족합니다!");
        }
    }

    function handleDragStart(e) {
        if (!e.target.classList.contains('item')) return;
        draggedElement = e.target;
        const itemId = parseInt(draggedElement.dataset.itemId, 10);
        draggedItem = itemsData.find(item => item.id === itemId);
        if (!draggedItem) return;

        if (takeSound) {
            takeSound.currentTime = 0;
            takeSound.play().catch(error => console.error("Audio play failed:", error));
        }

        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);

        dropSucceeded = false;
        offsetX = e.offsetX;
        offsetY = e.offsetY;

        if (draggedElement.parentElement === suitcaseGrid) {
            removeItemFromSuitcase(draggedElement);
        }

        setTimeout(() => {
            document.body.appendChild(draggedElement);
            draggedElement.style.position = 'absolute';
            draggedElement.classList.add('dragging');
            draggedElement.style.pointerEvents = 'none';
        }, 0);
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (!draggedElement) return;
        draggedElement.style.left = `${e.pageX - offsetX}px`;
        draggedElement.style.top = `${e.pageY - offsetY}px`;
    }

    function handleDragEnd(e) {
        if (!draggedElement) return;

        draggedElement.classList.remove('dragging');
        draggedElement.style.pointerEvents = 'auto';
        if (!dropSucceeded) {
            returnItemToList(draggedElement);
        }
        draggedItem = null;
        draggedElement = null;
    }

    function handleDropOnSuitcase(e) {
        e.preventDefault();
        if (!draggedItem) return;
        const suitcaseRect = suitcaseGrid.getBoundingClientRect();
        const itemX = e.clientX - suitcaseRect.left - offsetX;
        const itemY = e.clientY - suitcaseRect.top - offsetY;
        const col = Math.round(itemX / CELL_SIZE);
        const row = Math.round(itemY / CELL_SIZE);

        if (canPlaceItem(draggedItem, row, col)) {
            placeItem(draggedElement, draggedItem, row, col);
            dropSucceeded = true;
        } else {
            dropSucceeded = false;
        }
    }

    function handleDropOnItemList(e) {
        e.preventDefault();
        if (draggedElement) {
            returnItemToList(draggedElement);
            dropSucceeded = true;
        }
    }

    function canPlaceItem(item, startRow, startCol) {
        if (startRow < 0 || startCol < 0 || startRow + item.height > SUITCASE_ROWS || startCol + item.width > SUITCASE_COLS) return false;
        for (let r = 0; r < item.height; r++) {
            for (let c = 0; c < item.width; c++) {
                if (suitcaseState[startRow + r][startCol + c] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    function placeItem(element, item, startRow, startCol, playSound = true, updateWeight = true) {
        for (let r = 0; r < item.height; r++) {
            for (let c = 0; c < item.width; c++) {
                suitcaseState[startRow + r][startCol + c] = item.id;
            }
        }
        element.style.position = 'absolute';
        element.style.top = `${startRow * CELL_SIZE}px`;
        element.style.left = `${startCol * CELL_SIZE}px`;
        suitcaseGrid.appendChild(element);
        if (updateWeight) {
            currentWeight += item.weight;
        }
        updateWeightDisplay();
        if (playSound) {
            const sound = document.getElementById('place-sound');
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(error => console.error("Audio play failed:", error));
            }
        }
    }

    function removeItemFromSuitcase(element, update = true) {
        const itemId = parseInt(element.dataset.itemId, 10);
        const itemData = itemsData.find(item => item.id === itemId);
        if (!itemData) return;
        for (let r = 0; r < SUITCASE_ROWS; r++) {
            for (let c = 0; c < SUITCASE_COLS; c++) {
                if (suitcaseState[r][c] === itemId) suitcaseState[r][c] = null;
            }
        }
        if (update) {
            currentWeight -= itemData.weight;
            updateWeightDisplay();
        }
    }

    function returnItemToList(element) {
        const itemId = parseInt(element.dataset.itemId, 10);
        const item = itemsData.find(i => i.id === itemId);
        if (!item) return;
        element.style.position = 'relative';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.width = `${item.width * CELL_SIZE}px`;
        element.style.height = `${item.height * CELL_SIZE}px`;
        itemList.appendChild(element);
    }

    function updateWeightDisplay() {
        currentWeightEl.textContent = currentWeight.toFixed(1);
        currentWeightEl.style.color = currentWeight > weightLimit ? 'red' : 'black';
    }

    function checkCompletion() {
        if (currentWeight > weightLimit) {
            showPopupMessage(`경고: 무게 제한(${weightLimit}kg)을 초과했습니다! 현재 무게: ${currentWeight.toFixed(1)}kg`);
            return;
        }
        showPopupMessage('짐싸기 완료! 현지 정보와 짐 정보가 저장됩니다.');

        const dataToSave = {
            travelInfo: travelData,
            packedItems: [],
            allItemsData: itemsData,
            suitcaseInfo: {
                rows: SUITCASE_ROWS,
                cols: SUITCASE_COLS,
                weightLimit: weightLimit,
                currentWeight: parseFloat(currentWeight.toFixed(1))
            }
        };

        const processedItemIds = new Set();
        for (let r = 0; r < SUITCASE_ROWS; r++) {
            for (let c = 0; c < SUITCASE_COLS; c++) {
                const itemId = suitcaseState[r][c];
                if (itemId !== null && !processedItemIds.has(itemId)) {
                    const itemData = itemsData.find(item => item.id === itemId);
                    if (itemData) {
                        dataToSave.packedItems.push({
                            ...itemData,
                            row: r,
                            col: c
                        });
                        processedItemIds.add(itemId);
                    }
                }
            }
        }

        localStorage.setItem('travelGameData', JSON.stringify(dataToSave));
        setTimeout(() => { window.location.href = 'travel.html'; }, 1500);
    }

    function clearBag() {
        if (confirm('정말 가방을 비우시겠습니까? 모든 아이템이 초기화됩니다.')) {
            const itemsInSuitcase = Array.from(suitcaseGrid.querySelectorAll('.item'));
            itemsInSuitcase.forEach(itemEl => {
                returnItemToList(itemEl);
            });
            suitcaseState = Array(SUITCASE_ROWS).fill(null).map(() => Array(SUITCASE_COLS).fill(null));
            currentWeight = 0;
            updateWeightDisplay();
        }
    }

    // --- Main Execution ---
    setupModalEventListeners();
    showTripModal();
});