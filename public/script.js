async function shorten(url) {
  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl: url })
  });
  return res.json();
}

document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('longUrl');
  const url = input.value.trim();
  if (!url) return;

  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'Generating...';

  try {
    const data = await shorten(url);
    if (data.error) {
      resultDiv.textContent = data.error;
    } else {
      resultDiv.innerHTML = `Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    }
  } catch {
    resultDiv.textContent = 'Server error';
  }
});








async function shorten(url) {
  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl: url })
  });
  return res.json();
}

document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('longUrl').value.trim();
  if (!url) return;

  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'Generating...';

  try {
    const data = await shorten(url);
    if (data.error) {
      resultDiv.textContent = data.error;
      return;
    }

    resultDiv.innerHTML = `
      Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
      <button id="copyBtn">Copy</button>
      <span id="copyMsg" style="display:none;color:green;margin-left:8px;">Copied!!</span>
    `;

    const copyBtn = document.getElementById('copyBtn');
    const copyMsg = document.getElementById('copyMsg');

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(data.shortUrl);
      copyMsg.style.display = 'inline';
      setTimeout(() => copyMsg.style.display = 'none', 2000); // hide after 2s
    };
  } catch {
    resultDiv.textContent = 'Server error';
  }
});
