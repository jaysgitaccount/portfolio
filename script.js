document.addEventListener("DOMContentLoaded", function () {
    
    // EXPANDABLE SECTIONS

    const expandables = document.querySelectorAll('.expandable');

    expandables.forEach(element => {
        element.addEventListener("click", () => {
            element.classList.toggle('active');
            // The next sibling is always a <section>
            const content = element.nextElementSibling;
            // Expand/collapse the selected <section>
            // maxHeight is used for animation purposes
            content.style.maxHeight
                ? content.style.maxHeight = null
                : content.style.maxHeight = content.scrollHeight + 'px';
        })
    });

    // THEME CHANGES

    const toggle = document.querySelector('#toggle');
    const themeButton = document.querySelector('#toggle-theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Based off browser preference, toggling will add the stored theme,
    // which either changes from the default or has no effect
    if (currentTheme === 'dark') {
        document.body.classList.toggle('dark');
        toggle.checked = true;
    } else if (currentTheme === 'light') {
        document.body.classList.toggle('light');
        toggle.checked = false;
    }

    toggle.addEventListener('input', (event) => {
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

    // STICKY HEADER

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

    // LOGO ANIMATION

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

    // CANVAS GRID BACKGROUND

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const mouse = {
        x: undefined,
        y: undefined
    }

    resizeCanvas();
    drawGrid();
    window.addEventListener('resize', drawGrid);

    function drawGrid() {
        resizeCanvas();

        // Match colour to theme
        const color = getComputedStyle(document.body).getPropertyValue('--opposite-text-color');
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        const interval = 28;

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
    }

    function resizeCanvas() {
        canvas.width = document.body.scrollWidth;
        canvas.height = document.body.scrollHeight;
    }

    // PARALLAX BACKGROUND

    let totalOffset = 0; // Current canvas position
    let isAnimating = false;

    window.addEventListener('scroll', animateScroll);

    function animateScroll() {
        const offsetRate = 0.03;
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
});