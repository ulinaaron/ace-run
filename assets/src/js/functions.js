/* Custom functions */

/**
 * CSS3 transition support
 */
function supportsTransitions() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';

    if (typeof s[p] === 'string') { return true; }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i=0; i<v.length; i++) {
        if (typeof s[v[i] + p] === 'string') { return true; }
    }

    return false;
}
