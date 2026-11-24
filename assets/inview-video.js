if (!customElements.get('inview-video')) {
  customElements.define(
    'inview-video',
    class InviewVideo extends HTMLElement {
      connectedCallback() {
        this.video = this.querySelector('video');
        if (!this.video) return;

        // Required for autoplay on iOS / Chrome mobile
        this.video.muted = true;
        this.video.defaultMuted = true;
        this.video.loop = true;
        this.video.playsInline = true;
        this.video.setAttribute('muted', '');
        this.video.setAttribute('playsinline', '');

        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const playPromise = this.video.play();
                if (playPromise) playPromise.catch(() => {});
              } else {
                this.video.pause();
              }
            });
          },
          { threshold: 0.25 }
        );
        this.observer.observe(this);
      }

      disconnectedCallback() {
        if (this.observer) this.observer.disconnect();
      }
    }
  );
}
