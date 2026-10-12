// HuntAlong v6.1: the email signup is submitted before the optional questionnaire.
document.addEventListener('DOMContentLoaded',()=>{
 const signup=document.getElementById('early-access-form');
 const survey=document.getElementById('beta-questionnaire-form');
 if(!signup||!survey)return;
 const email=signup.querySelector('#signup-email'),name=signup.querySelector('#signup-name');
 const signupStatus=document.getElementById('signup-status');
 const surveyStatus=document.getElementById('questionnaire-status');
 const signupButton=document.getElementById('signup-submit');
 const surveyButton=document.getElementById('questionnaire-submit');
 const signupSuccess=document.getElementById('signup-success');
 const finished=document.getElementById('signup-finished');
 const panel=document.getElementById('questionnaire-panel');
 const surveySuccess=document.getElementById('questionnaire-success');
 const steps=[...survey.querySelectorAll('.beta-step')];
 let current=0;
 function showStep(n){current=n;steps.forEach((step,i)=>step.hidden=i!==n);surveyStatus.textContent='';steps[n].querySelector('legend')?.focus();document.getElementById('signup-card').scrollIntoView({block:'start',behavior:'smooth'});}
 function validateStep(n){
   const step=steps[n];
   for(const field of step.querySelectorAll('[required]')){
     if(field.type==='radio'){
       if(!step.querySelector('input[name="'+field.name+'"]:checked')){surveyStatus.textContent='Please choose an answer to continue.';field.focus();return false;}
     }else if(!field.checkValidity()){field.reportValidity();return false;}
   }return true;
 }
 async function send(form){
   if(!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(form.action))throw new Error('configuration');
   const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
   return response.ok;
 }
 function showFinished(){signupSuccess.hidden=true;panel.hidden=true;finished.hidden=false;finished.focus();}
 signup.addEventListener('submit',async event=>{
   event.preventDefault();if(!signup.reportValidity())return;
   signupButton.disabled=true;signupButton.textContent='Joining…';signupStatus.textContent='';
   try{
     if(!await send(signup)){signupStatus.textContent="We couldn't save your signup. Please try again.";return;}
     document.getElementById('questionnaire-email').value=email.value.trim();
     document.getElementById('questionnaire-name').value=name.value.trim();
     signup.hidden=true;signupSuccess.hidden=false;signupSuccess.focus();
   }catch(_){signupStatus.textContent="We couldn't confirm your signup. Please try again in a moment.";}
   finally{signupButton.disabled=false;signupButton.textContent='Join the early-access list';}
 });
 document.getElementById('start-questionnaire').addEventListener('click',()=>{signupSuccess.hidden=true;panel.hidden=false;showStep(0);});
 document.getElementById('skip-questionnaire').addEventListener('click',showFinished);
 document.getElementById('questionnaire-exit').addEventListener('click',showFinished);
 survey.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{if(validateStep(current))showStep(Number(b.dataset.next)-1);}));
 survey.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>{if(Number(b.dataset.back)===0){panel.hidden=true;signupSuccess.hidden=false;signupSuccess.focus();}else showStep(Number(b.dataset.back)-1);}));
 survey.addEventListener('submit',async event=>{
   event.preventDefault();if(!validateStep(current))return;
   for(let i=0;i<steps.length;i++)if(!validateStep(i)){showStep(i);return;}
   surveyButton.disabled=true;surveyButton.textContent='Submitting…';surveyStatus.textContent='';
   try{
     if(!await send(survey)){surveyStatus.textContent="We couldn't submit your answers. You're still signed up; please try again.";return;}
     panel.hidden=true;surveySuccess.hidden=false;surveySuccess.focus();
   }catch(_){surveyStatus.textContent="We couldn't confirm your questionnaire. Your email signup is already saved. Please try again.";}
   finally{surveyButton.disabled=false;surveyButton.textContent='Submit beta application';}
 });
});