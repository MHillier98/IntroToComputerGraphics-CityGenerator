var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.top = null;
stats.dom.style.bottom = 0;
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);