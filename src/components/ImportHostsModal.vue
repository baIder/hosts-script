<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores";

const store = useStore();
const { currentPlatform } = storeToRefs(store);
const activeKey = ref<string[]>(["1"]);

const onOpenFile = async () => {
    if (store.needCompact) {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const text = await file.text();
            store.handleText(text);
        };
        input.click();
    } else {
        const [fileHandler] = await window.showOpenFilePicker();
        const text = await (await fileHandler.getFile()).text();
        store.handleText(text);
    }
};
</script>

<template>
    <a-modal v-model:open="store.modalVisible.importModal" title="导入条目" :footer="null">
        <p>
            检测到当前的系统是： <span class="platform">{{ currentPlatform }}</span>
        </p>
        <div class="tutorial">在哪里找到 hosts 文件：</div>
        <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="1" header="Windows">
                <p>Windows</p>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="MacOS">
                <p>MacOS</p>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="Linux / 其他">
                <p>Linux / 其他</p>
            </a-collapse-panel>
        </a-collapse>
        <div>
            <a-button @click="onOpenFile" class="action" type="primary">选择文件</a-button>
        </div>
    </a-modal>
</template>

<style scoped lang="scss">
.platform {
    color: #ff4d4f;
    font-weight: bold;
}

.tutorial {
    font-weight: bold;
    margin-bottom: 0.5em;
}

.action {
    margin-top: 1em;
}
</style>
