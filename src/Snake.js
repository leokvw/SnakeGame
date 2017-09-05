var Snake =  cc.Node.extend({
    GameScene:   null,
    mapPanel:    null,
    tailQueue  : null,
    headId:-1,
    lastHeadId:-1,
    tailId:-1,
    speed:  11,
    refurbish:0,
    isQuicken:0,
    deltax:1, deltay:0,
    lastDeltax:0, lastDeltay:0,
    isAI:0,
    snakeId:0,
    changedir:8,
    score:0,

    //    墙 -1
    //    空 -2
    //    Apple x
    //    身体 -3
    ctor:function(gameScene,beginx,beginy,id,isAI){
        this._super();
        this.GameScene=gameScene;
        this.mapPanel = this.GameScene.mapPanel;
        this.isAI=isAI;
        this.snakeId=id;


        this.init(beginx,beginy);

        this.deltax = Math.random()*1.11;
        this.deltay = Math.sqrt(1.4-this.deltax*this.deltax)*( ((Math.random()*2-1>0)*2-1) );
        this.deltax = ((Math.random()>0.5)*2-1)*this.deltax;



    },

    init: function (beginx,beginy) {

        this.tailQueue = new Array();
        this.headId=-1;
        this.lastHeadId=-1;
        this.tailId=-1;
        this.score=2;
        this.speed=GameState.speed0;
        this.refurbish=GameState.refurbish0;

        this.headId=get_id(beginx,beginy);
        this.lastHeadId=0;
        this.drawHead(  this.headId);

        var body1= get_id(beginx+Constant.BodyLen/2.1,beginy);
        var body2= get_id(beginx+Constant.BodyLen/2.1+Constant.BodyLen,beginy);

        //var body1= get_id(beginx,beginy);
        //var body2= get_id(beginx+125,beginy);
        //trace("body 1 "+get_idx(body1)+"   "+get_idy(body1));
        //trace("body 2 "+get_idx(body2)+"   "+get_idy(body2));

        this.drawBody( body1);
        this.drawBody( body2);
        this.tailQueue.push(body2);
        this.tailQueue.push(body1);


    },

    doMove:function(){
        if(this.lastDeltax==this.deltax&&(this.lastDeltay==-this.deltay&&this.deltay!=0)){
            this.deltax=this.deltax+ (Math.random()>0?1:-1)* 0.4;
        }
        if((this.deltax!=0&&this.lastDeltax==-this.deltax)&& this.lastDeltay==this.deltay){
            this.deltay=this.deltay+ (Math.random()>0?1:-1)*0.4;
        }

        if(this.deltax==0&&this.deltay==0) {
            this.deltax=this.lastDeltax;
            this.deltay=this.lastDeltay;
        }

        this.lastDeltax=this.deltax;
        this.lastDeltay=this.deltay;


        var deltax=Math.ceil( this.deltax*this.speed);
        var deltay=Math.ceil( this.deltay*this.speed);


        var x= get_idx(this.headId);
        var y= get_idy(this.headId);
        var flag=this.checkState(x+deltax,y+deltay);

        if(flag == -1||flag==-3) {
            this.overGame();
        }
        if(flag !=-2&&flag!=-3&&flag!=-1)  {
            var value=this.mapPanel.getChildByTag(flag).value;
            this.score=this.score+value;
            this.GameScene.ui.update();
            GameState.appleNums=GameState.appleNums-1;
            this.mapPanel.removeChildByTag(flag);
            this.mapPanel.removeChildByTag(this.headId);
            GameState.appleRecord.splice(GameState.appleRecord.indexOf(flag), 1);

            this.drawHead(x + deltax, y+deltay);
            this.drawBody(this.headId);
            this.tailQueue.push(this.lastHeadId = this.headId);
            this.headId = get_id(x + deltax, y+deltay);

            for(var ii=1;ii<value;ii++) {
                x=get_idx(this.tailQueue[this.tailQueue.length-1])-deltax;
                y=get_idy(this.tailQueue[this.tailQueue.length-1])-deltay;
                this.tailQueue.splice(0, 0,get_id(x,y));
                this.drawBody(x,y);
            }
            if(GameState.appleNums<=30)
                this.GameScene.get_nextApple();
        }
        else if(flag ==-2){
                this.drawHead(x + deltax, y+deltay);
                this.mapPanel.removeChildByTag(this.headId);
                var hId=this.headId;
                this.headId = get_id(x + deltax, y + deltay);

                this.drawBody(hId);
                this.tailQueue.push(this.lastHeadId = hId);
                this.mapPanel.removeChildByTag(this.tailQueue[0]);
                this.tailQueue.splice(0, 1);


        }

        if(this.isAI!=1){
            if ( (deltay>0)){
                this.mapPanel.y -=  deltay;
            }
            if ((deltay<0)){
                this.mapPanel.y -=  deltay;
            }
            if ((deltax<0)) {
                this.mapPanel.x -= deltax;
            }
            if((deltax>0)) {
                this.mapPanel.x -= deltax;
            }
        }
    },

    drawHead: function(id,y){
        if(y==undefined) {
            var box = new sBox(id, 1);
            this.mapPanel.addChild(box, 1, id);
        }
        else{
            var box = new sBox(get_id(id,y), 1);
           // box.runAction(new cc.RotateTo(1,Math.atan(dy/dx)/Math.PI*180+(dy<0?180:0)));

           // trace("   " +this.deltay+"  "+this.deltax  );

            box.setRotation( -Math.atan(this.deltay/this.deltax)/Math.PI*180+(this.deltax<0?180:0)  )
            this.mapPanel.addChild(box, 1,get_id(id,y) );


        }
    },
    drawBody: function(id,y){
        if(y==undefined) {
            var box = new sBox(id, 2);
            this.mapPanel.addChild(box, 1, id);
        }
        else{
            var box = new sBox(get_id(id,y), 2);
            this.mapPanel.addChild(box, 1,get_id(id,y) );
        }
    },
    drawTail: function(id,y){
        if(y==undefined) {
            var box = new sBox(id, 3);
            this.mapPanel.addChild(box, 1, id);
        }
        else{
            var box = new sBox(get_id(id,y), 3);
            this.mapPanel.addChild(box, 1,get_id(id,y) );
        }
    },
    drawBak: function(id,y){
        if(y==undefined) {
            var box = new sBox(id, 4);
            this.mapPanel.addChild(box, 1, id);
        }
        else{
            var box = new sBox(get_id(id,y), 4);
            this.mapPanel.addChild(box, 1,get_id(id,y) );
        }
    },

    updateAI: function () {

        this.refurbish = this.refurbish - 1;
        this.isQuicken=this.isQuicken-1;
        this.changedir=this.changedir-1;


        if (this.refurbish == 0) {
            this.refurbish = GameState.refurbish0;

            if(this.changedir>0){      //判断是否改变方向
                this.doMove();
                return;
            }
            else
                this.changedir=7;
            //fflag  3       EatApple
            //fflag  1 2    WALL or Body



            var x= get_idx(this.headId);
            var y= get_idy(this.headId);

            var xx=x+Math.ceil(this.deltax*this.speed);
            var yy=y+Math.ceil(this.deltay*this.speed);

            var id=get_id(xx,yy);
            var fflag=0;

            if(xx>Constant.sizeX-Constant.BodyLen||xx<Constant.BodyLen||yy>Constant.sizeY-Constant.BodyLen||yy<Constant.BodyLen)
                fflag=1;

            var di=this.deltax>0?1:-1;
            var dj=this.deltay>0?1:-1;
            for(var i=1;i<=15&&!fflag;i++) {
                for(var j=1;j<=15;j++){
                    var xxx= xx+i* di;
                    var yyy= yy+j* dj;
                    var xyid=get_id(xxx,yyy);
                    if(this.tailQueue.indexOf(xyid)!=-1||this.headId==xyid)
                        continue;
                    if( this.mapPanel.getChildByTag(get_id(xxx,yyy))!=null){
                        fflag=2;
                        break;
                    }
                }
            }

            if(this.tailQueue.length>25)
                fflag=4;
            var minApplex,minAppleY;
            var disApple=999999999;

            for(var i=0; i<GameState.appleRecord.length&&!fflag;i++){
                var t = this.mapPanel.getChildByTag(GameState.appleRecord[i]);
                var xxx=get_idx(GameState.appleRecord[i]);
                var yyy=get_idy(GameState.appleRecord[i]);
                var dis=(  (xxx-x)*(xxx-x)+(yyy-y)*(yyy-y) );
                if(dis<disApple){
                    disApple=dis;
                    minApplex=xxx;
                    minAppleY=yyy;
                }
                fflag==3;
            }

            if(fflag==1||fflag==2){
                    if(xx>Constant.sizeX-Constant.BodyLen||xx<Constant.BodyLen)
                        this.deltax=-this.deltax;
                    if(yy>Constant.sizeY -Constant.BodyLen||yy<Constant.BodyLen)
                        this.deltay=-this.deltay;

                if(fflag==2) {
                    this.deltax = -this.deltax;
                    this.deltay = -this.deltay;
                }
                this.changedir=12;
            }
            else
                if (disApple < Constant.BodyLen*9 * Constant.BodyLen) {

                    var deleta = (minAppleY - y) / (minApplex - x);
                    var theta = Math.atan(deleta);
                    var deltx = Math.cos(theta);
                    var delty = Math.sin(theta);
                    if (minApplex < x) {
                        deltx = -deltx;
                        delty = -delty;
                    }
                    this.deltax = deltx;
                    this.deltay = delty;
                    if (disApple <= Constant.BodyLen*1.2*Constant.BodyLen*1.2) {
                        this.isQuicken = 5;
                        this.speed =29;
                        this.changedir = 15+this.score/3;
                    }
                    else
                        this.changedir = 12+this.score/3;
                }
                else{
                    if (Math.random() < 0.05) {
                        var deleta =Math.random();
                            deleta=Math.asin(deleta);
                            var deltx =   Math.cos(deleta);
                            var delty =   Math.sin(deleta);
                        this.changedir=7;
                        }
                }
            this.doMove();
        }

        if (this.isQuicken == 0) {
            this.speed = GameState.speed0;
        }

    },

    update: function () {
        this.refurbish = this.refurbish - 1;
        this.isQuicken=this.isQuicken-1;

        if (this.refurbish == 0) {
            this.doMove();
            this.refurbish = GameState.refurbish0;
        }


        if (this.isQuicken == 0) {
            this.speed = GameState.speed0;
            this.GameScene.ui.quickBak.scale = 1.0;
        }

    },

    overGame:function(){
        this.mapPanel.removeChildByTag(this.headId);
        trace("Snake "+(this.snakeId+1)+"  Died");
        for(var ii =0 ;ii<this.tailQueue.length;ii++){
            var tmpnode=this.mapPanel.getChildByTag(this.tailQueue[ii]);
            if((ii+1)%2==0){
                this.GameScene.drawApple(this.tailQueue[ii],2,tmpnode.value);
            }
            this.mapPanel.removeChild(tmpnode);
        }
        var rank=1;
        var score=this.score;
        if(this.isAI==0) {
            for(var __i=1;__i<= this.GameScene.snakeAI.length;__i++) {
                if(this.GameScene.snakeAI[__i]!=null)
                    if(this.GameScene.snakeAI[__i]>score)
                        rank=rank+1;
            }
            this.GameScene.ui.showGameOver(score,rank);
        }
        else
            this.GameScene.snakeDied(this.snakeId);
    },

    checkState: function(x,y,nank){

        //trace("From x "+x+"  y"+y+"  id  "+ get_id(x,y));

        //    墙 -1
        //    空 -2
        //    Apple x
        //    身体 -3
        if(x>Constant.sizeX -Constant.BodyLen*0.6||x<0||y>Constant.sizeY-Constant.BodyLen*0.6||y<0)
            return -1;
        for(var i=0; i<GameState.appleRecord.length;i++){
            var t = this.mapPanel.getChildByTag(GameState.appleRecord[i]);
            var xx=get_idx(GameState.appleRecord[i]);
            var yy=get_idy(GameState.appleRecord[i]);
            if(   (x-xx)*(x-xx)+(y-yy)*(y-yy)<= Constant.BodyLen*Constant.BodyLen)
                return GameState.appleRecord[i];
        }
        if(nank!=undefined)
            return -2;


        x=x-this.deltax;
        y=y-this.deltay;

        for(var i=1;i<=40;i++) {
            for(var j=1;j<=40;j++){
                var xx= x+(i-20)* ( (this.deltax>0)*2-1);
                var yy= y+(j-20)* ( (this.deltay>0)*2-1);
                var xyid=get_id(xx,yy);
                if(this.tailQueue.indexOf(xyid)!=-1||this.headId==xyid)
                    continue;
                if( this.mapPanel.getChildByTag(get_id(xx,yy))!=null){
                    return -3;
                }
            }
        }

        for(var i=1;i<=20;i++) {
            for(var j=1;j<=20;j++){
                var xx= x-i* ( (this.deltax>0)*2-1);
                var yy= y-j* ( (this.deltay>0)*2-1);
                var xyid=get_id(xx,yy);
                if(this.tailQueue.indexOf(xyid)!=-1||this.headId==xyid)
                    continue;
                if( this.mapPanel.getChildByTag(get_id(xx,yy))!=null){
                    return -3;
                }
            }
        }
        return -2;

    },

});


