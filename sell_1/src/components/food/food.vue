<template>
  <div v-show="showFlag" class="food" transition="move" v-el:food>
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image" alt=""/>
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="sell-rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <!--:food 这样用是将food传入到cartcontrol组件里面，供cartcontrol使用，这个是参数名，等号后面的是参数值-->
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0" transition="fade">加入购物车</div>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <!-- : 这里的冒号后面的也是传入到子组件里面去用的-->
        <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <!-- v-show="needShow(rating.type,rating.text)" v-show也可以绑定一个函数，这个函数返回true，或false ，可以绑定一个表达式-->
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
              </div>
              <!-- 对rating.rateTime做一个filter，用于将时间戳转化为想要的时间格式-->
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import Vue from 'vue';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  //这里用的是花括号，而不是直接一个变量；区别是，不带花括号的，引用的是export default的方式export出来的，带花括号的表示export的是function，可以export多个function，直接在花括号里面逗号分隔
  import {formatDate} from 'common/js/date';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props:{
      food:{
        type:Object
      }
    },
    data(){
      return {
        showFlag:false,
        selectType:ALL,
        onlyContent:true,  //
        desc:{
          all:'全部',
          positive:'推荐',
          negative:'吐槽'
        }
      };
    },
    methods:{
      //父组件可以调用子组件的方法，子组件不能调用父组件的方法
      show(){
        this.showFlag = true;
        this.selectType = ALL;  //每次初始化
        this.onlyContent = true;  //每次初始化
        //当这个页面被展示出来之后，就可以加载滚动的插件了
        //因为这个是异步的，所以一定要用$nextTick()
        //因为只有用$nextTick()才能保证这个DOM是已经渲染出来了的
        this.$nextTick(() => {
          if(!this.scroll){
            this.scroll = new BScroll(this.$els.food,{
              click:true
            });
          }else{
            this.scroll.refresh();
          }
        });
      },
      hide(){
        this.showFlag = false;
      },
      addFirst(event){
        if(!event._constructed){
          return;
        }
        //如果是display：none的时候，在做动画的时候浏览器就找不到这个位置，就会出问题，获取位置也有问题
        //为了解决这个，有一个巧妙的方法，可以让这个在消失的时候也有一个动画，就不会立马消失，就能获取到位置了
        this.$dispatch('cart.add',event.target);
        //因为第一次可能是没有这个food的，所以要用set方法
        Vue.set(this.food,'count',1);
      },
      needShow(type,text){
        //只看有内容的，并且没有文本
        if(this.onlyContent && !text){
          return false;
        }
        if(this.selectType === ALL){
          return true;
        }else{
          return type === this.selectType;
        }
      }
    },
    //监听两个组件，监听子组件里面的dispatch
    events:{
      //
      'ratingtype.select'(type){
        //监听子组件，将type传给父组件的selectType
        this.selectType = type;
        //这里要刷新滚动条，不过是需要异步更新，不能直接立马操作
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      'content.toggle'(onlyContent){
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    //在上面引用的filter，在这里可以统一定义filters，然后取名上面的对应的filter
    filters:{
      //这个filter的参数就可以取到在上面的要处理的数据
      formatDate(time){
        console.log(time);
        //用一个js模块来实现，在js里面去创建
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
      }
    },
    components:{
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .food
    position :fixed
    left :0
    top:0
    bottom :48px
    z-index :30
    width :100%
    background :#fff
    .food-content
      &.move-transition
        transform :translate3d(0,0,0)
        transition :all 0.4s linear
      &.move-enter,&.move-leave
        transform:translate3d(100%,0,0)
      .image-header
        position :relative
        width :100%
        height :0
        padding-top:100%  /*当我们给padding某一边值设置100%的时候，根据这个盒子的宽度来计算的，即这个盒子宽高一致*/
        img
          position :absolute
          top:0
          left: 0
          width :100%
          height :100%
        .back
          position :absolute
          top :10px
          left :0
          .icon-arrow_lift
            display :block
            padding :10px
            font-size :20px
            color :#fff
      .content
        position :relative
        padding :18px
        .title
          line-height :14px
          margin-bottom :8px
          font-size :14px
          font-weight :700
          color:rgb(7,17,27)
        .detail
          margin-bottom :18px
          line-height :10px
          height :10px
          font-size :0
          .sell-count,.sell-rating
            font-size :10px
            color :rgb(147,153,159)
          .sell-count
            margin-right :12px
        .price
          font-weight :700
          line-height :24px
          .now
            margin-right :8px
            font-size :14px
            color :rgb(240,20,20)
          .old
            text-decoration :line-through
            color :rgb(147,153,159)
        .cartcontrol-wrapper
          position :absolute
          right :12px
          bottom :12px
        .buy
          position :absolute
          right :18px
          bottom :18px
          z-index: 10
          height: 24px
          line-height :24px
          padding :0 12px
          box-sizing :border-box
          border-radius :12px
          font-size :10px
          color :#fff
          background :rgb(0,160,220)
          &.fade-transition
            transform :all 0.2s
            opacity :1
          &.fade-enter,&.fade-leave
            opacity :0
      .info
        padding :18px
        .title
          line-height :14px
          margin-bottom: 6px
          font-size :14px
          color :rgb(7,17,27)
        .text
          line-height :24px
          padding :0 8px
          font-size :12px
          color :rgb(77,85,93)
      .rating
        padding-top:18px
        .title
          line-height :14px
          margin-left :18px
          margin-bottom :6px
          font-size :14px
          color:rgb(7,17,27)
        .rating-wrapper
          padding: 0 18px
          .rating-item
            position :relative
            padding :16px 0
            border-1px(rgba(7,17,27,0.1))
            .user
              position :absolute
              right :0
              top :16px
              font-size :0
              line-height :12px
              .name
                display :inline-block
                margin-right :6px
                vertical-align :top
                color :rgb(147,153,159)
                font-size :10px
              .avatar
                border-radius :50%
            .time
              /*先写布局，再写*/
              margin-bottom :6px
              line-height :12px
              color :rgb(147,153,159)
              font-size :10px
            .text
              line-height :16px
              font-size :12px
              color :rgb(7,17,27)
              .icon-thumb_down,.icon-thumb_up
                margin-right :4px
                font-size :12px
              .icon-thumb_up
                color :rgb(0,160,220)
              .icon-thumb_down
                color :rgb(147,153,159)
          .no-rating
            padding :16px 0
            font-size :12px
            color: rgb(147,153,159)
</style>
