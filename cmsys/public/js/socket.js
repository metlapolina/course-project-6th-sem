const socket = io('https://localhost:4000');
const count = document.getElementById('like-count');
const form = document.getElementById('like-course');

socket.on('like-course', (value) => {
    count.innerText = value;
})

form.addEventListener('submit', e => {
    e.preventDefault();
    let liked = Number.parseInt(count.innerText);
    socket.emit('liked', ++liked);
    count.innerText = liked;
})