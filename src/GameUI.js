var recordbgSprite= null;


var GameUI = cc.Layer.extend({
    scoreText:null,
    gameLayer:null,
    bgSprite:null,
    YaoganBak:null,
    Yaogan:null,
    quickBak:null,
    scoreLayer:null,
    ctor: function (gameLayer) {
        this._super();
        this.gameLayer=gameLayer;
        this.init();
    },

    init: function(){
        var size = cc.winSize;
        this.scoreLayer = new scoreLayer();
        this.addChild(this.scoreLayer);
        this.scoreLayer.x=Constant.DesignResolutionSizeX-Constant.ScoreLayerWight+150;
        this.scoreLayer.y=Constant.DesignResolutionSizey-Constant.ScoreLayerHeight-15;

        var Pause_Item = new cc.MenuItemImage(res.Pause_png,res.Pause_png,res.Pause_png,this.clickPause,this);
        Pause_Item.setPosition(  1350,1350  );
        var Menu = new cc.Menu(Pause_Item);
        Menu.setPosition(cc.p(0,0));
        Menu.setRotation(90);
        this.addChild(Menu);

        this.YaoganBak = new cc.Sprite(res.Yaogan1_png);
        this.YaoganBak.x=Constant.YaoganX=200;   this.YaoganBak.y=Constant.YaoganY=200;
        this.addChild(this.YaoganBak,998);
        this.Yaogan = new cc.Sprite(res.Yaogan2_png);
        this.Yaogan.x=Constant.YaoganX; this.Yaogan.y=Constant.YaoganY;
        this.addChild(this.Yaogan,999);


        this.quickBak = new cc.Sprite(res.QuickMenuA_png);
        this.quickBak.x=Constant.QucikX=200;   this.quickBak.y=Constant.QucikY=1700;
        this.quickBak.setRotation(90);

        this.addChild(this.quickBak,998);


    },

    update:function() {
        this.scoreLayer.setScore(0,this.gameLayer.snake.score);
        var aiScore = this.gameLayer.snakeAI;
        for(var __i=1;__i<= 4;  __i++) {
            if(aiScore[__i]!=null)
                this.scoreLayer.setScore(__i,aiScore[__i].score);
            else
                this.scoreLayer.setScore(__i,0);
        }
    },

    clickPause: function () {
            var size = cc.director.getWinSize();
            var screen = new cc.RenderTexture(parseInt(size.width), parseInt(size.height));
            screen.setPosition(cc.p(size.width/2, size.height/2));
            screen.begin();
            cc.director.getRunningScene().visit();
            screen.end();
            recordbgSprite = screen.getSprite().getTexture();
            cc.director.pushScene(new gamePauseScene());
        //  cc.director.pushScene(new gameOverScene());



    },

    showGameOver: function(score,rank){
        //
        //
        //var winSize = cc.director.getWinSize();
        //var screen = new cc.RenderTexture(size.width, size.height,cc.IMAGE_FORMAT_PNG);
        //
        //screen.setPosition(cc.p(size.width/2, size.height/2));
        //screen.begin();
        //
        //cc.director.getRunningScene().visit();
        //
        ////cc.Director.visit();
        //
        //screen.end();
        //
        //
        ////    recordbgSprite = screen.getSprite().getTexture();
        //  //  cc.director.pushScene(new gameOverScene());

       // recordbgSprite = tex.getSprite().getTexture();
        cc.director.pushScene(new gameOverScene(score,rank));
    },

});

var scoreLayer   = cc.Layer.extend({
    ScoreText:null,
    sNameText:null,
    score:null,
    ctor: function () {
        this._super();

        var bakg = new cc.Sprite(res.ScoreBg);
        //var bakg = new cc.LayerColor(cc.color(44,44,44,100),Constant.ScoreLayerWight,Constant.ScoreLayerHeight);
        bakg.x=0;
        this.addChild(bakg);


        this.ScoreText = new Array();
        this.sNameText = new Array();
        this.score     = new Array();

        for(var  _i=1;_i<=5;_i++) {
            var nameText = new  cc.LabelTTF("snake"+_i,"arial",40);
            nameText.x=100-75*(_i-1);
            nameText.y=30;

            nameText.setRotation(90);
            this.sNameText.push(nameText);
            this.addChild(nameText);

            var scoreText = new cc.LabelTTF("0","arial",40);
            scoreText.x=100-75*(_i-1);
            scoreText.y=-70;
            scoreText.setRotation(90);
            this.ScoreText.push(scoreText);
            this.addChild(scoreText);
            this.score[_i]=0;
        }
        for(var _i=6;_i<=100;_i++)
            this.score[_i]=0;


    },

    setScore:function(i,_score){
       if(i<=5)
        this.ScoreText[i].setString(""+_score);
    },

});

var gameOverLayer = cc.Layer.extend({
   ctor:function(score,rank){
       this._super();
       var size = cc.director.getWinSize();

       var bg1 = new cc.Sprite(res.GameoverBG);
       bg1.setPosition(cc.p(size.width/2,size.height/2)); //放置位置,这个相对于中心位置
       bg1.setFlippedY(1);
       this.addChild(bg1);

       var Restart_Item = new cc.MenuItemImage(res.Restart_png,res.Restart_png,res.Restart_png,Restart,this);
       var Back_Item = new cc.MenuItemImage(res.Back_png,res.Back_png,res.Back_png,Back,this);
       var Continue_Item = new cc.MenuItemImage(res.Restart2_png,res.Restart2_png,res.Restart2_png,Restart,this);
       Back_Item.x=-180;
       Back_Item.y=1083;
       Restart_Item.x=310;
       Restart_Item.y=1213;
       Continue_Item.x=795;
       Continue_Item.y=1096;

       var Menu = new cc.Menu(Restart_Item,Back_Item,Continue_Item);
       Menu.setPosition(cc.p(0,0));
       this.addChild(Menu);

       Menu.setRotation(90);
       Menu.x=110;
       Menu.y=-120;


       var OverLenth =new cc.Sprite(res.OverLenth);
       var OverRank =new cc.Sprite(res.OverRank);
       OverLenth.x=600;
       OverLenth.y=1000;
       OverRank.x=400;
       OverRank.y=1000;
       this.addChild(OverLenth);
       this.addChild(OverRank);

        var score=50;




       var scoreText = new cc.LabelTTF(score+"\n\n\n"+rank, "arial", 56);
       scoreText.setColor(cc.color(0,0,0));
       scoreText.x = 500;
       scoreText.y = 800;
       scoreText.setRotation(90);
       this.addChild(scoreText);


   },
});

var gameOverScene = cc.Scene.extend({
    ctor:function (score,rank) {
        this._super();
        var taddLayer = new gameOverLayer(score,rank);
        if(taddLayer){
            this.addChild(taddLayer);
            taddLayer.setPosition(cc.p(0, 0));
        }


    },
});

var gamePauseLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        var size = cc.director.getWinSize();

        var bg = new cc.Sprite(res.PauseBG);
        bg.setPosition(cc.p(size.width/2,size.height/2));
        this.addChild(bg,0);





        var Restart_Item = new cc.MenuItemImage(res.Restart_png,res.Restart_png,res.Restart_png,Start,this);
        var Back_Item = new cc.MenuItemImage(res.Back_png,res.Back_png,res.Back_png,Back,this);
        var Continue_Item = new cc.MenuItemImage(res.Contunie_png,res.Contunie_png,res.Contunie_png,Continue,this);


        Restart_Item.x=540;
        Restart_Item.y=1213   ;

        Back_Item.x=190;
        Back_Item.y=1083;

        Continue_Item.x=925;
        Continue_Item.y=1096;
        var Menu = new cc.Menu(Restart_Item,Back_Item,Continue_Item);

        Menu.setPosition(cc.p(0,140));
        Menu.setRotation(90);
        Menu.x=130;
        Menu.y=0;


       this.addChild(Menu);






    },
});

var gamePauseScene = cc.Scene.extend({
    ctor:function () {
        this._super();
        var addLayer = new gamePauseLayer();
        this.addChild(addLayer);
        addLayer.setPosition(cc.p(0, 0));


    },
});

var gameHelloLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
        var size = cc.director.getWinSize();
        var HelloBg = new cc.Sprite(res.HelloBG_png);
        HelloBg.setPosition( size.width/2,size.height/2 );


        var Left_Item = new cc.MenuItemImage(res.Hello_Left,res.Hello_Left,res.Hello_Left,Start,this);
        Left_Item.setPosition( -200,950  );


        var Start_Item = new cc.MenuItemImage(res.Hello_START,res.Hello_START,res.Hello_START,Start,this);
        Start_Item.setPosition(  500,950  );
        Start_Item.scale=1.3;



        var Right_Item = new cc.MenuItemImage(res.Hello_Right,res.Hello_Right,res.Hello_Right,Start,this);
        Right_Item.setPosition(  1200,950  );


        var Menu = new cc.Menu(Start_Item,Left_Item,Right_Item);
        Menu.setPosition(cc.p(0,0));
        Menu.setRotation(90);


        this.addChild(HelloBg,0);
        this.addChild(Menu,1);
        //Menu.runAction(new cc.RotateTo(1,90));

        //
        //var stepText = new cc.LabelTTF("Game v0.3\n" +
        //                                "AI        v0.1", "arial", 30);
        //stepText.setColor(cc.color(0,0,0));
        //stepText.x = 300;
        //stepText.y = 500;
        //this.addChild(stepText);
        //

    },

});

var gameHelloScene = cc.Scene.extend({
    ctor : function(){
        this._super();
        this.addChild(new gameHelloLayer());
    },

});

function Restart() {
    cc.director.popScene();
    cc.director.runScene(new SnakeScene());
}

function Start() {
    cc.director.runScene(new SnakeScene());
}

function Continue() {
    cc.director.popScene();
}

function Back(){
    cc.director.runScene(new gameHelloScene());
}

function noF()
{

}

