// Reproduce un sonido de clic en cualquier boton/tile del sitio.
// El archivo de sonido lo pones tu en assets/audio/click.mp3
(function () {
  const CLICK_SOUND_SRC = 'assets/audio/click.mp3';

  document.querySelectorAll('.btn-mc, .option-tile').forEach((el) => {
    el.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const click = new Audio(CLICK_SOUND_SRC);
      click.volume = 0.7;

      if (href) {
        // Es un enlace: reproducimos el sonido y esperamos un
        // poquito antes de navegar para que se alcance a escuchar.
        e.preventDefault();
        click.play().catch(() => {});
        setTimeout(() => { window.location.href = href; }, 150);
      } else {
        // Es un boton normal (no navega): solo suena.
        click.play().catch(() => {});
      }
    });
  });
})();
