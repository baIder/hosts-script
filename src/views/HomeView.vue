<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores";
import HostsTable from "@/components/HostsTable.vue";
import ExportScriptModal from "@/components/ExportScriptModal.vue";

const store = useStore();
const { currentPlatform } = storeToRefs(store);

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

const openExportModal = () => {
    store.modalVisible.exportModal = true;
};

onMounted(() => {
    if (window.showSaveFilePicker === undefined) {
        store.needCompact = true;
    }
    if (navigator.userAgent.indexOf("Windows") > -1) {
        currentPlatform.value = "Windows";
    } else if (navigator.userAgent.indexOf("Mac") > -1) {
        currentPlatform.value = "MacOS";
    } else if (navigator.userAgent.indexOf("Linux") > -1) {
        currentPlatform.value = "Linux";
    } else {
        currentPlatform.value = "其他";
    }
});
</script>

<template>
    <div class="wrapper">
        <header>
            <a-button @click="onOpenFile"> 从hosts文件中导入 </a-button>
            <a-button @click="openExportModal"> 导出脚本 </a-button>
        </header>
        <main>
            <HostsTable />
        </main>
    </div>
    <ExportScriptModal />
</template>

<style scoped lang="scss">
.wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

header {
    height: 36px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

main {
    flex: 1;
}
</style>
