// Silver Living Tips — client logic
async function postJSON(url, data){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

function serializeForm(form){
  const fd = new FormData(form);
  return Object.fromEntries(fd.entries());
}

function bindLeadForm(){
  const form = document.getElementById('lead-form');
  const status = document.getElementById('lead-status');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    try{
      const payload = serializeForm(form);
      payload.source = 'lead';
      const resp = await postJSON('/.netlify/functions/telegram', payload);
      if(resp.ok){
        status.textContent = 'Sent! Your download will start in a moment.';
        // trigger download
        window.location.href = '/assets/checklist.pdf';
        form.reset();
      } else {
        status.textContent = resp.error || 'Something went wrong. Please try again.';
      }
    }catch(err){
      status.textContent = 'Network error. Please try again.';
    }
  });
}

function bindContactForm(){
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    try{
      const payload = serializeForm(form);
      payload.source = 'contact';
      const resp = await postJSON('/.netlify/functions/telegram', payload);
      status.textContent = resp.ok ? 'Thanks! We will get back to you shortly.' : (resp.error || 'Please try again.');
      if(resp.ok) form.reset();
    }catch(err){
      status.textContent = 'Network error. Please try again.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindLeadForm();
  bindContactForm();
});
