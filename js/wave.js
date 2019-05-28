$(function(){
    function anim(){
        let num = Math.round(Math.random() * 8.5);
        $('.pole').eq(num).animate({
            height:Math.random() * 99 +"%"
        },800)
    }
    var intv = setInterval(anim,5);

});