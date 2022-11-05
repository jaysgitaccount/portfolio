// EXPANDABLE SECTION LOGIC
// get reference to .expandable buttons
// add event listeners ( 'click', toggleDisplay() ) to all 
// default: button inactive, content display:none;
// when button is clicked, toggle "active" and add .active
// when button is active, expand the "next sibling" section, .content
// when button is inactive, hide content (content display: none)

//LIGHT MODE/DARK MODE
// when #toggle-theme button is pressed
// if currently light, add .dark to root
// if dark, remove .dark from root
// I wonder if I can add a nice fade in effect as well
// add .current class to the corresponding <i></i>, #light or #dark, and remove it from the other

// also, add .current to the currently selected theme on load

const themeButton = document.querySelector('#toggle-theme');
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");

// Based off browser preference, toggling will add the stored theme
// Which either changes from the default or has no effect
if (currentTheme === "dark") {
    document.body.classList.toggle("dark");
} else if (currentTheme === "light") {
    document.body.classList.toggle("light");
}

themeButton.addEventListener("click", function() {
    let theme;

    if(prefersDarkMode.matches) {
        // If the user prefers dark mode,
        // toggle body.light
        document.body.classList.toggle("light");

        theme = // if .light is on body
        document.body.classList.contains("light")
        ? "light" // theme = light
        : "dark"; // else, dark
    } else {
        document.body.classList.toggle("dark");

        theme = 
        document.body.classList.contains("dark")
        ? "dark"
        : "light";
    } 
    localStorage.setItem("theme", theme);
});