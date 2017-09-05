var GameLayer = cc.Layer.extend({
    mapPanel:null,
    ui:      null,
    snake:   null,
    snakeAI:  null,
    ctor:function() {
        this._super();

        this.Gameinit();
        this.scheduleUpdate();
        this.ui.update();

        if ("keyboard" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this._onKeyPressed.bind(this),
                onKeyReleased: this._onKeyReleased.bind(this)
            }, this);
        }

        if("touches" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this._onTouchBegan.bind(this),
                onTouchMoved: this._onTouchMoved.bind(this),
                onTouchEnded: this._onTouchEnded.bind(this),
            }, this);
        }

        if("mouse" in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this._onMouseBegan.bind(this),
                onMouseMove: this._onMouseMoved.bind(this),
                onMouseUp:   this._onMouseEnded.bind(this),

            }, this);
        };

    },

    Gameinit:function() {
            Constant.sizeX=5400;
            Constant.sizeY=9600;
            Constant.DesignResolutionSizeX=1080,
            Constant.DesignResolutionSizey=1920,
            Constant.scoreLabelX=300,
            Constant.ScoreLayerWight=450,
            Constant.ScoreLayerHeight=150,
            Constant.BodyLen=50,
            Constant.YaoganX=50,
            Constant.YaoganY=50,
            Constant.QucikX=50,
            Constant.QuickY=50,


        GameState.tailQueue = new Array();
        GameState.appleNums = 0;
        var beginId=randomId();

        var beginx=get_idx(beginId);
        var beginy=get_idy(beginId);

        this.mapPanel = new cc.Layer();
        this.addChild(this.mapPanel);
        this.mapPanel.x=Constant.DesignResolutionSizeX/2-beginx;
        this.mapPanel.y=Constant.DesignResolutionSizey/2-beginy;


        var backGround = new cc.LayerColor(cc.color(255,255,255,100), Constant.sizeX, Constant.sizeY);
        var backSprite = new cc.Sprite(res.BG_jpg);
        backGround.x=12.5;
        backGround.y=12.5;
        backSprite.x=Constant.sizeX/2;
        backSprite.y=Constant.sizeY/2;
        backGround.addChild(backSprite,1);
        this.mapPanel.addChild(backGround,1);

        //var backGround = new cc.Sprite(res.BG_jpg);
        //if(backGround)
        //    trace("BACKGROUND GOOD");
        //else
        //    trace("BACKGROUND FAIL");
        //backGround.x=2700+12.5;
        //backGround.y=4800+12.5;
        //this.mapPanel.addChild(backGround,1);



        this.ui = new GameUI(this);
        this.addChild(this.ui, 5);



        GameState.score = 2;
        GameState.appleRecord = new Array();


        this.snake =new Snake(this,beginx,beginy,0,0);
        this.snakeAI = new Array();


        var t=5;


        for(var i =1 ; i< t;i++ ){
            beginId=randomId();
            while(this.snake.checkState(get_idx(beginId),get_idy(beginId))!=-2)
                beginId=randomId();
            this.snakeAI[i] =new Snake(this,get_idx(beginId),get_idy(beginId),i,1);
        }

        for(var ii=0;ii<=50;ii++)
            this.get_nextApple();

    },

    drawApple: function(id,k,value){
        if(k==1) {
            var box =new  sBox(id, 5,1);
            this.mapPanel.addChild(box,1,id);
        }
        else {
            if(value==undefined)
                value=2;
            var box = new sBox(id, 2,value);
            this.mapPanel.addChild(box, 1,id);
        }
        GameState.appleRecord.push(id);
        GameState.appleNums=GameState.appleNums+1;
    },

    get_nextApple:function(){
        var t,x=2,y=2;
        while(1) {
            t = randomId();
            x = Math.floor(get_idx(t));
            y = Math.floor(get_idy(t));
            if (this.snake.checkState(x, y,1) ==-2)
                break;
        }
        this.drawApple(t,1);
        GameState.addApple=1;
    },

    update:function() {
        this.snake.update();
        for(var i=1;i<this.snakeAI.length;i++)
                if(this.snakeAI[i])
                     this.snakeAI[i].updateAI();

    },

    _onKeyPressed: function(keyCode,event){
        switch (keyCode) {
            case cc.KEY.space:
                this.snake.isQuicken=-1;
                this.ui.quickBak.scale = 1.2;
                this.snake.speed       =30;
                break;
            default:
                break;
        }
    },
    _onKeyReleased : function (keyCode, event) {

        switch (keyCode){
            case  cc.KEY.up:
            case  cc.KEY.w:
                this.snake.deltax=0;
                this.snake.deltay=1.1;
                break;
            case  cc.KEY.down:
            case  cc.KEY.s:
                this.snake.deltax=0;
                this.snake.deltay=-1.1;
                break;
            case  cc.KEY.left:
            case  cc.KEY.a:
                this.snake.deltax=-1.1;
                this.snake.deltay=0;
                break;
            case  cc.KEY.right:
            case  cc.KEY.d:
                this.snake.deltax=1.1;
                this.snake.deltay=0;
                break;
            case cc.KEY.space:
                this.snake.isQuicken=10;
                break;
            default:
                break;

        }
        return true;
    },

    _onMouseBegan: function(event) {
        var x=event.getLocationX();
        var y=event.getLocationY();
        //70 630
      //  trace("X Y "+x+ " " +y);
        if(x<=Constant.QucikX+200&& y>=Constant.QucikY-200){
            var dis = (  (x-Constant.QucikX)* (x-Constant.QucikX)+ (y-Constant.QucikY)*(y-Constant.QucikY) );
           // trace("dis"+dis);

            if(dis <= 150*150){
                if(this.snake.speed==GameState.speed0) {
                    this.ui.quickBak.scale = 1.2;
                    this.snake.speed      =30;
                }
            }
        }
        return true;
    },
    _onMouseMoved: function(event) {
        var deltx, delty;
        var x = event.getLocationX();
        var y = event.getLocationY();
        this.getNextPos(x,y);

    },
    _onMouseEnded: function(event) {
        this.snake.isQuicken=10;
    },

    _onTouchBegan:  function(touch,event) {
        var x=touch.getLocationX();
        var y=touch.getLocationY();
        if(x<=Constant.QucikX+200&& y>=Constant.QucikY-200){
            var dis = (  (x-Constant.QucikX)* (x-Constant.QucikX)+ (y-Constant.QucikY)*(y-Constant.QucikY) );
            // trace("dis"+dis);

            if(dis <= 150*150){
                if(this.snake.speed==GameState.speed0) {
                    this.ui.quickBak.scale = 1.2;
                    this.snake.speed      =30;
                }
            }
        }
        return true;
    },
    _onTouchMoved: function(touch,event) {
        var deltx,delty;
        var x=touch.getLocationX();
        var y=touch.getLocationY();
        this.getNextPos(x,y);
        return true;
    },
    _onTouchEnded: function(touch,event) {
        this.snake.isQuicken=10;

    },

    getNextPos: function (x,y) {

        var dis=Math.sqrt(   (x-Constant.YaoganX)*(x-Constant.YaoganX)+(y-Constant.YaoganY)*(y-Constant.YaoganY)   );
        if (dis<=250) {
            var fflag = 0;
            var deleta = (y - Constant.YaoganY) / (x - Constant.YaoganX);
            var theta = Math.atan(deleta);
            var deltx=Math.cos(theta);
            var delty=Math.sin(theta);
            if (x<Constant.YaoganX) {
               deltx = -deltx;
               delty = -delty;
            }
            this.snake.deltax=deltx;
            this.snake.deltay=delty;
            var dis=Math.sqrt(   (x-Constant.YaoganX)*(x-Constant.YaoganX)+(y-Constant.YaoganY)*(y-Constant.YaoganY)   );
            deltx=Math.min(dis,150)*deltx;
            delty=Math.min(dis,150)*delty;

            this.ui.Yaogan.setPosition(deltx+Constant.YaoganX,delty+Constant.YaoganY);
        }
        else{
            if(!GameState.yaoganMove&&this.ui.Yaogan.x!=Constant.YaoganX&&this.ui.Yaogan.y!=Constant.YaoganY){
                GameState.yaoganMove=1;
                var moveTo = cc.moveTo(0.4,cc.p(Constant.YaoganX, Constant.YaoganY));
                this.ui.Yaogan.runAction(moveTo);
                this.scheduleOnce( function(){GameState.yaoganMove=0;}  , 0.4+0.1);
            }
        }
    },

    snakeDied : function (id) {
        this.snakeAI[id]=null;
        this.schedule(function () {
            beginId=randomId();
            while(this.snake.checkState(get_idx(beginId),get_idy(beginId))!=-2)
                beginId=randomId();
            this.snakeAI[id] =new Snake(this,get_idx(beginId),get_idy(beginId),id,1);
        }, 10, 0, 0);
    },
});


var SnakeScene = cc.Scene.extend({

    ctor: function(){
        this._super();
        //
        var layer = new GameLayer();
        this.addChild(layer);
        layer.setPosition(cc.p(0, 0));
    }

});

function get_id(x,y) {
    return Math.floor(x+Math.floor(y)*Constant.sizeX);
}

function get_idx(headid) {
    return Math.floor(Math.floor(headid)%Constant.sizeX);
}

function get_idy(headid) {
    return Math.floor(Math.floor(headid)/Constant.sizeX);
}

function randomId(){
    return  Math.floor(Math.floor(Math.random() * (Constant.sizeX + Constant.sizeX * Constant.sizeY)) + 1);
}

