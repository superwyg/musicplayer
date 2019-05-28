(function(window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor:Lyric,
        init:function(path){
            this.path = path;
        },
        time :[],
        lyric : [],
        index : -1,
        currentIndex:function(currentTime){
            console.log(currentTime);
            if (currentTime>this.time[0]){
                this.index++;
                this.time.shift();
            }
            return this.index;
        },

        loadLyric:function(callBack){
            var $this = this;
            $.ajax({
                url:$this.path,
                dataType:"text",
                success:function(data){
                    $this.parseLyric(data);
                    callBack();
                }
            })
        },
        parseLyric:function(data){
            var $this =this;
            $this.time = [];
            $this.lyric = [];
            var lyricArr = data.split("\n");
            var reg = /\[(.*?)\]/;
            $.each(lyricArr,function(index,ele){
                if(ele.split(']')[1]==undefined){
                    return true;
                }
                var lrc = ele.split(']')[1];
                $this.lyric.push(lrc);
                if(ele.match(reg) == null){
                    return true;
                }
                var res = reg.exec(ele)[1];
                console.log(res);
                var ressplit = res.split(':');
                var min = parseInt(ressplit[0]) * 60;
                var sec = parseFloat(ressplit[1]);
                var time = parseFloat((min + sec).toFixed(2)) ;
                console.log(time);
                $this.time.push(time);


            })
            console.log($this.time);
            console.log($this.lyric);


        }

    };

    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;

})(window);