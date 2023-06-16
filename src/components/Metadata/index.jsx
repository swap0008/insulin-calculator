import { Table, Button } from "antd";
import { readData, updateData } from "../../firebase/firebase.helpers";
import { EditModal } from "../Home";
import { METADATA } from "../../utils/constants";
import { useEffect, useState } from "react";
import { databaseKeyNameMap } from "../../utils/helpers";

const Metadata = () => {
  const [data, setData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const docPath = METADATA;

  const handleEditValue = (newValue) => {
    updateData(docPath, {
      [editRecord.key]: newValue
    });
    setEditModalVisible(false);
  };

  const showEditModal = (record) => {
    setEditRecord(record);
    setEditModalVisible(true);
  };

  useEffect(() => {
    readData(docPath, data => {
      const keyValuePairs = Object.entries(data);

      const parsedData = [];
      keyValuePairs.forEach(keyValue => {
        const [key, value] = keyValue;

        parsedData.push({
          key, 
          value,
          fieldName: databaseKeyNameMap[key]
        });
      });
      
      setData(parsedData);
    }, true)
  }, []);

  const columns = [
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (value) => (
        <strong style={{ fontSize: 14 }}>
          {value}
        </strong>
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value) => (
        <span style={{ fontSize: 14 }}>
          {value || '-'}
        </span>
      )
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      render: (_, record) => <Button onClick={() => showEditModal(record)}>Edit</Button>,
    },
  ];

  return (
    <div className="home">
      <EditModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleEditValue}
        fieldName={editRecord.fieldName}
        value={editRecord.value}
        docPath={docPath}
      />
      <Table columns={columns} dataSource={data} pagination={false} showHeader={true} />
    </div>
  );
}

export default Metadata;