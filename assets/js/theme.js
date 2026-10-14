(function () {
    var root = document.documentElement;
    var toggle = document.querySelector('.sidebar-toggle');

    function onHome() {
        var path = location.pathname.replace(/\/+$/, '') || '/';
        return path === '/';
    }

    function showBrowse(show) {
        root.classList.toggle('is-browse', show);
        if (onHome()) {
            history.replaceState(null, '', show ? '#posts' : location.pathname);
        }
    }

    document.addEventListener('click', function (event) {
        var browse = event.target.closest('.js-show-index');
        if (browse) {
            if (onHome()) {
                event.preventDefault();
                showBrowse(true);
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
            return;
        }

        var latest = event.target.closest('.js-show-latest');
        if (latest && onHome() && root.classList.contains('is-browse')) {
            event.preventDefault();
            showBrowse(false);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    });

    function jumpTop(event) {
        if (!event.target.closest('.js-jump-top')) {
            return;
        }
        event.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    document.addEventListener('click', jumpTop);
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        jumpTop(event);
    });

    if (!toggle) {
        return;
    }

    function setSidebar(open) {
        document.body.classList.toggle('sidebar-open', open);
        toggle.classList.remove('is-hover');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close sidebar' : 'Open sidebar');
    }

    toggle.addEventListener('click', function () {
        setSidebar(!document.body.classList.contains('sidebar-open'));
    });

    toggle.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSidebar(!document.body.classList.contains('sidebar-open'));
        }
    });

    toggle.addEventListener('mouseenter', function () {
        if (!document.body.classList.contains('sidebar-open')) {
            toggle.classList.add('is-hover');
        }
    });

    toggle.addEventListener('mouseleave', function () {
        toggle.classList.remove('is-hover');
    });
})();
