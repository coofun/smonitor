<template>
<div class="login-container">
    <el-dialog :visible="showLoginDialog" :show-close="showCloseDialog" width="400px" center class="login-dialog">
        <div class="title-container">
            <h3 class="title">登录</h3>
        </div>
        <el-form class="login-form">
            <el-form-item label="用户名">
                <el-input type="text" v-model="username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="password" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleLogin">确认</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    login
} from '@/data'

export default {
    data() {
      return {
        showLoginDialog: true,
        showCloseDialog: false,
        username: null,
        password: null          
      }
    },
    created() {},
    mounted() {},
    computed: {},
    watch: {},
    methods: {
        handleLogin() {
            let _this = this
            if (!this.username) {
                this.$message({
                    message: '请输入用户名.',
                    type: 'error'
                })

                return
            }

            if (!this.password) {
                this.password = ''
            }

            login(this.username, this.password).then(function (result) {
                if (result.id) {
                    Object.assign(_this.$user, result)
                    _this.showLoginDialog = false
                    localStorage.setItem('user', JSON.stringify(_this.$user))
                    _this.$message({
                        message: '登录成功.',
                        type: 'success'
                    })
                    let redirect = decodeURIComponent(_this.$route.query.redirect || '/');
                    _this.$router.push({
                        path: redirect
                    });
                } else {
                    _this.$message({
                        message: '登录失败，请重新登录.',
                        type: 'error'
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    width: 100%;
    height: 100%;

    .login-dialog {
        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                margin: 0px auto 12px auto;
                text-align: center;
                font-weight: bold;
            }
        }
    }

    .el-button--primary {
        background-color: #d6b469;
        border-color: #d6b469;
    }
}
</style>
