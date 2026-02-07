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
        });
    }

    // Export Functionality
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // Find the first table in the main content area
            const table = document.querySelector('main table');
            if (!table) {
                return;
            }

            let csv = [];
            const rows = table.querySelectorAll('tr');

            for (let i = 0; i < rows.length; i++) {
                const row = [], cols = rows[i].querySelectorAll('td, th');

                for (let j = 0; j < cols.length; j++) {
                    // Clean up cell text
                    let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s+)/gm, ' ');
                    data = data.replace(/"/g, '""');
                    row.push('"' + data + '"');
                }
                csv.push(row.join(','));
            }

            const csvContent = csv.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', 'nexus_dashboard_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // User Management Search Functionality
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('tbody tr');

            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Modal Management
    const userModal = document.getElementById('user-modal');
    const deleteModal = document.getElementById('delete-modal');
    const userForm = document.getElementById('user-form');
    const addUserBtn = document.getElementById('add-user-btn');
    const tableBody = document.querySelector('tbody');
    let currentRow = null;

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (userModal) userModal.classList.add('hidden');
        if (deleteModal) deleteModal.classList.add('hidden');
        document.body.style.overflow = '';
        if (userForm) {
            userForm.reset();
            document.getElementById('edit-user-id').value = '';
        }
    };

    // Global close for modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === userModal) closeModal();
        if (e.target === deleteModal) closeModal();
    });

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            document.getElementById('modal-title').innerText = 'Add New User';
            openModal(userModal);
        });
    }

    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-user');
            const deleteBtn = e.target.closest('.delete-user');
            currentRow = e.target.closest('tr');

            if (editBtn) {
                const name = currentRow.querySelector('.font-medium').innerText;
                const email = currentRow.querySelector('td:nth-child(2)').innerText.trim();
                const role = currentRow.querySelector('td:nth-child(3)').innerText.trim();

                document.getElementById('modal-title').innerText = 'Edit User';
                document.getElementById('user-fullname').value = name;
                document.getElementById('user-email').value = email;
                document.getElementById('user-role').value = role;
                document.getElementById('edit-user-id').value = 'active';

                openModal(userModal);
            }

            if (deleteBtn) {
                const userName = currentRow.querySelector('.font-medium').innerText;
                const namePlaceholder = document.getElementById('delete-user-name');
                if (namePlaceholder) namePlaceholder.innerText = userName;
                openModal(deleteModal);
            }
        });
    }

    // Modal Form Submission
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isEdit = document.getElementById('edit-user-id').value === 'active';
            const name = document.getElementById('user-fullname').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('user-role').value;

            if (isEdit && currentRow) {
                currentRow.querySelector('.font-medium').innerText = name;
                currentRow.querySelector('td:nth-child(2)').innerText = email;
                currentRow.querySelector('td:nth-child(3)').innerText = role;
            } else {
                // Mock adding a new row
                const tr = tableBody.querySelector('tr');
                if (tr) {
                    const newRow = tr.cloneNode(true);
                    newRow.querySelector('.font-medium').innerText = name;
                    newRow.querySelector('td:nth-child(2)').innerText = email;
                    newRow.querySelector('td:nth-child(3)').innerText = role;
                    const avatar = newRow.querySelector('.w-10');
                    if (avatar) avatar.innerText = name.split(' ').map(n => n[0]).join('').toUpperCase();
                    tableBody.prepend(newRow);
                }
            }
            closeModal();
        });
    }

    // Confirm Delete Action
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (currentRow) {
                currentRow.remove();
                closeModal();
            }
        });
    }

    // Pagination Functionality
    const paginationContainer = document.querySelector('.pagination');
    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const pageLink = e.target.closest('.page-link');
            const prevBtn = e.target.closest('.prev-page');
            const nextBtn = e.target.closest('.next-page');
            const statusSpan = document.querySelector('.text-sm.text-gray-500');
            const activePage = paginationContainer.querySelector('.bg-blue-600');

            if (pageLink) {
                const pageNum = pageLink.innerText;
                paginationContainer.querySelectorAll('.page-link').forEach(link => {
                    link.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
                    link.classList.add('border', 'border-gray-200', 'dark:border-gray-700', 'text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-gray-800');
                });
                pageLink.classList.remove('border', 'border-gray-200', 'dark:border-gray-700', 'text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-gray-800');
                pageLink.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
                if (statusSpan) statusSpan.innerText = `Showing page ${pageNum} results...`;

                // Mock Data Swap for Users Page
                if (window.location.pathname.includes('users.html') && tableBody) {
                    if (pageNum === '2') {
                        tableBody.innerHTML = `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">EW</div>
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">Emma Watson</div>
                                            <div class="text-xs text-gray-500">Paris, France</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">emma.w@example.com</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Manager</td>
                                <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">Active</span></td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Nov 12, 2025</td>
                                <td class="px-6 py-4 text-right">
                                    <button class="edit-user text-gray-400 hover:text-blue-600 transition mx-1"><i class="fas fa-edit"></i></button>
                                    <button class="delete-user text-gray-400 hover:text-red-600 transition mx-1"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold">DB</div>
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">David Beckham</div>
                                            <div class="text-xs text-gray-500">Madrid, Spain</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">david.b@example.com</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Customer</td>
                                <td class="px-6 py-4"><span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">Banned</span></td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dec 01, 2025</td>
                                <td class="px-6 py-4 text-right">
                                    <button class="edit-user text-gray-400 hover:text-blue-600 transition mx-1"><i class="fas fa-edit"></i></button>
                                    <button class="delete-user text-gray-400 hover:text-red-600 transition mx-1"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `;
                        if (statusSpan) statusSpan.innerText = `Showing 4 to 5 of 50 users`;
                    } else {
                        // Restore page 1
                        tableBody.innerHTML = `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">JD</div>
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">John Doe</div>
                                            <div class="text-xs text-gray-500">New York, USA</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">john.doe@example.com</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Admin</td>
                                <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">Active</span></td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2025</td>
                                <td class="px-6 py-4 text-right">
                                    <button class="edit-user text-gray-400 hover:text-blue-600 transition mx-1"><i class="fas fa-edit"></i></button>
                                    <button class="delete-user text-gray-400 hover:text-red-600 transition mx-1"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <img src="https://ui-avatars.com/api/?name=Sarah+Smith&background=random" class="w-10 h-10 rounded-full" alt="Avatar">
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">Sarah Smith</div>
                                            <div class="text-xs text-gray-500">London, UK</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">sarah.smith@example.com</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Customer</td>
                                <td class="px-6 py-4"><span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">Active</span></td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Sep 15, 2025</td>
                                <td class="px-6 py-4 text-right">
                                    <button class="edit-user text-gray-400 hover:text-blue-600 transition mx-1"><i class="fas fa-edit"></i></button>
                                    <button class="delete-user text-gray-400 hover:text-red-600 transition mx-1"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `;
                    }
                }

                // Mock Data Swap for Orders Page
                if (window.location.pathname.includes('orders.html') && tableBody) {
                    if (pageNum === '2') {
                        tableBody.innerHTML = `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#ORD-9979</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div class="flex items-center gap-2">
                                        <img src="https://ui-avatars.com/api/?name=James+W&background=random" class="w-6 h-6 rounded-full" alt="">
                                        James Wilson
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">App Design</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">2 days ago</td>
                                <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">$2,400.00</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">Cancelled</span></td>
                                <td class="px-6 py-4 text-right"><button class="view-order text-blue-600 hover:text-blue-800 text-sm font-medium">View</button></td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#ORD-9978</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div class="flex items-center gap-2">
                                        <img src="https://ui-avatars.com/api/?name=Linda+K&background=random" class="w-6 h-6 rounded-full" alt="">
                                        Linda Kim
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Content Writing</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">3 days ago</td>
                                <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">$150.00</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">Completed</span></td>
                                <td class="px-6 py-4 text-right"><button class="view-order text-blue-600 hover:text-blue-800 text-sm font-medium">View</button></td>
                            </tr>
                        `;
                    } else {
                        // Restore page 1
                        tableBody.innerHTML = `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#ORD-9981</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div class="flex items-center gap-2">
                                        <img src="https://ui-avatars.com/api/?name=Alex+M&background=random" class="w-6 h-6 rounded-full" alt="">
                                        Alex Morris
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Web Development</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Today, 2:30 PM</td>
                                <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">$1,200.00</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">Completed</span></td>
                                <td class="px-6 py-4 text-right"><button class="view-order text-blue-600 hover:text-blue-800 text-sm font-medium">View</button></td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#ORD-9980</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div class="flex items-center gap-2">
                                        <img src="https://ui-avatars.com/api/?name=Maria+G&background=random" class="w-6 h-6 rounded-full" alt="">
                                        Maria Garcia
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">SEO Audit</td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Yesterday</td>
                                <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">$350.00</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-semibold">Pending</span></td>
                                <td class="px-6 py-4 text-right"><button class="view-order text-blue-600 hover:text-blue-800 text-sm font-medium">View</button></td>
                            </tr>
                        `;
                    }
                }
            }

            if (prevBtn && activePage) {
                const prevPage = activePage.previousElementSibling;
                if (prevPage && prevPage.classList.contains('page-link')) prevPage.click();
            }

            if (nextBtn && activePage) {
                const nextPage = activePage.nextElementSibling;
                if (nextPage && nextPage.classList.contains('page-link')) nextPage.click();
            }
        });
    }

    // Order Filtering Functionality
    const filterGroup = document.querySelector('.filter-group');
    if (filterGroup) {
        filterGroup.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            const filterValue = btn.getAttribute('data-filter');

            // Update active button style
            filterGroup.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
                b.classList.add('bg-white', 'dark:bg-dark-card', 'border', 'border-gray-200', 'dark:border-gray-700', 'text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-gray-800');
            });
            btn.classList.remove('bg-white', 'dark:bg-dark-card', 'border', 'border-gray-200', 'dark:border-gray-700', 'text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-gray-800');
            btn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');

            // Filter table rows
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                if (filterValue === 'all') {
                    row.style.display = '';
                } else {
                    const status = row.querySelector('span');
                    if (status && status.innerText.trim().toLowerCase() === filterValue.toLowerCase()) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // View Order Functionality (Orders Page)
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-order');
            if (viewBtn) {
                const orderId = viewBtn.closest('tr').querySelector('td:first-child').innerText;
                alert(`Viewing details for order ${orderId}`);
            }
        });
    }

    // General Button Feedback & Logout
    document.querySelectorAll('button, a').forEach(el => {
        if (el.innerText.toLowerCase().includes('logout') || el.classList.contains('fa-power-off')) {
            el.addEventListener('click', (e) => {
                if (!confirm('Are you sure you want to log out?')) {
                    e.preventDefault();
                }
            });
        }
    });

    // Messaging System - Chat Switching
    const chatItems = document.querySelectorAll('.chat-item');
    const chatHeader = document.getElementById('active-chat-name');
    const chatAvatar = document.getElementById('active-chat-avatar');
    const messageContainer = id => document.getElementById(id); // Helper or just use IDs directly
    const msgScroll = document.getElementById('chat-messages-scroll');
    const chatListContainer = document.getElementById('chat-list-container');
    const chatAreaContainer = document.getElementById('chat-area-container');
    const backToListBtn = document.getElementById('back-to-list');

    if (chatItems.length > 0) {
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                const name = item.querySelector('h4').innerText;
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

                // Mobile Handling: Switch Views
                if (chatListContainer && chatAreaContainer) {
                    chatListContainer.classList.add('hidden');
                    chatAreaContainer.classList.remove('hidden');
                    chatAreaContainer.classList.add('flex');
                }

                // Update Sidebar Active State
                chatItems.forEach(i => i.classList.remove('bg-blue-50', 'dark:bg-blue-900/10'));
                item.classList.add('bg-blue-50', 'dark:bg-blue-900/10');

                // Update Header
                if (chatHeader) chatHeader.innerText = name;
                if (chatAvatar) {
                    chatAvatar.innerText = initials;
                    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100'];
                    const textColors = ['text-blue-600', 'text-green-600', 'text-purple-600'];
                    const randomIdx = Math.floor(Math.random() * colors.length);
                    chatAvatar.className = `w-10 h-10 rounded-full ${colors[randomIdx]} flex items-center justify-center ${textColors[randomIdx]} font-bold`;
                }

                // Update Messages Area (Mock Data)
                if (msgScroll) {
                    const chatType = item.getAttribute('data-chat');
                    let messagesHtml = '';

                    if (chatType === 'sarah') {
                        messagesHtml = `
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">SS</div>
                                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-md">
                                    <p class="text-sm text-gray-800 dark:text-gray-200">Can I upgrade my plan mid-month?</p>
                                    <span class="text-xs text-gray-400 mt-1 block">9:15 AM</span>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 justify-end">
                                <div class="bg-blue-600 p-3 rounded-lg rounded-tr-none max-w-md text-white">
                                    <p class="text-sm">Hi Sarah! Yes, you can upgrade at any time. The difference will be prorated.</p>
                                    <span class="text-xs text-blue-200 mt-1 block">9:20 AM</span>
                                </div>
                                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">Me</div>
                            </div>
                        `;
                    } else if (chatType === 'michael') {
                        messagesHtml = `
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">MJ</div>
                                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-md">
                                    <p class="text-sm text-gray-800 dark:text-gray-200">Thanks for the quick refund.</p>
                                    <span class="text-xs text-gray-400 mt-1 block">Yesterday</span>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 justify-end">
                                <div class="bg-blue-600 p-3 rounded-lg rounded-tr-none max-w-md text-white">
                                    <p class="text-sm">You're welcome, Michael! High priority for our loyal customers.</p>
                                    <span class="text-xs text-blue-200 mt-1 block">Yesterday</span>
                                </div>
                                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">Me</div>
                            </div>
                        `;
                    } else {
                        messagesHtml = `
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">JD</div>
                                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-md">
                                    <p class="text-sm text-gray-800 dark:text-gray-200">Hi, I'm trying to generate a new API key but getting a 403 error.</p>
                                    <span class="text-xs text-gray-400 mt-1 block">10:30 AM</span>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 justify-end">
                                <div class="bg-blue-600 p-3 rounded-lg rounded-tr-none max-w-md text-white">
                                    <p class="text-sm">Hello John! Let me check your account permissions. One moment please.</p>
                                    <span class="text-xs text-blue-200 mt-1 block">10:32 AM</span>
                                </div>
                                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">Me</div>
                            </div>
                        `;
                    }
                    msgScroll.innerHTML = messagesHtml;
                    msgScroll.scrollTop = msgScroll.scrollHeight;
                }
            });
        });

        if (backToListBtn) {
            backToListBtn.addEventListener('click', () => {
                if (chatListContainer && chatAreaContainer) {
                    chatListContainer.classList.remove('hidden');
                    chatAreaContainer.classList.add('hidden');
                }
            });
        }
    }

    // Service Management Modal (Client Portal)
    const serviceModal = document.getElementById('service-modal');
    const manageServiceBtns = document.querySelectorAll('.manage-service-btn');
    const closeServiceModalBtns = document.querySelectorAll('.close-service-modal');
    const cancelSubBtn = document.getElementById('cancel-sub-btn');

    if (manageServiceBtns.length > 0 && serviceModal) {
        manageServiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const serviceName = btn.closest('div').querySelector('h3').innerText;
                const modalTitle = document.getElementById('service-modal-title');
                if (modalTitle) modalTitle.innerText = `Manage: ${serviceName}`;
                serviceModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeSvcModal = () => {
            serviceModal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        closeServiceModalBtns.forEach(btn => {
            btn.addEventListener('click', closeSvcModal);
        });

        window.addEventListener('click', (e) => {
            if (e.target === serviceModal) closeSvcModal();
        });

        if (cancelSubBtn) {
            cancelSubBtn.addEventListener('click', () => {
                const serviceNameElement = document.getElementById('service-modal-title');
                const serviceName = serviceNameElement ? serviceNameElement.innerText.replace('Manage: ', '') : 'this';
                if (confirm(`Are you sure you want to cancel your ${serviceName} subscription? This action will take effect at the end of the current billing cycle.`)) {
                    alert('Cancellation request sent. A confirmation email will be sent shortly.');
                    closeSvcModal();
                }
            });
        }
    }

    // Invoice Functionality
    const downloadBtns = document.querySelectorAll('.download-invoice');
    const payBtns = document.querySelectorAll('.pay-now-btn');

    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const invId = row.querySelector('td:first-child').innerText.trim();
            const service = row.querySelector('td:nth-child(2)').innerText.trim();

            // Mock Download
            const content = `Invoice: ${invId}\nService: ${service}\nStatus: Paid\nGenerated on: ${new Date().toLocaleDateString()}`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${invId}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        });
    });

    payBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const invId = row.querySelector('td:first-child').innerText.trim();

            if (confirm(`Process payment for ${invId}?`)) {
                // Simulate payment processing
                btn.innerText = 'Processing...';
                btn.disabled = true;

                setTimeout(() => {
                    // Update UI to Paid
                    const statusTd = row.querySelector('td:nth-child(6)');
                    if (statusTd) {
                        statusTd.innerHTML = '<span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">Paid</span>';
                    }

                    // Replace Pay Now button with Download button
                    const actionTd = row.querySelector('td:last-child');
                    if (actionTd) {
                        actionTd.innerHTML = `
                            <button class="download-invoice text-gray-500 hover:text-indigo-600 transition flex items-center justify-end gap-1 w-full text-sm">
                                Download <i class="fas fa-download"></i>
                            </button>
                        `;
                        // Re-attach download listener to the new button
                        const newDownloadBtn = actionTd.querySelector('.download-invoice');
                        newDownloadBtn.addEventListener('click', () => {
                            const content = `Invoice: ${invId}\nStatus: Paid\nGenerated on: ${new Date().toLocaleDateString()}`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${invId}.txt`;
                            a.click();
                        });
                    }

                    alert(`Payment for ${invId} successful!`);
                }, 1000);
            }
        });
    });

    // Profile Management Functionality
    const profileForm = document.getElementById('profile-form');
    const avatarUpload = document.getElementById('avatar-upload');
    const profilePreview = document.getElementById('profile-preview');
    const topbarAvatar = document.getElementById('topbar-avatar');
    const topbarName = document.getElementById('topbar-name');
    const displayName = document.getElementById('display-name');

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('full-name').value;

            // Mock Save
            if (topbarName) topbarName.innerText = fullName;
            if (displayName) displayName.innerText = fullName;

            alert('Profile updated successfully!');
        });
    }

    if (avatarUpload) {
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgUrl = event.target.result;
                    if (profilePreview) profilePreview.src = imgUrl;
                    if (topbarAvatar) topbarAvatar.src = imgUrl;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Settings Functionality
    const themeSwitch = document.getElementById('theme-switch');
    const rtlSwitch = document.getElementById('rtl-switch');

    if (themeSwitch) {
        // Init state from localStorage
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) themeSwitch.querySelector('div').classList.add('left-7');

        themeSwitch.addEventListener('click', () => {
            const themeToggleBtn = document.getElementById('theme-toggle');
            if (themeToggleBtn) themeToggleBtn.click(); // Reuse existing logic

            // Update switch UI
            themeSwitch.querySelector('div').classList.toggle('left-7');
        });
    }

    if (rtlSwitch) {
        // Init state from localStorage
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        if (isRtl) rtlSwitch.querySelector('div').classList.add('left-7');

        rtlSwitch.addEventListener('click', () => {
            const rtlToggleBtn = document.getElementById('rtl-toggle');
            if (rtlToggleBtn) rtlToggleBtn.click(); // Reuse existing logic

            // Update switch UI
            rtlSwitch.querySelector('div').classList.toggle('left-7');
        });
    }

    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Password updated successfully! Please use your new password next time you log in.');
            passwordForm.reset();
        });
    }

    // Support System Functionality
    const ticketForm = document.getElementById('ticket-form');
    const viewConvBtns = document.querySelectorAll('.view-conv-btn');
    const convModal = document.getElementById('conversation-modal');
    const closeConvBtn = document.querySelector('.close-conv-modal');
    const convReplyForm = document.getElementById('conv-reply-form');

    if (ticketForm) {
        ticketForm.querySelector('button').addEventListener('click', (e) => {
            e.preventDefault();
            const subject = ticketForm.querySelector('input').value;
            if (!subject) {
                alert('Please enter a subject');
                return;
            }
            alert(`Ticket "${subject}" submitted successfully. Our team will get back to you within 24 hours.`);
            ticketForm.reset();
        });
    }

    if (viewConvBtns.length > 0 && convModal) {
        viewConvBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const ticketId = btn.getAttribute('data-ticket');
                const ticketTitle = btn.getAttribute('data-title');

                document.getElementById('conv-ticket-title').innerText = ticketTitle;
                document.getElementById('conv-ticket-id').innerText = `Ticket ${ticketId}`;

                convModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeConv = () => {
            convModal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (closeConvBtn) closeConvBtn.addEventListener('click', closeConv);

        // Close on clicking outside the sidebar
        convModal.addEventListener('click', (e) => {
            if (e.target === convModal.firstElementChild) closeConv();
        });
    }

    if (convReplyForm) {
        convReplyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = convReplyForm.querySelector('textarea');
            if (!textarea.value.trim()) return;

            const messageHtml = `
                <div class="flex flex-col items-end gap-2 animate-fade-in">
                    <div class="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-sm">
                        <p>${textarea.value}</p>
                    </div>
                    <span class="text-[10px] text-gray-400">You • Just now</span>
                </div>
            `;

            document.getElementById('conv-messages').insertAdjacentHTML('beforeend', messageHtml);
            document.getElementById('conv-messages').scrollTop = document.getElementById('conv-messages').scrollHeight;
            textarea.value = '';
        });
    }
});
