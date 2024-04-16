<script setup lang="ts">
import { useStore } from "@/stores";
import type { TableColumnType } from "ant-design-vue";
import { reactive, type UnwrapRef } from "vue";

const store = useStore();

const editableData: UnwrapRef<Record<string, Hosts>> = reactive({});

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

const onEdit = (uuid: string) => {
    editableData[uuid] = { ...store.hostsData.filter((item) => uuid === item.uuid)[0] };
};

const onSave = (uuid: string) => {
    Object.assign(store.hostsData.filter((item) => uuid === item.uuid)[0], editableData[uuid]);
    Reflect.deleteProperty(editableData, uuid);
};

const onCancel = (uuid: string) => {
    Reflect.deleteProperty(editableData, uuid);
};
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
        <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'action'">
                <span>
                    <a-button
                        v-if="editableData[record.uuid]"
                        type="link"
                        size="small"
                        @click="onSave(record.uuid)"
                        >保存</a-button
                    >
                    <a-button v-else type="link" size="small" @click="onEdit(record.uuid)"
                        >编辑</a-button
                    >
                    <a-divider type="vertical" />
                    <a-button
                        v-if="editableData[record.uuid]"
                        type="link"
                        size="small"
                        @click="onCancel(record.uuid)"
                        >取消</a-button
                    >
                    <a-button
                        v-else
                        type="link"
                        size="small"
                        danger
                        @click="store.deleteRow(record.uuid)"
                    >
                        删除
                    </a-button>
                </span>
            </template>
            <template v-else>
                <div>
                    <a-input
                        v-if="editableData[record.uuid]"
                        v-model:value="
                            editableData[record.uuid as string][column.dataIndex as keyof Hosts]
                        "
                        style="margin: -5px 0"
                    />
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
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
