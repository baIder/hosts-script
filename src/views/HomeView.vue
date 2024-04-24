<script setup lang="ts">
import { $genScript } from "@/apis";
import HostsTable from "@/components/HostsTable.vue";
import { useStore } from "@/stores";
import { genBatScript } from "@/utils/bat-script";
import { onMounted } from "vue";

const store = useStore();

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

const onSaveFile = async () => {
    if (store.isWindows) {
        onSaveBat();
        return;
    }
    const { data: file } = await $genScript(store.hostsData);
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
    const script = genBatScript(store.hostsData);
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

onMounted(() => {
    if (window.showSaveFilePicker === undefined) {
        store.needCompact = true;
    }
    if (navigator.userAgent.indexOf("Windows") > -1) {
        store.isWindows = true;
    }
});
</script>

<template>
    <div class="wrapper">
        <header>
            <a-button @click="onOpenFile"> 选择文件 </a-button>
            <a-button @click="onSaveFile"> 保存文件 </a-button>
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
