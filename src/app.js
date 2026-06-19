const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const house = document.querySelector('#houseModel');
document.querySelectorAll('[data-rotate]').forEach((button) => {
  button.addEventListener('click', () => {
    const rotate = button.getAttribute('data-rotate');
    house.style.transform = `rotateX(-13deg) rotateY(${rotate}deg)`;
  });
});
