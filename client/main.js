import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatConatiner = document.querySelector('#chat_container');

let loadInterval;

function loader(elem){
  elem.textContent = '';
  loadInterval = setInterval(()=> {
    elem.textContent += '.';

    if(elem.textContent==='.....'){
      elem.textContent='';
    }
  },300);
}

function typeText(elem,text){
  
  let index=0;
  
  interval = setInterval(()=>{
    if(index < text.length){
      elem.innerHTML+=text.charAt(index);
      index+=1;
    } else {
      clearInterval(interval);
    }
  },20);
}

function genUnId(){
  const timeStamp = Date.now();
  const randNum = Math.random();
  const hexDeciStr = randNum.toString(16);
  return `id-${timeStamp}-${hexDeciStr}`;
}

function chatStripe(isAi, value, uniqueId){
  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="profile pic">
        </div>
        <div class="message" id=${uniqueId}>
          ${value}
        </div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault();

  const data = new FormData(form);
  
  //user
  chatConatiner.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //bot
  const uniqueId = genUnId();
  chatConatiner.innerHTML += chatStripe(true, " ", uniqueId);
  chatConatiner.scrollTop = chatConatiner.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch('https://dj-openai-app.onrender.com'||'http://localhost:5000', {
    method:'post',
    headers:{
      'content-type':'application/json'
    },
    body : JSON.stringify({
      prompt:data.get('prompt')
  })}
  );

  clearInterval(loadInterval);
  messageDiv.innerHTML='';

  if(response.ok){
    const data = await response.json();
    const parsedData = data?.bot?.trim();
    typeText(messageDiv, parsedData);
  } else{
    const err = await response.text();
    messageDiv.innerHTML="Something Went Wrong Nigga...!!!";
    alert(err);
  }

}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode===13){
    handleSubmit(e);
  }
})