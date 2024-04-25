import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { v4 as genUUID } from "uuid";

export const useStore = defineStore("index", () => {
    const currentPlatform = ref<"Windows" | "MacOS" | "Linux" | "其他">("其他");
    const needCompact = ref(false);
    const rawStr = ref("");
    const hostsData = ref<Hosts[]>([]);
    const selectedKeys = ref<string[]>([]);
    const modalVisible = reactive({
        exportModal: false,
        importModal: false
    });

    const selectedHosts = computed(() => {
        return hostsData.value.filter((row) => selectedKeys.value.includes(row.uuid));
    });

    const handleText = (str: string) => {
        rawStr.value = str;

        const rows = str
            .split("\n")
            .map((row) => row.trim())
            .filter((row) => row.length > 0)
            .filter((row) => !row.startsWith("#"))
            .map((row) => row.split(/\t|\s+/));

        const rawData = mergeArray(rows);

        rawData.forEach((row) => {
            if (row.length === 2) {
                const uuid = genUUID();
                hostsData.value.push({ uuid, ip: row[0], domain: row[1] });
            } else if (row.length > 2) {
                for (let i = 1; i < row.length; i++) {
                    const uuid = genUUID();
                    hostsData.value.push({ uuid, ip: row[0], domain: row[i] });
                }
            }
        });

        return hostsData;
    };

    const mergeArray = (arr: string[][]) => {
        const map = new Map();
        for (const subArr of arr) {
            const key = subArr[0];
            if (map.has(key)) {
                map.get(key).push(...subArr.slice(1));
            } else {
                map.set(key, subArr.slice());
            }
        }
        return Array.from(map.values());
    };

    const deleteRow = (uuid: string) => {
        hostsData.value = hostsData.value.filter((row) => row.uuid !== uuid);
    };

    const addRow = () => {
        hostsData.value.push({ uuid: genUUID(), ip: "", domain: "" });
        return hostsData.value[hostsData.value.length - 1];
    };

    return {
        hostsData,
        needCompact,
        selectedKeys,
        selectedHosts,
        modalVisible,
        currentPlatform,

        deleteRow,
        handleText,
        addRow
    };
});
