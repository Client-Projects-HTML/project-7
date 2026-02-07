/**
 * Nexus Dashboard JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // We need to handle sidebar visibility classes manually for mobile
    // Tailwind's 'hidden md:flex' handles the base state.
    // When toggled on mobile, we want to show it fixed over content.

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('absolute');
            sidebar.classList.toggle('h-full');
            sidebar.classList.toggle('w-64');
            sidebar.classList.toggle('z-50');
            // Note: A more robust mobile menu implementation would be better for production
            // but this serves the template demo purpose.
        });
    }
});
