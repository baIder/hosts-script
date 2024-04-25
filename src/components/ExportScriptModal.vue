<script setup lang="ts">
import { storeToRefs } from "pinia";
import { $genScript } from "@/apis";
import { useStore } from "@/stores";
import { genBatScript } from "@/utils/bat-script";

const store = useStore();
const { currentPlatform } = storeToRefs(store);

const onSaveSH = async () => {
    const { data: file } = await $genScript(store.selectedHosts);
    if (store.needCompact) {
        const blob = new Blob([file], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "update-hosts.zip";
        a.click();
        URL.revokeObjectURL(url);
        return;
    }
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "update-hosts.zip",
        types: [{ accept: { "application/zip": [".zip"] } }]
    });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
};

const onSaveBat = async () => {
    const script = genBatScript(store.selectedHosts);
    if (store.needCompact) {
        const blob = new Blob([script], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "update-hosts.bat";
        a.click();
        URL.revokeObjectURL(url);
        return;
    }
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "update-hosts.bat",
        types: [{ accept: { "text/plain": [".bat"] } }]
    });
    const writable = await fileHandle.createWritable();
    await writable.write(script);
    await writable.close();
};
</script>

<template>
    <a-modal v-model:open="store.modalVisible.exportModal" title="生成脚本" :footer="null">
        <p>
            检测到当前的系统是：
            <span class="platform">{{ currentPlatform }}</span>
            ，推荐下载
            {{ currentPlatform === "Windows" ? "Windows" : "MacOS / Linux" }}
            平台的脚本。
        </p>

        <div class="buttons">
            <a-button
                @click="onSaveBat"
                :type="currentPlatform === 'Windows' ? 'primary' : 'default'"
            >
                Windows 平台
            </a-button>
            <a-button
                @click="onSaveSH"
                :type="currentPlatform === 'Windows' ? 'default' : 'primary'"
            >
                MacOS / Linux 平台
            </a-button>
        </div>
    </a-modal>
</template>

<style scoped lang="scss">
.platform {
    font-weight: bold;
    color: red;
}

.buttons {
    display: flex;
    gap: 10px;
}
</style>
