import { useEffect, useState } from "react";
import { List, Button, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, PushpinOutlined } from "@ant-design/icons";
import FoodCategoryForm from "./FoodCategoryForm";
import { deleteData, readData } from "../../firebase/firebase.helpers";
import { FOOD_CATEGORIES } from "../../utils/constants";

const FoodCategories = () => {
  const [showForm, setShowForm] = useState(false);
  const [foodCategories, setFoodCategories] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    readData("food_categories", data => setFoodCategories(data));
  }, []);

  return (
    <div className="food-categories-container">
      {showForm && (
        <FoodCategoryForm 
          open={showForm}
          onClose={() => setShowForm(false)}
          edit={editData}
        />
      )}
      <Row gutter={[16, 16]}>
        <Col span={24} className="flex flex-center">
          <Button icon={<PlusOutlined />} size="middle" type="primary" onClick={() => setShowForm(true)}>
            Add Food Item
          </Button>
        </Col>
        <Col span={24}>
          <List
            itemLayout="horizontal"
            dataSource={foodCategories}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="edit" href="#" onClick={() => {
                    setEditData(item);
                    setShowForm(true);
                  }}> <EditOutlined /> Edit </a>,
                  <a key="delete" href="#" onClick={() => deleteData(FOOD_CATEGORIES + `/${item.id}`)}> <DeleteOutlined /> Delete </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<PushpinOutlined />}
                  title={item.name}
                  description={`Insulin Units: ${item.insulinUnits}`}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={24} style={{ marginBottom: 80 }}></Col>
      </Row>
    </div>
  );
}

export default FoodCategories;