const daysEl = document.getElementById('days')
const hoursEl = document.getElementById('hours')
const minutesEl = document.getElementById('minutes')
const secondsEl = document.getElementById('seconds')





function countdown(){
    const newDay = '1 Jan ';
    const currentDate = new Date();
    const newYears = newDay + (currentDate.getFullYear() + 1).toString();
    const newYearsDate = new Date(newYears);
    const totalseconds = (newYearsDate - currentDate) / 1000;
    const days = Math.floor(totalseconds/3600/24);
    const hours = Math.floor((totalseconds - (days*3600*24))/3600);
    const minutes = Math.floor((totalseconds - (days*3600*24) - (hours*3600))/60);
    const seconds = Math.floor((totalseconds - (days*3600*24) - (hours*3600) - (minutes*60)));

    daysEl.innerHTML = formatTime(days);
    hoursEl.innerHTML = formatTime(hours);
    minutesEl.innerHTML = formatTime(minutes);
    secondsEl.innerHTML = formatTime(seconds);
}

function formatTime(time){
    return time < 10 ? (`0${time}`) : time;
}

countdown();

setInterval(countdown, 1000);