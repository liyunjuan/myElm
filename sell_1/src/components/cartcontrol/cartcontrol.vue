<template>
  <div class="cartcontrol">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" transition="move">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props:{
      food:{
        type:Object
      }
    },
    created(){
    },
    methods:{
      addCart(event){
        //addCart不生效的原因：better的原因，需要将click置为true
        if(!event._constructed){
          return;
        }
        //当我们去给一个观测对象添加一个不存在的字段的时候，直接像下面这样去赋值是不可以的。如果想要下面生效，要用vue的一个接口,Vue.set()，这个接受3个参数，一个是对象，二个是赋值的属性，三个是值
        if(!this.food.count){
          Vue.set(this.food,'count',1);
        }else{
          this.food.count ++;
        }
        this.$dispatch('cart.add',event.target);
      },
      decreaseCart(event){
        if(!event._constructed){
          return;
        }
        if(this.food.count){
          this.food.count -- ;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size :0
    .cart-decrease
      display :inline-block
      padding :6px
      transition:all 0.4s linear
      &.move-transition
        opacity :1
        transform:translate3d(0,0,0)  /*ranslate3d能让动画更流畅一些*/
        .inner
          display :inline-block  /*因为是span标签，所以一定要设置inline-block*/
          line-height :24px
          font-size :24px
          color :rgb(0,160,220)
          transition :all 0.4s linear
          transform :rotate(0)
      &.move-enter,&.move-leave
        opacity :0
        transform :translate3d(24px,0,0)
        .inner
          transform :rotate(180deg)
    .cart-count
      display :inline-block
      vertical-align :top
      width :12px
      padding-top :6px
      line-height :24px
      text-align center
      font-size :10px
      color :rgb(147,153,159)
    .cart-add
      display :inline-block
      padding :6px
      font-size :24px
      color :rgb(0,160,220)
</style>
