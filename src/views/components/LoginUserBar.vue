<template>
<div>
    <el-dropdown v-if="user" @command="handleCommand" style="color: #ffaf3d; font-size: 18px">
        <span class="el-dropdown-link">欢迎您，{{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
export default {
    data() {
        return {
            user: JSON.parse(localStorage.getItem("user"))
        }
    },
    methods: {
        handleCommand(command) {
            localStorage.removeItem('user')
            this.$router.push({
                path: "/login"
            });
        }        
    },
    beforeDestroy() {
        window.removeEventListener('storage', this.storageHandler)
    }
}
</script>