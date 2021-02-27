const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
  align-items: center;
  display: flex;
  justify-content: center;

  border-radius: 100%;
  height: 2rem;
  width: 2rem;
}
.mute-toggle-label {
  align-items: center;
  display: flex;
  justify-content: center; 
 
  cursor: pointer;
  width: 100%;
}

#mute-toggle-button {
  appearance: none;
  display: none;
}
#mute-toggle-button + .mute-toggle-icon:before {
  content: "🔊";
}
#mute-toggle-button:checked + .mute-toggle-icon:before {
  content: "🔈";
}
</style>
<label class="mute-toggle-label">
  <input id="mute-toggle-button" type="checkbox" checked="true"/>
  <span class="mute-toggle-icon"></span>
  <!-- Looping is handled in JS to avoid gap between loops -->
  <audio autoplay="true" muted="true" src=""></audio>
</label>
`

class MuteToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const audio = this.shadowRoot.querySelector("audio");
    audio.src = this.getAttribute("src");
    const toggle = this.shadowRoot.querySelector("#mute-toggle-button");

    // Force initial muted state - Firefox remembers checkbox state otherwise
    toggle.checked = audio.muted;

    toggle.addEventListener("input", e => {
      e.preventDefault();
      this.toggleMuted(toggle.checked);
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

  toggleMuted(isMuted) {
    const audio = this.shadowRoot.querySelector("audio");
    audio.muted = isMuted;
    this.shadowRoot.querySelector("#mute-toggle-button").checked = isMuted;
    // For mobile browsers, the `autoplay` attribute isn't honored, even if initially muted.
    // Manually trigger a `play()` in case its needed.
    // https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
    audio.play();
  }
}

customElements.define("mute-toggle", MuteToggle);
