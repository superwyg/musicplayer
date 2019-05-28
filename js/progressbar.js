(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        progressSeekTo:function(){
            //progress bar controls music play
            var playPercent = setOffsetLeft / $('.bar-container').width();
            var totalPlayTime = $('audio').get(0).duration;
            $('audio').get(0).currentTime = parseInt(totalPlayTime * playPercent);
            console.log(playPercent);
        },

        progressClick:function(){
            var $this = this;
            this.$progressBar.click(function(e){
                var originalLeft = $(this).offset().left;
                var clickLeft = e.pageX;
                var setOffsetLeft = parseInt((clickLeft - originalLeft).toFixed(2));
                $this.$progressLine.css('width',setOffsetLeft+"px");
                console.log(originalLeft);
                $this.$progressDot.css('left',setOffsetLeft);


            })

        },
        progressMove:function(){
            var $this = this;

            //监听鼠标的按下事件
            this.$progressDot.mousedown(function(){
                //监听鼠标的移动事件
                $(document).mousemove(function(e){
                    var originalLeft = $this.$progressBar.offset().left;
                    var clickLeft = e.pageX;
                    var setOffsetLeft = clickLeft - originalLeft;
                    if(setOffsetLeft>=0 && setOffsetLeft<=$('.bar-container').width()){
                        $this.$progressLine.css('width',setOffsetLeft);
                        $this.$progressDot.css('left',setOffsetLeft);
                        var playPercent = setOffsetLeft / $('.bar-container').width();
                        var totalPlayTime = $('audio').get(0).duration;
                        $('audio').get(0).currentTime = parseInt(totalPlayTime * playPercent);
                        console.log(playPercent);
                    }

                })
            });
            //监听鼠标的抬起事件
            $(document).mouseup(function(){
                $(document).off('mousemove');

            });
        }
    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;

})(window);