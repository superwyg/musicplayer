(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        musicList:[],
        init:function($audio){
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex:-1,
        playMusic: function(index,music){

            if (this.currentIndex == index){
                if (this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                this.$audio.attr('src',music.src);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function(){
            let index = this.currentIndex -1;
            let musicList = $('.playitems');
            if(index < 0 ){
                index = musicList.length - 1;
                console.log(index);
                return index;
            }
            return index;
        },
        nextIndex: function(){
            let index = this.currentIndex + 1;
            let musicList = $('.playitems');

            if (index >= musicList.length -1){
                index = 0;
                console.log(index);
                return index;
            }
            return index;
        },
        getMusicDuration:function(){
            return this.audio.duration;
        },
        getMusicCurrentTime:function () {
            return this.audio.currentTime;
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;

})(window);