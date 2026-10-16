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

    document.querySelectorAll('.pagination').forEach(function (nav) {
        var total = parseInt(nav.getAttribute('data-pages'), 10);
        var current = parseInt(nav.getAttribute('data-page'), 10);
        var template = nav.getAttribute('data-template') || '';
        var slot = nav.querySelector('.page-nums');
        var firstPage = template.replace(/\/page\/999\/?$/, '/');
        var firstPath = firstPage;

        try {
            firstPath = firstPage.indexOf('http') === 0 ? new URL(firstPage).pathname : firstPage;
        } catch (error) {
            firstPath = firstPage;
        }

        var indexList = firstPath === '/' || firstPath === '';

        if (!slot || !total || template.indexOf('999') === -1) {
            return;
        }

        if (indexList) {
            nav.querySelectorAll('a.newer-posts, a.older-posts').forEach(function (link) {
                if (link.getAttribute('href') === '/' || link.getAttribute('href') === firstPage) {
                    link.setAttribute('href', '/#posts');
                }
            });
        }

        if (total < 4) {
            return;
        }

        for (var number = 1; number <= total; number++) {
            var href = number === 1
                ? (indexList ? '/#posts' : firstPage)
                : template.replace('999', String(number));
            var item;

            if (number === current) {
                item = document.createElement('span');
                item.setAttribute('aria-current', 'page');
            } else {
                item = document.createElement('a');
                item.href = href;
            }

            item.className = 'page-num' + (number === current ? ' is-current' : '');
            item.textContent = String(number);
            slot.appendChild(item);
        }
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
