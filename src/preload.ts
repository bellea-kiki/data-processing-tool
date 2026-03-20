window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  try {
    replaceText('app', `This app is running with Node.js ${process.versions.node}, Chromium ${process.versions.chrome}, and Electron ${process.versions.electron}.`);
  } catch (err) {
    console.log(err);
  }
});
