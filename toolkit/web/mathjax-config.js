if (location.hash.indexOf('#render') === 0) document.documentElement.classList.add('render');
window.MathJax = {
  loader: { load: ['[tex]/color'] },
  tex: { packages: { '[+]': ['color'] } },
  svg: { fontCache: 'none' },
  startup: { typeset: false, ready: () => { MathJax.startup.defaultReady(); MathJax.startup.promise.then(() => window.__mj && window.__mj(true)); } }
};
