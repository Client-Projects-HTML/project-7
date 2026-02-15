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

    // === Home Dropdown (Desktop) ===
    const homeMenuBtn = document.getElementById('home-menu-btn');
    const homeMenu = document.getElementById('home-menu');
    const homeArrow = document.getElementById('home-arrow');

    if (homeMenuBtn) {
        homeMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = homeMenu.classList.toggle('hidden');
            if (isHidden) {
                homeArrow.classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                homeArrow.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!homeMenuBtn.contains(e.target) && !homeMenu.contains(e.target)) {
                homeMenu.classList.add('hidden');
                homeArrow.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    }

    // === Home Dropdown (Mobile) ===
    const mobileHomeMenuBtn = document.getElementById('mobile-home-menu-btn');
    const mobileHomeMenu = document.getElementById('mobile-home-menu');
    const mobileHomeArrow = document.getElementById('mobile-home-arrow');

    if (mobileHomeMenuBtn) {
        mobileHomeMenuBtn.addEventListener('click', () => {
            const isHidden = mobileHomeMenu.classList.toggle('hidden');
            if (isHidden) {
                mobileHomeArrow.classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                mobileHomeArrow.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        });
    }
    // === Video Modal ===
    const watchVideoBtns = document.querySelectorAll('#watch-video-btn, .watch-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video');
    const videoIframe = document.getElementById('video-iframe');
    const videoUrl = "https://www.youtube.com/embed/377u4S1u9No?autoplay=1";

    if (videoModal && watchVideoBtns.length > 0) {
        watchVideoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (videoIframe) videoIframe.src = videoUrl;
                videoModal.classList.remove('hidden');
                videoModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            videoModal.classList.add('hidden');
            videoModal.style.display = 'none';
            if (videoIframe) videoIframe.src = "";
            document.body.style.overflow = '';
        };

        if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
    }

    // === Pricing Toggle (Home 2) ===
    const pricingToggle = document.getElementById('pricing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');

    const starterPrice = document.getElementById('starter-price');
    const businessPrice = document.getElementById('business-price');
    const enterprisePrice = document.getElementById('enterprise-price');

    const starterPeriod = document.getElementById('starter-period');
    const businessPeriod = document.getElementById('business-period');
    const enterprisePeriod = document.getElementById('enterprise-period');

    if (pricingToggle) {
        let isYearly = false;

        const updatePricing = () => {
            if (isYearly) {
                pricingToggle.classList.replace('justify-start', 'justify-end');
                if (monthlyLabel) monthlyLabel.className = 'text-gray-500 dark:text-gray-400 font-medium cursor-pointer transition-colors';
                if (yearlyLabel) yearlyLabel.className = 'text-gray-900 dark:text-white font-bold cursor-pointer transition-colors';
            } else {
                pricingToggle.classList.replace('justify-end', 'justify-start');
                if (monthlyLabel) monthlyLabel.className = 'text-gray-900 dark:text-white font-bold cursor-pointer transition-colors';
                if (yearlyLabel) yearlyLabel.className = 'text-gray-500 dark:text-gray-400 font-medium cursor-pointer transition-colors';
            }

            if (isYearly) {
                if (starterPrice) starterPrice.textContent = '$19';
                if (businessPrice) businessPrice.textContent = '$79';
                if (enterprisePrice) enterprisePrice.textContent = '$249';
                [starterPeriod, businessPeriod, enterprisePeriod].forEach(el => { if (el) el.textContent = '/year'; });
            } else {
                if (starterPrice) starterPrice.textContent = '$29';
                if (businessPrice) businessPrice.textContent = '$99';
                if (enterprisePrice) enterprisePrice.textContent = '$299';
                [starterPeriod, businessPeriod, enterprisePeriod].forEach(el => { if (el) el.textContent = '/month'; });
            }
        };

        pricingToggle.addEventListener('click', () => {
            isYearly = !isYearly;
            updatePricing();
        });

        if (monthlyLabel) monthlyLabel.addEventListener('click', () => { isYearly = false; updatePricing(); });
        if (yearlyLabel) yearlyLabel.addEventListener('click', () => { isYearly = true; updatePricing(); });

        updatePricing();
    }
    // === Footer Newsletter ===
    const footerForms = document.querySelectorAll('footer form');
    footerForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('Thank you for subscribing! You will receive our latest updates soon.');
                emailInput.value = '';
            }
        });
    });
});
