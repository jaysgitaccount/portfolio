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
        })
    });

    const themeButton = document.querySelector('#toggle-theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Based off browser preference, toggling will add the stored theme
    // Which either changes from the default or has no effect
    if (currentTheme === 'dark') {
        document.body.classList.toggle('dark');
    } else if (currentTheme === 'light') {
        document.body.classList.toggle('light');
    }

    themeButton.addEventListener('click', function() {
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
    });
});