<script setup lang="ts">
import { useStore } from "@/stores";
import type { TableColumnType } from "ant-design-vue";

const store = useStore();

const columns: TableColumnType[] = [
    {
        title: "IP 地址",
        dataIndex: "ip",
        key: "ip"
    },
    {
        title: "域名",
        dataIndex: "domain",
        key: "domain"
    },
    {
        title: "操作",
        key: "action",
        width: "140px"
    }
];
</script>

<template>
    <a-table
        :columns="columns"
        :data-source="store.hostsData"
        :pagination="false"
        :scroll="{
            y: 'calc(100vh - 120px)'
        }"
        bordered
        rowKey="uuid"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <span>
                    <a-button type="link" size="small">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" size="small" danger @click="store.deleteRow(record.uuid)">
                        删除
                    </a-button>
                </span>
            </template>
        </template>
        <template #summary>
            <a-table-summary>
                <a-table-summary-row>
                    <a-table-summary-cell :colSpan="3">
                        <a-button style="width: 100%">新增</a-button>
                    </a-table-summary-cell>
                </a-table-summary-row>
            </a-table-summary>
        </template>
    </a-table>
</template>

<style scoped lang="scss"></style>
