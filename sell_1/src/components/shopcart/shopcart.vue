<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <!-- :class="{'highlight':totalCount>0}" 这里为什么不是用的v-if。当只有一个判断的时候，可以用这种方式-->
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart"  :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price"  :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费{{deliveryPrice}}</div>
      </div>
      <!--@click.stop.prevent 这个是vue里面阻止冒泡-->
      <div class="content-right" @click.stop.prevent="pay">
        <!--当有多个判断时，可以放在计算属性里面去计算-->
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls" v-show="ball.show" transition="drop" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcart-list" v-show="listShow" transition="fold">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" v-el:list-content>
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
      <div transition="drop" v-for="ball in balls" v-show="ball.show" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
  <div class="list-mask" v-show="listShow" transition="fade" @click="hideList"></div>
</template>

<script type="text/ecmascript-6">
  //引用之后需要在export里面加一个components
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    props:{
      selectFoods:{
        type:Array,
        //如果default是一个数组，就需要是一个函数
        default(){
          return [
            {
              price:10,
              count:1
            }
          ];
        }
      },
      deliveryPrice:{
        type:Number,
        default:0
      },
      minPrice:{
        type:Number,
        default:0
      }
    },
    data() {
      return {
        balls:[
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          }
        ],
        dropBalls:[],
        //购物车性情收起还是展开
        fold:true
      };
    },
    //这个里面是计算属性，通过计算来得到的属性值
    computed:{
      totalPrice(){
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount(){
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc(){
        //一定要用全等，不用两等,两等会发生隐式转换
        if(this.totalPrice === 0){
          //这里用反引号的好处是可以在表达式里面直接用${}取数据而不用拼接
          return `￥${this.minPrice}元起送`;
        }else if(this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        }else{
          //如果没有变量的时候用反引号，eslint会报错
          return '去结算';
        }
      },
      payClass(){
        if(this.totalPrice < this.minPrice){
          return 'not-enough';
        }else{
          return 'enough';
        }
      },
      listShow(){
        if(!this.totalCount){
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if(show){
          this.$nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.$els.listContent,{
                click:true
              });
            }else{
             this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods:{
      drop(el){
        //找去当前
        //遍历这个balls，找到第一个隐藏的小球，将其置为显示，同时记录这个元素
        for(let i=0;i<this.balls.length;i++){
          let ball = this.balls[i];
          if(!ball.show){
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList(){
        if(!this.totalCount){
          return;
        }
        this.fold = !this.fold;
      },
      empty(){
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList(){
        this.fold = true;
      },
      pay(){
        if(this.totalPrice < this.minPrice){
          return;
        }
        //没有实现去结算的功能，可以弹框提示一下
        window.alert(`需要支付${this.totalPrice}元`);
      }
    },
    // transitions:{
    //   drop:{
    //     beforeEnter(el){
    //       // 找到所有show为true的小球
    //       let count = this.balls.length;
    //       while (count--){
    //         let ball = this.balls[count];
    //         if(ball.show){
    //           //获取加入购物车的标志的位置
    //           //获得这个标志相对于视口的位置
    //           let rect = ball.el.getBoundingClientRect();
    //           //获取加购物车标志和左下角购物车位置的横向和纵向的差值
    //           let x = rect.left - 32;
    //           let y = -(window.innerHeight - rect.top - 22);
    //           el.style.display = '';
    //           //这是外层原生做一个纵向的动画
    //           el.style.webkitTransform = `translate3d(0,${y}px,0)`;
    //           el.style.transform = `translate3d(0,${y}px,0)`;
    //           //内层元素做一个横向的动画
    //           // 通过className获取到里面的横向动画的元素：inner-hook,只是被js调用
    //           let inner = el.getElementsByClassName('inner-hook')[0];
    //           inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
    //           inner.style.transform = `translate3d(${x}px,0,0)`;
    //   }
    // },
    //这里是根据Vue官网写的动画
    transitions:{
      //这是一个钩子，每个动作接收一个dom元素，在当前这个例子中这个el表示transitio=drop的元素
      drop:{
        beforeEnter(el){
          //找到所有show=true的小球
          let count = this.balls.length;
          while(count--){
            let ball = this.balls[count];
            if(ball.show){
              //获取cartcontrol存的位置，是上面ball.el
              //这是浏览器的一个方法，相当于获取当前位置相对于视口的一个位置，返回left和top
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left -32;
              //y值是一个负值，是浏览器窗口减去top的值，再减去22
              let y = -(window.innerHeight - rect.top - 22);
              el.style.display = '';
              //外层元素做一个纵向的动画
              el.style.webkitTransform = `translate3d(0,${y}px,0)`;
              el.style.transform = `translate3d(0,${y}px,0)`;
              //内层元素做一个横向的动画
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.ransform = `translate3d(${x}px,0,0)`;
            }
          }
        },
        enter(el){
          //当这个小球动画完成的时候
          //触发浏览器重绘：当获取这个高度的时候，会强制浏览器刷新
          /* eslint-disable no-unused-vars */
          let ref = el.offsetHeight;
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)';
            el.style.transform = 'translate3d(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.ransform = 'translate3d(0,0,0)';
          });
        },
        afterEnter(el){
          //取出这个在执行动画的小球，dropballs放的是进行动画的小球
          let ball = this.dropBalls.shift();
          if(ball){
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
    },
    components:{
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position :fixed
    left :0
    bottom :0
    z-index :50
    width :100%
    height :48px
    .content
      display :flex
      background :#141d27
      font-size :0
      color :rgba(255,255,255,0.4)
      .content-left
        flex :1
        .logo-wrapper
          display :inline-block
          vertical-align :top
          position :relative
          top: -10px
          margin :0 12px
          padding :6px
          width :56px
          height :56px
          box-sizing :border-box
          border-radius :50%
          background :#141d27
          .logo
            width :100%
            height 100%
            border-radius :50%
            background :#2b343c
            text-align :center
            &.highlight
              background :rgb(0,160,220)
            .icon-shopping_cart
              line-height :44px
              font-size :24px
              color :#80858a
              &.highlight
                color :#fff
          .num
            position :absolute
            top:0
            right :0
            width :24px
            height :16px
            line-height :16px
            text-align :center
            border-radius :9px
            font-size :9px
            font-weight :700
            color :#fff
            background :rgb(240,20,20)
            box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display :inline-block
          vertical-align :top
          margin-top :12px
          line-height :24px
          padding-right :12px
          box-sizing :border-box
          border-right :1px solid rgba(255,255,255,0.1)
          font-size :16px
          font-weight :700
          &.highlight
            color :#fff
        .desc
          display :inline-block
          vertical-align :top
          line-height :24px
          margin :12px 0 0 12px
          font-size :10px
      .content-right
        flex :0 0 105px
        width :105px

        .pay
          height :48px
          line-height :48px
          text-align :center
          font-size :12px
          font-weight :700
          background :#2b333b
          &.not-enough
           background :#2b333b
          &.enough
            background :#00b43c
            color :#fff
    .ball-container
      .ball
        position :fixed
        left:32px
        bottom :22px
        z-index :200
        &.drop-transition
          transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
          .inner
            width :16px
            height :16px
            border-radius :50%
            background :rgb(0,160,220)
            transition :all 0.4s linear
    .shopcart-list
      position :absolute
      left :0
      top:0
      z-index :-1
      width :100%
      &.fold-transition
        transition:all 0.5s
        transform:translate3d(0,-100%,0) /*-100%是相对于当前的高度全部展示出来*/
      &.fold-enter,&.fold-leave
        transform :translate3d(0,0,0)
      .list-header
        height :40px
        line-height :40px
        padding :0 18px
        background :#f3f5f7
        border-bottom :1px solid rgba(7,17,27,0.1)
        .title
          float :left
          font-size :14px
          color :rgb(7,17,27)
        .empty
          float :right
          font-size :12px
          color :rgb(0,160,220)
      .list-content
        padding :0 18px
        max-height :217px
        overflow :hidden
        background :#fff
        .food
          position :relative
          padding :12px 0
          box-sizing :border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height :24px
            font-size :14px
            color:rgb(7,17,27)
          .price
            position :absolute
            right :90px
            bottom :12px
            line-height :24px
            font-size :14px
            font-weight :700
            color :rgb(240,20,20)
          .cartcontrol-wrapper
            right :0
            bottom :6px
            position :absolute
  .list-mask
    position :fixed
    top:0
    left:0
    width :100%
    height: 100%
    z-index :40
    -webkit-backdrop-filter :blur(10)
    &.fade-transition
      transition :all 0.5s
      opacity :1
      background :rgba(7,17,27,0.6)
    &.fade-enter,&.fade-leave
      opacity :0
      background :rgba(7,17,27,0.6)
</style>
