document.getElementById('svgInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader();

        reader.onload = function(e) {
            const svgContent = e.target.result;
            document.getElementById('svgContainer').innerHTML = svgContent;

            initializeMapFunctions();
        };

        reader.readAsText(file);
    } else {
        alert('Please select a valid SVG file.');
    }
});

function initializeMapFunctions() {
    const inputField = document.getElementById('inputRegion');
    const resetButton = document.getElementById('resetButton');
    const giveUpButton = document.getElementById('giveUpButton');

    // 监听 Enter 键
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const regionName = inputField.value.trim().toLowerCase();

            // 检查输入是否为空
            if (!regionName) {
                alert('Please enter a valid region name.');
                return;
            }

            const regions = document.querySelectorAll('svg [data-name]');
    
            let regionFound = false;
            regions.forEach(region => {
                const dataName = region.getAttribute('data-name').toLowerCase();
    
                // 处理“/”或“( )”逻辑
                const nameOptions = dataName
                    .replace(/[()]/g, '/')
                    .split('/')
                    .map(name => name.trim());
    
                if (nameOptions.some(name => name === regionName)) {
                    region.style.fill = 'red';
                    regionFound = true;
                }
            });

            if (!regionFound) {
                alert('Region not found!');
            }

            inputField.value = '';
        }
    });
    
    // 重置按钮的功能
    resetButton.addEventListener('click', function() {
        const regions = document.querySelectorAll('svg [data-name]');
        regions.forEach(region => {
            region.style.fill = 'white'; // 重置为默认颜色

            // 清除显示的id和data-name文本
            const textElement = region.getAttribute('data-text-id');
            if (textElement) {
                const textNode = document.getElementById(textElement);
                if (textNode) {
                    textNode.remove();
                }
                region.removeAttribute('data-text-id');
            }
        });
    });

    // Give Up 按钮的功能
    giveUpButton.addEventListener('click', function() {
        const regions = document.querySelectorAll('svg [data-name]');
        regions.forEach(region => {
            const id = region.getAttribute('id');
            const dataName = region.getAttribute('data-name');

            // 创建一个唯一的文本ID
            const textId = `text-${id}`;
            
            // 在每个区域内显示 id 和 data-name
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('id', textId);
            text.setAttribute('x', region.getBBox().x + region.getBBox().width / 2);
            text.setAttribute('y', region.getBBox().y + region.getBBox().height / 2);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '5');
            text.setAttribute('fill', 'black');
            text.textContent = `${id} / ${dataName}`;

            // 将文本元素与区域关联
            region.setAttribute('data-text-id', textId);

            region.parentNode.appendChild(text);
        });
    });
}
