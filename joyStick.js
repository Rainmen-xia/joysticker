function joyStick(id, size, callback) {
    this.id = id || '';
    this.squareSize =  size || 100;
    this.spriteSize = this.squareSize/2;
    this.callback = callback || function() {};
    this.canvas = document.querySelector(id);
    this.canvas.width = this.squareSize * 2;
    this.canvas.height = this.squareSize * 2;
    this.context = this.canvas.getContext('2d');
    this.buttonLoaded = false;
    this.boardLoaded = false;
    this.x =  0;
    this.y =  0;
    this.lastTouch = new Date().getTime();
    this._init();
}

joyStick.prototype = {
    _init: function() {
        var self = this;
        this.button = this.load('./img/button.png', function() {
            self.buttonLoaded = true;
            self._tryLoadFinished();
        });
        this.board = this.load('./img/background.png', function() {
            self.boardLoaded = true;
            self._tryLoadFinished();
        });

    },
    bindEvent: function() {
        var slef = this;
        this.canvas.addEventListener('touchstart', function(e) {
            var e = e.targetTouches[0];
            slef.x = e.clientX;
            slef.y = e.clientY;
            slef.renderSprite();
        })

        this.canvas.addEventListener('touchmove', function(e) {
            var e = e.targetTouches[0];
            slef.x = e.clientX;
            slef.y = e.clientY;
            slef.renderSprite();
        })
        this.canvas.addEventListener('touchend', function(e) {
            slef.x = 0;
            slef.y = 0;
            slef.renderSprite();
        })
    },
    load: function(src, callback) {
        var sprite = new Image();
        sprite.onload = callback;
        sprite.src = src;
        return sprite;
    },
    _getCurrentCoords: function() {
        var x = this.x;
        var y = this.y

        var backgroundCenterPosition = this.squareSize;
        
        var radius = this.squareSize/2;
        var circle = this.squareSize-20;

        var userX = x === 0 ? backgroundCenterPosition:x;
        var userY = y === 0 ? backgroundCenterPosition:y;

        var tempX = userX - backgroundCenterPosition;
        var tempY = userY - backgroundCenterPosition;
        //用户到中心点距离
        var distance =  parseInt(Math.pow(tempX*tempX+tempY*tempY,0.5));
        //用户角度
        var angle = Math.atan2( userX- backgroundCenterPosition,userY- backgroundCenterPosition);
        //用户移动向量
        var moveX = parseInt(Math.sin(angle) * circle / 2);
        var moveY = parseInt(Math.cos(angle) * circle / 2);
        //禁止摇杆超过背景
        if(distance>radius-10){
            userX = moveX + backgroundCenterPosition;
            userY = moveY + backgroundCenterPosition;
        }

        return {
            coordsX : userX - this.spriteSize/2,
            coordsY : userY - this.spriteSize/2,
            moveX : moveX,
            moveY : moveY,
            distance : distance>radius?radius:distance
        }
    },
    renderSprite: function() {
        //计算坐标
        var obj = this._getCurrentCoords();

        if (this.context == null) {
            return;
        }
        this.context.clearRect(0, 0, this.squareSize * 2, this.squareSize * 2);
        this.context.drawImage(this.board,
            this.squareSize/2,
            this.squareSize/2,
            this.squareSize,
            this.squareSize
        )
        this.context.drawImage(this.button,
            obj.coordsX,
            obj.coordsY, 
            this.spriteSize,
            this.spriteSize
        );

        this.callback(obj);
    },
    _tryLoadFinished: function() {
        if (this.buttonLoaded && this.boardLoaded) {
            var self = this;
            this.renderSprite();
            this.bindEvent();
        }
    },
    log: function() {
        console.log();
    }
}

//module.exports = joyStick;