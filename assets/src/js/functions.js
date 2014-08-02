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

/**
 * Conditionizr
 */

conditionizr.add('chrome', function () {
  return !!window.chrome && /google/i.test(navigator.vendor);
});

conditionizr.add('ie8', function () {
  return (Function('/*@cc_on return (@_jscript_version > 5.7 && !/^(9|10)/.test(@_jscript_version)); @*/')());
});

conditionizr.polyfill(templateDir + 'assets/js/rem.js', ['chrome']);
