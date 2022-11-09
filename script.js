document.addEventListener("DOMContentLoaded", function () {
    // EXPANDABLE SECTION LOGIC
    // get reference to .expandable buttons
    // add event listeners ( 'click', toggleDisplay() ) to all 
    // default: button inactive, content display:none;
    // when button is clicked, toggle "active" and add .active
    // when button is active, expand the "next sibling" section, .content
    // when button is inactive, hide content (content display: none)
    const expandables = document.querySelectorAll('.expandable');

    expandables.forEach(element => {
        element.addEventListener("click", () => {
            element.classList.toggle('active');
            const content = element.nextElementSibling;
            content.style.maxHeight
                ? content.style.maxHeight = null
                : content.style.maxHeight = content.scrollHeight + 'px';
            drawGrid();
        })
    });

    const toggle = document.querySelector('#toggle');
    const themeButton = document.querySelector('#toggle-theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Based off browser preference, toggling will add the stored theme
    // Which either changes from the default or has no effect
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
            document.body.classList.toggle('light');

            theme =
            document.body.classList.contains('light')
            ? 'light'
            : 'dark';
        } else {
            document.body.classList.toggle('dark');

            theme = 
            document.body.classList.contains('dark')
            ? 'dark'
            : 'light';
        } 
        localStorage.setItem('theme', theme);
        drawGrid();
    });

    // STICKY HEADER
    // if currentScroll, window.pageYOffset, < 0, .scrolldown must be on body
    // if currentScroll => 0, remove scrolldown
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset;       

        if ( currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // if current pos is greater than lastScroll (scrolled down)
            // and the header does NOT already have .scroll-down
            header.classList.add('scroll-down');
        } else if ( currentScroll <= lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
        }
        //save current scroll;;
        lastScroll = currentScroll;
    });

    // LOGO ANIMATION
    // On hover/focus, expand
    // on active, maybe scale(90%) or lighter colour
    // on mobile, expand when clicked. after input dtected elsewhere, collapse (or maybe after page returns to top & sections collapse)
    // when clicked, take user back to top, collapse everything
    // get .logo
    // get span (.logo span)
    // on click, .logo width
    // and span.textContent = 'JAY'S PORTFOLIO'
    // be able to transition back to original state (incl. textContent = 'J')

    const logo = document.querySelector('.logo');
    const logoText = document.querySelector('.logo span');
    const logoString = "AY'S PORTFOLIO";

    let expandArray = [];

    logo.addEventListener('mouseenter', expand);
    logo.addEventListener('mouseleave', shrink);

    let hue = 0;

    function expand() {
        clearTimeouts();

        // Get the index of the current letter
        let currentLogoIndex = logoText.textContent.length - 1;

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

    // PARALLAX BACKGROUND

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const mouse = {
        x: undefined,
        y: undefined
    }

    resizeCanvas();

    // Use device orientation for mobile, mouse for desktop
    // not supposed to use brackets for these lol
    window.addEventListener('scroll', animateScroll);
    window.addEventListener('resize', drawGrid);

    let totalOffset = 0;
    let isAnimating = false;
    
    function animateScroll() {
        const offsetRate = 0.05;
        let startPos = 0;

        if (!isAnimating) {
            isAnimating = true;

            animLoop();
        }

        function animLoop() {
            const currentPos = window.pageYOffset;
            let difference = currentPos - totalOffset;

            difference *= offsetRate;
            if (Math.abs(difference) < 0.05) {
                // this only triggers when I'm at the top?
                totalOffset = window.pageYOffset;
                isAnimating = false;
                return;
            }

            canvas.style.top = (startPos - totalOffset) + 'px';
            totalOffset += difference;
            drawGrid();
            requestAnimationFrame(animLoop);
        }
    }
    

    function drawGrid() {
        resizeCanvas();

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

    drawGrid();
});