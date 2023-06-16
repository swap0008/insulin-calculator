import { DatePicker, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const DateComponent = ({
  selectedDate,
  handleDateChange,
  handlePreviousDate,
  handleNextDate
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: "center" }}>
      <Button onClick={handlePreviousDate} style={{ marginRight: 20 }}><LeftOutlined /></Button>
      <DatePicker 
        value={selectedDate} 
        onChange={handleDateChange} 
        size="small" 
        allowClear={false} 
        format={"D MMMM, YYYY"}
      />
      <Button onClick={handleNextDate} style={{ marginLeft: 20 }}><RightOutlined /></Button>
    </div>
  );
}

export default DateComponent;
