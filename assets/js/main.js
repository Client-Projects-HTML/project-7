/**
 * Nexus HTML Template - Main JS
 * Handles Theme Toggle, RTL Support, and Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    // === Theme & RTL Initialize ===
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const savedDir = localStorage.getItem('dir');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    }

    if (savedDir) {
        htmlElement.setAttribute('dir', savedDir);
    }

    // === Dark/Light Mode Toggle ===
    const themeToggleButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');

    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    });

    // === RTL Toggle ===
    const rtlToggleButtons = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile');

    rtlToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    });

    // === Mobile Menu ===
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMenu);
    }
});
