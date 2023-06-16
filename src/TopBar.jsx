import { Typography } from "antd";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const { Title } = Typography;

const TopBar = () => {
  const { pathname } = useLocation();

  const getTitle = () => {
    const titleSlang = pathname.split('/')[1];

    switch(titleSlang) {
      case "food-categories":
        return "Food Categories";
      case "metadata":
        return "Metadata";
      default:
        return "Home (Daily Record)"
    }
  }

  return (
    <div className="top-bar">
      <Title level={4}>
        {getTitle()}
      </Title>
    </div>
  );
}

export default TopBar;