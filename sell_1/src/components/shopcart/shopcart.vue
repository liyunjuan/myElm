<template>
  <div class="shopcart">
    <div class="content">
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
      <div class="content-right">
        <!--当有多个判断时，可以放在计算属性里面去计算-->
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
</style>
