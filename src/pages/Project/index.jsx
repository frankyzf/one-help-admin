import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, message } from 'antd';
import * as services from '@/services';
import { hooks } from '@/utils';
import { Table, TextButton } from '@/components';
import CUModal from './components/CUModal';

function Project() {
  const cuModalState = hooks.useModal();
  const actionRef = useRef();

  const handleSuccess = () => {
    actionRef.current.reload();
  };

  const handleDelete = (row) => {
    Modal.confirm({
      title: 'Tips',
      content: `Confirm to delete [${row.name}]?`,
      onOk: () => {
        return services.deleteProject(row.id).then(() => {
          message.success('Deleted.');
          handleSuccess();
        });
      },
    });
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      valueType: 'index',
      width: 72,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      hideInSearch: true,
      showInSearchField: true,
    },
    {
      title: 'Url',
      dataIndex: 'url',
      hideInSearch: true,
      showInSearchField: true,
      width: 200,
    },
    {
      title: 'Contact Email',
      dataIndex: 'contactEmail',
      hideInSearch: true,
      showInSearchField: true,
    },
    {
      title: 'Contact Mobile',
      dataIndex: 'contactPhone',
      hideInSearch: true,
      showInSearchField: true,
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: 'Action',
      key: 'option',
      width: 120,
      valueType: 'option',
      fixed: 'right',
      render: (_, row) => [
        <TextButton onClick={() => cuModalState.show({ extra: 'edit', data: row })} key="edit">
          Edit
        </TextButton>,
        <TextButton onClick={() => handleDelete(row)} key="delete">
          Delete
        </TextButton>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <Table
        actionRef={actionRef}
        columns={columns}
        searchFieldInitialValue="name"
        request={services.getProjectList}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => cuModalState.show({ extra: 'add' })}>
            Add
          </Button>,
        ]}
      />
      <CUModal
        visible={cuModalState.visible}
        type={cuModalState.extra}
        onCancel={() => cuModalState.hide()}
        onSuccess={handleSuccess}
        data={cuModalState.data}
      />
    </PageContainer>
  );
}

export default Project;
