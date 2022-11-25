document.addEventListener("DOMContentLoaded", function () {
    setTheme();
    drawGrid();
    window.addEventListener('resize', drawGrid);
    setExpandableSections();
    setStickyHeader();
    setLogoAnim();
    setParallaxBackground();
    enableImageDisplay();

    // Manages expandable buttons and adjacent sections
    function setExpandableSections() {
        const expandables = document.querySelectorAll('.expandable');

        expandables.forEach(element => {
            // The next sibling is always a <section>
            const content = element.nextElementSibling;
            const isActive = () => {
                return element.classList.contains('active');
            }
            // At first, disable inactive anchor elements
            toggleFocusableChildren(
                getKeyboardFocusableElements(content),
                isActive()
            );
            element.addEventListener("click", () => {
                element.classList.toggle('active');
                setExpandableHeight(content, content.style.maxHeight);
                toggleFocusableChildren(
                    getKeyboardFocusableElements(content),
                    isActive()
                );
            })
            // Also set up corresponding close button
            content.querySelector('.close-section').addEventListener(
                'click',
                () => {
                    element.classList.toggle('active');
                    setExpandableHeight(content, content.style.maxHeight);
                    toggleFocusableChildren(
                        getKeyboardFocusableElements(content),
                        isActive()
                    );
                }
            )
        });

        // Expand/collapse the selected section
        function setExpandableHeight(element, isNotNull) {
            // Only set height if it's needed
            // maxHeight is used for animation purposes
            isNotNull
                ? element.style.maxHeight = null
                : element.style.maxHeight = element.scrollHeight + 'px';
        }
        
        function toggleFocusableChildren(nodeList, isActive) {
            if (nodeList.length > 0) {
                let focusValue = isActive
                                ? 0
                                : -1
                nodeList.forEach (element => {
                    element.tabIndex = focusValue;
                })
            }
        }

        function getKeyboardFocusableElements (parentElement) {
            return parentElement.querySelectorAll(
                'a[href], button, input, [tabindex]:not([tabindex="-1"])'
            )
        }
    }

    // Manages light/dark modes
    function setTheme() {
        const toggle = document.querySelector('#toggle');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme');

        // Before theme is toggled for the first time, 
        // If browser prefers dark, set toggle to reflect this
        if (prefersDarkMode.matches && currentTheme === null) {
            toggle.checked = true;
        }

        // Based off browser preference, toggle() will add the stored theme,
        // which either changes from the default or has no effect
        if (currentTheme === 'dark') {
            document.body.classList.toggle('dark');
            toggle.checked = true;
        } else if (currentTheme === 'light') {
            document.body.classList.toggle('light');
            toggle.checked = false;
        }

        toggle.addEventListener('input', () => {
            let theme;
            if(prefersDarkMode.matches) {
                // If browser prefers dark, only .light exists
                document.body.classList.toggle('light');
                theme =
                    document.body.classList.contains('light')
                    ? 'light'
                    : 'dark';
            } else {
                // If no preference set, only .dark exists
                document.body.classList.toggle('dark');
                theme = 
                    document.body.classList.contains('dark')
                    ? 'dark'
                    : 'light';
            }
            // Save theme preference for refresh
            localStorage.setItem('theme', theme);
            // Redraw background grid on theme change
            drawGrid();
        });
    }
    

    // Manages header behaviour
    function setStickyHeader() {
        const header = document.querySelector('header');
        let lastScroll = 0;

        window.addEventListener("scroll", () => {
            let currentScroll = window.pageYOffset;       

            if ( currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // If scrolling down, hide the header
                header.classList.add('scroll-down');
            } else if ( currentScroll <= lastScroll && header.classList.contains('scroll-down')) {
                header.classList.remove('scroll-down');
            }
            // Save current scroll
            lastScroll = currentScroll;
        });
    }

    // Manages animated header logo
    function setLogoAnim() {
        const logo = document.querySelector('.logo');
        const logoText = document.querySelector('.logo span');
        const logoString = "AY'S PORTFOLIO";
        let expandArray = [];

        logo.addEventListener('mouseenter', expand);
        logo.addEventListener('mouseleave', shrink);

        function expand() {
            clearTimeouts();
            // Get the index of the current letter
            let currentLogoIndex = logoText.textContent.length - 1;
            // Incrementally expand the logo text
            for (let i = currentLogoIndex; i < logoString.length; i++) {
                trackTimeouts(() => {
                        logoText.textContent += logoString[i];
                    },
                    i
                );
            }
        }

        function shrink() {
            clearTimeouts();
            // Remove all letters except the last one, "J"
            for (let i = 0; i < logoText.textContent.length - 1; i++) {
                trackTimeouts( () => {
                        logoText.textContent = logoText.textContent.slice(0, -1);
                    },
                    i
                );
            };
        }

        function trackTimeouts(callback, index) {
            // Store each TimeoutID in an array
            expandArray.push(setTimeout(callback, Math.log(Math.pow(10, 5)) * index));
        }

        function clearTimeouts() {
            // Avoid duplicate strings appearing in the logo by clearing current Timeouts
            expandArray.forEach(element => {
                clearTimeout(element);
            });
            expandArray = [];
        };
    }

    // Manages creation of canvas grid background
    function drawGrid() {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const interval = 28;
        const color = getComputedStyle(document.body).getPropertyValue('--opposite-text-color');

        resizeCanvas();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += interval) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += interval) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        function resizeCanvas() {
            canvas.width = document.body.scrollWidth;
            // Increase canvas height to avoid gap when resizing
            canvas.height = document.body.scrollHeight * 2.5;
        }
    }

    // Manages behaviour of the background's parallax scrolling
    function setParallaxBackground() {
        let totalOffset = 0; // Current canvas position
        let isAnimating = false;

        window.addEventListener('scroll', animateScroll);

        function animateScroll() {
            const canvas = document.querySelector('canvas');
            // Controls how fast the background scrolls
            const offsetRate = 0.01;
            let startPos = 0;

            // When scrolling, if not currently animating, start anim
            if (!isAnimating) {
                isAnimating = true;
                animLoop();
            }

            function animLoop() {
                const currentPos = window.pageYOffset;
                // Define the rate at which totalOffset is increased
                let difference = currentPos - totalOffset;
                difference *= offsetRate;

                // If page is not moving, stop animating and break
                if (Math.abs(difference) < 0.05) {
                    totalOffset = window.pageYOffset;
                    isAnimating = false;
                    return;
                }

                canvas.style.top = (startPos - totalOffset) + 'px';
                // Store distance travelled this frame
                totalOffset += difference;
                // Redraw background so we don't run out of grid
                drawGrid();
                // Call function to update an animation before repaint
                requestAnimationFrame(animLoop);
            }
        }
    }

    function enableImageDisplay() {
        const imageDisplay = document.querySelector('#full-page');
        const fullSizeImage = document.querySelector('#full-page img');
        const imageDisplayBG = document.querySelector('#full-page div');
        const images = document.querySelectorAll('.projects img');

        // Allow user to click to exit display
        imageDisplayBG.addEventListener('click', (e) => {
            // Clicking on the image itself does not exit
            e.stopPropagation;
            imageDisplay.style.display = 'none';
        })

        document.querySelector('#full-page button').addEventListener(
            'click', 
            (e) => {
                imageDisplay.style.display = 'none';
            }
        )

        // Enable every image to activate the display
        images.forEach(element => {
            element.addEventListener('click', () => {
                let fullPath = element.getAttribute('src');
                let fileName = fullPath.split(/[\\\/]/).pop();
                fullSizeImage.setAttribute('src', './img/full/' + fileName);
                imageDisplay.style.display = 'flex';
            })
        })
    }
});