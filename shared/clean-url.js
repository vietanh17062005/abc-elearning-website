(() => {
    const { pathname, search, hash } = window.location;
    const oldProductPath = /^\/san-pham(?:\/index\.html)?\/?$/;
    const cleanPath = oldProductPath.test(pathname)
        ? '/product'
        : pathname.replace(/\/index\.html$/, '') || '/';

    if (cleanPath !== pathname) {
        window.location.replace(`${cleanPath}${search}${hash}`);
    }
})();
