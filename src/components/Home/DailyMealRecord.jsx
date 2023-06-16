import { useEffect, useState } from 'react';
import { List, Button, Tabs, Row, Col, Modal, Select } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { createData, deleteData, readData, updateData } from '../../firebase/firebase.helpers';
import { FOOD_CATEGORIES } from '../../utils/constants';
import { showNotification } from '../../utils/helpers';

const DailyMealRecord = ({ docPath }) => {
  const [cartItems, setCartItems] = useState([]);
  const [tab, setTab] = useState('dinner');
  const [dailyMealRecordPath, setDailyMealRecordPath] = useState(docPath + `/${tab}`);
  const [addItem, setAddItem] = useState(false);
  const [foodCategories, setFoodCategories] = useState([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  useEffect(() => {
    readData(dailyMealRecordPath, data => setCartItems(data));
  }, [dailyMealRecordPath]);

  useEffect(() => {
    setDailyMealRecordPath(docPath + `/${tab}`);
  }, [docPath]);

  useEffect(() => {
    readData(FOOD_CATEGORIES, data => setFoodCategories(data));
  }, []);

  const handleIncrement = (item) => {
    updateData(dailyMealRecordPath + `/${item.id}`, {
      quantity: item.quantity + 0.5
    });
  };

  const handleDecrement = (item) => {
    updateData(dailyMealRecordPath + `/${item.id}`, {
      quantity: item.quantity === 0.5 ? 0.5 : item.quantity - 0.5
    });
  };

  const handleRemoveItem = (itemId) => {
    deleteData(dailyMealRecordPath + `/${itemId}`);
  };

  const getList = () => {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24} className="flex flex-middle flex-space-between">
          <span>
            Total Insulin Units: <strong>{cartItems.reduce((total, item) => total + item.insulinUnits * item.quantity, 0)}</strong>
          </span>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddItem(true)}>
            Add Item
          </Button>
        </Col>
        <Col span={24}>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<MinusOutlined />}
                    onClick={() => handleDecrement(item)}
                  />,
                  <span>{item.quantity}</span>,
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={() => handleIncrement(item)}
                  />,
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`Insulin Units: ${item.insulinUnits}`}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    );
  }

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {addItem && (
        <Modal
          open={addItem}
          onCancel={() => {
            setSelectedFoodItem(null);
            setAddItem(false);
          }}
          title="Add Food Item"
          footer={null}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Select
                value={selectedFoodItem}
                onChange={setSelectedFoodItem}
                placeholder="Select Food Item"
                className="w-100"
              >
                {foodCategories.map(f => (
                  <Select.Option key={f.id} value={f.id}>
                    {f.name} ({f.insulinUnits})
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={24}>
              <Button type="primary" onClick={() => {
                const f = foodCategories.find(fc => fc.id === selectedFoodItem);
                if (f) {
                  f.quantity = 1;
                  delete f.id;
                  createData(dailyMealRecordPath, f);
                } else {
                  return showNotification('info', 'Please select food item');
                }
                setSelectedFoodItem(null);
                setAddItem(false);
              }}>
                Add Item
              </Button>
              <Button className="ml-8" onClick={() => {
                setSelectedFoodItem(null);
                setAddItem(false);
              }}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Modal>
      )}
      <Tabs
        activeKey={tab}
        onChange={key => {
          setDailyMealRecordPath(docPath + `/${key}`);
          setTab(key);
        }}
        items={[
          // {
          //   key: "breakfast",
          //   label: "Breakfast",
          //   children: getList()
          // },
          {
            key: "dinner",
            label: "Dinner",
            children: getList()
          }
        ]}
      />
      <div style={{ marginBottom: 100 }}></div>
    </div>
  );
};

export default DailyMealRecord;
