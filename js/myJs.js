//author:Wu Yuguang
$(function(){
    $('.function>span').attr('title','noch nicht fertig').css({cursor:"not-allowed"});

    //0 scrollbar
    $('.playlist').mCustomScrollbar({
        theme:'minimal-dark'
    });
    //close the mask
    $('.close-button').click(function(){
        $(this).parents('.self-intro').remove();
    });
    //1获取音乐数据
    getPlayList();
    function getPlayList(){
        $.ajax({
            url:"./resources/resources.json",
            dataType:"json",
            success:function(data){
                var $ul = $('ul');
                player.musicList = data;

                //1.1遍历获取到的数据创建每一条音乐
                $.each(data,function(index,ele){
                    var $item = createMusicItem(index,ele);
                    $ul.append($item);


                });
                //1.2 initializing music info
                initMusicInfo(data[0]);
                //1.3 initializing lyrics
                initLyricInfo(data[0]);
            },
            error:function(e){
                console.log(e);
            }
        });
    }
    var lyric;
    function initLyricInfo(data){
        lyric = new Lyric(data.lyric);
        var $lyricContainer = $('.lyric');
        lyric.loadLyric(function(){
            //create lyric lists
            $.each(lyric.lyric,function(index,ele){
                var $lyricNode = $("<p>"+ele+"</p>");
                $lyricContainer.append($lyricNode);
            })
        })
    }

    function initMusicInfo(music){
        var $musicImage = $('.cd-box>img');
        var $musicName = $('.songInfo .songName');
        var $musicSingerName = $('.songInfo .singerName');
        var $musicAlbumName = $('.songInfo .albumName');
        var $musicProgressName = $('.progress-bar .song-info .bar-songname');
        var $musicProgressSingerName = $('.progress-bar .song-info .bar-singer');
        var $musicProgressTimeTotal = $('.progress-bar .song-info .time-total');
        var $lyric = $('.lyric');
        var $musicBG = $('.mask-cover');

        $musicImage.attr('src',music.img);
        $musicName.text("Song: "+ music.name);
        $musicSingerName.text("Singer: " + music.singername);
        $musicAlbumName.text("Album: " + music.album);
        $musicProgressName.text(music.name);
        $musicProgressSingerName.text(music.singername);
        $musicProgressTimeTotal.text(music.time);
        $musicBG.css("background","url("+music.img+")");
        console.log(music.lyric);


    }

    function createMusicItem(index,ele){
        let $linode =$("<li class=\"playitems\">\n" +
            "                        <div class=\"list_check\">\n" +
            "                            <i></i>\n" +
            "                        </div>\n" +
            "                        <div class=\"list_num\">"+(index + 1)+"</div>\n" +
            "                        <div class=\"list_song_name\">"+ele.name+"</div>\n" +
            "                        <div class=\"list_singer\">"+ele.singername+"</div>\n" +
            "                        <div class=\"list_time\">"+ele.time+"</div>\n" +
            "                        <div class=\"src\">"+ele.src+"</div>\n" +
            "                        <div class=\"pop-up-menu\">\n" +
            "                            <i class=\"fas fa-play\"></i>\n" +
            "                            <i class=\"fas fa-plus\"></i>\n" +
            "                            <i class=\"fas fa-download\"></i>\n" +
            "                            <i class=\"fas fa-share-square\"></i>\n" +
            "                        </div>\n" +
            "                        <div class=\"delete\"><i class=\"fas fa-trash-alt\"></i></div>\n" +
            "                    </li>");

        $linode.get(0).index = index;
        $linode.get(0).music = ele;
        return $linode;
    }


    //2 初始化一系列代理事件
    initEvent();
    function initEvent(){
        $('ul').delegate('.playitems','mouseenter',function(){
            $(this).find('.list_time').toggleClass('hide');
            $(this).find('.delete').css('display','block');
        });
        $('ul').delegate('.playitems','mouseleave',function(){
            $(this).find('.list_time').toggleClass('hide');
            $(this).find('.delete').css('display','none');
        });
        //.delete按钮删除歌曲
        $('ul').delegate('.playitems .delete','click',function(){
            $(this).parents('.playitems').remove();
            $audio[0].pause();
            sortAgain();
        });
        function sortAgain(){
            var len = $('.playitems').length;
            var list_num = $(".list_num");
            for (let i = 0; i<len;i++){
                list_num.eq(i).html(i+1);
            }
        }
        //.fas fa-play播放按钮同时改变主播放按钮
        $('ul').delegate('.pop-up-menu>i:first-child','click',function(){
            let $buttonPlay = $(this);
            let $mainPlay = $('.play-control>a:nth-child(2)>i');
            let $wave = $("<div class=\"wave\">\n" +
                "                                <div class=\"ul\">\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                    <div class=\"pole\"></div>\n" +
                "                                </div>\n" +
                "                            </div>");

            if ($mainPlay.hasClass('fas fa-play') || $buttonPlay.hasClass('fas fa-play')){
                $buttonPlay.attr('class','fas fa-pause');
                $buttonPlay.parents('.playitems').siblings().find(".pop-up-menu>i:first-child").attr('class','fas fa-play');
                $mainPlay.attr('class','fas fa-pause');
                $buttonPlay.parents('.playitems').siblings().find('.list_check .wave').remove();
                $buttonPlay.parents('.playitems').find('.list_check').append($wave);
                console.log('appended');

            } else if ($mainPlay.hasClass('fas fa-pause') || $buttonPlay.hasClass('fas fa-pause')){
                $buttonPlay.attr('class','fas fa-play');
                $mainPlay.attr('class','fas fa-play');
                $buttonPlay.parents('.playitems').find('.list_check .wave').empty();
                $audio[0].pause();
            }
        });

        //点击方框给方框加对号
        //check_header 点击总表头的checkbox会改变所有曲目的对号为选中
        $('ul').delegate('.playitems_header .list_check_header>i','click',function(){
            $(this).toggleClass('fas fa-check');
            if ($(this).hasClass('fas fa-check')){
                $(this).parents('.playitems_header').siblings().find('.list_check>i').addClass('fas fa-check opacity1');
            }else{
                $(this).parents('.playitems_header').siblings().find('.list_check>i').removeClass('fas fa-check opacity1');
            }
        });
        $('ul').delegate('.playitems .list_check>i','click',function(){
            if ($(this).hasClass('fas fa-check')){
                $(this).removeClass('fas fa-check opacity1')
            }else{
                $(this).addClass('fas fa-check opacity1');
            };
        });

        $('ul').delegate('.playitems .pop-up-menu>i:first-child','click',function(){
            if($(this).hasClass('fas fa-pause')){
                player.playMusic($(this).parents('.playitems').get(0).index,$(this).parents('.playitems').get(0).music)
            }
            console.log($(this).parents('.playitems').get(0).index);
            console.log($(this).parents('.playitems').get(0).music);
            initMusicInfo($(this).parents('.playitems').get(0).music);
            $('.lyric').html("");
            initLyricInfo($(this).parents('.playitems').get(0).music);
        });

        //监听底部控制按钮 播放键
        var $play = $('.bottom .play-control a').eq(1);
        $play.click(function(){
            if (player.currentIndex == -1){
                $('.playitems').eq(0).find('.pop-up-menu i:first-child').trigger('click');
            }else{
                $('.playitems').eq(player.currentIndex).find('.pop-up-menu i:first-child').trigger('click');
            }
        });
        //监听底部控制按钮 上一个键
        var $previous = $('.bottom .play-control a').eq(0);
        $previous.click(function(){
            $('.playitems').eq(player.preIndex()).find('.pop-up-menu i:first-child').trigger('click');
        });
        //监听底部控制按钮 下一个键
        var $next = $('.bottom .play-control a').eq(2);
        $next.click(function(){
            $('.playitems').eq(player.nextIndex()).find('.pop-up-menu i:first-child').trigger('click');
        });

    }




    //audio标签控制
    var $audio = $('audio');
    var player = new Player($audio);
    player.nextIndex();
    player.preIndex();
    player.$audio.on('timeupdate',function(){
        var currentTime = $('audio').get(0).currentTime;
        var totalTime = $('audio').get(0).duration;
        var timeString = formatTime(currentTime);
        $('.time-played').text(timeString);
        //lyric gets current time
        var index = lyric.currentIndex(currentTime);
        $('.lyric p').eq(index).addClass('current-line');
        $('.lyric p').eq(index).siblings().removeClass('current-line');
        if(lyric.index <= 1 ) return true;
        $('.lyric').css({
            marginTop: ((-lyric.index + 1) * (120 / 3)) +"px"
        });

        //同步进度条
        var playPercent = currentTime / totalTime;
        $('.bar-progress').css({
            width:$('.bar-container').width() * playPercent
        });
        $('.dot').css({
            left:$('.bar-container').width() * playPercent + "px"
        });
    });
    function formatTime(currentTime){
        var minutes = parseInt(currentTime / 60);
        var seconds = parseInt(currentTime % 60);
        if(minutes<10){
            minutes = "0" + minutes;
        }
        if(seconds<10){
            seconds = "0" + seconds;
        }
        return minutes+":"+seconds+" / "
    }

    //volume control
    $('.volume i').click(function(){
       if($(this).hasClass('fas fa-volume-up')){
           $(this).removeClass().addClass('fas fa-volume-mute');
           $audio.get(0).volume = 0;
       }else{
           $(this).removeClass().addClass('fas fa-volume-up');
           $audio.get(0).volume = 1;

       }
    });

    //play progress bar
    var $progressBar = $('.bar-container');
    var $progressLine = $('.bar-progress');
    var $progressDot = $('.dot');
    var progress = new Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick();
    progress.progressMove();
    progress.progressSeekTo();
    //volume control bar
    var $volumeBar = $('.volume-bar');
    var $volumeLine = $('.volume-progress');
    var $volumeDot = $('.volume-dot');
    var volumeProgress = Progress($volumeBar,$volumeLine,$volumeDot);
    volumeProgress.progressClick();
    volumeProgress.progressMove();

    $('.volume-bar').click(function(){
        var volumeValue = 1 + (parseInt($(this).find('.volume-progress').css('left')) / parseInt($(this).find(".volume-progress").css('width')));
        console.log(volumeValue);
        $audio.get(0).volume =parseInt(volumeValue.toFixed(2));
    });

});
