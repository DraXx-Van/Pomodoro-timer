let timer = 10;
let initialTime = 10;
let defaultTime = 10;
let timerid;
let sessionCount = 0;
let totalMinutes = 0;
const display = document.querySelector('#timerValue');
const startbtn = document.querySelector('#bstart');
const pausebtn = document.querySelector('#bpause');
const resetbtn = document.querySelector('#breset');
const ring = document.getElementById('ring');
const baddtime = document.querySelector('#baddtime');

const focusbtn = document.querySelector('#bfocus');
const lbreabtn = document.querySelector('#blongbreak');
const sbreakbtn = document.querySelector('#bsmallbreak');
const label = document.querySelector('#mode');
const sub = document.querySelector('#modesub');
const addbtn = document.querySelector('#add-btn');
const inputTask = document.querySelector('.task-input');
const navbtns = document.querySelectorAll('.nav .navbtns');
const filterBtns = document.querySelectorAll('.filter-btn');

const taskList = document.querySelector('.tasks-ls');

const MODES = {
    work:  { time: 25*60, heading: 'FOCUS.',     eyebrow: 'FOCUS SESSION',bodyclass: ''         },
    short: { time: 1*60,  heading: 'BREAK.',     eyebrow: 'SHORT BREAK',bodyclass: 'mode-short' },
    long:  { time: 15*60, heading: 'RECHARGE.',  eyebrow: 'LONG BREAK',bodyclass: 'mode-long'   },
}

let tasks = [];
let currentFilter = 'all';

const CIRC = 2 * Math.PI * 120;
ring.style.strokeDasharray = CIRC;
ring.style.strokeDashoffset = 0;

pausebtn.setAttribute('disabled','');

function calcTimeStr(time){

    let minutes = String(Math.floor(time/60)).padStart(2,0);
    let seconds = String(time % 60).padStart(2,0);

    let calculatedTime = `${minutes}:${seconds}`;
    return calculatedTime;
}

function updateTimer(time){
    display.innerText = time;
}

function displayTime(){
    if(timer > 0){
        timer--;
        updateTimer(calcTimeStr(timer));
        updateRing();
    }else{
        if (document.body.className === '') {
            sessionCount++;
            totalMinutes += Math.floor(initialTime / 60);
            document.getElementById('sesssionC').innerText = sessionCount;
            document.getElementById('minF').innerText = totalMinutes;
        }
        timer = defaultTime;
        initialTime = defaultTime;
        updateTimer(calcTimeStr(timer));
        clearInterval(timerid);
        updateRing();
        timerid = null;
        startbtn.removeAttribute('disabled');
        pausebtn.setAttribute('disabled','');
    }
}

function updateRing(){
    let offset = CIRC * (1 - timer/initialTime);
    ring.style.strokeDashoffset = offset;
}

function setMode(mode,clickedbtn){
    clearInterval(timerid);
    timerid = null;
    timer = mode.time;
    initialTime = mode.time;
    defaultTime = mode.time;

    document.body.className = mode.bodyclass;
    updateTimer(calcTimeStr(timer));
    updateRing();
    label.innerText = mode.heading;
    sub.innerText = mode.eyebrow;

    navbtns.forEach((el)=>{
        el.classList.remove('active');
    });

    clickedbtn.classList.add('active');

}

function renderTask(){
    const list = document.querySelector('.tasks-ls');
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.done);
    } else if (currentFilter === 'done') {
        filteredTasks = tasks.filter(t => t.done);
    }

    list.innerHTML = filteredTasks.map((task)=>{
        return `<div class="task-item">
                        <input type="checkbox" class="checkboxtask" ${task.done ? 'checked' : ''} id="task-${task.id}">
                        <label for="task-${task.id}" class="custom-check" data-id="${task.id}"></label>
                        <span class="tname">${task.text}</span>
                        <span class="del-btn" data-id="${task.id}">✕</span>
                </div>`
    }).join('');

    let count = 0;
    for(let task of tasks){
        if(task.done == true){
            count++;
        }
    }
    console.log(count);

    const taskdone = document.getElementById('tasks-count');
    taskdone.innerText = count;
    document.getElementById('finishC').innerText = count;
    document.getElementById('totalC').innerText = `/ ${tasks.length}`;
}

function addTask(){
    if(!inputTask.value){
        return;
    }

    let newtask = {
        id: null,
        text: '',
        done: false,
    };

    newtask.text = inputTask.value;
    newtask.id = Date.now();

    tasks.push(newtask);
    console.log(tasks);
    inputTask.value = '';

    renderTask();

}

function toggleTask(id){
    
    tasks.forEach((task)=>{
        if(task.id == id){
            task.done = !task.done;
        }
    });

    renderTask();
}

function deleteTask(id){
    console.log(id);
    tasks = tasks.filter((task)=>{
        return task.id != id;
    });
    renderTask();
}

startbtn.addEventListener('click',() =>{
    if(timerid != null){
       return;
    }
    startbtn.setAttribute('disabled','');
    pausebtn.removeAttribute('disabled');
    timerid = setInterval(displayTime,1000);
});


pausebtn.addEventListener('click',()=>{
    pausebtn.setAttribute('disabled','');
    startbtn.removeAttribute('disabled');
    if(timerid == null)
        return;
    clearInterval(timerid);
    timerid = null;
});

resetbtn.addEventListener('click',()=>{
    clearInterval(timerid);
    timerid = null;
    timer = initialTime;
    updateTimer(calcTimeStr(timer));
    updateRing();
    startbtn.removeAttribute('disabled');
});

baddtime.addEventListener('click',()=>{
    timer+=10;
    initialTime+=10;
    updateTimer(calcTimeStr(timer));
    updateRing();
});

focusbtn.addEventListener('click',()=>{
    setMode(MODES.work,focusbtn);
});

lbreabtn.addEventListener('click',()=>{
    setMode(MODES.long,lbreabtn);
});

sbreakbtn.addEventListener('click',()=>{
    setMode(MODES.short,sbreakbtn);
});

addbtn.addEventListener( 'click',()=>{
    addTask();
});

inputTask.addEventListener('keydown',(event)=>{
    if(event.key == 'Enter'){
        addTask();
    }
});

taskList.addEventListener('click',(e)=>{
    
    if(e.target.classList.contains('custom-check')){
        let id = Number(e.target.dataset.id);
        console.log(id);
        toggleTask(id);
    }

    if(e.target.classList.contains('del-btn')){
        let id = Number(e.target.dataset.id);
        deleteTask(id);
    }

});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTask();
    });
});


updateTimer(calcTimeStr(timer));

(function(){
  const canvas = document.getElementById('dot-canvas');
  const ctx = canvas.getContext('2d');
  const GAP = 22;
  const R = 0.8;

  function draw() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;
    const maxD = Math.sqrt(cx * cx + cy * cy) * 0.75;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = GAP; x < canvas.width; x += GAP) {
      for (let y = GAP; y < canvas.height; y += GAP) {
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const t = Math.min(dist / maxD, 1);
        const alpha = Math.sin(t * Math.PI) * 0.055;
        if (alpha < 0.003) continue;
        ctx.beginPath();
        ctx.arc(x, y, R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }
  }

  draw();
  window.addEventListener('resize', draw);
})();