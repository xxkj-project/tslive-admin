<!--
 * @Author: wangshengxian
 * @Date: 2020-12-14 12:40:32
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-02-01 09:58:16
 * @Desc: 2020圣诞活动设置
-->
<template>
  <div class="activities-set-components">
    <el-dialog title="活动设置" width="800px" top="0" center :visible.sync="dialogVisible">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="200px">
        <p class="itemTitle">
          活动时间
        </p>
        <el-form-item label="活动时间" prop="times">
          <el-date-picker
            v-model="formData.times"
            type="datetimerange"
            size="small"
            clearable
            :picker-options="pickerOptionsRange"
            start-placeholder="开始时间"
            range-separator="至"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <p class="itemTitle">
          奖品概率配置
        </p>

        <el-form-item :label="item.name" v-for="(item, index) in formData.list" :key="index">
          <el-input-number v-model="item.probability" :min="0" size="small" :controls="false"></el-input-number>
          %
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="large" :loading="isLoading" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import picker from '@/utils/pickerOptions'
import { setChristmasConfig } from '@/api/activity'
import jsPrecision from '@/utils/jsPrecision'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      pickerOptionsRange: picker.pickerOptionsRange,
      rules: {
        times: [{ required: true, message: '请选择时间', trigger: 'change' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSave() {
      this.validateFunc(() => {
        console.log('验证成功')
        console.log('-form-data-', this.formData)
        const { times, list } = this.formData
        const params = { startTime: times[0], endTime: times[1], list: this.setParams(list) }
        console.log('-params-', params)
        this.isLoading = true
        setChristmasConfig(params).then(res => {
          console.log('-res-', res)
          this.isLoading = false
          this.dialogVisible = false
          this.msgFunc('设置成功！', 'success')
          this.$emit('success')
        })
      })
    },
    setParams(list) {
      return list.map(val => ({ id: val.id, probability: val.probability }))
    },
    validateFunc(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const { list } = this.formData
          // console.log('-list-', list)
          if (list.some(val => val.probability === undefined)) {
            this.msgFunc('概率配置项不能为空!')
            return
          }
          let totalNum = jsPrecision.arrObjSum(list, 'probability')
          // console.log('-total-num-', totalNum)
          if (totalNum !== 100) {
            this.msgFunc('概率总和须等于100%')
            return
          }
          callback()
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm() {
      console.log('重置')
      this.$refs.formRef.resetFields()
    },
    msgFunc(message, type = 'warning', duration = 2000) {
      this.$message({
        message,
        type,
        duration
      })
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.itemTitle {
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
  margin-bottom: 24px;
}

.el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .el-dialog__body {
    padding: 30px 50px 0;
  }
}

/deep/ .el-form {
  .el-form-item__label {
    padding-right: 16px;
  }
}

/deep/ .el-input-number {
  width: 180px;
}
</style>
