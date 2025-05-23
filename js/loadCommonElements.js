$(function () {
    const page = window.location.pathname.split('/').pop();

    const navMap = {
        'index.html': '#nav-home',
        'forge.html': '#nav-forge',
        'activity.html': '#nav-library',
        'help.html': '#nav-help',
        'dylanKendall.html': '#nav-kendall',
        'tanishaSikder.html': '#nav-sikder'
    };

    $('#navbar-container').load('commonElements/navbar.html', function () {
        const selector = navMap[page];
        if (selector) {
            $(selector).addClass('active');
            if (selector === '#nav-kendall' || selector === '#nav-sikder') {
                $('#nav-team').addClass('active');
            }
        }
    });

    $('#footer-container').load('commonElements/footer.html', function () {
        $(`.bottom-links a[href="${page}"]`).addClass('active');
    });
});
