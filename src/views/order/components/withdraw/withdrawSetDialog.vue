<!--
   提现设置
-->
<template>
  <div class="withdrawSet">
    <el-dialog
      title="提现设置"
      :visible.sync="dialogVisible"
      center
      top="30vh"
      :close-on-press-escape="false"
      :before-close="handleBeforeClose"
    >
      <el-form :model="formData">
        <!-- <el-form-item label="TST最小提现数量:" :label-width="labelWidth">
          <el-input-number
            v-model="initFormData.tstMinNumDate"
            controls-position="right"
            :min="0"
            :max="999999999"
            :precision="2"
            @change="handleChange('tstMin')"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="TST手续费比例:" :label-width="labelWidth">
          <el-input-number
            v-model="initFormData.tstMinRateDate"
            controls-position="right"
            :min="0"
            :max="100"
            :precision="2"
            @change="handleChange('tstRate')"
            :controls="false"
          ></el-input-number
          >%
        </el-form-item>
        <el-form-item label="TF最小提现数量:" :label-width="labelWidth">
          <el-input-number
            v-model="initFormData.tfMinNumDate"
            controls-position="right"
            :min="0"
            :max="999999999"
            :precision="2"
            @change="handleChange('tfMin')"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="TF手续费比例:" :label-width="labelWidth">
          <el-input-number
            v-model="initFormData.tfMinRateDate"
            controls-position="right"
            :min="0"
            :max="100"
            :precision="2"
            @change="handleChange('tfRate')"
            :controls="false"
          ></el-input-number
          >%
        </el-form-item> -->
        <el-form-item label="TST手续费:" :label-width="labelWidth">
          <el-input-number
            v-model="initFormData.tstMinFeeDate"
            controls-position="right"
            :min="0.5833"
            :max="999999999"
            @change="handleChange('tstMin')"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="TF手续费:" :label-width="labelWidth">
          <el-input-number
            v-model="initFormData.tfMinFeeDate"
            controls-position="right"
            :min="4.1176"
            :max="999999999"
            @change="handleChange('tfMin')"
            :controls="false"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { editWithdrawCost } from '@/api/order'
export default {
  name: '',
  data() {
    return {
      count: 0,
      labelWidth: '260px',
      editWithdrawParams: {},
      initFormData: {
        tstMinFeeDate: '0.5833',
        tfMinFeeDate: '4.1176'
      }
      // initFormData: {
      //   tstMinNumDate: '',
      //   tstMinRateDate: '',
      //   tfMinNumDate: '',
      //   tfMinRateDate: ''
      // }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '1'
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
  watch: {
    formData: {
      handler(newVal, oldVal) {
        // console.log('-newVal-', newVal, '-oldVal-', oldVal)
        this.initFormData = { ...newVal }
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      this.initFormData = { ...this.formData }
      this.editWithdrawParams = {}
    },
    handleChange(type) {
      console.log(type, this.initFormData, this.formData)
      this.editWithdrawParams[type] = this.setEditParamsData(type)
    },
    setEditParamsData(type) {
      let result = {
        date: '',
        id: ''
      }
      // if (type === 'tstMin' && this.initFormData.tstMinNumDate + '' !== this.formData.tstMinNumDate) {
      //   result.date = this.initFormData.tstMinNumDate
      //   result.id = this.initFormData.tstMinNumId
      // }
      // if (type === 'tstRate' && this.initFormData.tstMinRateDate + '' !== this.formData.tstMinRateDate) {
      //   result.date = this.initFormData.tstMinRateDate
      //   result.id = this.initFormData.tstMinRateId
      // }
      // if (type === 'tfMin' && this.initFormData.tfMinNumDate + '' !== this.formData.tfMinNumDate) {
      //   result.date = this.initFormData.tfMinNumDate
      //   result.id = this.initFormData.tfMinNumId
      // }
      // if (type === 'tfRate' && this.initFormData.tfMinRateDate + '' !== this.formData.tfMinRateDate) {
      //   result.date = this.initFormData.tfMinRateDate
      //   result.id = this.initFormData.tfMinRateId
      // }

      if (type === 'tstMin' && this.initFormData.tstMinFeeDate + '' !== this.formData.tstMinFeeDate) {
        result.date = this.initFormData.tstMinFeeDate
        result.id = this.initFormData.tstMinFeeId
      }
      if (type === 'tfMin' && this.initFormData.tfMinFeeDate + '' !== this.formData.tfMinFeeDate) {
        result.date = this.initFormData.tfMinFeeDate
        result.id = this.initFormData.tfMinFeeId
      }

      return result
    },
    // dialog关闭前
    handleBeforeClose(done) {
      this.initData()
      done()
    },
    onCancel() {
      this.dialogVisible = false
      this.initData()
    },
    onConfirm() {
      let params = Object.values(this.editWithdrawParams)
      // console.log('-params-', params, this.editWithdrawParams)

      editWithdrawCost(params).then(res => {
        // console.log('-edit-res-', res)
        this.$message({
          message: '恭喜你，设置成功！',
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.dialogVisible = false
            this.editWithdrawParams = {}
            this.$emit('uploadData', this.initFormData)
          }
        })
      })

      // try {
      //   let error = new Error()
      //   error()
      //   this.dialogVisible = false
      // } catch (err) {
      //   console.log('_ERR_', err)
      //   // this.initData()
      //   this.$message({
      //     message: '出错了,！',
      //     type: 'error'
      //   })
      // }

      // this.count++
      // if (this.count > 1) {
      //   let info = { ...this.formData }
      //   this.$emit('uploadData', info)
      // } else {
      //   try {
      //     let error = new Error()
      //     error()
      //   } catch (err) {
      //     console.log('_ERR_', err)
      //     this.formData = this.initData()
      //   }
      // }
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

/deep/ .el-form {
  .el-form-item__label {
    padding-right: 20px;
  }
}

.el-input {
  width: 280px;
}
</style>
