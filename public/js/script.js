let slider1 = document.querySelector('.slider1')
let slider2 = document.querySelector('.slider2')
let slider3 = document.querySelector('.slider3')
let addmore = document.querySelector('.add-more')

var click = 1;
console.log(click);
addmore.addEventListener('click', () => {
    if (click == 1) {
        console.log(click)
        click += 1;
        slider1.classList.remove('disable');
    }
   else if(click == 2) {
        console.log(click)
        click += 1;
        slider2.classList.remove('disable');
    }
   else if(click == 3) {
        console.log(click)
        click += 1;
        slider3.classList.remove('disable');
    }
})
