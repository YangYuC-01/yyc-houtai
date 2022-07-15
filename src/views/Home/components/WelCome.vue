<template>
<div class="welcome">
  <el-button type="primary" @click="time">欢迎登录</el-button>
    <el-calendar v-model="value"></el-calendar>
</div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'Welcome',
  created () {},
  data () {
    return {
      value: new Date()
    }
  },
  methods: {
    time () {
      const nowTime = Date.now()
      console.log(nowTime)
      const year = dayjs().get('year')
      const month = dayjs().get('month') + 1
      const date = dayjs().get('date')
      const tt = `${year}-${month}-${date} 18:00:00`
      const HaHa = new Date(tt).getTime()
      const distTime = Math.floor((HaHa - nowTime) / 1000)
      console.log(distTime)
      if (distTime >= 0) {
        const h = Math.floor((distTime / 60 / 60) % 24)
        const m = Math.floor((distTime / 60) % 60)
        const s = Math.floor(distTime % 60)
        this.$message.success(`距离下班还有${h}小时${m}分钟${s}秒( •̀ ω •́ )✧`)
      } else {
        this.$message.warning('该下班了！！！')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.welcome {
  .el-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
