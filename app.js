// Helpers
async function postJSON(url, data){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  let payload = {};
  try { payload = await res.json(); } catch {}
  if (!res.ok) {
    const msg = payload.error || `HTTP ${res.status}`;
    const extra = payload.details ? ` – ${payload.details}` : '';
    throw new Error(msg + extra);
  }
  return payload;
}
function serializeForm(form){
  const fd = new FormData(form);
  return Object.fromEntries(fd.entries());
}

// Intent switcher
window.openForm = function(intent){
  const section = document.getElementById('form');
  const sourceInput = document.getElementById('form-source');
  const title = document.getElementById('form-title');
  const sub = document.getElementById('form-sub');
  const submitBtn = document.getElementById('form-submit');
  const msgWrap = document.getElementById('message-wrap');

  if(intent === 'contact'){
    sourceInput.value = 'contact';
    title.textContent = 'Contact Us';
    sub.textContent = 'Send your question and we’ll reply by email.';
    submitBtn.textContent = 'Send Message';
    msgWrap.querySelector('span').textContent = 'Message';
    msgWrap.style.display = '';
  } else {
    sourceInput.value = 'lead';
    title.textContent = 'Free 1‑Page Checklist: Home Upgrade Starter Pack';
    sub.textContent = 'Enter your details to get an instant download link. We’ll also send occasional helpful tips (unsubscribe anytime).';
    submitBtn.textContent = 'Send & Download';
    msgWrap.querySelector('span').textContent = 'Message (optional)';
    msgWrap.style.display = '';
  }
  section.scrollIntoView({ behavior:'smooth' });
};

// Bind single form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('unified-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    try{
      const payload = serializeForm(form);
      const intent = payload.source || 'lead';
      const resp = await postJSON('/.netlify/functions/telegram', payload);
      if(resp.ok){
        if(intent === 'lead'){
          status.textContent = 'Sent! Your download will start in a moment.';
          window.location.href = '/assets/checklist.pdf';
        }else{
          status.textContent = 'Thanks! We will get back to you shortly.';
        }
        form.reset();
        // reset to default intent
        document.getElementById('form-source').value = 'lead';
      }else{
        status.textContent = resp.error || 'Please try again.';
      }
    }catch(err){
      status.textContent = err.message || 'Network error. Please try again.';
    }
  });
});
