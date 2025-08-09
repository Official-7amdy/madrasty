/* src/assets/css/pages/profile.js */

function initProfileTabs() {
    const tabLinks = document.querySelectorAll('.profile-tabs-nav .tab-link');
    const tabContents = document.querySelectorAll('.profile-content .tab-content');

    if (!tabLinks.length || !tabContents.length) return;

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Deactivate all links and content
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate the clicked link and corresponding content
            const tabId = link.getAttribute('data-tab');
            const correspondingContent = document.getElementById(tabId);
            
            link.classList.add('active');
            if (correspondingContent) {
                correspondingContent.classList.add('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initProfileTabs);