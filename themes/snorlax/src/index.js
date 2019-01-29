import '@babel/polyfill'
import '~/css/style.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap.bundle.js'

window.$ = $

$(document).ready(function () {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active", 1000);
        $(".navbar-menu").toggleClass("is-active", 1000);

    });

    $(".post-list-item").click((e) => {
        $(e.currentTarget).find(".card-title > a")[0].click();
    })

    // const gitment = new Gitment({
    //   owner: 'kdevkr',
    //   repo: 'kdevkr.github.io',
    //   oauth: {
    //     client_id: '09d7de1c47808658ba67',
    //     client_secret: 'c533399ed8080e575405d5f8a9621561f015df38',
    //   },
    //   // ...
    //   // For more available options, check out the documentation below
    // })
    // gitment.render('gitment')
});
