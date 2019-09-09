
window.onload = function() {

    //環境變數
    var updateFPS = 30;
    var showMouse = true;
    var time = 0;
    var bgcolor = "black";

    //控制
    var controls = {
        draw : function() {
            cx.fillStyle = "black";
            cx.fillRect(0, 0, ww, wh);
            trees = [];
            trees.push(new Tree());
        }

    }

    var gui = new dat.GUI();
    gui.add(controls, "draw");

    //--------------vec2 向量------------------

    class Vec2 {
        constructor(x, y){
            this.x = x || 0;
            this.y = y || 0;
        }

        set(x, y) {
            this.x = x;
            this.y = y;
        }
        
        move(x, y) {
            this.x += x;
            this.y += y;
        }

        add(v) {
            return new Vec2(this.x + v.x, this.y + v.y)
        }
        sub(v) {
            return new Vec2(this.x - v.x, this.y - v.y)
        }
        mul(s) {
            return new Vec2(this.x*s, this.y*s)
        }

        //新的向量長度
        set length(nv) {
            var temp = this.unit.mul(nv); //this.unit.mul(nv) 是1
            this.set(temp.x, this.y);
        }

        get length() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }

        clone() {
            return new Vec2(this.x, this.y);
        }
        //轉成字串
        toString() {
            // return "("+this.x+","+this.y+")";
            return `(${this.x}, ${this.y})`;
        }
        //比較
        equal(){
            return this.x == v.x && this.y == v.y;
        }

        get angle() {
            return Math.atan2(this.y, this.x);
        }

        get unit() {
            return this.mul(1/this.length);
        }


    }
//------------------------------------------------------------
    var canvas = document.getElementById("canvas");
    var cx = canvas.getContext("2d");
   
    //設定畫圓
    cx.circle = function(v, r) {
        this.arc(v.x, v.y, r, 0, Math.PI*2);
    }
    //設定畫線
    cx.line = function (v1, v2) {
        this.moveTo(v1.x, v1.y);
        this.lineTo(v2.x, v2.y);

    }

    // canvas的設定
    function initCanvas() {
 
        ww = canvas.width = window.innerWidth;
        wh = canvas.height =window.innerHeight;
    }
    initCanvas();

    class Tree {
        constructor(args) {
            var def = {
                p: new Vec2 (),
                angle: -Math.PI/2,  //往上長-90度
                speed: 4,
                w: 10,
                time: 0,    //生長時間
            }
            Object.assign(def,args);
            Object.assign(this,def);
        }
        draw() {
            //自己的寬大於0，才繪製
            if(this.w>0) {
                cx.beginPath();
                cx.arc(this.p.x, this.p.y, this.w, 0, Math.PI*2);
                cx.fillStyle = "white";
                cx.fill();
            }
        }
        update() {
            this.time++;
            this.v = (new Vec2(Math.cos(this.angle), Math.sin(this.angle))).mul(this.speed);
            this.p = this.p.add(this.v);
            this.w *= Math.random()*0.02 + 0.98;  
            //分枝
            // 如果樹枝生長時間大於15 以及 每隔15 才去分枝  (+ this.w/50) 增加他粗度分支的可能性
            if(Math.random()<0.8 + this.w/50 && this.time >15 && this.time % 15==0 && this.w > 0.5) {

                this.angle += (Math.random()-0.5)/5;  // /5是偏移幅度小一點

                //判斷是分枝還是旁枝
                if (Math.random()<0.5) {
                    trees.push(new Tree({
                        p: this.p.clone(),
                        angle: this.angle + (Math.random()-0.5)/2,
                        speed: this.speed/ (1.2 + Math.random()),
                        w: this.w *(0.45 + 0.5*Math.random()),
                    }))
                } else {   // 左右分枝
                    trees.push(new Tree({
                        p: this.p.clone(),
                        angle: this.angle + (Math.random()-0.5)/3,
                        speed: this.speed/ (1.3 + Math.random()),
                        w: this.w *(0.45 + 0.5*Math.random()),
                    }))

                    trees.push(new Tree({
                        p: this.p.clone(),
                        angle: this.angle - (Math.random()-0.5)/3,  //左
                        speed: this.speed/ (1.2 + Math.random()),
                        w: this.w *(0.45 + 0.5*Math.random()),
                    }))
                    this.w = 0;  // 分裂兩個後，原本主要樹枝消失
                } 
                if (Math.random <0.3) {
                    this.w = 0;
                }
            }

            if (this.w >0.1 && this.w < 2 && Math.random() <0.1) {
                cx.beginPath();
                cx.arc(this.p.x, this.p.y, Math.random()*4, 0, Math.PI*2);
                cx.fillStyle = "hsl("+Math.random()*50+", 80%, 50%)";  //色相(彩度、明度、飽和度)
                cx.fill();
            }
        }
    }

    
    var tree = []; //第一根樹枝
    var trees = []; //所有樹枝

    //邏輯的初始化
    function init() {

        cx.fillStyle = "black";
        cx.fillRect(0, 0, ww, wh);
        tree = new Tree ({
            p: new Vec2(),
            angle: -Math.PI/2,
        })
        trees.push(tree);
        
    }


    //遊戲邏輯的更新
    function update() {

        time++;
        
    }

    //畫面更新
    function draw() {

        //清空背景
        cx.fillStyle = bgcolor;
        // cx.fillRect(0, 0, ww, wh);

        //----在這繪製--------------------------------

        cx.save();
            cx.translate(ww/2, wh);

            //更新位置後 畫出，不放在function update() 是因為前進得很慢
            trees.forEach(function(tree) {
                tree.update();
            })
            trees.forEach(function(tree) {
                tree.draw();
            })
   


        cx.restore();








        //----------------------------------------

        //滑鼠
        // cx.fillStyle = "red";
        // cx.beginPath();
        // cx.circle(mousePos,3);
        // cx.fill();

        // //滑鼠線
        // cx.save();
        //     cx.beginPath();
        //     cx.translate(mousePos.x, mousePos.y);
              
        //         cx.strokeStyle = "red";
        //         var len = 20;
        //         cx.line(new Vec2(-len, 0), new Vec2(len, 0));

        //         cx.fillText (mousePos, 10, -10);
        //         cx.rotate(Math.PI/2);
        //         cx.line(new Vec2(-len, 0), new Vec2(len, 0));
        //         cx.stroke();

        // cx.restore();




        requestAnimationFrame(draw)
    }

    //頁面載完依序呼叫
    function loaded() {

        initCanvas();
        init();
        requestAnimationFrame(draw);
        setInterval(update, 1000/updateFPS);
    }

    // window.addEventListener('load', loaded);
    //頁面縮放
    window.addEventListener('resize', initCanvas);


    //滑鼠 事件更新
    var mousePos = new Vec2(0, 0);
    var mousePosDown = new Vec2(0, 0);
    var mousePosUP = new Vec2(0, 0);

    window.addEventListener("mousemove",mousemove);
    window.addEventListener("mouseup",mouseup);
    window.addEventListener("mousedown",mousedown);

    function mousemove(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        

    }
    function mouseup(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosUP = mousePos.clone();
        
    }
    function mousedown(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosDown = mousePos.clone();
    }

    loaded();
}
