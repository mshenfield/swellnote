const template = document.createElement("template");
template.innerHTML = `
<swellnote-button icon="speaker"/>
<!-- Looping is handled in JS to avoid gap between loops -->
<audio autoplay="true" muted="true" src=""></audio>
`

class MuteToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // Forward the button-size attribute (and in the future all button state) to the swellnote-button
    this.muteButton.setAttribute("button-size", this.getAttribute("button-size"));
  }

  connectedCallback() {
    const audio = this.shadowRoot.querySelector("audio");
    audio.src = this.getAttribute("src");
    // Initialize values to the current audio state.
    this.setIcon(audio.muted);

    // Force initial muted state - Firefox remembers checkbox state otherwise
    this.muteButton.addEventListener("click", e => {
      e.preventDefault();
      this.toggleMuted(!audio.muted);
    });
    
    // Using the <audio> "loop" attribute results in a conspicuous gap between
    // loops. To make the background noise as unobtrusive as possible, do extra
    // massaging for a gap-less loop.
    audio.addEventListener("timeupdate", () => {
      const proportionPlayed = audio.currentTime / audio.duration;
      if (proportionPlayed > .95) {
        audio.currentTime = 0;
        audio.play();
      }
    });
  }

  get muteButton() {
    return this.shadowRoot.querySelector("swellnote-button");
  }

  toggleMuted(isMuted) {
    const audio = this.shadowRoot.querySelector("audio");
    audio.muted = isMuted;
    // For mobile browsers, the `autoplay` attribute isn't honored, even if initially muted.
    // Manually trigger a `play()` in case its needed.
    // https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
    audio.play();

    this.setIcon(isMuted);
  }

  setIcon(isMuted) {
    this.muteButton.icon = isMuted ? "speaker-muted" : "speaker";
  }
}

customElements.define("mute-toggle", MuteToggle);
