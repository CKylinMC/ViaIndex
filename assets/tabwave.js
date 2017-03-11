/**
 * TabWave
 * @author 徐文
 * @website www.sasukei.com
 */

/**
* 点击实现波浪效果组件
* @param [object] options 组件的基础设置
* @param [string] options.selector 应用于按钮的选择器
* @param [number] options.time 完成一次效果所需要的时间
* @param [string] options.background 波浪底色
*/
function TabWave(options) {
    var that = this;
    that.time = options.time;
    that.selector = options.selector;
    that.targets = document.querySelectorAll(that.selector);
    that.background = options.background;
    that.tab = "ontouchend" in document ? 'touchstart' : 'click';
    that.bindEvent();
}
TabWave.prototype = {
    /**
     * 设置波浪元素的位置
     * @param [object] selector 波浪元素
     * @param [string] width 宽度
     * @param [number] top值
     * @param [number] left值
     */
    setStyle : function (wave,width,top,left) {
        var that = this;
        var startStyle = {
            opacity : 1,
            transform : 'scale(0)',
            top : top,
            left : left,
            width : width ,
            height : width ,
            position : 'absolute' ,
            borderRadius : '50%',
            background : that.background,
            pointerEvents:'none'
        }
        var endStyle = {
            transition : 'opacity '+ (that.time/1000) +'s linear, transform 1s linear',
            opacity : 0,
            transform : 'scale(1)'
        }
        for(var i in startStyle) {
            wave.style[i] = startStyle[i];
        }
        setTimeout(function() {
            for(var i in endStyle) {
                wave.style[i] = endStyle[i];
            }
        },0);
    },
    /**
     * 绑定事件
     */
    bindEvent : function() {
        var that = this;
        var target = that.targets;
        var width = 0,_width,_height,top,left,_this,x,y;
        for(var i = 0;i < target.length;i ++) {
            target[i].addEventListener(that.tab,function(event){
                _this = this;
                var wave = document.createElement('span');
                _this.appendChild(wave);
                _width = parseInt(_this.style.width);
                _height = parseInt(_this.style.height);
                width = Math.sqrt((_width * _width) + (_height * _height));//设置圆盘的最大宽度
                if(event.offsetX) {
                    x = event.offsetX;
                    y = event.offsetY;
                } else {
                    y = event.changedTouches[0].pageY - _this.offsetTop;
                    x = event.changedTouches[0].pageX - _this.offsetLeft;
                }
                left = x - width + 'px';
                top = y - width + 'px';
                width = width*2 + 'px';
                that.setStyle(wave,width,top,left);
                setTimeout(function() {
                    _this.removeChild(wave);
                },that.time + 10);
            },false);
        }
    },
    /**
     * 取消事件绑定
     */
    removeEvent : function() {
        var targets = that.targets;
        for(var i = 0;i < targets.length;i ++) {
           targets[i].removeEventListener(that.tab,function(event){},false);
        }               
    }
}
new TabWave({
    selector : 'div' ,
    time : 1000,
    background : '#333'
});