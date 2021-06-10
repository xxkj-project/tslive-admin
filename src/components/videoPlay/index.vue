<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 11:35:41
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-09 17:05:16
 * @Desc: 全局视频播放dialog -- TODO 需要自测目前不可用
-->
<template>
  <div class="dialogWrap">
    <el-dialog :center="true" :title="title" :visible.sync="dialogVis" :width="width" @closed="onCloseEvent">
      <div class="videoWrap">
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
          @ended="onPlayerEnded($event)"
        ></video-player>
        <videoItem
          v-bind="$attrs"
          v-on="$listeners"
          :autoPlay="isAutoPlay"
          :playStatus="dialogVis"
          :onPlay="handlePlay"
          :onPause="handlePause"
          :onEnd="handleEnd"
        ></videoItem>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      playerOptions: {
        autoplay: '', // 如果为true,浏览器准备好时开始回放。
        // aspectRatio: '9:16', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        sources: [
          {
            type: 'video/mp4', // 类型
            src: '' // url地址
          }
        ],
        poster: '', // 封面地址
        // width: document.documentElement.clientHeight,
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    }
  },
  props: {
    // dialog的显示/隐藏
    dialogVisible: {
      type: Boolean,
      default: false
    },

    videoUrl: {
      type: String,
      default: ''
    },
    // dialog宽度
    width: {
      type: String,
      default: '50%'
    },
    // dialog标题
    title: {
      type: String,
      default: ''
    },
    // 是否自动播放
    isAutoPlay: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVis: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', false)
      }
    },
    // 播放实例
    playerObj() {
      return this.$refs.videoPlayer.player
    }
  },
  created() {},
  mounted() {
    // 视频格式
    // type："video/webm"   // 可以播放，用ogg也可打开
    // type："video/ogg"    // 可以播放，用webm也可打开
    // type："video/3gp"    // 可以播放
    // type："video/mp4"    // 可以播放
    // type："video/avi"    // 打不开
    // type："video/flv"    // 打不开
    // type："video/mkv"    // 打不开
    // type："video/mov"    // 打不开
    // type："video/mpg"    // 打不开
    // type："video/swf"    // 打不开
    // type："video/ts"     // 打不开
    // type："video/wmv"    // 打不开
    // type："video/vob"    // 没转化
    // type："video/mxf"    // 转化出错
    // type: "video/rm"     // 转化出错
    this.$nextTick(() => {
      console.log('播放组件加载完成')
      this.videoUrl && (this.playerOptions.sources[0].src = this.videoUrl)
      this.playerOptions.autoplay = this.isAutoPlay
      console.log(this.playerOptions, this.isAutoPlay)
    })
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      console.log('-watch-video-dialog-', newVal)
      if (newVal) {
        console.log('播放实例', this.playerObj)
        this.playerObj.play()
        this.playerOptions.sources[0].src = this.videoUrl
        return
      }
      // 暂停播放
      this.playerObj.pause()
    }
  },
  methods: {
    // 暂停回调
    onPlayerPause(e) {
      this.propsEvent('onPause', this.onPause, e)
    },
    // 播放完毕回调
    onPlayerEnded(e) {
      this.propsEvent('onEnd', this.onEnd, e)
    },
    propsEvent(eventName, propsEventName, e) {
      // console.log(eventName, propsEventName, e)
      if (propsEventName) {
        propsEventName(e)
        return
      }
      switch (eventName) {
        case 'onPlay':
          console.log('-play-', e)
          break
        case 'onPause':
          console.log('-pause-', e)
          break
        case 'onEnd':
          console.log('-ended-', e)
          break
        default:
          console.log('-other-')
          break
      }
    },
    onCloseEvent() {
      console.log('-close-dialog-')
    },
    handlePlay(e) {
      console.log('自定义播放回调事件', e)
    },
    handlePause(e) {
      console.log('自定义暂停回调事件', e)
    },
    handleEnd(e) {
      console.log('自定义播放结束回调事件')
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
