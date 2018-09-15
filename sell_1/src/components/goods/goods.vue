<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <!--这里的v-el的值一定要用中划线-->
        <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex == $index}" @click="selectMenu($index,$event)">
          <span class="text border-1px">
            <!--对应的class的classMap里面对应的字段-->
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" :src="d food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.sellCount}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <!--:food 是传入的参数-->
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--传2个属性，一个是配送费，一个是起送费-->
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  //引用之后需要在export里面加一个components
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  const ERR_OK = 0;

  export default {
    props:{
      seller:{
        type:Object
      }
    },
    //默认的一些属性
    data(){
      return {
        goods:[],
        listHeight:[], //右边商品的高度
        scrollY:0 //y轴的高度
      };
    },
    //计算属性
    computed:{
      currentIndex(){
        for(let i=0;i<this.listHeight.length;i++){
          //获得当前索引值的高度
          let height1 = this.listHeight[i];
          //获得下一个高度
          let height2 = this.listHeight[i+1];
          //获得一个区间的上下范围；如果是最后一个，即没有height2，就直接返回最后一个i,或者返回这个区间
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
           if(food.count > 0){
             foods.push(food);
           }
          });
        });
        return foods;
      }
    },
    created(){
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if(response.errno === ERR_OK){
          this.goods = response.data;
          //当需要计算与dom相关的时候，需要在$nextTick()中去注册
          this.$nextTick(() => {
            //滚动
            this._initScroll();
            //计算高度
            this._calculateHeight();
          });
        }
      });
      //classMap[seller.supports[$index]]  这样就可以取到这个里面对应下标的值
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    methods:{
      selectMenu(index,event){
        //自己webpack去触发这个事件会有，原生浏览器去触发是没有这个事件的,所以在浏览器中，直接return
        if(!event._constructed){
          return;
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        //拿到对应的food区域
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el,300);
      },
      _initScroll(){
        this.menuScroll = new BScroll(this.$els.menuWrapper,{
          click:true
        });
        this.foodsScroll = new BScroll(this.$els.foodsWrapper,{
          //希望scroll在滚动的时候告诉我们滚动的位置
          probeType:3 ,
          click:true
        });
        this.foodsScroll.on('scroll',(pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight(){
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for(let i=0;i<foodList.length;i++){
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    //注册，这里是一个属性
    components: {
      shopcart,
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display :flex
    position :absolute
    top:174px
    bottom:46px
    width :100%
    overflow :hidden
    .menu-wrapper
      /*flex缩写，第一个等分，第二个空间不足的时候的缩放情况，第三个占位的空间*/
      flex:0 0 80px
      width :80px
      background :#f3f5f7
      .menu-item
        /*table不管几行都可以垂直居中*/
        display :table
        height :54px
        width :56px
        line-height :14px
        padding:0 12px
        &.current
          position :relative
          z-index: 10
          margin-top :-1px
          font-weight :700
          background :#fff
          .text
            border-none()
        .icon
          display :inline-block
          width :12px
          height 12px
          vertical-align :top
          margin-right :2px
          background-size :12px 12px
          background-repeat :no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display :table-cell
          width :56px
          vertical-align :middle
          border-1px:(rgba(7,17,27,0.1))
          font-size :12px
    .foods-wrapper
      flex :1
      .title
        padding-left :14px
        height :26px
        line-height :26px
        border-left :2px solid #d9dde1
        font-size :12px
        color :rgb(147,153,159)
        background :#f3f5f7
      .food-item
        display :flex
        margin :18px
        padding-bottom :18px
        border-1px:(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom :0
        .icon
          flex : 0 0 57px
          margin-right 10px
        .content
          flex :1
          .name
            margin :2px 0 8px
            height :14px
            line-height 14px
            font-size :14px
            color :rgb(7,17,27)
          .desc,.extra
            line-height :10px
            font-size 10px
            color :rgb(147,153,159)
          .desc
             margin-bottom :8px
             line-height :12px
          .extra
            .count
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
            right :0
            bottom :12px
</style>
