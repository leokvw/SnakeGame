/**
 * Created by admin on 2016/12/11.
 */

var sBox = cc.Sprite.extend({
    isApple:0,
    value:1,
    ctor:function(id,k,value){
        var x=get_idx(id);
        var y=get_idy(id);

        if(k==1)
            this._super(res.Head_png);
        else if(k==2)
            this._super(res.Body_png);
        else if(k==5) {
            this.isApple = 1;

            var app = Math.ceil(Math.random()*3+1);

            app="res/Apple"+app+".png"

            this._super(app);

        }
        if(value!=undefined)
            this.value=value;
        this.setPosition(cc.p(x+25,y+25));
        return true;
    },
});



