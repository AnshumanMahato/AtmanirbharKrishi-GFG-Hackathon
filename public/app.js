$(document).ready(function () {
    $("a").on("click", function (event) {
        if (this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;
            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top,
                },
                800,
                function () {
                    window.location.hash = hash;
                }
            );
        }
    });
});

$(".menu-items a").click(function () {
    $("#checkbox").prop("checked", false);
});
function login_clicked(e){
    e.style.display="none";
    let tp1=document.getElementById('after_login1');
    let tp2=document.getElementById('after_login2');
    tp1.style.display="block";
    tp2.style.display="block";
}