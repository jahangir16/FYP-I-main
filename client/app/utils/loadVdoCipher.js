export const loadVdoCipherAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.VdoPlayer) return resolve(window.VdoPlayer);
    const script = document.createElement("script");
    script.src = "https://player.vdocipher.com/v2/api.js";
    script.onload = () => resolve(window.VdoPlayer);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};
