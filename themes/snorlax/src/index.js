import '@babel/polyfill'
import '~/css/style.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import $ from 'jquery'

window.$ = $

$(document).ready(function () {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active", 1000);
        $(".navbar-menu").toggleClass("is-active", 1000);

    });

    $(".post-list-item").click((e) => {
        $(e.currentTarget).find(".title > a")[0].click();
    })
});
