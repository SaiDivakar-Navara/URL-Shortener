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
      <div style="display:flex;align-items:center;gap:10px;">
        <span>Short URL: <a href="${data.shortUrl}" target="_blank" class="short-link">${data.shortUrl}</a></span>
        <button id="copyBtn" style="padding:6px 10px;font-size:0.9rem;border:none;border-radius:6px;background:#2b6cff;color:#fff;cursor:pointer;">Copy</button>
        <span id="copyMsg" style="display:none;color:green;font-size:0.9rem;">Copied!</span>
      </div>
    `;

    const copyBtn = document.getElementById('copyBtn');
    const copyMsg = document.getElementById('copyMsg');

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(data.shortUrl);
      copyMsg.style.display = 'inline';
      setTimeout(() => copyMsg.style.display = 'none', 2000);
    };
  } catch {
    resultDiv.textContent = 'Server error';
  }
});
