<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="密  码" prop="password">
            <Input type="password" v-model="formValidate.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>
<script>
export default {
  data () {
    return {
      formValidate: {
        name: '',
        password: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
          // { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空.', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码位数不小于六位', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    console.log('登录之后创建的this', this)
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$store.dispatch('loginByName', this.formValidate).then(response => {
            console.log('在loginvue里面数据', response)
            if (response.code === 200) {
              this.$Message.success('登录成功!')
            } else {
              this.$Message.error('登录失败!')
            }
            this.$router.push({ path: '/' })
          }).catch(error => {
            console.log('在login vue 里面请求失败', error)
          })
        } else {
          this.$Message.error('参数格式错误')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
