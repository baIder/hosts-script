<script setup lang="ts">
import { GithubOutlined, CaretRightOutlined } from "@ant-design/icons-vue";
import { h } from "vue";
</script>

<template>
    <div class="wrapper">
        <div class="content">
            <div class="title">hosts 脚本生成器</div>
            <div class="desc">快速生成能修改 hosts 的脚本</div>
            <div class="buttons">
                <RouterLink to="/main">
                    <a-button :icon="h(CaretRightOutlined)" type="primary">开始使用</a-button>
                </RouterLink>
                <a-button :icon="h(GithubOutlined)" href="https://github.com/baIder/hosts-script"
                    >Github</a-button
                >
            </div>
        </div>
        <div class="banner">
            <img src="@/assets/images/banner.jpg" alt="" />
        </div>
        <div class="background"></div>
    </div>
</template>

<style scoped lang="scss">
@import "@/assets/css/dynamicBackground.scss";

.wrapper {
    width: 100vw;
    height: 100vh;
    padding: 60px;

    display: flex;
    align-items: center;
    overflow: hidden;

    .content {
        flex: 1;

        .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .desc {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }

        .buttons {
            display: flex;
            gap: 20px;
        }
    }
}
</style>
