function initCourseDetail() {
    // Tabs functionality
    const tabsNav = document.querySelector('.tabs-nav');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabsNav) {
        tabsNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-link')) {
                const tabId = e.target.dataset.tab;

                tabsNav.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');

                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            }
        });
    }

    // Sticky sidebar
    const sidebar = document.getElementById('course-sidebar');
    if (sidebar) {
        const sidebarTop = sidebar.offsetTop;
        const footerTop = document.querySelector('.footer')?.offsetTop || document.body.scrollHeight;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            if (scrollY > sidebarTop - 100 && scrollY < footerTop - sidebar.offsetHeight - 120) {
                sidebar.classList.add('is-sticky');
            } else {
                sidebar.classList.remove('is-sticky');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initCourseDetail);
