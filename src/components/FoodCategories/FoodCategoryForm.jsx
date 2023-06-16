import { Button, Col, Input, InputNumber, Modal, Row, Typography } from "antd";
import { useReducer } from "react";
import { createData, updateData } from "../../firebase/firebase.helpers";
import { FOOD_CATEGORIES } from "../../utils/constants";
import { showNotification } from "../../utils/helpers";

const { Text } = Typography;

const FoodCategoryForm = ({
  open,
  onClose,
  edit
}) => {
  const [formState, setFormState] = useReducer((prev, next) => ({
    ...prev, ...next
  }), edit ? edit : {});

  const onChange = (name, value) => setFormState({ [name]: value });

  const addFoodCategory = () => {
    if (!formState.name) return showNotification("info", "Please enter name");
    if (!formState.insulinUnits) return showNotification("info", "Please enter insulin units");

    if (edit) {
      updateData(FOOD_CATEGORIES + `/${edit.id}`, formState);
    } else {
      createData(FOOD_CATEGORIES, {
        name: formState.name,
        insulinUnits: formState.insulinUnits
      });
    }

    onClose();
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      title={edit ? "Edit Food Category" : "Add Food Category"}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text>Name</Text>
          <Input
            type="text"
            placeholder="Enter Name..." 
            value={formState.name} 
            onChange={e => onChange('name', e.target.value)}
            required
          />
        </Col>
        <Col span={24}>
          <Text>Insulin Units</Text>
          <InputNumber
            className="w-100"
            placeholder="Enter Insulin Units..." 
            value={formState.insulinUnits}
            onChange={value => onChange('insulinUnits', value)}
            required
            inputMode="decimal"
          />
        </Col>
        <Col span={24}>
          <Button type="primary" htmlType="submit" onClick={addFoodCategory}>
            Submit
          </Button>
          <Button onClick={onClose} className="ml-8">
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default FoodCategoryForm;