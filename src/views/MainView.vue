<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores";
import HostsTable from "@/components/HostsTable.vue";
import ExportScriptModal from "@/components/ExportScriptModal.vue";
import ImportHostsModal from "@/components/ImportHostsModal.vue";

const store = useStore();
const { currentPlatform } = storeToRefs(store);

const openImportModal = () => {
    store.modalVisible.importModal = true;
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
        <div class="container">
            <header>
                <a-button @click="openImportModal"> 从hosts文件中导入 </a-button>
                <a-button @click="openExportModal"> 导出脚本 </a-button>
            </header>
            <main>
                <HostsTable />
            </main>
        </div>
    </div>
    <ExportScriptModal />
    <ImportHostsModal />
</template>

<style scoped lang="scss">
.wrapper {
    height: 100%;
    display: flex;
    justify-content: center;

    .container {
        height: 100%;
        width: 900px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
    }
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
