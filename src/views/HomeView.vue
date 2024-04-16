<script setup lang="ts">
import { ref } from "vue";
import HostsTable from "@/components/HostsTable.vue";
import { handleText } from "@/utils/helper";

const raw_data = ref<string[][]>();
const onOpenFile = async () => {
    const [fileHandler] = await window.showOpenFilePicker();
    const text = await (await fileHandler.getFile()).text();
    raw_data.value = handleText(text);
};

const onSaveFile = async () => {
    // const fileHandle = await window.showSaveFilePicker();
    // const writable = await fileHandle.createWritable();
    // await writable.write(content.value);
    // await writable.close();
};
</script>

<template>
    <div class="wrapper">
        <header>
            <a-button @click="onOpenFile"> 选择文件 </a-button>
            <a-button @click="onSaveFile"> 保存文件 </a-button>
        </header>
        <main>
            <HostsTable v-model="raw_data" />
        </main>
    </div>
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
