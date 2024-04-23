<script setup lang="ts">
import { $genScript } from "@/apis";
import HostsTable from "@/components/HostsTable.vue";
import { useStore } from "@/stores";
import { genBatScript } from "@/utils/bat-script";

const store = useStore();

const onOpenFile = async () => {
    const [fileHandler] = await window.showOpenFilePicker();
    const text = await (await fileHandler.getFile()).text();
    store.handleText(text);
};

const onSaveFile = async () => {
    const { data: file } = await $genScript(store.hostsData);
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "update-hosts.zip",
        types: [{ accept: { "application/zip": [".zip"] } }]
    });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
};

const onSaveBat = async () => {
    const script = genBatScript(store.hostsData);
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
    <div class="wrapper">
        <header>
            <a-button @click="onOpenFile"> 选择文件 </a-button>
            <a-button @click="onSaveFile"> 保存文件 </a-button>
            <a-button @click="onSaveBat"> 保存bat脚本 </a-button>
        </header>
        <main>
            <HostsTable />
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
