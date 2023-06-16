import { Table, Button, Modal, Form, InputNumber, Row, Col, Radio, Alert, Divider } from 'antd';
import { useEffect, useState } from 'react';
import DateComponent from './DateComponent';
import dayjs from 'dayjs';
import { createData, readData, updateData } from '../../firebase/firebase.helpers';
import { DAILY_SUGAR_INSULIN_RECORD } from '../../utils/constants';
import { databaseKeyNameMap, showNotification } from '../../utils/helpers';
import DailyMealRecord from './DailyMealRecord';

export const EditModal = ({ visible, onCancel, onSave, fieldName, value }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values.fieldValue);
      form.resetFields();
    });
  };

  return (
    <Modal open={visible} onCancel={onCancel} onOk={handleSave}>
      <Form form={form} initialValues={{ fieldValue: value }}>
        <Form.Item
          name="fieldValue"
          label={fieldName}
          rules={[{ required: true, message: 'Please input a value!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Home = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [docPath, setDocPath] = useState(DAILY_SUGAR_INSULIN_RECORD + `/${selectedDate.format('DD-MM-YYYY')}`);
  const [tab, setTab] = useState('dailySugarInsulinRecord');
  const previousDateDocPath = DAILY_SUGAR_INSULIN_RECORD + `/${selectedDate.subtract(1, 'day').format('DD-MM-YYYY')}`;
  const [previousDayRecord, setPreviousDayRecord] = useState(null);
  const [currentDayRecord, setCurrentDayRecord] = useState({});

  const isAllPreviousDayValuesFilled = (
    previousDayRecord?.morningInsulin || previousDayRecord?.morningSugar ||
    previousDayRecord?.nightSugar || previousDayRecord?.nightInsulin
  );

  useEffect(() => {
    readData(previousDateDocPath, data => {
      setPreviousDayRecord(data);
    }, true);

    readData(docPath, data => {
      if (!data) {
        createData(docPath, {
          morningInsulin: '',
          morningSugar: '',
          nightInsulin: '',
          nightSugar: '',
          dailyFoodRecord: {
            breakfast: [],
            dinner: []
          },
        }, true);
      } else if (typeof data === "object") {
        const parsedData = [];
        let nightInsulin = {};

        Object.entries(data).map(d => {
          const [key, value] = d;

          if (key === "dailyMealRecord" || key === "morningInsulin" || key === "formulaValues") return;

          const obj = {
            key,
            value,
            fieldName: databaseKeyNameMap[key]
          };

          if (key === "nightInsulin") {
            obj.formulaValues = data.formulaValues;
            nightInsulin = obj;
          } else {
            parsedData.push(obj);
          }
        });

        parsedData.push(nightInsulin);

        setData(parsedData);
        setCurrentDayRecord(data);
      }
    }, true);
  }, [docPath]);

  useEffect(() => {
    const newDocPath = DAILY_SUGAR_INSULIN_RECORD + `/${selectedDate.format('DD-MM-YYYY')}`;
    setDocPath(newDocPath);
  }, [selectedDate.format('DD-MM-YYYY')]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  const handlePreviousDate = () => {
    setSelectedDate(selectedDate.subtract(1, 'day'));
  }

  const handleNextDate = () => {
    setSelectedDate(selectedDate.add(1, 'day'));
  }

  const showEditModal = (record) => {
    setEditRecord(record);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (value, record) => (
        <strong style={{ fontSize: record.key === "nightInsulin" ? 18 : 14 }}>
          {value}
        </strong>
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => (
        <span style={{ fontSize: record.key === "nightInsulin" ? 18 : 14 }}>
          {value || '-'}
        </span>
      )
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      render: (text, record) => {
        const { x1, x2, x3 } = record?.formulaValues || {};
        return record.key !== 'nightInsulin' ? <Button onClick={() => showEditModal(record)}>Edit</Button> : (
          record?.formulaValues ? <span>x1 = <strong>{x1}</strong><br /> x2 = <strong>{x2}</strong><br /> x3 = <strong>{x3}</strong></span> : null
        )
      },
    },
  ];

  const handleEditValue = (newValue) => {
    updateData(docPath, {
      [editRecord.key]: newValue
    });
    setEditModalVisible(false);
  };

  const getMealInsulinValue = (meal = {}) => {
    return Object.values(meal).reduce((sum, curr) => sum + curr.quantity * curr.insulinUnits, 0);
  }

  const calculateNightInsulin = () => {
    if (
      !previousDayRecord || !previousDayRecord?.nightSugar || !previousDayRecord?.nightInsulin
    ) return showNotification("info", "Please enter previous day values");

    const x1 = getMealInsulinValue(currentDayRecord?.dailyMealRecord?.dinner) - getMealInsulinValue(previousDayRecord?.dailyMealRecord?.dinner);
    const x2 = Number(((currentDayRecord?.nightSugar - previousDayRecord?.nightSugar) / 15).toFixed(1));
    const x3 = previousDayRecord?.nightInsulin;

    const insulinDose = x1 + x2 + x3;

    if (isNaN(insulinDose)) return showNotification('info', 'Please make sure that all the values are filled correctly');

    updateData(docPath, {
      nightInsulin: Number(insulinDose.toFixed(1)),
      formulaValues: {
        x1,
        x2,
        x3,
      }
    });
  }

  return (
    <div className="home">
      <Row gutter={[16, 16]}>
        <EditModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSave={handleEditValue}
          fieldName={editRecord.fieldName}
          value={editRecord.value}
          docPath={docPath}
        />
        <Col span={24}>
          <DateComponent
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            handleNextDate={handleNextDate}
            handlePreviousDate={handlePreviousDate}
          />
        </Col>
        <Col span={24} className="flex flex-center">
          <Radio.Group value={tab} onChange={(e) => setTab(e.target.value)}>
            <Radio.Button value="dailySugarInsulinRecord">Sugar Insulin Record</Radio.Button>
            <Radio.Button value="dailyMealRecord">Meal Record</Radio.Button>
          </Radio.Group>
        </Col>
        {!isAllPreviousDayValuesFilled && (
          <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Alert
              message="Please enter all the previous day values"
              type="error"
              showIcon
            />
          </Col>
        )}
        <Col span={24} className="home-table">
          {tab === "dailyMealRecord" ? (
            <DailyMealRecord
              docPath={docPath + '/dailyMealRecord'}
            />
          ) : (
            <Table columns={columns} dataSource={data} pagination={false} showHeader={false} />
          )}
        </Col>
        {tab !== "dailyMealRecord" && (
          <Col span={24} className="flex flex-center">
            <Button type="primary" onClick={calculateNightInsulin}>
              Calculate Night Insulin
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Home;
