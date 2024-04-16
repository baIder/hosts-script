<script setup lang="ts">
import { computed } from "vue";

const raw_data = defineModel<string[][]>();

const hosts_data = computed({
    get: () => {
        if (!raw_data.value) return [];
        const data: { ip: string; domain: string }[] = [];
        raw_data.value.forEach((row) => {
            if (row.length === 2) {
                data.push({ ip: row[0], domain: row[1] });
            } else if (row.length > 2) {
                for (let i = 1; i < row.length; i++) {
                    data.push({ ip: row[0], domain: row[i] });
                }
            }
        });
        return data;
    },
    set: (value) => {
        raw_data.value = value.map(({ ip, domain }) => [ip, domain]);
    }
});

const columns = [
    {
        title: "IP 地址",
        dataIndex: "ip",
        key: "ip"
    },
    {
        title: "域名",
        dataIndex: "domain",
        key: "domain"
    }
];
</script>

<template>
    <a-table
        :columns="columns"
        :data-source="hosts_data"
        :pagination="false"
        :scroll="{
            y: 'calc(100vh - 120px)'
        }"
        bordered
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
                <a>
                    {{ record.name }}
                </a>
            </template>
        </template>
    </a-table>
</template>

<style scoped lang="scss"></style>
