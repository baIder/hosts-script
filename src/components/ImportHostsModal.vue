<script setup lang="ts">
import { h, ref } from "vue";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import { CopyOutlined } from "@ant-design/icons-vue";
import { useStore } from "@/stores";

import imgWindows from "@/assets/images/windows.gif";

const store = useStore();
const { currentPlatform } = storeToRefs(store);
const activeKey = ref<string[]>(["1"]);
const refDivPath = ref<HTMLDivElement>();

const onOpenFile = async () => {
    if (store.needCompact) {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const text = await file.text();
            store.handleText(text);
            store.modalVisible.importModal = false;
        };
        input.click();
        return;
    }
    try {
        const [fileHandler] = await window.showOpenFilePicker();
        const text = await (await fileHandler.getFile()).text();
        store.handleText(text);
        store.modalVisible.importModal = false;
    } catch (e) {
        const { name, message: errMessage } = e as DOMException;
        switch (name) {
            case "NotReadableError":
                message.error("文件读取失败，请检查权限");
                break;

            case "AbortError":
                break;

            default:
                message.error(errMessage);
                break;
        }
    }
};

const onCopyPath = async () => {
    if (!refDivPath.value) return;
    const text = refDivPath.value.innerText;
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        const inputElement = document.createElement("input");
        inputElement.style.position = "fixed";
        inputElement.style.left = "-10000px";
        inputElement.style.top = "-10000px";
        inputElement.style.opacity = "0";
        inputElement.value = text;
        document.body.appendChild(inputElement);
        inputElement.select();
        document.execCommand("copy");
        document.body.removeChild(inputElement);
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
                <p>
                    点击 <b>选择文件</b> 按钮，将下框中的路径粘贴至打开窗口的路径中，选择打开即可：
                </p>
                <div class="copy-path">
                    <div class="path" ref="refDivPath">
                        <code> %SYSTEMROOT%\System32\drivers\etc\hosts </code>
                    </div>
                    <a-tooltip title="复制路径">
                        <a-button :icon="h(CopyOutlined)" size="small" @click="onCopyPath" />
                    </a-tooltip>
                </div>
                <p class="tutorial-image">
                    <a-image :src="imgWindows" />
                </p>
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
.copy-path {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;

    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 8px;
    background: #f8f8f8;

    .path {
        flex: 1;
        overflow: auto hidden;
        text-wrap: nowrap;
    }
}

.platform {
    color: #ff4d4f;
    font-weight: bold;
}

.tutorial {
    font-weight: bold;
    margin-bottom: 0.5em;
}

.tutorial-image {
    border-radius: 8px;
    overflow: hidden;
}

.action {
    margin-top: 1em;
}
</style>
